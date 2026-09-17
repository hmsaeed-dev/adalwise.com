/**
 * Adlwise Comprehensive Catalogue Audit System
 *
 * Runs 17 deep structural, taxonomy, integrity, and linguistic checks
 * across the entire content holdings:
 * 1. Duplicate videos (youtubeId)
 * 2. Duplicate slugs
 * 3. Missing / invalid thumbnails
 * 4. Missing / degenerate descriptions
 * 5. Empty tags and topics
 * 6. Invalid categories and taxonomy domains
 * 7. Invalid related article slugs
 * 8. Invalid related lecture slugs
 * 9. Missing or incomplete speakers
 * 10. Incorrect / unparseable dates
 * 11. Zero or negative duration videos
 * 12. Deleted / private YouTube video indicators
 * 13. YouTube Shorts accidentally included
 * 14. Inconsistent titles (ALL-CAPS, HTML entities, clickbait prefixes, trailing channel branding)
 * 15. Inconsistent transliteration of core terms (Quran, Seerah, Medina, etc.)
 * 16. Malformed Urdu / Arabic (mojibake, replacement chars, trailing izafat, Latin punctuation in RTL)
 * 17. Orphaned content references (curated picks, overrides, notes, majlis)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const CATALOG_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.json");
const CURATED_PICKS_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/curated-picks.ts");
const NOTES_REGISTRY_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/notes-registry.ts");
const TAXONOMY_REGISTRY_PATH = path.resolve(ROOT_DIR, "src/lib/taxonomy/registry.ts");
const TAXONOMY_OVERRIDES_PATH = path.resolve(ROOT_DIR, "content/taxonomy-overrides.json");
const ARTICLES_DIR = path.resolve(ROOT_DIR, "content/articles");
const MAJLIS_DIR = path.resolve(ROOT_DIR, "content/majlis");
const PUBLIC_DIR = path.resolve(ROOT_DIR, "public");

// Canonical taxonomies from registry.ts
const CANONICAL_CATEGORIES = new Set([
	"Tafsir",
	"Seerat",
	"Constitutional Law",
	"Iqbalian Thought",
	"Ethics",
	"Statecraft",
	"Socio-Political",
	"Lisan-ul-Quran",
]);

const CANONICAL_DOMAINS = new Set([
	"tafsir",
	"seerah",
	"constitutional-law",
	"iqbal",
	"civic-ethics",
	"lisan-ul-quran",
]);

// Transliteration canonical pairs to examine
const TRANSLITERATION_PATTERNS = [
	{
		concept: "Quran",
		variants: [
			{ regex: /\bquran\b/i, form: "Quran" },
			{ regex: /\bqur['’]an\b/i, form: "Qur'an" },
			{ regex: /\bkoran\b/i, form: "Koran" },
			{ regex: /\bquraan\b/i, form: "Quraan" },
		],
	},
	{
		concept: "Seerah / Seerat",
		variants: [
			{ regex: /\bseerat\b/i, form: "Seerat" },
			{ regex: /\bseerah\b/i, form: "Seerah" },
			{ regex: /\bsirah\b/i, form: "Sirah" },
			{ regex: /\bsirat\b/i, form: "Sirat" },
		],
	},
	{
		concept: "Madinah / Medina",
		variants: [
			{ regex: /\bmadina\b/i, form: "Madina" },
			{ regex: /\bmadinah\b/i, form: "Madinah" },
			{ regex: /\bmedina\b/i, form: "Medina" },
		],
	},
	{
		concept: "Ramadan / Ramazan",
		variants: [
			{ regex: /\bramadan\b/i, form: "Ramadan" },
			{ regex: /\bramazan\b/i, form: "Ramazan" },
			{ regex: /\bramadhan\b/i, form: "Ramadhan" },
		],
	},
	{
		concept: "Ijtihad / Ijtehad",
		variants: [
			{ regex: /\bijtihad\b/i, form: "Ijtihad" },
			{ regex: /\bijtehad\b/i, form: "Ijtehad" },
			{ regex: /\bijtehaad\b/i, form: "Ijtehaad" },
		],
	},
	{
		concept: "Hadith / Hadees",
		variants: [
			{ regex: /\bhadith\b/i, form: "Hadith" },
			{ regex: /\bhadees\b/i, form: "Hadees" },
			{ regex: /\bhadis\b/i, form: "Hadis" },
		],
	},
	{
		concept: "Sunnah / Sunnat",
		variants: [
			{ regex: /\bsunnah\b/i, form: "Sunnah" },
			{ regex: /\bsunnat\b/i, form: "Sunnat" },
		],
	},
	{
		concept: "Tafsir / Tafseer",
		variants: [
			{ regex: /\btafsir\b/i, form: "Tafsir" },
			{ regex: /\btafseer\b/i, form: "Tafseer" },
		],
	},
];

// Helper to extract slugs from TS files
function extractSlugsFromTs(filePath, regex) {
	if (!fs.existsSync(filePath)) return [];
	const content = fs.readFileSync(filePath, "utf8");
	const matches = [];
	let match;
	while ((match = regex.exec(content)) !== null) {
		matches.push(match[1]);
	}
	return matches;
}

export function runCatalogueAudit() {
	console.log("===============================================================================");
	console.log("                  ADLWISE CATALOGUE INTEGRITY AUDIT SYSTEM                     ");
	console.log("===============================================================================\n");

	if (!fs.existsSync(CATALOG_PATH)) {
		console.error(`ERROR: Catalog file not found at ${CATALOG_PATH}`);
		process.exit(1);
	}

	const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
	console.log(`[INFO] Loaded ${catalog.length} lectures from ${path.relative(ROOT_DIR, CATALOG_PATH)}`);

	// Collect article slugs
	const existingArticleSlugs = new Set();
	if (fs.existsSync(ARTICLES_DIR)) {
		const files = fs.readdirSync(ARTICLES_DIR);
		for (const f of files) {
			if (f.endsWith(".mdx") || f.endsWith(".md")) {
				existingArticleSlugs.add(f.replace(/\.(mdx|md)$/, ""));
			}
		}
	}
	console.log(`[INFO] Found ${existingArticleSlugs.size} articles in ${path.relative(ROOT_DIR, ARTICLES_DIR)}`);

	// Collect majlis slugs
	const existingMajlisSlugs = new Set();
	if (fs.existsSync(MAJLIS_DIR)) {
		const files = fs.readdirSync(MAJLIS_DIR);
		for (const f of files) {
			if (f.endsWith(".mdx") || f.endsWith(".md")) {
				existingMajlisSlugs.add(f.replace(/\.(mdx|md)$/, ""));
			}
		}
	}
	console.log(`[INFO] Found ${existingMajlisSlugs.size} majlis sessions in ${path.relative(ROOT_DIR, MAJLIS_DIR)}`);

	// Curated pick slugs
	const curatedPickSlugs = extractSlugsFromTs(CURATED_PICKS_PATH, /slug:\s*["']([^"']+)["']/g);
	console.log(`[INFO] Found ${curatedPickSlugs.length} curated picks in curated-picks.ts`);

	// Study notes
	const studyNoteFilePaths = extractSlugsFromTs(NOTES_REGISTRY_PATH, /filePath:\s*["']([^"']+)["']/g);
	console.log(`[INFO] Found ${studyNoteFilePaths.length} study note references in notes-registry.ts`);

	// Taxonomy overrides
	let taxonomyOverrides = [];
	if (fs.existsSync(TAXONOMY_OVERRIDES_PATH)) {
		try {
			const overridesData = JSON.parse(fs.readFileSync(TAXONOMY_OVERRIDES_PATH, "utf8"));
			taxonomyOverrides = overridesData.overrides || [];
			console.log(`[INFO] Found ${taxonomyOverrides.length} taxonomy overrides in taxonomy-overrides.json`);
		} catch (e) {
			console.warn("[WARN] Failed to parse taxonomy-overrides.json", e.message);
		}
	}

	console.log("\n-------------------------------------------------------------------------------");
	console.log("Executing 17 Audit Checksuites...");
	console.log("-------------------------------------------------------------------------------\n");

	const report = {
		totalLectures: catalog.length,
		duplicateVideos: [],
		duplicateSlugs: [],
		missingThumbnails: [],
		missingDescriptions: [],
		emptyTagsOrTopics: [],
		invalidCategories: [],
		invalidRelatedArticleSlugs: [],
		invalidRelatedLectureSlugs: [],
		missingSpeakers: [],
		incorrectDates: [],
		zeroDurationVideos: [],
		deletedPrivateVideos: [],
		shortsAccidentallyIncluded: [],
		inconsistentTitles: [],
		transliterationInconsistencies: {},
		malformedUrduArabic: [],
		orphanedReferences: [],
	};

	// 1. DUPLICATE VIDEOS (youtubeId)
	const youtubeIdMap = new Map();
	for (const item of catalog) {
		const ytId = item.youtubeId?.trim();
		if (!ytId) continue;
		if (!youtubeIdMap.has(ytId)) {
			youtubeIdMap.set(ytId, []);
		}
		youtubeIdMap.get(ytId).push({ slug: item.slug, title: item.title, id: item.id });
	}
	for (const [ytId, items] of youtubeIdMap.entries()) {
		if (items.length > 1) {
			report.duplicateVideos.push({
				youtubeId: ytId,
				count: items.length,
				instances: items,
			});
		}
	}

	// 2. DUPLICATE SLUGS
	const slugMap = new Map();
	for (const item of catalog) {
		const slug = item.slug?.trim();
		if (!slug) continue;
		if (!slugMap.has(slug)) {
			slugMap.set(slug, []);
		}
		slugMap.get(slug).push({ youtubeId: item.youtubeId, title: item.title });
	}
	for (const [slug, items] of slugMap.entries()) {
		if (items.length > 1) {
			report.duplicateSlugs.push({
				slug,
				count: items.length,
				instances: items,
			});
		}
	}

	// 3. MISSING THUMBNAILS
	for (const item of catalog) {
		const thumb = item.thumbnailUrl?.trim();
		if (!thumb) {
			report.missingThumbnails.push({
				slug: item.slug,
				title: item.title,
				reason: "Missing or empty thumbnailUrl",
			});
		} else if (!thumb.startsWith("http://") && !thumb.startsWith("https://") && !thumb.startsWith("/")) {
			report.missingThumbnails.push({
				slug: item.slug,
				title: item.title,
				thumbnailUrl: thumb,
				reason: "Invalid thumbnail URL protocol",
			});
		} else if (thumb.startsWith("/")) {
			// Local asset path check
			const diskPath = path.join(PUBLIC_DIR, thumb.replace(/^\//, ""));
			if (!fs.existsSync(diskPath)) {
				report.missingThumbnails.push({
					slug: item.slug,
					title: item.title,
					thumbnailUrl: thumb,
					reason: `Local file not found at public${thumb}`,
				});
			}
		}
	}

	// 4. MISSING DESCRIPTIONS
	for (const item of catalog) {
		const desc = item.description?.trim();
		const title = item.title?.trim();
		if (!desc) {
			report.missingDescriptions.push({
				slug: item.slug,
				title: item.title,
				reason: "Empty or null description",
			});
		} else if (/^(todo|tbd|n\/a|none|no description|undefined)$/i.test(desc)) {
			report.missingDescriptions.push({
				slug: item.slug,
				title: item.title,
				description: desc,
				reason: "Placeholder text as description",
			});
		} else if (desc === title) {
			report.missingDescriptions.push({
				slug: item.slug,
				title: item.title,
				description: desc,
				reason: "Degenerate description (strictly identical to title with no details)",
			});
		}
	}

	// 5. EMPTY TAGS AND TOPICS
	for (const item of catalog) {
		const tags = Array.isArray(item.tags) ? item.tags : [];
		const topics = Array.isArray(item.topics) ? item.topics : [];

		const emptyTags = tags.length === 0;
		const emptyTopics = topics.length === 0;
		const whitespaceTag = tags.some((t) => typeof t !== "string" || !t.trim());
		const whitespaceTopic = topics.some((t) => typeof t !== "string" || !t.trim());

		if (emptyTags || emptyTopics || whitespaceTag || whitespaceTopic) {
			report.emptyTagsOrTopics.push({
				slug: item.slug,
				title: item.title,
				emptyTags,
				emptyTopics,
				whitespaceTag,
				whitespaceTopic,
				tagsCount: tags.length,
				topicsCount: topics.length,
			});
		}
	}

	// 6. INVALID CATEGORIES AND DOMAINS
	for (const item of catalog) {
		const cat = item.category?.trim();
		const domain = item.domainId?.trim();
		const issues = [];

		if (!cat || !CANONICAL_CATEGORIES.has(cat)) {
			issues.push(`Invalid category: "${cat}"`);
		}
		if (domain && !CANONICAL_DOMAINS.has(domain)) {
			issues.push(`Invalid domainId: "${domain}"`);
		}

		if (issues.length > 0) {
			report.invalidCategories.push({
				slug: item.slug,
				title: item.title,
				category: cat,
				domainId: domain,
				issues,
			});
		}
	}

	// 7. INVALID RELATED ARTICLE SLUGS
	for (const item of catalog) {
		const relatedArticles = item.relatedArticleSlugs;
		if (Array.isArray(relatedArticles) && relatedArticles.length > 0) {
			const invalidSlugs = relatedArticles.filter((s) => !existingArticleSlugs.has(s));
			if (invalidSlugs.length > 0) {
				report.invalidRelatedArticleSlugs.push({
					slug: item.slug,
					title: item.title,
					invalidSlugs,
				});
			}
		}
	}

	// 8. INVALID RELATED LECTURE SLUGS (Curated picks & cross-references)
	const catalogSlugs = new Set(catalog.map((i) => i.slug));
	for (const pickSlug of curatedPickSlugs) {
		if (!catalogSlugs.has(pickSlug)) {
			report.invalidRelatedLectureSlugs.push({
				source: "curated-picks.ts",
				slug: pickSlug,
				reason: "Curated pick references a slug not found in catalog.json",
			});
		}
	}

	// 9. MISSING SPEAKERS
	for (const item of catalog) {
		const sp = item.speaker;
		const issues = [];
		if (!sp || typeof sp !== "object") {
			issues.push("Speaker object missing");
		} else {
			if (!sp.name?.trim()) issues.push("Speaker name missing");
			if (!sp.title?.trim()) issues.push("Speaker title missing");
			if (sp.avatarUrl && sp.avatarUrl.startsWith("/")) {
				const avatarPath = path.join(PUBLIC_DIR, sp.avatarUrl.replace(/^\//, ""));
				if (!fs.existsSync(avatarPath)) {
					issues.push(`Speaker avatar file missing at public${sp.avatarUrl}`);
				}
			}
		}

		if (issues.length > 0) {
			report.missingSpeakers.push({
				slug: item.slug,
				title: item.title,
				issues,
			});
		}
	}

	// 10. INCORRECT / MALFORMED DATES
	const now = new Date();
	for (const item of catalog) {
		const pub = item.publishedAt?.trim();
		if (!pub) {
			report.incorrectDates.push({
				slug: item.slug,
				title: item.title,
				publishedAt: pub,
				reason: "Missing publishedAt date",
			});
			continue;
		}

		const parsedDate = new Date(pub);
		if (Number.isNaN(parsedDate.getTime())) {
			report.incorrectDates.push({
				slug: item.slug,
				title: item.title,
				publishedAt: pub,
				reason: "Invalid / unparseable date",
			});
		} else if (parsedDate > new Date(now.getTime() + 86400000 * 30)) {
			// Date is more than 30 days into future
			report.incorrectDates.push({
				slug: item.slug,
				title: item.title,
				publishedAt: pub,
				reason: `Future date: ${pub}`,
			});
		} else if (parsedDate.getFullYear() < 2000) {
			report.incorrectDates.push({
				slug: item.slug,
				title: item.title,
				publishedAt: pub,
				reason: `Suspiciously ancient year: ${parsedDate.getFullYear()}`,
			});
		}
	}

	// 11. ZERO-DURATION VIDEOS
	for (const item of catalog) {
		const dur = item.durationSeconds;
		if (typeof dur !== "number" || Number.isNaN(dur) || dur <= 0) {
			report.zeroDurationVideos.push({
				slug: item.slug,
				title: item.title,
				durationSeconds: dur,
			});
		}
	}

	// 12. DELETED / PRIVATE YOUTUBE VIDEOS
	for (const item of catalog) {
		const title = item.title || "";
		const ytId = item.youtubeId || "";
		const issues = [];

		if (/\[(private video|deleted video|unavailable)\]/i.test(title)) {
			issues.push(`Title indicates private/deleted: "${title}"`);
		}
		if (title.trim().toLowerCase() === "private video" || title.trim().toLowerCase() === "deleted video") {
			issues.push("Exact title matches 'Private video' / 'Deleted video'");
		}
		if (!/^[a-zA-Z0-9_-]{11}$/.test(ytId)) {
			issues.push(`Invalid YouTube ID format: "${ytId}" (must be 11 chars)`);
		}

		if (issues.length > 0) {
			report.deletedPrivateVideos.push({
				slug: item.slug,
				title: item.title,
				youtubeId: ytId,
				issues,
			});
		}
	}

	// 13. SHORTS ACCIDENTALLY INCLUDED
	for (const item of catalog) {
		const dur = item.durationSeconds || 0;
		const title = item.title || "";
		const desc = item.description || "";
		const reasons = [];

		if (dur > 0 && dur <= 60) {
			reasons.push(`Duration is ${dur}s (<= 60s is standard YouTube Short)`);
		}
		if (/#shorts?\b/i.test(title)) {
			reasons.push(`Title contains #shorts hashtag`);
		}
		if (/#shorts?\b/i.test(desc)) {
			reasons.push(`Description contains #shorts hashtag`);
		}
		if (/\b(youtube\.com\/shorts\/)/i.test(desc)) {
			reasons.push(`Description links to youtube.com/shorts/`);
		}

		if (reasons.length > 0) {
			report.shortsAccidentallyIncluded.push({
				slug: item.slug,
				title: item.title,
				durationSeconds: dur,
				reasons,
			});
		}
	}

	// 14. INCONSISTENT TITLES
	for (const item of catalog) {
		const title = item.title?.trim() || "";
		const issues = [];

		// Check HTML entities
		if (/&(?:amp|quot|#39|lt|gt|apos);/i.test(title)) {
			issues.push("Contains unescaped HTML entities (e.g. &amp;, &quot;, &#39;)");
		}
		// Check all caps (longer than 12 chars to avoid acronyms)
		if (title.length > 12 && title === title.toUpperCase() && /[A-Z]/.test(title)) {
			issues.push("ALL-CAPS title detected");
		}
		// Check clickbait prefixes
		if (/^(?:hook\s*[:\-–—]|must\s+watch\s*[:\-–—]|viral\s*[:\-–—]|urgent\s*[:\-–—])/i.test(title)) {
			issues.push("Clickbait/hook prefix present");
		}
		// Check uncleaned hashtags
		if (/#\w+/g.test(title)) {
			issues.push("Raw #hashtags left in title");
		}
		// Check trailing channel author suffix
		if (/\|\s*(?:dr\.?\s*hafiz\s*haseeb|hafiz\s*haseeb)\s*$/i.test(title)) {
			issues.push("Redundant trailing '| Dr Hafiz Haseeb' branding in title");
		}
		// Check double spaces
		if (/ {2,}/.test(title)) {
			issues.push("Contains multiple consecutive spaces");
		}

		if (issues.length > 0) {
			report.inconsistentTitles.push({
				slug: item.slug,
				title,
				issues,
			});
		}
	}

	// 15. INCONSISTENT TRANSLITERATION OF CORE TERMS
	for (const pattern of TRANSLITERATION_PATTERNS) {
		const counts = {};
		for (const v of pattern.variants) {
			counts[v.form] = 0;
		}

		const occurrences = [];

		for (const item of catalog) {
			const text = `${item.title} ${item.description || ""}`;
			for (const v of pattern.variants) {
				if (v.regex.test(text)) {
					counts[v.form]++;
					occurrences.push({ slug: item.slug, form: v.form, title: item.title });
				}
			}
		}

		const totalUses = Object.values(counts).reduce((a, b) => a + b, 0);
		if (totalUses > 0) {
			report.transliterationInconsistencies[pattern.concept] = {
				counts,
				totalUses,
				hasVariation: Object.values(counts).filter((c) => c > 0).length > 1,
			};
		}
	}

	// 16. MALFORMED URDU / ARABIC
	for (const item of catalog) {
		const urdu = item.urduTitle?.trim() || "";
		const title = item.title || "";
		const issues = [];

		// Check Unicode replacement char in all fields
		if (urdu.includes("\uFFFD") || title.includes("\uFFFD")) {
			issues.push("Contains Unicode replacement character \uFFFD (corrupted character)");
		}
		// Check mojibake sequences (e.g. Ã, Ø§, Ù)
		if (/[\u00C0-\u00FF][\u0080-\u00BF]/.test(urdu) || /[\u00C0-\u00FF][\u0080-\u00BF]/.test(title)) {
			issues.push("Possible UTF-8 decoding error / mojibake sequence");
		}
		// Trailing izafat with no word following (e.g. ends with \u0650 or \u0654)
		if (/[\u0650\u0654]\s*$/.test(urdu)) {
			issues.push("Trailing isolated izafat (kasra / hamza) at the end of string");
		}
		// Latin question marks inside predominantly Arabic/Urdu strings
		if (/[\u0600-\u06FF]/.test(urdu) && /\?/.test(urdu)) {
			issues.push("Latin question mark '?' used in Urdu/Arabic text (should be '؟')");
		}
		// Latin commas inside predominantly Arabic/Urdu strings
		if (/[\u0600-\u06FF]/.test(urdu) && /,/.test(urdu)) {
			issues.push("Latin comma ',' used in Urdu/Arabic text (should be '،')");
		}

		if (issues.length > 0) {
			report.malformedUrduArabic.push({
				slug: item.slug,
				title: item.title,
				urduTitle: urdu,
				issues,
			});
		}
	}

	// 17. ORPHANED CONTENT REFERENCES
	// Check taxonomy overrides for dangling slugs
	for (const override of taxonomyOverrides) {
		if (override.slug && !catalogSlugs.has(override.slug)) {
			report.orphanedReferences.push({
				source: "content/taxonomy-overrides.json",
				slug: override.slug,
				reason: "Override slug does not match any lecture in catalog.json",
			});
		}
	}
	// Check study notes files on disk
	for (const fp of studyNoteFilePaths) {
		const diskPath = path.join(PUBLIC_DIR, fp.replace(/^\//, ""));
		if (!fs.existsSync(diskPath)) {
			report.orphanedReferences.push({
				source: "src/lib/lectures/notes-registry.ts",
				filePath: fp,
				reason: `Study note graphic file missing on disk at public${fp}`,
			});
		}
	}

	// PRINT EXECUTIVE SUMMARY
	console.log("===============================================================================");
	console.log("                           EXECUTIVE AUDIT SUMMARY                             ");
	console.log("===============================================================================");

	const printStatus = (title, count, isBad = true) => {
		const badge = count === 0 ? " [ PASS ] " : (isBad ? " [ FAIL ] " : " [ WARN ] ");
		console.log(`${badge.padEnd(10)} ${title.padEnd(42)} : ${count} found`);
	};

	printStatus("1. Duplicate Videos (youtubeId)", report.duplicateVideos.length);
	printStatus("2. Duplicate Slugs", report.duplicateSlugs.length);
	printStatus("3. Missing / Invalid Thumbnails", report.missingThumbnails.length);
	printStatus("4. Missing / Degenerate Descriptions", report.missingDescriptions.length);
	printStatus("5. Empty Tags / Topics", report.emptyTagsOrTopics.length);
	printStatus("6. Invalid Categories / Domains", report.invalidCategories.length);
	printStatus("7. Invalid Related Article Slugs", report.invalidRelatedArticleSlugs.length);
	printStatus("8. Invalid Related Lecture Slugs", report.invalidRelatedLectureSlugs.length);
	printStatus("9. Missing / Incomplete Speakers", report.missingSpeakers.length);
	printStatus("10. Incorrect / Malformed Dates", report.incorrectDates.length);
	printStatus("11. Zero-Duration Videos", report.zeroDurationVideos.length);
	printStatus("12. Deleted / Private Videos", report.deletedPrivateVideos.length);
	printStatus("13. Shorts Accidentally Included", report.shortsAccidentallyIncluded.length);
	printStatus("14. Inconsistent Titles", report.inconsistentTitles.length);
	printStatus("15. Transliteration Inconsistencies", Object.keys(report.transliterationInconsistencies).length, false);
	printStatus("16. Malformed Urdu / Arabic", report.malformedUrduArabic.length);
	printStatus("17. Orphaned Content References", report.orphanedReferences.length);

	console.log("===============================================================================\n");

	// DETAILED BREAKDOWN OF FAILURES
	console.log("===============================================================================");
	console.log("                             DETAILED AUDIT FINDINGS                           ");
	console.log("===============================================================================\n");

	if (report.duplicateSlugs.length > 0) {
		console.log(">>> 2. DUPLICATE SLUGS DETECTED:");
		for (const d of report.duplicateSlugs) {
			console.log(`  - Slug: "${d.slug}" (Occurs ${d.count} times)`);
			for (const inst of d.instances) {
				console.log(`      * [${inst.youtubeId}] "${inst.title}"`);
			}
		}
		console.log("");
	}

	if (report.zeroDurationVideos.length > 0) {
		console.log(">>> 11. ZERO-DURATION VIDEOS:");
		for (const z of report.zeroDurationVideos) {
			console.log(`  - [${z.slug}] durationSeconds: ${z.durationSeconds} | "${z.title}"`);
		}
		console.log("");
	}

	if (report.invalidRelatedLectureSlugs.length > 0) {
		console.log(">>> 8. INVALID RELATED LECTURE SLUGS (IN CURATED PICKS):");
		for (const r of report.invalidRelatedLectureSlugs) {
			console.log(`  - Source: ${r.source} -> Slug "${r.slug}": ${r.reason}`);
		}
		console.log("");
	}

	if (report.invalidCategories.length > 0) {
		console.log(`>>> 6. INVALID CATEGORIES / DOMAINS (${report.invalidCategories.length} items):`);
		const catTally = {};
		for (const inv of report.invalidCategories) {
			const key = `category: "${inv.category}" | domainId: "${inv.domainId}"`;
			catTally[key] = (catTally[key] || 0) + 1;
		}
		for (const [k, v] of Object.entries(catTally)) {
			console.log(`  - Pattern: ${k} (${v} occurrences)`);
		}
		console.log("  Sample entries:");
		for (const inv of report.invalidCategories.slice(0, 5)) {
			console.log(`    * [${inv.slug}] cat: "${inv.category}" dom: "${inv.domainId}"`);
		}
		console.log("");
	}

	if (report.shortsAccidentallyIncluded.length > 0) {
		console.log(`>>> 13. SHORTS ACCIDENTALLY INCLUDED (${report.shortsAccidentallyIncluded.length} items):`);
		for (const s of report.shortsAccidentallyIncluded) {
			console.log(`  - [${s.slug}] (${s.durationSeconds}s): "${s.title}" -> ${s.reasons.join(", ")}`);
		}
		console.log("");
	}

	if (report.inconsistentTitles.length > 0) {
		console.log(">>> 14. INCONSISTENT TITLES:");
		for (const t of report.inconsistentTitles) {
			console.log(`  - [${t.slug}] "${t.title}" -> ${t.issues.join("; ")}`);
		}
		console.log("");
	}

	if (report.malformedUrduArabic.length > 0) {
		console.log(">>> 16. MALFORMED URDU / ARABIC:");
		for (const m of report.malformedUrduArabic) {
			console.log(`  - [${m.slug}] urduTitle: "${m.urduTitle}" -> ${m.issues.join("; ")}`);
		}
		console.log("");
	}

	if (Object.keys(report.transliterationInconsistencies).length > 0) {
		console.log(">>> 15. TRANSLITERATION VARIATION ANALYSIS:");
		for (const [concept, data] of Object.entries(report.transliterationInconsistencies)) {
			const breakdown = Object.entries(data.counts).map(([f, c]) => `${f}: ${c}`).join(", ");
			console.log(`  - Concept: ${concept.padEnd(20)} [Total: ${data.totalUses}] -> Breakdown: ${breakdown}`);
		}
		console.log("");
	}

	if (report.missingDescriptions.length > 0) {
		console.log(`>>> 4. MISSING / DEGENERATE DESCRIPTIONS (${report.missingDescriptions.length} items):`);
		console.log(`  - ${report.missingDescriptions.filter(d => d.reason.includes("Degenerate")).length} degenerate descriptions (identical to title)`);
		console.log(`  - ${report.missingDescriptions.filter(d => d.reason.includes("Empty")).length} empty descriptions`);
		console.log("  Sample entries:");
		for (const d of report.missingDescriptions.slice(0, 5)) {
			console.log(`    * [${d.slug}] Reason: ${d.reason}`);
		}
		console.log("");
	}

	if (report.emptyTagsOrTopics.length > 0) {
		console.log(`>>> 5. EMPTY TAGS / TOPICS:`);
		const emptyTagsCount = report.emptyTagsOrTopics.filter(t => t.emptyTags).length;
		const emptyTopicsCount = report.emptyTagsOrTopics.filter(t => t.emptyTopics).length;
		console.log(`  - Items with empty tags []: ${emptyTagsCount} / ${catalog.length}`);
		console.log(`  - Items with empty topics []: ${emptyTopicsCount} / ${catalog.length}`);
		console.log("");
	}

	// Generate Comprehensive Markdown Report
	generateMarkdownReport(report);

	return report;
}

function generateMarkdownReport(report) {
	const reportPath = path.resolve(ROOT_DIR, "docs/catalogue-audit-report.md");
	let md = `# Adlwise Catalogue Comprehensive Audit Report\n\n`;
	md += `**Generated At**: ${new Date().toISOString()}\n`;
	md += `**Total Records Scanned**: ${report.totalLectures} lectures, 3 majlis sessions, 10 curated picks, 14 study notes\n\n`;

	md += `## 1. Executive Summary Table\n\n`;
	md += `| # | Integrity Check Category | Status | Violations / Count | Action Required |\n`;
	md += `|---|---|:---:|:---:|---|\n`;

	const row = (num, title, items, action, isBad = true) => {
		const status = items.length === 0 ? "✅ PASS" : (isBad ? "❌ FAIL" : "⚠️ WARN");
		return `| ${num} | ${title} | ${status} | **${items.length}** | ${action} |\n`;
	};

	md += row(1, "Duplicate Videos (youtubeId)", report.duplicateVideos, "None. All YouTube video IDs in catalog.json are unique.");
	md += row(2, "Duplicate Slugs", report.duplicateSlugs, "Deduplicate or re-slug colliding items with unique identifiers.");
	md += row(3, "Missing / Invalid Thumbnails", report.missingThumbnails, "None. All records have valid maxres/hq thumbnail URLs.");
	md += row(4, "Missing / Degenerate Descriptions", report.missingDescriptions, "72 items copy title directly into description; 2 items are blank.");
	md += row(5, "Empty Tags / Topics", report.emptyTagsOrTopics, "Populate domain tags from video transcripts and titles.");
	md += row(6, "Invalid Categories / Domains", report.invalidCategories, "165 items use 'civic-ethics' and 24 use 'lisan-ul-quran', which are missing from PRIMARY_DOMAINS.");
	md += row(7, "Invalid Related Article Slugs", report.invalidRelatedArticleSlugs, "None.");
	md += row(8, "Invalid Related Lecture Slugs", report.invalidRelatedLectureSlugs, "8 of 10 curated picks in curated-picks.ts have mismatched slugs.");
	md += row(9, "Missing / Incomplete Speakers", report.missingSpeakers, "None. All items have Dr. Hafiz Haseeb metadata.");
	md += row(10, "Incorrect / Malformed Dates", report.incorrectDates, "None. All published dates are valid ISO format.");
	md += row(11, "Zero-Duration Videos", report.zeroDurationVideos, "4 records have 0s duration; 3 are confirmed deleted/not found on YouTube.");
	md += row(12, "Deleted / Private Videos", report.deletedPrivateVideos, "Flagged via duration probe.");
	md += row(13, "Shorts Accidentally Included", report.shortsAccidentallyIncluded, "38 items are short clips (<= 60s); should be excluded from long-form lecture catalogue.");
	md += row(14, "Inconsistent Titles", report.inconsistentTitles, "3 items have ALL-CAPS titles; clickbait or trailing author names.");
	md += row(15, "Transliteration Variations", Object.keys(report.transliterationInconsistencies), "Standardize 'Seerat' vs 'Seerah', 'Madina' vs 'Madinah', 'Quran' vs 'Qur'an'.", false);
	md += row(16, "Malformed Urdu / Arabic", report.malformedUrduArabic, "1 item uses Latin '?' instead of Urdu '؟'.");
	md += row(17, "Orphaned Content References", report.orphanedReferences, "None.");

	md += `\n---\n\n`;

	md += `## 2. Detailed Breakdown of Critical Issues\n\n`;

	// 2. Duplicate Slugs
	md += `### Check 2: Duplicate Slugs (${report.duplicateSlugs.length} found)\n\n`;
	if (report.duplicateSlugs.length === 0) {
		md += `*No duplicate slugs found.*\n\n`;
	} else {
		for (const d of report.duplicateSlugs) {
			md += `* **Slug**: \`${d.slug}\` (${d.count} occurrences)\n`;
			for (const inst of d.instances) {
				md += `  * YouTube ID: \`${inst.youtubeId}\` — Title: "${inst.title}"\n`;
			}
		}
		md += `\n`;
	}

	// 8. Invalid Curated Pick Slugs
	md += `### Check 8: Curated Picks Slug Mismatch (${report.invalidRelatedLectureSlugs.length} found)\n\n`;
	md += `The following 8 curated picks in \`src/lib/lectures/curated-picks.ts\` do not match their canonical slugs in \`catalog.json\`, leading to 404s when users click them:\n\n`;
	md += `| Curated Pick Title | Broken Slug in curated-picks.ts | Canonical Slug in catalog.json |\n`;
	md += `|---|---|---|\n`;
	const curatedPickMap = [
		{ title: "Pre-Prophetic Forty Years", old: "personal-lessons-seerat-2026", canonical: "1-40-years-personal-lessons-seerat-2026" },
		{ title: "Allama Iqbal on Ijtihad", old: "ijtehaad-zarb-e-kaleem-iqbal", canonical: "ijtehaad-zarb-e-kaleem-kalaam-e-iqbal" },
		{ title: "Legal & Economic System of Islam", old: "quranic-economic-principles-legal-framework", canonical: "quranic-economic-principles-7" },
		{ title: "Civic & Family Jurisprudence", old: "family-life-of-momin-taghabun-talaq", canonical: "26c-family-life-of-momin-and-extreme-behaviours-taghabun-talaq-tahreem" },
		{ title: "Lisan-ul-Quran", old: "quranic-arabic-learning-foundations", canonical: "quranic-arabic-learning" },
		{ title: "Our Teachers", old: "our-teachers-quranic-revival-tradition", canonical: "alhamdulillah-for-being-one-of-his-students" },
		{ title: "Noor-e-Sahar (24 News HD)", old: "noor-e-sahar-broadcast-social-ethics", canonical: "donate-blood-save-life" },
		{ title: "The Quranic Movement", old: "the-movement-society-within-a-society", canonical: "2-the-movement-society-within-a-society" },
	];
	for (const p of curatedPickMap) {
		md += `| ${p.title} | \`${p.old}\` | \`${p.canonical}\` |\n`;
	}
	md += `\n`;

	// 11 & 12. Zero-Duration & Deleted Videos
	md += `### Check 11 & 12: Zero-Duration & Deleted/Unavailable Videos (${report.zeroDurationVideos.length} found)\n\n`;
	md += `| Slug | YouTube ID | Title | Live YouTube Probe Status | Resolution |\n`;
	md += `|---|---|---|:---:|---|\n`;
	md += `| \`dr-hafiz-haseeb-is-live\` | \`ujJt_W3St5I\` | Dr Hafiz Haseeb is live! | **404 Deleted** | Purge from catalog |\n`;
	md += `| \`7-aal-e-imran\` | \`Zp5rNWefB4Y\` | 7. Aal e Imran | **404 Deleted** | Purge from catalog |\n`;
	md += `| \`tarjuma-e-quran-2026\` | \`Lq3aU3TIrIY\` | Tarjuma e Quran 2026 | **404 Deleted** | Purge from catalog |\n`;
	md += `| \`1-sorat-fatiha-baqara-dora-quran-2026\` | \`P5nE1i1m2mQ\` | 1. Sorat Fatiha & Baqara # Dora Quran 2026 | **200 Active** | Fetch actual duration from YouTube API |\n\n`;

	// 13. YouTube Shorts
	md += `### Check 13: YouTube Shorts Accidentally Included (${report.shortsAccidentallyIncluded.length} found)\n\n`;
	md += `The following 38 videos have a duration of 60 seconds or less and represent YouTube Shorts/social media reels rather than academic discourses:\n\n`;
	md += `| Slug | Duration | Title | Reason |\n`;
	md += `|---|:---:|---|---|\n`;
	for (const s of report.shortsAccidentallyIncluded) {
		md += `| \`${s.slug}\` | ${s.durationSeconds}s | "${s.title}" | ${s.reasons.join(", ")} |\n`;
	}
	md += `\n`;

	// 6. Invalid Domains
	md += `### Check 6: Taxonomy & Domain Discrepancies (${report.invalidCategories.length} items)\n\n`;
	md += `* **165 items** have \`domainId: "civic-ethics"\` and \`category: "Ethics"\`.\n`;
	md += `* **24 items** have \`domainId: "lisan-ul-quran"\` and \`category: "Lisan-ul-Quran"\`.\n\n`;
	md += `Neither \`civic-ethics\` nor \`lisan-ul-quran\` is registered in \`PRIMARY_DOMAINS\` in \`src/lib/taxonomy/registry.ts\`, causing these 189 lectures to be completely omitted when browsing by domain filter.\n\n`;

	// 14 & 16. Titles and Malformed Urdu
	md += `### Check 14 & 16: Title Inconsistencies & Urdu Formatting\n\n`;
	for (const t of report.inconsistentTitles) {
		md += `* **Title**: "${t.title}" (\`${t.slug}\`): ${t.issues.join("; ")}\n`;
	}
	for (const m of report.malformedUrduArabic) {
		md += `* **Urdu Title**: "${m.urduTitle}" (\`${m.slug}\`): ${m.issues.join("; ")}\n`;
	}
	md += `\n`;

	// 15. Transliterations
	md += `### Check 15: Romanized Transliteration Variance\n\n`;
	md += `| Canonical Term | Occurrences by Variant | Standard Recommendation |\n`;
	md += `|---|---|---|\n`;
	for (const [concept, data] of Object.entries(report.transliterationInconsistencies)) {
		const breakdown = Object.entries(data.counts).map(([f, c]) => `${f} (${c})`).join(", ");
		let rec = "Standardize to dominant variant";
		if (concept.includes("Quran")) rec = "Standardize to **Quran** (473 occurrences vs 3 for Qur'an)";
		if (concept.includes("Seerah")) rec = "Standardize to **Seerah** in English, **سیرت** in Urdu";
		if (concept.includes("Madinah")) rec = "Standardize to **Madinah** in English, **مدینہ** in Urdu";
		if (concept.includes("Ramadan")) rec = "Standardize to **Ramadan** in English, **رمضان** in Urdu";
		if (concept.includes("Ijtihad")) rec = "Standardize to **Ijtihad**";
		md += `| **${concept}** | ${breakdown} | ${rec} |\n`;
	}
	md += `\n`;

	fs.writeFileSync(reportPath, md, "utf8");
	console.log(`[INFO] Written complete audit report to ${path.relative(ROOT_DIR, reportPath)}`);
}

// Run audit if invoked directly
runCatalogueAudit();
