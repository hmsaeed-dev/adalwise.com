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

export function splitCatalog() {
	if (!fs.existsSync(CATALOG_PATH)) {
		throw new Error(`Catalog not found at ${CATALOG_PATH}`);
	}

	const catalogRaw = fs.readFileSync(CATALOG_PATH, "utf8");
	const catalog = JSON.parse(catalogRaw);

	console.log(`[SPLIT] Loaded ${catalog.length} items from ${CATALOG_PATH}`);

	if (!fs.existsSync(CHUNKS_DIR)) {
		fs.mkdirSync(CHUNKS_DIR, { recursive: true });
		console.log(`[SPLIT] Created directory ${CHUNKS_DIR}`);
	}

	// Group items by domainId
	const groups = new Map();
	for (const domain of CANONICAL_DOMAINS) {
		groups.set(domain, []);
	}

	const unassigned = [];

	for (const item of catalog) {
		const domain = item.domainId;
		if (domain && groups.has(domain)) {
			groups.get(domain).push(item);
		} else {
			unassigned.push(item);
		}
	}

	if (unassigned.length > 0) {
		throw new Error(
			`[ERROR] Found ${unassigned.length} items with invalid or unassigned domainId! Items: ${unassigned.map((x) => x.slug).join(", ")}`
		);
	}

	let totalSplit = 0;

	for (const [domain, items] of groups.entries()) {
		// Sort descending by publishedAt
		items.sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
		);

		const targetPath = path.resolve(CHUNKS_DIR, `${domain}.json`);
		fs.writeFileSync(targetPath, JSON.stringify(items, null, 2), "utf8");
		const stats = fs.statSync(targetPath);
		const sizeKb = (stats.size / 1024).toFixed(1);
		console.log(
			`[SPLIT] Wrote ${items.length} records to ${domain}.json (${sizeKb} KB)`
		);
		totalSplit += items.length;
	}

	console.log(`[SPLIT SUCCESS] All ${totalSplit} records successfully split across ${CANONICAL_DOMAINS.length} domain chunks.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	splitCatalog();
}
