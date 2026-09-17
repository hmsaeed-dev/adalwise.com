/**
 * Adlwise Catalogue Remediation Script
 *
 * Applies targeted fixes based on the 17-point audit findings:
 * 1. Backs up catalog.json
 * 2. Purges 43 invalid records (4 deleted/zero-duration placeholders, 38 shorts <= 60s, 2 blank records)
 * 3. Resolves the duplicate slug issue (both were short announcements)
 * 4. Normalizes ALL-CAPS titles and malformed Urdu punctuation
 * 5. Standardizes transliteration variations (e.g. Qur'an -> Quran)
 * 6. Enriches degenerate descriptions (title-only) with structured domain context
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const CATALOG_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.json");
const BACKUP_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.backup.json");

const DELETED_OR_ZERO_IDS = new Set([
	"ujJt_W3St5I", // dr-hafiz-haseeb-is-live (404 on YouTube)
	"Zp5rNWefB4Y", // 7-aal-e-imran (404 on YouTube)
	"Lq3aU3TIrIY", // tarjuma-e-quran-2026 (404 on YouTube)
	"P5nE1i1m2mQ", // 1-sorat-fatiha-baqara-dora-quran-2026 (00:00 duration)
]);

export function runRemediation() {
	console.log("=== ADLWISE CATALOGUE REMEDIATION ===");

	const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));
	console.log(`Loaded original catalog.json: ${catalog.length} items`);

	// 1. Create backup
	fs.writeFileSync(BACKUP_PATH, JSON.stringify(catalog, null, 2), "utf8");
	console.log(`[BACKUP] Saved backup copy to ${path.relative(ROOT_DIR, BACKUP_PATH)}`);

	let purgedCount = 0;
	let titleNormalizedCount = 0;
	let urduNormalizedCount = 0;
	let descEnrichedCount = 0;

	// Filter out invalid items
	const cleaned = catalog.filter((item) => {
		const ytId = item.youtubeId?.trim();
		const dur = item.durationSeconds || 0;
		const title = item.title?.trim() || "";
		const desc = item.description?.trim() || "";

		// Condition A: Confirmed deleted / zero duration
		if (DELETED_OR_ZERO_IDS.has(ytId) || dur <= 0) {
			purgedCount++;
			return false;
		}

		// Condition B: Blank title or description
		if (!title || !desc) {
			purgedCount++;
			return false;
		}

		// Condition C: YouTube Shorts (duration <= 60 seconds or #shorts tag)
		if (dur <= 60 || /#shorts\b/i.test(title) || /#shorts\b/i.test(desc)) {
			purgedCount++;
			return false;
		}

		// Condition D: Google Maps venue announcement URLs
		if (/maps\.app\.goo\.gl/i.test(title)) {
			purgedCount++;
			return false;
		}

		return true;
	});

	// Normalize remaining items
	cleaned.forEach((item) => {
		let t = item.title.trim();

		// Specific ALL-CAPS fixes
		if (item.slug === "ep01-subah-zarb-e-kaleem") {
			item.title = "Ep Subah صبح | Zarb-e-Kaleem (ضربِ کلیم)";
			titleNormalizedCount++;
		} else if (item.slug === "muhammad-rasoolullah-saw-special-lecture-2") {
			item.title = "محمد رسول اللہﷺ | Muhammad Rasoolullah (SAW) | Special Lecture - 2";
			titleNormalizedCount++;
		} else if (item.slug === "la-ilaha-ilallah-special-lecture-1") {
			item.title = "لا إله إلا الله | La Ilaha Ilallah | Special Lecture - 1";
			titleNormalizedCount++;
		}

		// Transliteration standardization: Qur'an -> Quran
		if (item.title.includes("Qur'an")) {
			item.title = item.title.replace(/Qur'an/g, "Quran");
			titleNormalizedCount++;
		}

		// Malformed Urdu punctuation fix
		if (item.slug === "14-what-to-do" && item.urduTitle) {
			item.urduTitle = "اگست اور ربیع الاول؟";
			urduNormalizedCount++;
		}

		// Enrich degenerate descriptions (strictly identical to title)
		if (item.description.trim() === item.title.trim()) {
			item.description = `${item.title} — Comprehensive academic discourse by Dr. Hafiz Haseeb exploring ${item.category} and foundational principles of Islamic thought and jurisprudence.`;
			if (!item.summary || item.summary.trim() === item.title.trim()) {
				item.summary = item.description.slice(0, 160);
			}
			descEnrichedCount++;
		}

		// Populate tags from category, domain, and topics if tags array is empty
		if (!item.tags || item.tags.length === 0) {
			const tagSet = new Set([
				item.category,
				item.domainId,
				...(item.topics || []),
			].filter(Boolean));
			item.tags = Array.from(tagSet);
		}
	});

	console.log(`[CLEANSE] Purged ${purgedCount} invalid items (deleted/shorts/blanks)`);
	console.log(`[CLEANSE] Normalized ${titleNormalizedCount} titles`);
	console.log(`[CLEANSE] Normalized ${urduNormalizedCount} Urdu strings`);
	console.log(`[CLEANSE] Enriched ${descEnrichedCount} degenerate descriptions`);
	console.log(`[RESULT] Cleaned catalog contains ${cleaned.length} high-signal lectures`);

	// Write cleaned catalog
	fs.writeFileSync(CATALOG_PATH, JSON.stringify(cleaned, null, 2), "utf8");
	console.log(`[SAVED] Updated ${path.relative(ROOT_DIR, CATALOG_PATH)} successfully.`);
}

runRemediation();
