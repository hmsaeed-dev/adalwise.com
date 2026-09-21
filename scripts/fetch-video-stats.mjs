import fs from "fs";
import path from "path";

// 1. Read .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
let YOUTUBE_API_KEY = "";
let YOUTUBE_CHANNEL_ID = "";

for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("YOUTUBE_API_KEY=")) {
    YOUTUBE_API_KEY = trimmed.replace("YOUTUBE_API_KEY=", "").trim();
  }
  if (trimmed.startsWith("YOUTUBE_CHANNEL_ID=")) {
    YOUTUBE_CHANNEL_ID = trimmed.replace("YOUTUBE_CHANNEL_ID=", "").trim();
  }
}

if (!YOUTUBE_API_KEY) {
  console.error("Missing YOUTUBE_API_KEY in .env.local");
  process.exit(1);
}

// 2. Read catalog.json
const catalogPath = "src/lib/lectures/catalog.json";
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
console.log(`Loaded ${catalog.length} lectures from catalog.json`);

// 3. Fetch Channel Statistics
async function getChannelStats() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,brandingSettings&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) {
    throw new Error(`YouTube API Error: ${JSON.stringify(data.error)}`);
  }
  return data.items && data.items.length > 0 ? data.items[0] : null;
}

// 4. Batch Fetch Video Statistics (50 at a time)
async function fetchVideoBatchStats(videoIds) {
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    chunks.push(videoIds.slice(i, i + 50));
  }

  const results = new Map();

  for (let idx = 0; idx < chunks.length; idx++) {
    const chunk = chunks[idx];
    const ids = chunk.join(",");
    const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${ids}&key=${YOUTUBE_API_KEY}`;
    console.log(`Fetching batch ${idx + 1}/${chunks.length} (${chunk.length} videos)...`);
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      console.error(`Batch ${idx + 1} error:`, data.error);
      continue;
    }
    if (data.items) {
      for (const item of data.items) {
        results.set(item.id, {
          viewCount: parseInt(item.statistics?.viewCount || "0", 10),
          likeCount: parseInt(item.statistics?.likeCount || "0", 10),
          commentCount: parseInt(item.statistics?.commentCount || "0", 10),
        });
      }
    }
  }

  return results;
}

async function main() {
  console.log("Fetching channel info...");
  const channelData = await getChannelStats();
  console.log("Channel statistics:", channelData?.statistics);

  const videoIds = catalog.map((l) => l.youtubeId).filter(Boolean);
  const statsMap = await fetchVideoBatchStats(videoIds);
  console.log(`Fetched statistics for ${statsMap.size} videos.`);

  let totalViews = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalSeconds = 0;
  let videoDetails = [];

  const domainStats = {};
  const formatStats = {};

  for (const item of catalog) {
    const s = statsMap.get(item.youtubeId) || { viewCount: 0, likeCount: 0, commentCount: 0 };
    totalViews += s.viewCount;
    totalLikes += s.likeCount;
    totalComments += s.commentCount;
    totalSeconds += item.durationSeconds || 0;

    // Track domain
    const d = item.category || "Uncategorized";
    if (!domainStats[d]) {
      domainStats[d] = { count: 0, seconds: 0, views: 0, likes: 0 };
    }
    domainStats[d].count += 1;
    domainStats[d].seconds += item.durationSeconds || 0;
    domainStats[d].views += s.viewCount;
    domainStats[d].likes += s.likeCount;

    // Track format
    const f = item.format || "Standard";
    if (!formatStats[f]) {
      formatStats[f] = { count: 0, seconds: 0, views: 0 };
    }
    formatStats[f].count += 1;
    formatStats[f].seconds += item.durationSeconds || 0;
    formatStats[f].views += s.viewCount;

    videoDetails.push({
      slug: item.slug,
      youtubeId: item.youtubeId,
      title: item.title,
      category: item.category,
      durationSeconds: item.durationSeconds,
      views: s.viewCount,
      likes: s.likeCount,
      comments: s.commentCount,
    });
  }

  // Sort videoDetails by views descending
  videoDetails.sort((a, b) => b.views - a.views);

  const top10Videos = videoDetails.slice(0, 10);

  // Approximate Watch Hours:
  // Note: YouTube Data API public statistics don't provide exact user watch retention.
  // We compute:
  // 1. Total Content Catalog Recorded Hours: totalSeconds / 3600
  // 2. Estimated Consumed Watch Hours: Assuming conservative industry retention ~35% or ~40% of video duration:
  // or (duration * views * average retention)
  const catalogHours = Number((totalSeconds / 3600).toFixed(1));
  const estimatedWatchHoursConservative = Math.round(
    videoDetails.reduce((acc, v) => acc + (v.views * (v.durationSeconds || 0) * 0.35) / 3600, 0)
  );
  const totalPossibleWatchedHours = Math.round(
    videoDetails.reduce((acc, v) => acc + (v.views * (v.durationSeconds || 0)) / 3600, 0)
  );

  // Format domain stats hours
  const formattedDomainStats = {};
  for (const [k, v] of Object.entries(domainStats)) {
    formattedDomainStats[k] = {
      lecturesCount: v.count,
      totalHours: Number((v.seconds / 3600).toFixed(1)),
      totalViews: v.views,
      totalLikes: v.likes,
    };
  }

  const generatedAt = new Date().toISOString();

  const finalStats = {
    generatedAt,
    channel: {
      channelId: YOUTUBE_CHANNEL_ID,
      title: channelData?.snippet?.title || "Adlwise",
      subscriberCount: parseInt(channelData?.statistics?.subscriberCount || "0", 10),
      totalChannelViews: parseInt(channelData?.statistics?.viewCount || "0", 10),
      totalChannelVideosUploaded: parseInt(channelData?.statistics?.videoCount || "0", 10),
    },
    catalogSummary: {
      totalCatalogLectures: catalog.length,
      totalCatalogHours: catalogHours,
      totalCatalogMinutes: Math.round(totalSeconds / 60),
      averageDurationMinutes: Math.round(totalSeconds / catalog.length / 60),
      totalViewsInCatalog: totalViews,
      totalLikesInCatalog: totalLikes,
      totalCommentsInCatalog: totalComments,
      estimatedWatchHours: estimatedWatchHoursConservative,
      maximumPotentialWatchHours: totalPossibleWatchedHours,
    },
    domainBreakdown: formattedDomainStats,
    formatBreakdown: formatStats,
    top10MostViewed: top10Videos,
  };

  // Write to video_stats.json in root
  fs.writeFileSync("video_stats.json", JSON.stringify(finalStats, null, 2), "utf8");
  console.log("Saved root video_stats.json");

  // Also save to src/lib/lectures/video_stats.json for direct UI consumption
  fs.writeFileSync("src/lib/lectures/video_stats.json", JSON.stringify(finalStats, null, 2), "utf8");
  console.log("Saved src/lib/lectures/video_stats.json");

  // Write video_stats.md for human review
  const mdContent = `# Adlwise Lecture Video Statistics Report
*Generated on: ${generatedAt}*

---

## 1. Channel Overview (Live YouTube Data API)
* **Channel Title:** ${finalStats.channel.title}
* **Subscribers:** ${finalStats.channel.subscriberCount.toLocaleString()}
* **Total Channel Views:** ${finalStats.channel.totalChannelViews.toLocaleString()}
* **Total Channel Uploads:** ${finalStats.channel.totalChannelVideosUploaded}

---

## 2. Catalog Aggregate Metrics (${catalog.length} Filtered Scholarly Lectures)
* **Total Catalog Lectures:** ${finalStats.catalogSummary.totalCatalogLectures}
* **Total Recorded Hours:** ${finalStats.catalogSummary.totalCatalogHours} Hours (${finalStats.catalogSummary.totalCatalogMinutes.toLocaleString()} minutes)
* **Average Discourse Length:** ${finalStats.catalogSummary.averageDurationMinutes} Minutes
* **Total Views Across Catalog:** ${finalStats.catalogSummary.totalViewsInCatalog.toLocaleString()}
* **Total Likes:** ${finalStats.catalogSummary.totalLikesInCatalog.toLocaleString()}
* **Total Discussion Comments:** ${finalStats.catalogSummary.totalCommentsInCatalog.toLocaleString()}
* **Estimated Consumed Watch Time:** ~${finalStats.catalogSummary.estimatedWatchHours.toLocaleString()} Hours *(based on conservative 35% retention)*
* **Potential Max Watch Time:** ${finalStats.catalogSummary.maximumPotentialWatchHours.toLocaleString()} Hours

---

## 3. Disciplinary Domain Breakdown
| Discipline / Domain | Lectures | Recorded Hours | Total Views | Total Likes |
| :--- | :--- | :--- | :--- | :--- |
${Object.entries(finalStats.domainBreakdown)
  .map(
    ([name, d]) =>
      `| **${name}** | ${d.lecturesCount} | ${d.totalHours} hrs | ${d.totalViews.toLocaleString()} | ${d.totalLikes.toLocaleString()} |`
  )
  .join("\n")}

---

## 4. Top 10 Most Viewed Discourses
| # | Title | Category | Duration | Views | Likes |
| :--- | :--- | :--- | :--- | :--- | :--- |
${top10Videos
  .map(
    (v, i) =>
      `| ${i + 1} | [${v.title}](/lectures/${v.slug}) | ${v.category} | ${Math.round(
        v.durationSeconds / 60
      )}m | **${v.views.toLocaleString()}** | ${v.likes.toLocaleString()} |`
  )
  .join("\n")}
`;

  fs.writeFileSync("video_stats.md", mdContent, "utf8");
  console.log("Saved video_stats.md");
}

main().catch(console.error);
