/**
 * Adalwise YouTube Catalog Sync Pipeline
 * 
 * Fetches all video uploads from the YouTube Data API v3,
 * normalizes titles, slugs, durations, and categories,
 * and compiles src/lib/media/catalog.json.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.resolve(__dirname, "../src/lib/media/catalog.json");
const ENV_LOCAL_PATH = path.resolve(__dirname, "../.env.local");
const ENV_PATH = path.resolve(__dirname, "../.env");

// 1. Automatically load .env.local or .env if present
function loadEnv() {
  for (const p of [ENV_LOCAL_PATH, ENV_PATH]) {
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (key && !process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

// Helper to convert ISO 8601 duration (e.g. PT1H23M45S) to total seconds
function parseIsoDuration(durationStr) {
  if (!durationStr) return 0;
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Generate URL-friendly slug
function slugify(text) {
  const clean = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || "lecture";
}

// Infer category from title / description
function inferCategory(title, description = "") {
  const combined = `${title} ${description}`.toLowerCase();

  if (combined.includes("تفسیر") || combined.includes("tafsir") || combined.includes("قرآن") || combined.includes("quran") || combined.includes("surah")) {
    return "Tafsir";
  }
  if (combined.includes("سیرت") || combined.includes("seerat") || combined.includes("prophet") || combined.includes("مدینہ") || combined.includes("madinah")) {
    return "Seerat";
  }
  if (combined.includes("دستور") || combined.includes("constitution") || combined.includes("قانون") || combined.includes("عدالت") || combined.includes("court") || combined.includes("judicial")) {
    return "Constitutional Law";
  }
  if (combined.includes("اصول") || combined.includes("usul") || combined.includes("فقہ") || combined.includes("fiqh") || combined.includes("شریعت")) {
    return "Usul al-Fiqh";
  }
  if (combined.includes("ریاست") || combined.includes("statecraft") || combined.includes("قرض") || combined.includes("debt") || combined.includes("معیشت") || combined.includes("economy")) {
    return "Statecraft";
  }
  if (combined.includes("اخلاق") || combined.includes("ethics") || combined.includes("اختلاف") || combined.includes("adab")) {
    return "Ethics";
  }
  return "Socio-Political";
}

// Extract Urdu title portion if bilingual
function extractUrduTitle(title) {
  // Regex for Arabic/Urdu unicode range
  const urduMatch = title.match(/[\u0600-\u06FF\s،۔؛؟!-]+/g);
  if (urduMatch) {
    const trimmed = urduMatch.join(" ").trim();
    if (trimmed.length > 5) {
      return trimmed;
    }
  }
  return undefined;
}

async function fetchAllVideos(apiKey, channelId) {
  console.log(`--> Connecting to YouTube Data API for channel: ${channelId}...`);

  // Step 1: Find uploads playlist ID (usually starts with 'UU' instead of 'UC')
  let uploadsPlaylistId = null;
  if (channelId.startsWith("UC")) {
    uploadsPlaylistId = "UU" + channelId.substring(2);
  } else {
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`;
    const res = await fetch(channelUrl);
    const data = await res.json();
    if (data.error) {
      throw new Error(`YouTube API Error: ${data.error.message}`);
    }
    uploadsPlaylistId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  }

  if (!uploadsPlaylistId) {
    throw new Error(`Could not determine uploads playlist for channel ${channelId}`);
  }

  console.log(`--> Uploads playlist ID resolved: ${uploadsPlaylistId}`);

  // Step 2: Paginate through all playlist items
  const playlistItems = [];
  let nextPageToken = "";
  let page = 1;

  while (true) {
    process.stdout.write(`Fetching page ${page} of uploads...\r`);
    const pageUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`;
    const res = await fetch(pageUrl);
    const data = await res.json();

    if (data.error) {
      throw new Error(`YouTube API Error on playlist fetch: ${data.error.message}`);
    }

    if (!data.items || data.items.length === 0) {
      break;
    }

    playlistItems.push(...data.items);

    if (data.nextPageToken) {
      nextPageToken = data.nextPageToken;
      page++;
    } else {
      break;
    }
  }

  console.log(`\n✓ Retrieved ${playlistItems.length} video records from playlist.`);

  // Step 3: Fetch video duration & metadata in batches of 50
  const videoIds = playlistItems
    .map((item) => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId)
    .filter(Boolean);

  const videoDetailsMap = new Map();
  const batchSize = 50;

  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);
    process.stdout.write(`Fetching detailed metadata batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(videoIds.length / batchSize)}...\r`);
    
    const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${batch.join(",")}&key=${apiKey}`;
    const res = await fetch(videosUrl);
    const data = await res.json();

    if (data.items) {
      for (const item of data.items) {
        videoDetailsMap.set(item.id, item);
      }
    }
  }

  console.log(`\n✓ Detailed metadata fetched for ${videoDetailsMap.size} videos.`);

  // Step 4: Normalize into MediaItem format
  const normalizedCatalog = [];
  const usedSlugs = new Set();

  for (const item of playlistItems) {
    const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
    if (!videoId) continue;

    const details = videoDetailsMap.get(videoId);
    const snippet = details?.snippet || item.snippet;
    const contentDetails = details?.contentDetails;

    const title = snippet.title;
    if (title === "Private video" || title === "Deleted video") continue;

    let baseSlug = slugify(title);
    let finalSlug = baseSlug;
    let counter = 1;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    usedSlugs.add(finalSlug);

    const durationSeconds = parseIsoDuration(contentDetails?.duration);
    const description = snippet.description || "";
    const category = inferCategory(title, description);
    const urduTitle = extractUrduTitle(title);

    // Pick best available thumbnail
    const thumbs = snippet.thumbnails || {};
    const thumbnailUrl =
      thumbs.maxres?.url ||
      thumbs.standard?.url ||
      thumbs.high?.url ||
      thumbs.medium?.url ||
      thumbs.default?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

    normalizedCatalog.push({
      id: `yt-${videoId}`,
      slug: finalSlug,
      youtubeId: videoId,
      title,
      urduTitle,
      speaker: {
        name: "Dr. Hafiz Haseeb",
        urduName: "ڈاکٹر حافظ حسیب",
        title: "Director, Adalwise Institute",
      },
      description: description.slice(0, 400) || "Recorded lecture and scholarly exegesis.",
      summary: description.slice(0, 200) || undefined,
      durationSeconds,
      publishedAt: snippet.publishedAt,
      thumbnailUrl,
      category,
      topics: snippet.tags?.slice(0, 3) || [category],
      tags: snippet.tags || [category],
      relatedArticleSlugs: [],
    });
  }

  return normalizedCatalog;
}

async function sync() {
  console.log("=========================================");
  console.log("   Adalwise YouTube Sync Pipeline");
  console.log("=========================================");

  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    console.log("No YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID found in .env.local.");
    if (fs.existsSync(CATALOG_PATH)) {
      const raw = fs.readFileSync(CATALOG_PATH, "utf-8");
      const catalog = JSON.parse(raw);
      console.log(`Retaining existing cached catalog: ${catalog.length} items.`);
    }
    return;
  }

  try {
    const catalog = await fetchAllVideos(apiKey, channelId);
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2), "utf-8");
    console.log(`\nSUCCESS: Synced and saved ${catalog.length} videos to:`);
    console.log(CATALOG_PATH);
  } catch (err) {
    console.error("\nSync failed:", err.message);
    process.exit(1);
  }
}

sync();
