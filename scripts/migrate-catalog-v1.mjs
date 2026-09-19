import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const CATALOG_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.json");
const BACKUP_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.backup.json");

export function runMigration() {
	console.log("=== ADLWISE PHASE 1: CATALOGUE SCHEMA NORMALIZATION ===");

	const rawOriginal = fs.readFileSync(CATALOG_PATH, "utf8");
	const originalSize = Buffer.byteLength(rawOriginal);
	const catalog = JSON.parse(rawOriginal);
	console.log(`Original catalog: ${catalog.length} items (${(originalSize / 1024).toFixed(1)} KB)`);

	// 1. Create safety backup
	fs.writeFileSync(BACKUP_PATH, rawOriginal, "utf8");
	console.log(`[BACKUP] Created safety backup at ${path.relative(ROOT_DIR, BACKUP_PATH)}`);

	let speakersExtracted = 0;
	let searchTextsPurged = 0;
	let formatsNormalized = 0;
	let tarjumaConsolidated = 0;
	let iqbalConsolidated = 0;
	let adhocSeriesCleaned = 0;

	const formatCounts = {};

	for (const item of catalog) {
		// 1. Normalize speaker to speakerId
		item.speakerId = "dr-hafiz-haseeb";
		if (item.speaker) {
			delete item.speaker;
			speakersExtracted++;
		}

		// 2. Purge redundant static searchText blob
		if (item.searchText !== undefined) {
			delete item.searchText;
			searchTextsPurged++;
		}

		// 3. Normalize LectureFormat to canonical enum
		const prevFormat = item.format;
		if (item.isCoursework) {
			item.format = "Serial Coursework";
		} else if (item.isKhutba) {
			item.format = "Sermon / Khutba";
		} else if (item.seriesTitle && item.seriesTitle.includes("SPECIAL LECTURE SERIES")) {
			item.format = "Thematic Academic Seminar";
		} else if (item.format === "Public Dialogue" || /نشست|sawal|jawab/i.test(item.title)) {
			item.format = "Public Dialogue";
		} else {
			item.format = "Standalone Keynote";
		}
		if (prevFormat !== item.format) {
			formatsNormalized++;
		}
		formatCounts[item.format] = (formatCounts[item.format] || 0) + 1;

		// 4. Consolidate Tarjuma-e-Quran series taxonomy
		if (
			item.isCoursework ||
			["dora-tarjuma-quran-2023", "live-ramazan-2024", "ramazan-2025", "tarjuma-quran-in-ramazan-2026"].includes(item.seriesId)
		) {
			let year = 2026;
			if (item.seriesId === "dora-tarjuma-quran-2023" || item.title.includes("2023")) {
				year = 2023;
			} else if (item.seriesId === "live-ramazan-2024" || item.title.includes("2024")) {
				year = 2024;
			} else if (item.seriesId === "ramazan-2025" || item.title.includes("2025")) {
				year = 2025;
			} else if (item.seriesId === "tarjuma-quran-in-ramazan-2026" || item.title.includes("2026")) {
				year = 2026;
			}

			item.batchYear = year;
			item.seriesId = "tarjuma-e-quran-course";
			item.seriesTitle = `Tarjuma-e-Quran (${year} Edition)`;
			item.isCoursework = true;
			tarjumaConsolidated++;
		}

		// 5. Consolidate Iqbal series to canonical SERIES_LIST
		if (item.seriesId === "iqbal-quran-with-friends" || item.seriesId === "kalam-e-iqbal") {
			item.seriesId = "iqbal-and-quran";
			item.seriesTitle = "Iqbal & the Quranic Worldview";
			iqbalConsolidated++;
		}

		// 6. Clean ad-hoc non-series containers
		if (
			item.seriesId === "unassigned-individual-uploads" ||
			item.seriesId === "current-affairs" ||
			item.seriesId === "personal-talk"
		) {
			delete item.seriesId;
			delete item.seriesTitle;
			adhocSeriesCleaned++;
		}
	}

	const newRaw = JSON.stringify(catalog, null, 2) + "\n";
	const newSize = Buffer.byteLength(newRaw);
	const savedBytes = originalSize - newSize;
	const reductionPct = ((savedBytes / originalSize) * 100).toFixed(1);

	fs.writeFileSync(CATALOG_PATH, newRaw, "utf8");

	console.log(`\n=== MIGRATION RESULTS ===`);
	console.log(`Speaker objects extracted: ${speakersExtracted}`);
	console.log(`searchText fields purged: ${searchTextsPurged}`);
	console.log(`Formats normalized: ${formatsNormalized}`);
	console.log(`Format breakdown:`, formatCounts);
	console.log(`Tarjuma-e-Quran sessions unified under 'tarjuma-e-quran-course': ${tarjumaConsolidated}`);
	console.log(`Iqbal series unified under 'iqbal-and-quran': ${iqbalConsolidated}`);
	console.log(`Ad-hoc non-series containers cleaned: ${adhocSeriesCleaned}`);
	console.log(`\nOriginal Size: ${(originalSize / 1024).toFixed(1)} KB`);
	console.log(`New Size:      ${(newSize / 1024).toFixed(1)} KB`);
	console.log(`Saved:         ${(savedBytes / 1024).toFixed(1)} KB (${reductionPct}% reduction)`);
	console.log(`\n[SUCCESS] Normalized catalogue written to ${path.relative(ROOT_DIR, CATALOG_PATH)}`);
}

runMigration();
