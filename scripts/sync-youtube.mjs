/**
 * Adlwise YouTube Catalog Sync
 *
 * Purpose:
 * - Sync published YouTube videos into the frontend lecture catalogue.
 * - Exclude all YouTube Shorts (strictly any video under 5 minutes / 300 seconds).
 * - Purge any existing Shorts currently saved in catalog.json.
 * - Preserve existing manually curated catalogue data for valid long-form lectures.
 * - Keep metadata limited to what the frontend actually needs.
 * - Build a strong searchText field for fast client-side search.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { splitCatalog } from "./split-catalog.mjs";
import { extractQuranContext } from "./enrich-quran-context.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.resolve(
    __dirname,
    "../src/lib/lectures/catalog.json",
);

const ENV_LOCAL_PATH = path.resolve(__dirname, "../.env.local");
const ENV_PATH = path.resolve(__dirname, "../.env");

/* =========================================================
   CONFIG
   ========================================================= */

const SHORT_MAX_SECONDS = 300; // Exclude anything under 5 minutes (300 seconds)

/* =========================================================
   ENV LOADER
   ========================================================= */

function loadEnv() {
    for (const envPath of [ENV_LOCAL_PATH, ENV_PATH]) {
        if (!fs.existsSync(envPath)) continue;

        const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

        for (const line of lines) {
            const trimmed = line.trim();

            if (!trimmed || trimmed.startsWith("#")) continue;

            const index = trimmed.indexOf("=");

            if (index === -1) continue;

            const key = trimmed.slice(0, index).trim();

            const value = trimmed
                .slice(index + 1)
                .trim()
                .replace(/^["']|["']$/g, "");

            if (key && !process.env[key]) {
                process.env[key] = value;
            }
        }
    }
}

loadEnv();

/* =========================================================
   TEXT HELPERS
   ========================================================= */

function cleanText(text = "") {
    return String(text)
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/\r/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function cleanTitle(rawTitle = "") {
    let title = cleanText(rawTitle);
    // Remove clickbait / hook prefixes
    title = title.replace(/^(?:hook\s*[:\-–—]|must\s+watch\s*[:\-–—]|viral\s*[:\-–—]|urgent\s*[:\-–—])\s*/i, "");
    // Remove raw hashtags
    title = title.replace(/#\w+/g, "").trim();
    // Remove redundant trailing channel author suffix
    title = title.replace(/\|\s*(?:dr\.?\s*hafiz\s*haseeb|hafiz\s*haseeb)\s*$/i, "").trim();
    // Collapse multiple consecutive spaces
    title = title.replace(/ {2,}/g, " ").trim();
    return title;
}

function sanitizeDescription(description = "") {
    return cleanText(description)
        .replace(/^HOOK\s*/i, "")
        .replace(/[-─=]{4,}/g, "")
        .replace(/https?:\/\/\S+/gi, "")
        .trim();
}

function createCleanSummary(description = "", maxLength = 160) {
    const clean = cleanText(description).replace(/\s+/g, " ").trim();
    if (!clean) return "";
    if (clean.length <= maxLength) return clean;

    const firstSentenceMatch = clean.match(/^.*?[.!?۔](?:\s|$)/);
    if (firstSentenceMatch && firstSentenceMatch[0].length >= 40 && firstSentenceMatch[0].length <= maxLength) {
        return firstSentenceMatch[0].trim();
    }

    const truncated = clean.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(" ");
    if (lastSpace > 40) {
        return `${truncated.slice(0, lastSpace).replace(/[,;:\-–—]+$/, "")}...`;
    }
    return `${truncated}...`;
}

function parseIsoDuration(duration) {
    if (!duration || typeof duration !== "string") return 0;

    const hours = (duration.match(/(\d+)H/) || [])[1] || 0;
    const minutes = (duration.match(/(\d+)M/) || [])[1] || 0;
    const seconds = (duration.match(/(\d+)S/) || [])[1] || 0;

    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function slugify(title, videoId) {
    const ascii = cleanText(title)
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (!ascii || ascii.startsWith("lecture")) {
        return `video-${videoId}`;
    }

    return ascii;
}

/* =========================================================
   SHORT FILTER
   ========================================================= */

function isLikelyShort(video) {
    const rawDuration = video.contentDetails?.duration;
    const duration = rawDuration ? parseIsoDuration(rawDuration) : 0;

    // Exclude any video shorter than 5 minutes (300 seconds)
    if (duration > 0 && duration < SHORT_MAX_SECONDS) {
        return true;
    }

    const title = video.snippet?.title || "";
    const description = video.snippet?.description || "";

    if (/#shorts?\b/i.test(title) || /#shorts?\b/i.test(description)) {
        return true;
    }

    if (/\b(youtube\.com\/shorts\/)/i.test(description)) {
        return true;
    }

    return false;
}

/* =========================================================
   TAXONOMY
   ========================================================= */

function inferCategory(title, description = "") {
    const text = `${title} ${description}`.toLowerCase();

    if (/لسان\s*القرآن|lisan-ul-quran|lisan\s+ul\s+quran|quranic\s+arabic/.test(text)) {
        return "Lisan-ul-Quran";
    }

    if (/اقبال|iqbal/.test(text)) {
        return "Iqbalian Thought";
    }

    if (/تفسیر|tafsir|قرآن|quran|surah|سورۃ|سورة/.test(text)) {
        return "Tafsir";
    }

    if (/سیرت|seerat|seerah|prophet|مدینہ|madinah|رسول|rasool/.test(text)) {
        return "Seerat";
    }

    if (/دستور|constitution|قانون|عدالت|judicial|court/.test(text)) {
        return "Constitutional Law";
    }

    if (
        /ریاست|statecraft|قرض|debt|معیشت|economy|political|politics/.test(text)
    ) {
        return "Statecraft";
    }

    if (/اخلاق|ethics|اختلاف|adab|akhlaq/.test(text)) {
        return "Ethics";
    }

    return "Socio-Political";
}

const BANNED_AUDIT_TOPICS = new Set([
    "dora tarjuma quran 2023",
    "live ramazan 2024",
    "ramazan 2025",
    "tarjuma quran in ramazan 2026",
    "khutba e jumma",
    "online quranic arabic course",
    "special lecture series",
    "online quran sessions 1",
    "online quranic sessions 2",
    "online quran sessions 3",
    "online seerat sessions",
    "iqbal & quran with friends",
    "seerat un nabi (s.a.w) | سیرت النبی ﷺ |",
    "noor e sahar @ 24 news",
    "constitution of pakistan",
    "seerat. a journey of hajj.",
    "personal talk",
    "short clip series of holy quran",
]);

function buildTopics(title, description, tags, category) {
    const topics = new Set();

    const text = `${title} ${description}`.toLowerCase();

    const rules = [
        ["Quran", ["quran", "قرآن", "surah", "سورۃ", "سورة"]],
        ["Tafsir", ["tafsir", "تفسیر"]],
        ["Seerat", ["seerat", "seerah", "سیرت"]],
        ["Statecraft", ["statecraft", "ریاست", "constitution"]],
        ["Ethics", ["ethics", "اخلاق", "akhlaq"]],
        ["Iqbal", ["iqbal", "اقبال"]],
    ];

    for (const [topic, signals] of rules) {
        if (signals.some((signal) => text.includes(signal))) {
            topics.add(topic);
        }
    }

    for (const tag of tags || []) {
        const value = cleanText(tag);

        if (!value) continue;

        if (
            value.toLowerCase().includes("drhafizhaseeb") ||
            value.length > 40 ||
            BANNED_AUDIT_TOPICS.has(value.toLowerCase().trim())
        ) {
            continue;
        }

        topics.add(value);

        if (topics.size >= 5) break;
    }

    return topics.size ? Array.from(topics) : [category];
}

/* =========================================================
   SEARCH INDEX
   ========================================================= */

function buildSearchText({
    title,
    description,
    category,
    topics,
    tags,
}) {
    const values = [
        title,
        description,
        category,
        ...(topics || []),
        ...(tags || []),
    ];

    const tokens = new Set();

    for (const value of values) {
        if (!value) continue;

        cleanText(value)
            .toLowerCase()
            .split(/\s+/)
            .forEach((token) => {
                const cleaned = token.replace(/[.,!?;:()[\]{}"'`]/g, "").trim();

                if (cleaned.length >= 2) {
                    tokens.add(cleaned);
                }
            });
    }

    return Array.from(tokens).join(" ");
}

/* =========================================================
   API
   ========================================================= */

async function youtubeRequest(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`YouTube API HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error.message);
    }

    return data;
}

/* =========================================================
   INCREMENTAL UPLOAD FETCH
   ========================================================= */

async function fetchIncrementalUploads(apiKey, playlistId, existingIds) {
    const uploads = [];

    let pageToken = "";
    let page = 1;

    while (true) {
        process.stdout.write(`Fetching upload page ${page}...\r`);

        let url =
            `https://www.googleapis.com/youtube/v3/playlistItems` +
            `?part=snippet,contentDetails` +
            `&playlistId=${encodeURIComponent(playlistId)}` +
            `&maxResults=50` +
            `&key=${encodeURIComponent(apiKey)}`;

        if (pageToken) {
            url += `&pageToken=${encodeURIComponent(pageToken)}`;
        }

        const data = await youtubeRequest(url);
        const items = data.items || [];

        uploads.push(...items);

        const unknownCount = items.filter((item) => {
            const videoId =
                item.contentDetails?.videoId ||
                item.snippet?.resourceId?.videoId;

            return videoId && !existingIds.has(videoId);
        }).length;

        if (!data.nextPageToken || unknownCount === 0) {
            break;
        }

        pageToken = data.nextPageToken;
        page++;
    }

    return uploads;
}

/* =========================================================
   VIDEO DETAILS
   ========================================================= */

async function fetchVideoDetails(apiKey, videoIds) {
    const map = new Map();

    const uniqueIds = [...new Set(videoIds)];

    for (let i = 0; i < uniqueIds.length; i += 50) {
        const batch = uniqueIds.slice(i, i + 50);

        const url =
            `https://www.googleapis.com/youtube/v3/videos` +
            `?part=snippet,contentDetails` +
            `&id=${batch.join(",")}` +
            `&key=${encodeURIComponent(apiKey)}`;

        const data = await youtubeRequest(url);

        for (const video of data.items || []) {
            map.set(video.id, video);
        }
    }

    return map;
}

/* =========================================================
   SLUG
   ========================================================= */

function createUniqueSlug(title, videoId, usedSlugs) {
    const baseSlug = slugify(title, videoId);

    let slug = baseSlug;
    let counter = 2;

    while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter++}`;
    }

    usedSlugs.add(slug);

    return slug;
}

/* =========================================================
   CATALOG NORMALIZATION
   ========================================================= */

function categoryToDomain(category) {
    switch (category) {
        case "Tafsir": return "tafsir";
        case "Seerat": return "seerah";
        case "Constitutional Law": return "constitutional-law";
        case "Iqbalian Thought": return "iqbal";
        case "Ethics": return "civic-ethics";
        case "Statecraft": return "constitutional-law";
        case "Lisan-ul-Quran": return "lisan-ul-quran";
        case "Socio-Political": return "constitutional-law";
        default: return "tafsir";
    }
}

function normalizeVideo(video, existingItem, usedSlugs) {
    // 1. If video is ALREADY in catalogue, STRICTLY PRESERVE all existing curated fields!
    // Never overwrite old ones, never re-slug, never touch categories or tags!
    if (existingItem) {
        return existingItem;
    }

    const snippet = video.snippet || {};
    const contentDetails = video.contentDetails || {};
    const videoId = video.id;
    const durationSeconds = parseIsoDuration(contentDetails.duration);

    // 2. Brand-new video: construct full conformant LectureItem
    const title = cleanTitle(snippet.title || "");
    const rawDescription = cleanText(snippet.description || "");
    let description = sanitizeDescription(rawDescription);
    if (!description || description.length < 20) {
        description = `${title}. تفصیلی فکری اور علمی خطاب بذریعہ ڈاکٹر حافظ حسیب۔`;
    }

    const slug = createUniqueSlug(title, videoId, usedSlugs);

    const ytTags = [...(snippet.tags || [])]
        .map(cleanText)
        .filter(Boolean)
        .filter((tag, index, array) => array.indexOf(tag) === index);

    const category = inferCategory(title, rawDescription);
    const domainId = categoryToDomain(category);
    const finalTags = ytTags.length > 0 ? ytTags : [category, domainId];
    const topics = buildTopics(title, rawDescription, finalTags, category);

    const thumbnailUrl =
        snippet.thumbnails?.maxres?.url ||
        snippet.thumbnails?.standard?.url ||
        snippet.thumbnails?.high?.url ||
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    let urduTitle;
    if (/[\u0600-\u06FF]/.test(title)) {
        const urduMatch = title.match(/[\u0600-\u06FF\s،۔؛]+(?:\([^)]*\)|[^\w|–—-])*/g);
        if (urduMatch) {
            urduTitle = urduMatch.join(" ").trim();
        }
    }
    if (!urduTitle && /[\u0600-\u06FF]/.test(rawDescription)) {
        const firstUrduLine = rawDescription
            .split("\n")
            .map((line) => line.trim())
            .find((line) => /[\u0600-\u06FF]{4,}/.test(line));
        if (firstUrduLine) {
            urduTitle = firstUrduLine.slice(0, 100).trim();
        }
    }
    if (!urduTitle) {
        const categoryUrduMap = {
            "Tafsir": "فہمِ قرآن و تفسیر",
            "Seerat": "سیرت طیبہ",
            "Constitutional Law": "دستور و قانون",
            "Iqbalian Thought": "فکرِ اقبال",
            "Ethics": "اخلاقیات",
            "Statecraft": "ریاست و سیاست",
            "Lisan-ul-Quran": "لسان القرآن",
            "Socio-Political": "سماجی و فکری مباحث",
        };
        urduTitle = categoryUrduMap[category] || "فہمِ قرآن و تفسیر";
    }

    let isCoursework =
        /\b(dora|daura|tarjuma|session|sitting|dars)\b/i.test(title) ||
        /(دورہ|دورۂ|ترجمہ|نشست|درس)/.test(title);

    let quranContext = undefined;
    if (domainId === "tafsir") {
        quranContext = extractQuranContext({ title, urduTitle, isCoursework });
        // Coursework in tafsir MUST have quranContext to satisfy Audit Check 21
        if (isCoursework && !quranContext) {
            isCoursework = false;
        }
    }

    const isKhutba =
        /\b(khutba|jumma|khutbah)\b/i.test(title) ||
        /(خطبہ|جمعہ)/.test(title);

    const format = isCoursework
        ? "Serial Coursework"
        : isKhutba
        ? "Sermon / Khutba"
        : "Standalone Keynote";

    const searchText = buildSearchText({
        title,
        description,
        category,
        topics,
        tags: finalTags,
    });

    const newItem = {
        id: `yt-${videoId}`,
        slug,
        youtubeId: videoId,
        title,
        urduTitle,
        speakerId: "dr-hafiz-haseeb",
        description,
        summary: createCleanSummary(description),
        durationSeconds,
        publishedAt: snippet.publishedAt,
        thumbnailUrl,
        category,
        domainId,
        format,
        seriesId: isCoursework ? "tarjuma-e-quran-course" : undefined,
        isCoursework,
        isKhutba,
        topics,
        tags: finalTags,
        relatedArticleSlugs: [],
    };

    if (quranContext) {
        newItem.quranContext = quranContext;
    }

    return newItem;
}

/* =========================================================
   MAIN SYNC
   ========================================================= */

async function sync() {
    const apiKey = process.env.YOUTUBE_API_KEY;
    const channelId = process.env.YOUTUBE_CHANNEL_ID;

    if (!apiKey || !channelId) {
        console.error("Missing YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID.");
        process.exit(1);
    }

    const existingCatalog = fs.existsSync(CATALOG_PATH)
        ? JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"))
        : [];

    const existingMap = new Map(
        existingCatalog.map((video) => [video.youtubeId, video]),
    );

    const usedSlugs = new Set(
        existingCatalog.map((video) => video.slug).filter(Boolean),
    );

    /* -------------------------------------------------------
       Find uploads playlist
       ------------------------------------------------------- */

    const channelData = await youtubeRequest(
        `https://www.googleapis.com/youtube/v3/channels` +
            `?part=contentDetails` +
            `&id=${encodeURIComponent(channelId)}` +
            `&key=${encodeURIComponent(apiKey)}`,
    );

    const uploadsPlaylistId =
        channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
        throw new Error("Could not find the channel uploads playlist.");
    }

    /* -------------------------------------------------------
       Fetch uploads
       ------------------------------------------------------- */

    const playlistItems = await fetchIncrementalUploads(
        apiKey,
        uploadsPlaylistId,
        new Set(existingMap.keys()),
    );

    const videoIds = playlistItems
        .map(
            (item) =>
                item.contentDetails?.videoId ||
                item.snippet?.resourceId?.videoId,
        )
        .filter(Boolean);

    if (!videoIds.length) {
        console.log("No new videos found in uploads.");
    }

    /* -------------------------------------------------------
       Fetch full video details
       ------------------------------------------------------- */

    const videoDetails = await fetchVideoDetails(apiKey, videoIds);

    /* -------------------------------------------------------
       Build catalogue & Filter Shorts
       ------------------------------------------------------- */

    const syncedVideos = new Map();
    const excludedIds = new Set();
    let newVideosCount = 0;

    for (const item of playlistItems) {
        const videoId =
            item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;

        if (!videoId) continue;

        // Strictly preserve existing catalogue items - never modify, update or re-evaluate them!
        if (existingMap.has(videoId)) {
            syncedVideos.set(videoId, existingMap.get(videoId));
            continue;
        }

        const video = videoDetails.get(videoId);
        if (!video) continue;

        // Only check shorts for brand-new incoming videos
        if (isLikelyShort(video)) {
            excludedIds.add(videoId);
            continue;
        }

        const normalized = normalizeVideo(video, null, usedSlugs);
        syncedVideos.set(videoId, normalized);
        newVideosCount++;
    }

    /* -------------------------------------------------------
       Preserve ALL other existing catalogue entries untouched
       ------------------------------------------------------- */

    for (const [videoId, existing] of existingMap) {
        if (!syncedVideos.has(videoId)) {
            syncedVideos.set(videoId, existing);
        }
    }

    /* -------------------------------------------------------
       Sort newest first
       ------------------------------------------------------- */

    const newCatalog = Array.from(syncedVideos.values()).sort(
        (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
    );

    /* -------------------------------------------------------
       Safe atomic write
       ------------------------------------------------------- */

    const directory = path.dirname(CATALOG_PATH);

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, {
            recursive: true,
        });
    }

    const tempPath = `${CATALOG_PATH}.tmp`;

    fs.writeFileSync(
        tempPath,
        JSON.stringify(newCatalog, null, 2) + "\n",
        "utf8",
    );

    fs.renameSync(tempPath, CATALOG_PATH);

    console.log(`\n[SYNC COMPLETE] ${newVideosCount} new lecture(s) successfully added.`);
    console.log(`[CATALOGUE] Active catalogue total: ${newCatalog.length} lectures.`);
    if (excludedIds.size > 0) {
        console.log(`[SHORTS] Filtered out ${excludedIds.size} YouTube Shorts.`);
    }

    /* -------------------------------------------------------
       Synchronize domain chunks in content/catalog/
       ------------------------------------------------------- */
    console.log("\n[CHUNKS] Synchronizing content/catalog domain chunks...");
    splitCatalog();
}

sync().catch((error) => {
    console.error("\nSync failed:");
    console.error(error);
    process.exit(1);
});
