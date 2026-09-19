import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const CATALOG_PATH = path.resolve(ROOT_DIR, "src/lib/lectures/catalog.json");
const CHUNKS_DIR = path.resolve(ROOT_DIR, "content/catalog");

const CANONICAL_DOMAINS = [
	"tafsir",
	"civic-ethics",
	"seerah",
	"lisan-ul-quran",
	"constitutional-law",
	"iqbal",
];

export function mergeCatalog() {
	if (!fs.existsSync(CHUNKS_DIR)) {
		throw new Error(`Chunks directory not found at ${CHUNKS_DIR}`);
	}

	const merged = [];
	const seenIds = new Set();
	const seenSlugs = new Set();

	for (const domain of CANONICAL_DOMAINS) {
		const filePath = path.resolve(CHUNKS_DIR, `${domain}.json`);
		if (!fs.existsSync(filePath)) {
			throw new Error(`Missing expected domain chunk: ${filePath}`);
		}

		const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
		console.log(`[MERGE] Read ${data.length} records from ${domain}.json`);

		for (const item of data) {
			if (item.domainId !== domain) {
				throw new Error(
					`[ERROR] Item ${item.slug} in ${domain}.json has conflicting domainId "${item.domainId}"`
				);
			}
			if (seenIds.has(item.id)) {
				throw new Error(`[ERROR] Duplicate item id detected: ${item.id} (${item.slug})`);
			}
			if (seenSlugs.has(item.slug)) {
				throw new Error(`[ERROR] Duplicate item slug detected: ${item.slug}`);
			}
			seenIds.add(item.id);
			seenSlugs.add(item.slug);
			merged.push(item);
		}
	}

	// Sort descending by publishedAt
	merged.sort(
		(a, b) =>
			new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
	);

	// Write unified catalog.json
	fs.writeFileSync(CATALOG_PATH, JSON.stringify(merged, null, 2), "utf8");
	const stats = fs.statSync(CATALOG_PATH);
	const sizeKb = (stats.size / 1024).toFixed(1);

	console.log(
		`[MERGE SUCCESS] Merged ${merged.length} records into ${CATALOG_PATH} (${sizeKb} KB)`
	);
	return merged;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	mergeCatalog();
}
