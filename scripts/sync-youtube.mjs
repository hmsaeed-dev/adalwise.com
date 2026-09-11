/**
 * Adalwise YouTube Catalog Sync Pipeline (Optimized)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.resolve(__dirname, "../src/lib/media/catalog.json");
const ENV_LOCAL_PATH = path.resolve(__dirname, "../.env.local");
const ENV_PATH = path.resolve(__dirname, "../.env");

/* =========================================================
   CONFIG & CONSTANTS
   ========================================================= */

const SHORT_HARD_LIMIT_SECONDS = 75; // Always treat <= 75s as short
const SHORT_SOFT_LIMIT_SECONDS = 180; // Inspect signals between 75s and 180s
const SHORT_SIGNALS = ["#shorts", "#short", "shorts", "reel", "reels"];
const SHORT_ALLOWLIST = new Set([]);

const DEFAULT_SPEAKER = {
	name: "Dr. Hafiz Haseeb",
	urduName: "ڈاکٹر حافظ حسیب",
	title: "Director, Adalwise Institute",
};

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
			if (key && !process.env[key]) process.env[key] = value;
		}
	}
}
loadEnv();

/* =========================================================
   HELPERS & CLEANERS
   ========================================================= */

function parseIsoDuration(duration) {
	if (!duration) return 0;
	const match = duration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
	if (!match) return 0;
	return (
		Number(match[1] || 0) * 3600 +
		Number(match[2] || 0) * 60 +
		Number(match[3] || 0)
	);
}

function cleanText(text = "") {
	return text
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/\r/g, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function sanitizeDescription(desc = "") {
	// Strip empty template scaffolding and channel links
	return cleanText(
		desc
			.replace(/^HOOK\s*/i, "")
			.replace(/[-─=]{4,}/g, "")
			.replace(/https?:\/\/\S+/gi, "")
			.trim(),
	);
}

function slugify(title, videoId) {
	const ascii = cleanText(title)
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");

	// Prevent generic "lecture-X" slugs
	return ascii && !ascii.startsWith("lecture") ? ascii : `video-${videoId}`;
}

function extractUrduTitle(title) {
	const matches = title.match(/[\u0600-\u06FF\u0750-\u077F\s،۔؛؟!:'"()\-]+/g);
	if (!matches) return undefined;
	const result = matches.join(" ").replace(/\s+/g, " ").trim();
	return result.length > 4 ? result : undefined;
}

function isLikelyShort(video) {
	if (SHORT_ALLOWLIST.has(video.id)) return false;
	const duration = parseIsoDuration(video.contentDetails?.duration);

	if (duration <= SHORT_HARD_LIMIT_SECONDS) return true;
	if (duration > SHORT_SOFT_LIMIT_SECONDS) return false;

	const text =
		`${video.snippet?.title || ""} ${video.snippet?.description || ""}`.toLowerCase();
	return SHORT_SIGNALS.some((sig) => text.includes(sig));
}

/* =========================================================
   TAXONOMY & SEARCH
   ========================================================= */

function inferCategory(title, description = "") {
	const text = `${title} ${description}`.toLowerCase();
	if (/تفسیر|tafsir|قرآن|quran|surah|سورۃ|سورة/.test(text)) return "Tafsir";
	if (/سیرت|seerat|seerah|prophet|مدینہ|madinah|رسول|rasool/.test(text))
		return "Seerat";
	if (/دستور|constitution|قانون|عدالت|judicial|court/.test(text))
		return "Constitutional Law";
	if (/ریاست|statecraft|قرض|debt|معیشت|economy|political|politics/.test(text))
		return "Statecraft";
	if (/اخلاق|ethics|اختلاف|adab|akhlaq/.test(text)) return "Ethics";
	return "Socio-Political";
}

function buildTopics(title, description, tags, category) {
	const topics = new Set();

	for (const tag of tags || []) {
		const val = cleanText(tag);
		if (val && !val.toLowerCase().includes("drhafizhaseeb"))
			topics.add(val);
		if (topics.size >= 4) break;
	}

	const text = `${title} ${description}`.toLowerCase();
	const rules = [
		["Quran", ["quran", "قرآن", "surah", "سورۃ"]],
		["Tafsir", ["tafsir", "تفسیر"]],
		["Seerat", ["seerat", "seerah", "سیرت"]],
		["Statecraft", ["statecraft", "ریاست", "constitution"]],
		["Ethics", ["ethics", "اخلاق", "akhlaq"]],
	];

	for (const [topic, signals] of rules) {
		if (signals.some((s) => text.includes(s))) topics.add(topic);
		if (topics.size >= 5) break;
	}

	return topics.size ? Array.from(topics) : [category];
}

function buildSearchText(fields) {
	const tokens = new Set();
	Object.values(fields)
		.flat()
		.filter(Boolean)
		.forEach((val) => {
			if (typeof val === "string") {
				val.toLowerCase()
					.split(/\s+/)
					.forEach((t) => tokens.add(t));
			}
		});
	return Array.from(tokens).join(" ");
}

/* =========================================================
   API OPERATIONS (WITH INCREMENTAL SYNC)
   ========================================================= */

async function youtubeRequest(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const data = await response.json();
	if (data.error) throw new Error(data.error.message);
	return data;
}

async function fetchIncrementalUploads(apiKey, playlistId, existingIds) {
	const uploads = [];
	let pageToken = "";
	let page = 1;
	let consecutiveKnown = 0;

	while (true) {
		process.stdout.write(`Fetching upload page ${page}...\r`);
		let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(playlistId)}&maxResults=50&key=${encodeURIComponent(apiKey)}`;
		if (pageToken) url += `&pageToken=${encodeURIComponent(pageToken)}`;

		const data = await youtubeRequest(url);
		const items = data.items || [];
		uploads.push(...items);

		// Incremental stop-check: If 5 items on page already exist, break
		for (const item of items) {
			const vidId =
				item.contentDetails?.videoId ||
				item.snippet?.resourceId?.videoId;
			if (existingIds.has(vidId)) consecutiveKnown++;
			else consecutiveKnown = 0;
		}

		if (!data.nextPageToken || consecutiveKnown >= 5) break;
		pageToken = data.nextPageToken;
		page++;
	}
	return uploads;
}

async function fetchVideoDetails(apiKey, videoIds) {
	const map = new Map();
	const uniqueIds = [...new Set(videoIds)];

	for (let i = 0; i < uniqueIds.length; i += 50) {
		const batch = uniqueIds.slice(i, i + 50);
		const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${batch.join(",")}&key=${encodeURIComponent(apiKey)}`;
		const data = await youtubeRequest(url);
		for (const video of data.items || []) map.set(video.id, video);
	}
	return map;
}

/* =========================================================
   CATALOG BUILDER
   ========================================================= */

function normalizeVideo(video, existingItem, usedSlugs) {
	const snippet = video.snippet || {};
	const contentDetails = video.contentDetails || {};
	const videoId = video.id;

	const title = cleanText(snippet.title || "");
	const rawDescription = cleanText(snippet.description || "");
	const sanitizedDesc = sanitizeDescription(rawDescription);
	const urduTitle = extractUrduTitle(title);

	let slug = existingItem?.slug;
	if (!slug || slug.startsWith("lecture-")) {
		const baseSlug = slugify(title, videoId);
		slug = baseSlug;
		let c = 2;
		while (usedSlugs.has(slug)) slug = `${baseSlug}-${c++}`;
	}
	usedSlugs.add(slug);

	const category =
		existingItem?.category || inferCategory(title, rawDescription);
	const ytTags = (snippet.tags || []).map(cleanText).filter(Boolean);
	const topics = existingItem?.topics?.length
		? existingItem.topics
		: buildTopics(title, rawDescription, ytTags, category);

	const durationSeconds = parseIsoDuration(contentDetails.duration);
	const thumbnailUrl =
		snippet.thumbnails?.maxres?.url ||
		snippet.thumbnails?.standard?.url ||
		snippet.thumbnails?.high?.url ||
		`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

	const finalDescription =
		existingItem?.description &&
		existingItem.description !== "Recorded lecture and scholarly Tafsir."
			? existingItem.description
			: sanitizedDesc.slice(0, 350) ||
				"Recorded lecture and scholarly Tafsir.";

	const finalSummary =
		existingItem?.summary ||
		(sanitizedDesc ? sanitizedDesc.slice(0, 180) : undefined);

	return {
		id: `yt-${videoId}`,
		slug,
		youtubeId: videoId,
		title,
		...(urduTitle ? { urduTitle } : {}),
		speaker: existingItem?.speaker || DEFAULT_SPEAKER,
		description: finalDescription,
		...(finalSummary ? { summary: finalSummary } : {}),
		durationSeconds,
		publishedAt: snippet.publishedAt,
		thumbnailUrl,
		category,
		topics,
		tags: topics,
		relatedArticleSlugs: existingItem?.relatedArticleSlugs || [],
		searchText: buildSearchText({ title, urduTitle, topics, category }),
	};
}

/* =========================================================
   MAIN SYNC
   ========================================================= */

async function sync() {
	const apiKey = process.env.YOUTUBE_API_KEY;
	const channelId = process.env.YOUTUBE_CHANNEL_ID;

	if (!apiKey || !channelId) {
		console.error("Missing credentials.");
		process.exit(1);
	}

	const existingCatalog = fs.existsSync(CATALOG_PATH)
		? JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"))
		: [];
	const existingMap = new Map(existingCatalog.map((v) => [v.youtubeId, v]));
	const usedSlugs = new Set();

	const uploadsPlaylistId = await youtubeRequest(
		`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
	).then((res) => res.items?.[0]?.contentDetails?.relatedPlaylists?.uploads);

	const playlistItems = await fetchIncrementalUploads(
		apiKey,
		uploadsPlaylistId,
		existingMap,
	);
	const videoIds = playlistItems
		.map((i) => i.contentDetails?.videoId)
		.filter(Boolean);
	const videoDetails = await fetchVideoDetails(apiKey, videoIds);

	const newCatalog = [];
	for (const item of playlistItems) {
		const videoId = item.contentDetails?.videoId;
		const video = videoDetails.get(videoId);
		if (!video || isLikelyShort(video)) continue;

		const existing = existingMap.get(videoId);
		newCatalog.push(normalizeVideo(video, existing, usedSlugs));
	}

	// Merge any older existing videos that were past the incremental sync limit
	for (const [id, item] of existingMap) {
		if (!newCatalog.some((v) => v.youtubeId === id)) {
			newCatalog.push(item);
		}
	}

	newCatalog.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() -
			new Date(a.publishedAt).getTime(),
	);

	// Atomic safe write
	const tempPath = `${CATALOG_PATH}.tmp`;
	fs.writeFileSync(tempPath, JSON.stringify(newCatalog, null, 2) + "\n");
	fs.renameSync(tempPath, CATALOG_PATH);

	console.log(`Sync complete: ${newCatalog.length} records saved.`);
}

sync();
