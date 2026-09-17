import { getAllArticles, getAllMajlisSessions } from "@/lib/content/client";
import { getAllLectures } from "@/lib/lectures/client";
import { formatDuration, formatISODate } from "@/lib/utils";
import { expandQueryTokens } from "./synonyms";
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
	searchCorpus: string;
}

let memorySearchPool: IndexedSearchResult[] | null = null;

export function invalidateSearchPoolCache(): void {
	memorySearchPool = null;
}

function normalizeText(value: string | undefined): string {
	return value?.toLowerCase().trim() ?? "";
}

function createIndexedItem(
	item: SearchResult,
	extraCorpus = "",
): IndexedSearchResult {
	const searchTitle = normalizeText(item.title);
	const searchUrduTitle = normalizeText(item.urduTitle);
	const searchExcerpt = normalizeText(item.excerpt);
	const searchCategory = normalizeText(item.category);
	const searchTags = item.tags.map(normalizeText);

	const searchCorpus = [
		searchTitle,
		searchUrduTitle,
		searchExcerpt,
		searchCategory,
		...searchTags,
		normalizeText(extraCorpus),
	]
		.filter(Boolean)
		.join(" ");

	return {
		...item,
		searchTitle,
		searchUrduTitle,
		searchExcerpt,
		searchCategory,
		searchTags,
		searchCorpus,
	};
}

async function getSearchPool(): Promise<IndexedSearchResult[]> {
	if (memorySearchPool) {
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
			createIndexedItem(
				{
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
				},
				article.content,
			),
		);
	}

	for (const lecture of lectureList) {
		pool.push(
			createIndexedItem(
				{
					type: "lectures",
					id: lecture.slug,
					title: lecture.title,
					urduTitle: lecture.urduTitle,
					url: lecture.isCoursework
						? `/lectures/tarjuma-e-quran?session=${lecture.slug}`
						: `/lectures/${lecture.slug}`,
					excerpt: lecture.description,
					category: lecture.category,
					tags: lecture.tags,
					date: formatISODate(lecture.publishedAt),
					meta: formatDuration(lecture.durationSeconds),
					thumbnailUrl: lecture.thumbnailUrl,
					youtubeId: lecture.youtubeId,
					durationSeconds: lecture.durationSeconds,
					isCoursework: lecture.isCoursework,
				},
				[lecture.searchText, lecture.seriesTitle, ...(lecture.topics || [])]
					.filter(Boolean)
					.join(" "),
			),
		);
	}

	for (const majlis of majlisList) {
		pool.push(
			createIndexedItem(
				{
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
				},
				majlis.content,
			),
		);
	}

	memorySearchPool = pool;
	return pool;
}

function calculateRelevance(
	item: IndexedSearchResult,
	cleanQuery: string,
	tokenGroups: string[][],
): number {
	// Every token in the query must match via at least one synonym in the item's corpus
	const matchesAll = tokenGroups.every((variants) =>
		variants.some((v) => item.searchCorpus.includes(v)),
	);

	if (!matchesAll) {
		return 0;
	}

	let score = 50; // base score for match

	const title = item.searchTitle;
	const urduTitle = item.searchUrduTitle;
	const excerpt = item.searchExcerpt;
	const category = item.searchCategory;

	// Title exact or phrase match
	if (title === cleanQuery) {
		score += 1000;
	} else if (title.startsWith(cleanQuery)) {
		score += 800;
	} else if (title.includes(cleanQuery)) {
		score += 600;
	}

	// Urdu title phrase match
	if (urduTitle && urduTitle.includes(cleanQuery)) {
		score += 400;
	}

	// Excerpt phrase match
	if (excerpt.includes(cleanQuery)) {
		score += 200;
	}

	// Token matches in title vs Urdu vs excerpt vs tags
	tokenGroups.forEach((variants) => {
		if (variants.some((v) => title.includes(v))) {
			score += 150;
		} else if (variants.some((v) => urduTitle.includes(v))) {
			score += 100;
		} else if (variants.some((v) => excerpt.includes(v))) {
			score += 50;
		} else if (variants.some((v) => item.searchTags.some((t) => t.includes(v)))) {
			score += 30;
		} else {
			score += 15;
		}
	});

	if (category.includes(cleanQuery)) {
		score += 70;
	}

	// Coursework contextual weighting:
	// Standalone masterclasses, major articles, and majlis sessions rank over repetitive daily coursework
	// unless the user specifically searched for a session, coursework, or number
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

		const tokenGroups = expandQueryTokens(cleanQ);
		if (tokenGroups.length === 0) {
			return [];
		}

		const cleanCategory = normalizeText(category);
		const pool = await getSearchPool();

		const rankedResults: Array<{
			item: SearchResult;
			score: number;
			index: number;
		}> = [];

		for (let index = 0; index < pool.length; index++) {
			const item = pool[index];

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
				tokenGroups,
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
