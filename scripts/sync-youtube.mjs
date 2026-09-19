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

const SHORT_MAX_SECONDS = 300; // Anything under 5 minutes is excluded

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
    if (!rawDuration) return false;

    const duration = parseIsoDuration(rawDuration);

    // Guard against invalid/unparsed durations (e.g. active livestreams)
    if (!duration || duration <= 0) {
        return false;
    }

    // Exclude anything under 5 minutes
    return duration < SHORT_MAX_SECONDS;
}

/* =========================================================
   TAXONOMY
   ========================================================= */

function inferCategory(title, description = "") {
    const text = `${title} ${description}`.toLowerCase();

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

function buildTopics(title, description, tags, category) {
    const topics = new Set();

    const text = `${title} ${description}`.toLowerCase();

    const rules = [
        ["Quran", ["quran", "قرآن", "surah", "سورۃ", "سورة"]],
        ["Tafsir", ["tafsir", "تفسیر"]],
        ["Seerat", ["seerat", "seerah", "سیرت"]],
        ["Statecraft", ["statecraft", "ریاست", "constitution"]],
        ["Ethics", ["ethics", "اخلاق", "akhlaq"]],
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
            value.length > 40
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
    const snippet = video.snippet || {};
    const contentDetails = video.contentDetails || {};
    const videoId = video.id;
    const durationSeconds = parseIsoDuration(contentDetails.duration);

    // 1. If video is ALREADY in catalogue, STRICTLY PRESERVE all existing curated fields!
    // Never strip speaker, domainId, isCoursework, urduTitle, or rename existing slugs!
    if (existingItem) {
        return {
            ...existingItem,
            durationSeconds: existingItem.durationSeconds || durationSeconds,
            thumbnailUrl:
                existingItem.thumbnailUrl ||
                snippet.thumbnails?.maxres?.url ||
                snippet.thumbnails?.high?.url ||
                `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        };
    }

    // 2. Brand-new video: construct full conformant LectureItem
    const title = cleanText(snippet.title || "");
    const rawDescription = cleanText(snippet.description || "");
    const description = sanitizeDescription(rawDescription);

    const slug = createUniqueSlug(title, videoId, usedSlugs);

    const ytTags = [...(snippet.tags || [])]
        .map(cleanText)
        .filter(Boolean)
        .filter((tag, index, array) => array.indexOf(tag) === index);

    const category = inferCategory(title, rawDescription);
    const domainId = categoryToDomain(category);
    const topics = buildTopics(title, rawDescription, ytTags, category);

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

    const isCoursework =
        /\b(dora|daura|tarjuma|session|sitting|dars)\b/i.test(title) ||
        /(دورہ|دورۂ|ترجمہ|نشست|درس)/.test(title);

    const isKhutba =
        /\b(khutba|jumma|khutbah)\b/i.test(title) ||
        /(خطبہ|جمعہ)/.test(title);

    const format = isCoursework
        ? "Serial Coursework"
        : isKhutba
        ? "Sermon / Khutba"
        : "Standalone Keynote";

    const speaker = {
        name: "Dr. Hafiz Haseeb",
        urduName: "ڈاکٹر حافظ حسیب",
        title: "Consultant Hematologist & Quranic Researcher",
        avatarUrl: "/images/haseeb-02.jpg",
    };

    const searchText = buildSearchText({
        title,
        description,
        category,
        topics,
        tags: ytTags,
    });

    return {
        id: `yt-${videoId}`,
        slug,
        youtubeId: videoId,
        title,
        urduTitle: urduTitle || undefined,
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
        tags: ytTags,
        relatedArticleSlugs: [],
    };
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

    for (const item of playlistItems) {
        const videoId =
            item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;

        if (!videoId) continue;

        const video = videoDetails.get(videoId);
        if (!video) continue;

        if (isLikelyShort(video)) {
            excludedIds.add(videoId);
            continue;
        }

        const existing = existingMap.get(videoId);
        const normalized = normalizeVideo(video, existing, usedSlugs);

        syncedVideos.set(videoId, normalized);
    }

    /* -------------------------------------------------------
       Preserve older catalogue entries (Audited against Shorts)
       ------------------------------------------------------- */

    let purgedShortsCount = 0;

    for (const [videoId, existing] of existingMap) {
        // Discard if flagged as a short in current run
        if (excludedIds.has(videoId)) {
            purgedShortsCount++;
            continue;
        }

        // Discard legacy catalog entries shorter than 5 minutes
        if (
            typeof existing.durationSeconds === "number" &&
            existing.durationSeconds > 0 &&
            existing.durationSeconds < SHORT_MAX_SECONDS
        ) {
            purgedShortsCount++;
            continue;
        }

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

    console.log(`Sync complete: ${newCatalog.length} valid lectures saved.`);
    if (purgedShortsCount > 0) {
        console.log(`Purged ${purgedShortsCount} Shorts (< 5 mins) from catalog.`);
    }
}

sync().catch((error) => {
    console.error("\nSync failed:");
    console.error(error);
    process.exit(1);
});
