import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "../data");
const CATALOG_PATH = path.resolve(__dirname, "../src/lib/lectures/catalog.json");

// Robust CSV parser supporting quotes, commas, and newlines inside quotes
function parseCSV(content) {
	const rows = [];
	let currentRow = [];
	let currentCell = "";
	let inQuotes = false;
	const text = content.replace(/^\uFEFF/, ""); // strip BOM

	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const nextChar = text[i + 1];

		if (char === '"') {
			if (inQuotes && nextChar === '"') {
				currentCell += '"';
				i++; // skip escaped quote
			} else {
				inQuotes = !inQuotes;
			}
		} else if (char === "," && !inQuotes) {
			currentRow.push(currentCell.trim());
			currentCell = "";
		} else if ((char === "\r" || char === "\n") && !inQuotes) {
			if (char === "\r" && nextChar === "\n") i++;
			currentRow.push(currentCell.trim());
			if (currentRow.some((c) => c.length > 0)) {
				rows.push(currentRow);
			}
			currentRow = [];
			currentCell = "";
		} else {
			currentCell += char;
		}
	}
	if (currentCell.length > 0 || currentRow.length > 0) {
		currentRow.push(currentCell.trim());
		if (currentRow.some((c) => c.length > 0)) {
			rows.push(currentRow);
		}
	}
	return rows;
}

// Clean title of clickbait tags, #viral, #shorts, etc.
function cleanTitle(title = "") {
	return title
		.replace(/^HOOK\s*[:\-–—]?\s*/i, "")
		.replace(/#\w+/g, "")
		.replace(/\|\s*dr\s*hafiz\s*haseeb\s*/gi, "")
		.replace(/\|\s*hafiz\s*haseeb\s*/gi, "")
		.replace(/\s*\|\s*$/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

function cleanDescription(desc = "") {
	return desc
		.replace(/^HOOK\s*[:\-–—]?\s*/i, "")
		.replace(/📌\s*KEY POINTS[\s\S]*?(#HASHTAGS|REFERENCES|⏱ TIMESTAMPS|$)/gi, "")
		.replace(/⏱\s*TIMESTAMPS[\s\S]*?(#HASHTAGS|REFERENCES|$)/gi, "")
		.replace(/REFERENCES[\s\S]*?(#HASHTAGS|🔗 LINKS|$)/gi, "")
		.replace(/🔗\s*LINKS[\s\S]*?(#HASHTAGS|🔔 Subscribe|$)/gi, "")
		.replace(/🔔\s*Subscribe[\s\S]*?(#HASHTAGS|▶ Playlists|$)/gi, "")
		.replace(/▶\s*Playlists[\s\S]*?(#HASHTAGS|$)/gi, "")
		.replace(/#\w+/g, "")
		.replace(/[-─=]{4,}/g, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function parseDurationFormatted(formatted) {
	if (!formatted || typeof formatted !== "string") return 0;
	const parts = formatted.split(":").map((p) => parseInt(p, 10) || 0);
	if (parts.length === 3) {
		return parts[0] * 3600 + parts[1] * 60 + parts[2];
	} else if (parts.length === 2) {
		return parts[0] * 60 + parts[1];
	}
	return 0;
}

function slugify(text, videoId) {
	const ascii = text
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return ascii.length > 3 ? ascii : `lecture-${videoId}`;
}

// Map playlists and titles to the 6 canonical domains
function determineDomain(playlist, primaryDomainRaw, title, desc, isCoursework, isKhutba) {
	if (isCoursework) {
		return { domainId: "tafsir", category: "Tafsir" };
	}
	if (isKhutba) {
		return { domainId: "civic-ethics", category: "Ethics" };
	}

	const p = (playlist || "").toLowerCase();
	const d = (primaryDomainRaw || "").toLowerCase();
	const t = (title || "").toLowerCase();
	const full = `${p} ${d} ${t} ${desc || ""}`.toLowerCase();

	// 1. Lisan-ul-Quran
	if (
		p.includes("online quranic arabic course") ||
		t.includes("لسان القرآن") ||
		t.includes("lisan ul quran") ||
		t.includes("arabic course")
	) {
		return { domainId: "lisan-ul-quran", category: "Lisan-ul-Quran" };
	}

	// 2. Iqbalian Thought
	if (
		p.includes("iqbal") ||
		d.includes("iqbal") ||
		t.includes("iqbal") ||
		t.includes("اقبال") ||
		t.includes("ضربِ کلیم") ||
		t.includes("بانگِ درا") ||
		t.includes("بالِ جبریل") ||
		t.includes("جاوید نامہ")
	) {
		return { domainId: "iqbal", category: "Iqbalian Thought" };
	}

	// 3. Constitutional Law & Statecraft
	if (
		p.includes("constitution") ||
		d.includes("constitutional") ||
		t.includes("constitution") ||
		t.includes("آئین") ||
		t.includes("دستور") ||
		t.includes("supreme court") ||
		t.includes("amendment") ||
		t.includes("قانون") ||
		t.includes("ریاست") ||
		t.includes("میثاق") ||
		t.includes("statecraft") ||
		p.includes("special lecture series") && /معیشت|قرض|ریاست|justice/i.test(t)
	) {
		return { domainId: "constitutional-law", category: "Constitutional Law" };
	}

	// 4. Seerah as Operative Statecraft
	if (
		p.includes("seerat") ||
		d.includes("seerat") ||
		d.includes("civilizational history") ||
		t.includes("seerat") ||
		t.includes("سیرت") ||
		t.includes("مدینہ") ||
		t.includes("madinah") ||
		t.includes("ghazwa") ||
		t.includes("غزوہ") ||
		t.includes("prophet") ||
		t.includes("رسول")
	) {
		return { domainId: "seerah", category: "Seerat" };
	}

	// 5. Civic Ethics & Public Philosophy
	if (
		d.includes("ethics") ||
		d.includes("general public address") ||
		t.includes("اخلاق") ||
		t.includes("ethics") ||
		t.includes("adab") ||
		t.includes("family") ||
		t.includes("marriage") ||
		t.includes("tazkiyah") ||
		t.includes("تزکیہ") ||
		t.includes("تربیت") ||
		t.includes("معاشرہ") ||
		t.includes("social")
	) {
		return { domainId: "civic-ethics", category: "Ethics" };
	}

	// 6. Default: Tafsir & Quranic Hermeneutics
	return { domainId: "tafsir", category: "Tafsir" };
}

// Generate rich, tokenized bilingual search string
function buildSearchText(title, urduTitle, desc, domain, playlist, topics, tags) {
	const tokens = new Set();
	const corpus = [title, urduTitle, desc, domain, playlist, ...(topics || []), ...(tags || [])]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	corpus
		.split(/[\s,./\\;:'"[\]{}|!@#$%^&*()_+=\-–—]+/)
		.filter((tok) => tok.length >= 2)
		.forEach((tok) => tokens.add(tok));

	return Array.from(tokens).join(" ");
}

async function compile() {
	console.log("=== COMPILING ADLWISE LECTURE CATALOGUE ===");

	// 1. Read existing catalog.json (571 items)
	const existingCatalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
	console.log(`Loaded existing catalog.json: ${existingCatalog.length} records.`);

	const existingMapByYtId = new Map();
	existingCatalog.forEach((item) => {
		if (item.youtubeId) existingMapByYtId.set(item.youtubeId, item);
	});

	// 2. Read 3-data-playlist.csv for real YouTube Playlists
	const playlistCSV = fs.readFileSync(path.join(DATA_DIR, "3-data-playlist.csv"), "utf8");
	const playlistRows = parseCSV(playlistCSV);
	const plHeaders = playlistRows[0];
	const plYtIdIdx = plHeaders.indexOf("video_id");
	const plDomainIdx = plHeaders.indexOf("primary_domain"); // In 3-data-playlist this contains the playlist name!
	const plTitleIdx = plHeaders.indexOf("title");

	console.log(`Parsed 3-data-playlist.csv: ${playlistRows.length - 1} rows.`);
	const playlistByYtId = new Map();
	for (let i = 1; i < playlistRows.length; i++) {
		const row = playlistRows[i];
		const ytId = row[plYtIdIdx];
		const plName = row[plDomainIdx];
		if (ytId && plName) {
			playlistByYtId.set(ytId, plName);
		}
	}

	// 3. Read 1-data.csv for archetypes, primary domains, subcategories, metrics, clean description
	const data1CSV = fs.readFileSync(path.join(DATA_DIR, "1-data.csv"), "utf8");
	const data1Rows = parseCSV(data1CSV);
	const d1Headers = data1Rows[0];
	const d1YtIdIdx = d1Headers.indexOf("video_id");
	const d1ArchIdx = d1Headers.indexOf("structural_archetype");
	const d1DomainIdx = d1Headers.indexOf("primary_domain");
	const d1SubIdx = d1Headers.indexOf("sub_category");
	const d1DescIdx = d1Headers.indexOf("description_clean");
	const d1DurIdx = d1Headers.indexOf("duration_formatted");
	const d1ViewsIdx = d1Headers.indexOf("views");
	const d1LikesIdx = d1Headers.indexOf("likes");
	const d1TitleIdx = d1Headers.indexOf("title");
	const d1DateIdx = d1Headers.indexOf("published_date");

	console.log(`Parsed 1-data.csv: ${data1Rows.length - 1} rows.`);
	const metadataByYtId = new Map();
	for (let i = 1; i < data1Rows.length; i++) {
		const row = data1Rows[i];
		const ytId = row[d1YtIdIdx];
		if (ytId) {
			metadataByYtId.set(ytId, {
				title: row[d1TitleIdx],
				archetype: row[d1ArchIdx],
				primaryDomain: row[d1DomainIdx],
				subCategory: row[d1SubIdx],
				descriptionClean: row[d1DescIdx],
				durationFormatted: row[d1DurIdx],
				views: parseInt(row[d1ViewsIdx], 10) || 0,
				likes: parseInt(row[d1LikesIdx], 10) || 0,
				publishedDate: row[d1DateIdx],
			});
		}
	}

	// 4. Merge and compile unified records
	const compiledCatalog = [];
	const allYtIds = new Set([
		...existingMapByYtId.keys(),
		...metadataByYtId.keys(),
		...playlistByYtId.keys(),
	]);

	console.log(`Total unique YouTube video IDs across sources: ${allYtIds.size}`);

	let courseworkCount = 0;
	let khutbaCount = 0;
	const domainCounts = {};

	for (const ytId of allYtIds) {
		const existing = existingMapByYtId.get(ytId);
		const meta = metadataByYtId.get(ytId);
		const playlist = playlistByYtId.get(ytId) || "";

		// Extract raw title and description
		const rawTitle = meta?.title || existing?.title || "";
		if (!rawTitle) continue;

		const title = cleanTitle(rawTitle);
		const rawDesc = meta?.descriptionClean || existing?.description || "";
		const description = cleanDescription(rawDesc) || title;

		// Duration
		let durationSeconds = existing?.durationSeconds || 0;
		if (!durationSeconds && meta?.durationFormatted) {
			durationSeconds = parseDurationFormatted(meta.durationFormatted);
		}

		// Published Date
		const publishedAt = existing?.publishedAt || (meta?.publishedDate ? `${meta.publishedDate}T00:00:00Z` : "2024-01-01T00:00:00Z");

		// Thumbnail
		const thumbnailUrl = existing?.thumbnailUrl || `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;

		// Flags for Coursework & Khutba
		const isCoursework =
			/tarjuma|dora|ramazan/i.test(playlist) ||
			/dora.*quran|tarjuma.*quran|ramzan \d+/i.test(title);

		if (isCoursework) courseworkCount++;

		const isKhutba =
			/khutba e jumma/i.test(playlist) ||
			/khutba.*jumma/i.test(title);

		if (isKhutba) khutbaCount++;

		// Determine domain and category
		const { domainId, category } = determineDomain(playlist, meta?.primaryDomain, title, description, isCoursework, isKhutba);
		domainCounts[domainId] = (domainCounts[domainId] || 0) + 1;

		// Structural format / archetype
		let format = meta?.archetype || "Standalone Keynote";
		if (isCoursework) format = "Serial Coursework";
		if (playlist.includes("Online Quranic Arabic Course")) format = "Serial Coursework";
		if (playlist.includes("SPECIAL LECTURE SERIES")) format = "Thematic Academic Seminar";
		if (/نشست|sawal|jawab|q&a/i.test(title)) format = "Public Dialogue";

		// Urdu title extraction if title contains Urdu
		let urduTitle = existing?.urduTitle;
		if (!urduTitle && /[\u0600-\u06FF]/.test(title)) {
			// Extract Urdu portion if bilingual
			const urduMatch = title.match(/[\u0600-\u06FF\s،۔؛]+(?:\([^)]*\)|[^\w|–—-])*/g);
			if (urduMatch) {
				urduTitle = urduMatch.join(" ").trim();
			}
		}

		// Slug
		const slug = existing?.slug || slugify(title, ytId);

		// Topics
		const topics = new Set([category]);
		if (meta?.subCategory && !meta.subCategory.includes("Unassigned") && !meta.subCategory.includes("General")) {
			topics.add(meta.subCategory);
		}
		if (playlist && !playlist.includes("Unassigned")) {
			topics.add(playlist.replace(/\|\s*[^|]+$/g, "").trim());
		}

		// Search Text
		const searchText = buildSearchText(
			title,
			urduTitle,
			description,
			category,
			playlist,
			Array.from(topics),
			[]
		);

		compiledCatalog.push({
			id: `yt-${ytId}`,
			slug,
			youtubeId: ytId,
			title,
			urduTitle: urduTitle || undefined,
			speaker: {
				name: "Dr. Hafiz Haseeb",
				urduName: "ڈاکٹر حافظ حسیب",
				title: "Consultant Hematologist & Quranic Researcher",
				avatarUrl: "/images/haseeb-02.jpg",
			},
			description,
			summary: description.slice(0, 160),
			durationSeconds,
			publishedAt,
			thumbnailUrl,
			category,
			domainId,
			subCategory: meta?.subCategory || undefined,
			format,
			seriesId: playlist ? slugify(playlist, "") : undefined,
			seriesTitle: playlist || undefined,
			isCoursework,
			isKhutba,
			topics: Array.from(topics),
			tags: [],
			relatedArticleSlugs: [],
			searchText,
		});
	}

	// Sort: chronological descending by default
	compiledCatalog.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

	console.log(`\n=== COMPILED CATALOG STATS ===`);
	console.log(`Total Compiled Lectures: ${compiledCatalog.length}`);
	console.log(`Tarjuma-e-Quran Coursework Sessions: ${courseworkCount}`);
	console.log(`Khutba-e-Jumma Sermons: ${khutbaCount}`);
	console.log(`Domain Distribution:`, domainCounts);

	// Write back to catalog.json
	fs.writeFileSync(CATALOG_PATH, JSON.stringify(compiledCatalog, null, 2), "utf8");
	console.log(`[SUCCESS] Wrote enriched catalogue to ${CATALOG_PATH}`);
}

compile().catch(console.error);
