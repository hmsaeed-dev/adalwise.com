import MiniSearch from "minisearch";
import { LectureItem } from "./types";
import { normalizeUrduArabic, tokenizeBilingual } from "@/lib/search/normalizer";
import { getSynonymsForText } from "@/lib/search/synonyms";
import { resolveQuranNotation } from "@/lib/search/quran-notation";

interface IndexedLectureDoc {
	id: string;
	slug: string;
	title: string;
	urduTitle: string;
	cleanUrduTitle: string;
	description: string;
	category: string;
	domainId: string;
	subCategory: string;
	seriesTitle: string;
	topics: string;
	tags: string;
	synonyms: string;
	searchText: string;
	isCoursework: boolean;
}

let lectureSearchEngine: MiniSearch<IndexedLectureDoc> | null = null;
let lecturesMap: Map<string, LectureItem> | null = null;

export function initLectureSearch(catalog: LectureItem[]): {
	engine: MiniSearch<IndexedLectureDoc>;
	map: Map<string, LectureItem>;
} {
	if (lectureSearchEngine && lecturesMap) {
		return { engine: lectureSearchEngine, map: lecturesMap };
	}

	const map = new Map<string, LectureItem>();
	const docs: IndexedLectureDoc[] = [];

	for (const item of catalog) {
		map.set(item.slug, item);

		const allText = [
			item.title,
			item.urduTitle,
			item.description,
			item.category,
			item.domainId,
			item.subCategory,
			item.seriesTitle,
			item.searchText,
			...(item.topics || []),
			...(item.tags || []),
		]
			.filter(Boolean)
			.join(" ");

		const synonyms = getSynonymsForText(allText).join(" ");

		docs.push({
			id: item.slug,
			slug: item.slug,
			title: item.title,
			urduTitle: item.urduTitle || "",
			cleanUrduTitle: normalizeUrduArabic(item.urduTitle || ""),
			description: item.description || "",
			category: item.category || "",
			domainId: item.domainId || "",
			subCategory: item.subCategory || "",
			seriesTitle: item.seriesTitle || "",
			topics: (item.topics || []).join(" "),
			tags: (item.tags || []).join(" "),
			synonyms,
			searchText: item.searchText || "",
			isCoursework: Boolean(item.isCoursework),
		});
	}

	const engine = new MiniSearch<IndexedLectureDoc>({
		fields: [
			"title",
			"urduTitle",
			"cleanUrduTitle",
			"synonyms",
			"topics",
			"tags",
			"category",
			"subCategory",
			"seriesTitle",
			"description",
			"searchText",
		],
		storeFields: ["id", "slug", "domainId", "category", "isCoursework"],
		tokenize: tokenizeBilingual,
		processTerm: (term) => normalizeUrduArabic(term),
		searchOptions: {
			boost: {
				title: 4.0,
				cleanUrduTitle: 3.5,
				urduTitle: 3.0,
				synonyms: 2.8,
				topics: 2.0,
				tags: 1.8,
				category: 1.5,
				seriesTitle: 1.5,
				subCategory: 1.3,
				description: 1.2,
				searchText: 1.0,
			},
			prefix: true,
			fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
			combineWith: "AND",
		},
	});

	engine.addAll(docs);
	lectureSearchEngine = engine;
	lecturesMap = map;

	return { engine, map };
}

export function searchLectureCatalog(
	catalog: LectureItem[],
	query: string,
	options: {
		domainId?: string;
		category?: string;
		includeCoursework?: boolean;
	} = {},
): LectureItem[] {
	const cleanQ = normalizeUrduArabic(query);
	if (!cleanQ) return catalog;

	const { engine, map } = initLectureSearch(catalog);

	const hasCourseworkIntent =
		/\b(dora|daura|tarjuma|session|sitting|dars|course|juz|para|\d+)\b/i.test(cleanQ) ||
		/(دورہ|دورۂ|ترجمہ|نشست|درس|پارہ|جزء)/.test(cleanQ);

	const boostDocument = (
		_id: string,
		_term: string,
		storedFields?: Record<string, unknown>,
	) => {
		if (!storedFields?.isCoursework) return 1.0;
		return hasCourseworkIntent ? 1.15 : 0.3;
	};

	const filterPredicate = (result: { [key: string]: any }) => {
		if (!options.includeCoursework && result.isCoursework) {
			return false;
		}
		if (options.domainId && options.domainId.toLowerCase() !== "all") {
			if (result.domainId?.toLowerCase() !== options.domainId.toLowerCase()) {
				return false;
			}
		}
		if (options.category && options.category.toLowerCase() !== "all") {
			if (result.category?.toLowerCase() !== options.category.toLowerCase()) {
				return false;
			}
		}
		return true;
	};

	// 1. Primary scoped search
	let hits = engine.search(cleanQ, {
		filter: filterPredicate,
		boostDocument,
		combineWith: "AND",
		prefix: true,
		fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
	});

	// If hits were 0 and Quran notation was detected, search resolved terms
	const quranTerms = resolveQuranNotation(query);
	if (hits.length === 0 && quranTerms.length > 0) {
		const notationQuery = quranTerms.map(normalizeUrduArabic).join(" ");
		hits = engine.search(notationQuery, {
			filter: filterPredicate,
			boostDocument,
			combineWith: "OR",
			prefix: true,
			fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
		});
	}

	// If no hits with AND, fallback to OR
	if (hits.length === 0 && cleanQ.includes(" ")) {
		hits = engine.search(cleanQ, {
			filter: filterPredicate,
			boostDocument,
			combineWith: "OR",
			prefix: true,
			fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
		});
	}

	// 2. Cross-domain fallback if domain scope yielded 0 hits
	if (
		hits.length === 0 &&
		((options.domainId && options.domainId.toLowerCase() !== "all") ||
			(options.category && options.category.toLowerCase() !== "all"))
	) {
		const fallbackFilter = (result: { [key: string]: any }) => {
			if (!options.includeCoursework && result.isCoursework) {
				return false;
			}
			return true;
		};

		hits = engine.search(cleanQ, {
			filter: fallbackFilter,
			boostDocument,
			combineWith: "AND",
			prefix: true,
			fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
		});

		if (hits.length === 0 && cleanQ.includes(" ")) {
			hits = engine.search(cleanQ, {
				filter: fallbackFilter,
				boostDocument,
				combineWith: "OR",
				prefix: true,
				fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
			});
		}
	}

	const results: LectureItem[] = [];
	for (const hit of hits) {
		const doc = map.get(hit.id);
		if (doc) {
			results.push(doc);
		}
	}

	return results;
}

// Backward compatibility legacy matching functions
export function matchLecture(item: LectureItem, tokenGroups: string[][]): boolean {
	if (tokenGroups.length === 0) return true;

	const corpus = [
		item.title,
		item.urduTitle,
		item.description,
		item.searchText,
		item.category,
		item.domainId,
		item.seriesTitle,
		...(item.topics || []),
		...(item.tags || []),
	]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	return tokenGroups.every((variants) =>
		variants.some((v) => corpus.includes(v)),
	);
}

export function scoreLecture(
	item: LectureItem,
	cleanQuery: string,
	tokenGroups: string[][],
): number {
	let score = 50;
	const titleLower = item.title.toLowerCase();
	const urduLower = (item.urduTitle || "").toLowerCase();
	const descLower = item.description.toLowerCase();
	const tagsLower = (item.tags || []).map((t) => t.toLowerCase());
	const topicsLower = (item.topics || []).map((t) => t.toLowerCase());

	if (titleLower === cleanQuery) score += 1000;
	else if (titleLower.startsWith(cleanQuery)) score += 800;
	else if (titleLower.includes(cleanQuery)) score += 600;

	if (urduLower && urduLower.includes(cleanQuery)) score += 400;
	if (descLower.includes(cleanQuery)) score += 200;

	tokenGroups.forEach((variants) => {
		if (variants.some((v) => titleLower.includes(v))) {
			score += 150;
		} else if (variants.some((v) => urduLower.includes(v))) {
			score += 100;
		} else if (variants.some((v) => descLower.includes(v))) {
			score += 50;
		} else if (
			variants.some((v) => tagsLower.some((t) => t.includes(v)) || topicsLower.some((t) => t.includes(v)))
		) {
			score += 30;
		} else {
			score += 15;
		}
	});

	if (item.category.toLowerCase().includes(cleanQuery)) {
		score += 70;
	}

	if (item.isCoursework) {
		const hasCourseworkIntent =
			/\b(dora|daura|tarjuma|session|sitting|dars|course|\d+)\b/i.test(cleanQuery) ||
			/(دورہ|دورۂ|ترجمہ|نشست|درس)/.test(cleanQuery);

		if (!hasCourseworkIntent) {
			score -= 250;
		}
	}

	return Math.max(1, score);
}
