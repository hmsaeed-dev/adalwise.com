import { getAllArticles, getAllMajlisSessions } from "@/lib/content/client";
import { getAllLectures } from "@/lib/lectures/client";
import { formatDuration, formatISODate } from "@/lib/utils";
import {
	SearchOptions,
	SearchProvider,
	SearchResult,
} from "./types";

interface IndexedSearchResult extends SearchResult {
	searchTitle: string;
	searchUrduTitle: string;
	searchExcerpt: string;
	searchCategory: string;
	searchTags: string[];
}

let memorySearchPool: IndexedSearchResult[] | null = null;
let lastPoolBuildTime = 0;

const CACHE_TTL_MS = 60 * 1000;

function normalizeText(value: string | undefined): string {
	return value?.toLowerCase().trim() ?? "";
}

function createIndexedItem(item: SearchResult): IndexedSearchResult {
	return {
		...item,
		searchTitle: normalizeText(item.title),
		searchUrduTitle: normalizeText(item.urduTitle),
		searchExcerpt: normalizeText(item.excerpt),
		searchCategory: normalizeText(item.category),
		searchTags: item.tags.map(normalizeText),
	};
}

async function getSearchPool(): Promise<IndexedSearchResult[]> {
	const now = Date.now();

	if (
		memorySearchPool &&
		now - lastPoolBuildTime < CACHE_TTL_MS
	) {
		return memorySearchPool;
	}

	const [articles, lectureList, majlisList] = await Promise.all([
		getAllArticles(),
		getAllLectures(),
		getAllMajlisSessions(),
	]);

	const pool: IndexedSearchResult[] = [];

	for (const article of articles) {
		pool.push(
			createIndexedItem({
				type: "article",
				id: article.slug,
				title: article.frontmatter.title,
				urduTitle: article.frontmatter.urduTitle,
				url: `/twasi-al-haq/${article.slug}`,
				excerpt: article.frontmatter.excerpt,
				category: article.frontmatter.category,
				tags: article.frontmatter.tags,
				date: formatISODate(article.frontmatter.publishedAt),
				meta: article.frontmatter.readTime,

			}),
		);
	}

	for (const lecture of lectureList) {
		pool.push(
			createIndexedItem({
				type: "lectures",
				id: lecture.slug,
				title: lecture.title,
				urduTitle: lecture.urduTitle,
				url: `/lectures/${lecture.slug}`,
				excerpt: lecture.description,
				category: lecture.category,
				tags: lecture.tags,
				date: formatISODate(lecture.publishedAt),
				meta: formatDuration(lecture.durationSeconds),
				thumbnailUrl: lecture.thumbnailUrl,
				youtubeId: lecture.youtubeId,
			}),
		);
	}

	for (const majlis of majlisList) {
		pool.push(
			createIndexedItem({
				type: "majlis",
				id: majlis.slug,
				title: majlis.session.title,
				urduTitle: majlis.session.urduTitle,
				url: `/majlis/${majlis.slug}`,
				excerpt:
					majlis.session.thesis ||
					majlis.session.description ||
					"",
				category: "Majlis",
				tags: ["Majlis", "Lahore"],
				date: formatISODate(majlis.session.date),
				meta: majlis.session.location,
			}),
		);
	}

	memorySearchPool = pool;
	lastPoolBuildTime = now;

	return pool;
}

function getWordMatches(
	text: string,
	queryWords: string[],
): number {
	if (!text || queryWords.length === 0) {
		return 0;
	}

	const words = text.split(/\s+/);
	let matches = 0;

	for (const queryWord of queryWords) {
		if (
			words.some(
				(word) =>
					word === queryWord ||
					word.startsWith(queryWord),
			)
		) {
			matches++;
		}
	}

	return matches;
}

function calculateRelevance(
	item: IndexedSearchResult,
	query: string,
	queryWords: string[],
): number {
	let score = 0;

	const title = item.searchTitle;
	const urduTitle = item.searchUrduTitle;
	const excerpt = item.searchExcerpt;
	const category = item.searchCategory;

	/*
	 * TITLE
	 *
	 * Title is the strongest signal because users normally
	 * expect the most relevant title to appear first.
	 */

	if (title === query) {
		score += 1000;
	} else if (title.startsWith(query)) {
		score += 800;
	} else if (title.includes(query)) {
		score += 600;
	}

	const titleWordMatches = getWordMatches(title, queryWords);

	if (titleWordMatches > 0) {
		score += titleWordMatches * 150;
	}

	/*
	 * URDU TITLE
	 */

	if (urduTitle === query) {
		score += 500;
	} else if (urduTitle.startsWith(query)) {
		score += 400;
	} else if (urduTitle.includes(query)) {
		score += 300;
	}

	const urduWordMatches = getWordMatches(
		urduTitle,
		queryWords,
	);

	score += urduWordMatches * 100;

	/*
	 * TAGS
	 *
	 * Exact tag matches are stronger than partial tag matches.
	 */

	for (const tag of item.searchTags) {
		if (tag === query) {
			score += 250;
		} else if (tag.startsWith(query)) {
			score += 180;
		} else if (tag.includes(query)) {
			score += 120;
		}

		if (queryWords.length > 1) {
			const tagWordMatches = getWordMatches(
				tag,
				queryWords,
			);

			score += tagWordMatches * 40;
		}
	}

	/*
	 * DESCRIPTION / EXCERPT
	 */

	if (excerpt.includes(query)) {
		score += 100;
	}

	const excerptWordMatches = getWordMatches(
		excerpt,
		queryWords,
	);

	score += excerptWordMatches * 20;

	/*
	 * CATEGORY
	 */

	if (category === query) {
		score += 150;
	} else if (category.startsWith(query)) {
		score += 100;
	} else if (category.includes(query)) {
		score += 70;
	}

	/*
	 * Multi-word query bonus.
	 *
	 * If every query word appears somewhere in the title,
	 * give the result an additional boost.
	 */

	if (
		queryWords.length > 1 &&
		queryWords.every((word) => title.includes(word))
	) {
		score += 300;
	}

	return score;
}

export class LocalSearchProvider implements SearchProvider {
	async search(
		query: string,
		options: SearchOptions = {},
	): Promise<SearchResult[]> {
		const {
			type = "all",
			category,
			limit = 20,
		} = options;

		const cleanQ = normalizeText(query);

		if (!cleanQ || limit <= 0) {
			return [];
		}

		const cleanCategory = normalizeText(category);

		const queryWords = cleanQ
			.split(/\s+/)
			.filter(Boolean);

		const pool = await getSearchPool();

		const rankedResults: Array<{
			item: SearchResult;
			score: number;
			index: number;
		}> = [];

		for (let index = 0; index < pool.length; index++) {
			const item = pool[index];

			/*
			 * Apply structural filters before doing
			 * expensive relevance calculations.
			 */

			if (type !== "all" && item.type !== type) {
				continue;
			}

			if (
				cleanCategory &&
				item.searchCategory !== cleanCategory
			) {
				continue;
			}

			const score = calculateRelevance(
				item,
				cleanQ,
				queryWords,
			);

			if (score <= 0) {
				continue;
			}

			rankedResults.push({
				item,
				score,
				index,
			});
		}

		/*
		 * Highest relevance first.
		 *
		 * Original pool order is used as a stable tie-breaker.
		 */

		rankedResults.sort((a, b) => {
			if (b.score !== a.score) {
				return b.score - a.score;
			}

			return a.index - b.index;
		});

		return rankedResults
			.slice(0, limit)
			.map((result) => result.item);
	}
}
