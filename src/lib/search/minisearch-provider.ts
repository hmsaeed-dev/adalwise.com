import MiniSearch from "minisearch";
import { getAllArticles, getAllMajlisSessions } from "@/lib/content/client";
import { getAllLectures } from "@/lib/lectures/client";
import { STUDY_NOTES_REGISTRY } from "@/lib/lectures/notes-registry";
import { formatDuration, formatISODate } from "@/lib/utils";
import { normalizeUrduArabic, tokenizeBilingual } from "./normalizer";
import { getSynonymsForText } from "./synonyms";
import { resolveQuranNotation } from "./quran-notation";
import {
	SearchOptions,
	SearchProvider,
	SearchResult,
} from "./types";

export interface MiniSearchDocument {
	id: string;
	type: "article" | "lectures" | "dispatch" | "majlis" | "note";
	title: string;
	urduTitle: string;
	cleanUrduTitle: string;
	excerpt: string;
	category: string;
	domainId: string;
	tags: string;
	synonyms: string;
	corpus: string;
	url: string;
	date: string;
	meta?: string;
	thumbnailUrl?: string;
	youtubeId?: string;
	durationSeconds?: number;
	isCoursework?: boolean;
	slug?: string;
}

let cachedEngine: MiniSearch<MiniSearchDocument> | null = null;
let cachedDocumentsMap: Map<string, SearchResult> | null = null;

export function invalidateSearchPoolCache(): void {
	cachedEngine = null;
	cachedDocumentsMap = null;
}

async function buildSearchIndex(): Promise<{
	engine: MiniSearch<MiniSearchDocument>;
	docsMap: Map<string, SearchResult>;
}> {
	if (cachedEngine && cachedDocumentsMap) {
		return { engine: cachedEngine, docsMap: cachedDocumentsMap };
	}

	const [articles, lectureList, majlisList] = await Promise.all([
		getAllArticles(),
		getAllLectures(),
		getAllMajlisSessions(),
	]);

	const docsMap = new Map<string, SearchResult>();
	const searchDocs: MiniSearchDocument[] = [];

	// 1. Articles (Twasi al-Haq)
	for (const article of articles) {
		const docId = `art-${article.slug}`;
		const title = article.frontmatter.title || "";
		const urduTitle = article.frontmatter.urduTitle || "";
		const excerpt = article.frontmatter.excerpt || "";
		const tagsList = article.frontmatter.tags || [];
		const category = article.frontmatter.category || "Article";

		const allText = [title, urduTitle, excerpt, category, ...tagsList, article.content]
			.filter(Boolean)
			.join(" ");

		const synonyms = getSynonymsForText(allText).join(" ");

		const searchResult: SearchResult = {
			type: "article",
			id: article.slug,
			title,
			urduTitle: urduTitle || undefined,
			url: `/twasi-al-haq/${article.slug}`,
			excerpt,
			category,
			tags: tagsList,
			date: formatISODate(article.frontmatter.publishedAt),
			meta: article.frontmatter.readTime,
			slug: article.slug,
		};

		docsMap.set(docId, searchResult);
		searchDocs.push({
			id: docId,
			type: "article",
			title,
			urduTitle,
			cleanUrduTitle: normalizeUrduArabic(urduTitle),
			excerpt,
			category,
			domainId: "articles",
			tags: tagsList.join(" "),
			synonyms,
			corpus: article.content.slice(0, 5000),
			url: searchResult.url,
			date: searchResult.date,
			meta: searchResult.meta,
			slug: article.slug,
		});
	}

	// 2. Lectures (Audio & Video Catalog)
	for (const lecture of lectureList) {
		const docId = `lec-${lecture.slug}`;
		const title = lecture.title || "";
		const urduTitle = lecture.urduTitle || "";
		const excerpt = lecture.description || "";
		const tagsList = lecture.tags || [];
		const topicsList = lecture.topics || [];
		const category = lecture.category || "Lecture";
		const domainId = lecture.domainId || "";
		const isCoursework = Boolean(lecture.isCoursework);

		const url = isCoursework
			? `/tarjuma-e-quran?session=${lecture.slug}`
			: `/lectures/${lecture.slug}`;

		const allText = [
			title,
			urduTitle,
			excerpt,
			category,
			domainId,
			lecture.seriesTitle,
			lecture.searchText,
			...topicsList,
			...tagsList,
		]
			.filter(Boolean)
			.join(" ");

		const synonyms = getSynonymsForText(allText).join(" ");

		const searchResult: SearchResult = {
			type: "lectures",
			id: lecture.slug,
			title,
			urduTitle: urduTitle || undefined,
			url,
			excerpt,
			category,
			tags: tagsList,
			date: formatISODate(lecture.publishedAt),
			meta: formatDuration(lecture.durationSeconds),
			thumbnailUrl: lecture.thumbnailUrl,
			youtubeId: lecture.youtubeId,
			durationSeconds: lecture.durationSeconds,
			isCoursework,
			slug: lecture.slug,
		};

		docsMap.set(docId, searchResult);
		searchDocs.push({
			id: docId,
			type: "lectures",
			title,
			urduTitle,
			cleanUrduTitle: normalizeUrduArabic(urduTitle),
			excerpt,
			category,
			domainId,
			tags: [...topicsList, ...tagsList].join(" "),
			synonyms,
			corpus: [lecture.seriesTitle, lecture.searchText, excerpt].filter(Boolean).join(" "),
			url,
			date: searchResult.date,
			meta: searchResult.meta,
			thumbnailUrl: lecture.thumbnailUrl,
			youtubeId: lecture.youtubeId,
			durationSeconds: lecture.durationSeconds,
			isCoursework,
			slug: lecture.slug,
		});
	}

	// 3. Majlis Sessions
	for (const majlis of majlisList) {
		const docId = `maj-${majlis.slug}`;
		const title = majlis.session.title || "";
		const urduTitle = majlis.session.urduTitle || "";
		const excerpt = majlis.session.thesis || majlis.session.description || "";
		const category = "Majlis";
		const tagsList = ["Majlis", "Lahore"];

		const allText = [title, urduTitle, excerpt, category, majlis.content]
			.filter(Boolean)
			.join(" ");

		const synonyms = getSynonymsForText(allText).join(" ");

		const searchResult: SearchResult = {
			type: "majlis",
			id: majlis.slug,
			title,
			urduTitle: urduTitle || undefined,
			url: `/majlis/${majlis.slug}`,
			excerpt,
			category,
			tags: tagsList,
			date: formatISODate(majlis.session.date),
			meta: majlis.session.location,
			slug: majlis.slug,
		};

		docsMap.set(docId, searchResult);
		searchDocs.push({
			id: docId,
			type: "majlis",
			title,
			urduTitle,
			cleanUrduTitle: normalizeUrduArabic(urduTitle),
			excerpt,
			category,
			domainId: "majlis",
			tags: tagsList.join(" "),
			synonyms,
			corpus: majlis.content.slice(0, 5000),
			url: searchResult.url,
			date: searchResult.date,
			meta: searchResult.meta,
			slug: majlis.slug,
		});
	}

	// 4. Study Notes & Infographics
	for (const note of STUDY_NOTES_REGISTRY) {
		const docId = `note-${note.id}`;
		const title = note.title || "";
		const urduTitle = note.urduTitle || "";
		const excerpt = note.description || "";
		const category = note.category || "Study Note";

		const allText = [title, urduTitle, excerpt, category, note.type]
			.filter(Boolean)
			.join(" ");

		const synonyms = getSynonymsForText(allText).join(" ");

		const searchResult: SearchResult = {
			type: "note",
			id: note.id,
			title,
			urduTitle: urduTitle || undefined,
			url: `/lectures/notes`,
			excerpt,
			category,
			tags: [note.category, note.type],
			date: "",
			meta: note.type.toUpperCase(),
			slug: note.id,
		};

		docsMap.set(docId, searchResult);
		searchDocs.push({
			id: docId,
			type: "note",
			title,
			urduTitle,
			cleanUrduTitle: normalizeUrduArabic(urduTitle),
			excerpt,
			category,
			domainId: note.category.toLowerCase(),
			tags: note.type,
			synonyms,
			corpus: excerpt,
			url: searchResult.url,
			date: "",
			meta: searchResult.meta,
			slug: note.id,
		});
	}

	// Instantiate and populate MiniSearch
	const engine = new MiniSearch<MiniSearchDocument>({
		fields: [
			"title",
			"urduTitle",
			"cleanUrduTitle",
			"synonyms",
			"tags",
			"category",
			"excerpt",
			"corpus",
		],
		storeFields: [
			"id",
			"type",
			"title",
			"urduTitle",
			"url",
			"category",
			"domainId",
			"isCoursework",
			"slug",
		],
		tokenize: tokenizeBilingual,
		processTerm: (term) => normalizeUrduArabic(term),
		searchOptions: {
			boost: {
				title: 4.0,
				cleanUrduTitle: 3.5,
				urduTitle: 3.0,
				synonyms: 2.8,
				tags: 2.0,
				category: 1.6,
				excerpt: 1.2,
				corpus: 1.0,
			},
			prefix: true,
			fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
			combineWith: "AND",
		},
	});

	engine.addAll(searchDocs);

	cachedEngine = engine;
	cachedDocumentsMap = docsMap;

	return { engine, docsMap };
}

export class MiniSearchProvider implements SearchProvider {
	async search(
		query: string,
		options: SearchOptions = {},
	): Promise<SearchResult[]> {
		const {
			type = "all",
			category,
			domain,
			limit = 20,
		} = options;

		const cleanQ = normalizeUrduArabic(query);
		if (!cleanQ || limit <= 0) {
			return [];
		}

		const { engine, docsMap } = await buildSearchIndex();

		// Contextual intent detection for coursework (324 Tarjuma sessions)
		const hasCourseworkIntent =
			/\b(dora|daura|tarjuma|session|sitting|dars|course|juz|para|\d+)\b/i.test(cleanQ) ||
			/(دورہ|دورۂ|ترجمہ|نشست|درس|پارہ|جزء)/.test(cleanQ);

		const boostDocument = (
			_id: string,
			_term: string,
			storedFields?: Record<string, unknown>,
		) => {
			if (!storedFields?.isCoursework) {
				return 1.0;
			}
			// Deprioritize repetitive daily coursework unless explicit intent exists
			return hasCourseworkIntent ? 1.15 : 0.3;
		};

		// Filter predicate for facet criteria
		const cleanCategory = category ? normalizeUrduArabic(category) : undefined;
		const cleanDomain = domain ? domain.toLowerCase().trim() : undefined;

		const filterPredicate = (result: { [key: string]: any }) => {
			if (type !== "all" && result.type !== type) {
				return false;
			}
			if (cleanCategory && normalizeUrduArabic(result.category) !== cleanCategory) {
				return false;
			}
			if (cleanDomain && cleanDomain !== "all" && result.domainId?.toLowerCase() !== cleanDomain) {
				return false;
			}
			return true;
		};

		// Check for Quranic chapter/verse notations (e.g. "2:255", "Surah 18", "Para 30", "Ayat ul Kursi")
		const quranTerms = resolveQuranNotation(query);
		let isRelaxed = false;

		// 1. Primary search with high precision ('AND' combination)
		let rawResults = engine.search(cleanQ, {
			filter: filterPredicate,
			boostDocument,
			combineWith: "AND",
			prefix: true,
			fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
		});

		// 2. If Quran notation was resolved and direct search was low/zero, search resolved terms
		if (rawResults.length === 0 && quranTerms.length > 0) {
			const notationQuery = quranTerms.map(normalizeUrduArabic).join(" ");
			rawResults = engine.search(notationQuery, {
				filter: filterPredicate,
				boostDocument,
				combineWith: "OR",
				prefix: true,
				fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
			});
		}

		// 3. High-recall soft fallback: if multi-word query produced 0 results, retry with 'OR'
		if (rawResults.length === 0 && cleanQ.includes(" ")) {
			rawResults = engine.search(cleanQ, {
				filter: filterPredicate,
				boostDocument,
				combineWith: "OR",
				prefix: true,
				fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
			});
			if (rawResults.length > 0) {
				isRelaxed = true;
			}
		}

		const finalResults: SearchResult[] = [];
		for (const item of rawResults.slice(0, limit)) {
			const fullDoc = docsMap.get(item.id);
			if (fullDoc) {
				finalResults.push({
					...fullDoc,
					isRelaxedMatch: isRelaxed,
				});
			}
		}

		return finalResults;
	}
}

export interface ClientSearchItem {
	id: string;
	type: "article" | "lectures" | "dispatch" | "majlis" | "note";
	title: string;
	urduTitle?: string;
	url: string;
	category: string;
	meta?: string;
	isCoursework?: boolean;
	slug?: string;
	tags?: string[];
}

export async function getSearchCatalogLightweight(): Promise<ClientSearchItem[]> {
	const { docsMap } = await buildSearchIndex();
	const items: ClientSearchItem[] = [];
	for (const doc of docsMap.values()) {
		items.push({
			id: doc.id,
			type: doc.type,
			title: doc.title,
			urduTitle: doc.urduTitle,
			url: doc.url,
			category: doc.category,
			meta: doc.meta,
			isCoursework: doc.isCoursework,
			slug: doc.slug,
			tags: doc.tags,
		});
	}
	return items;
}

