import { cache } from "react";
import { getAllArticles, getAllMajlisSessions } from "@/lib/content/client";
import { getAlllectures } from "@/lib/lectures/client";
import { formatDuration, formatISODate } from "@/lib/utils";
import { SearchOptions, SearchProvider, SearchResult } from "./types";

const getCachedSearchPool = cache(async (): Promise<SearchResult[]> => {
	const [articles, lecturesList, majlisList] = await Promise.all([
		getAllArticles(),
		getAlllectures(),
		getAllMajlisSessions(),
	]);

	const pool: SearchResult[] = [];

	for (const a of articles) {
		pool.push({
			type: "article",
			id: a.slug,
			title: a.frontmatter.title,
			urduTitle: a.frontmatter.urduTitle,
			url: `/twasi-al-haq/${a.slug}`,
			excerpt: a.frontmatter.excerpt,
			category: a.frontmatter.category,
			tags: a.frontmatter.tags,
			date: formatISODate(a.frontmatter.publishedAt),
			meta: a.frontmatter.readTime,
		});
	}

	for (const m of lecturesList) {
		pool.push({
			type: "lectures",
			id: m.slug,
			title: m.title,
			urduTitle: m.urduTitle,
			url: `/lectures/${m.slug}`,
			excerpt: m.description,
			category: m.category,
			tags: m.tags,
			date: formatISODate(m.publishedAt),
			meta: `${formatDuration(m.durationSeconds)}`,
		});
	}

	for (const m of majlisList) {
		pool.push({
			type: "majlis",
			id: m.slug,
			title: m.session.title,
			urduTitle: m.session.urduTitle,
			url: `/majlis`,
			excerpt: m.session.description,
			category: "Majlis",
			tags: ["Majlis", "Lahore"],
			date: formatISODate(m.session.date),
			meta: m.session.location,
		});
	}

	return pool;
});

export class LocalSearchProvider implements SearchProvider {
	async search(
		query: string,
		options: SearchOptions = {},
	): Promise<SearchResult[]> {
		const { type = "all", category, limit = 20 } = options;
		const cleanQ = query.toLowerCase().trim();

		if (!cleanQ) {
			return [];
		}

		const pool = await getCachedSearchPool();

		const filtered = pool.filter((item) => {
			if (type !== "all" && item.type !== type) {
				return false;
			}

			if (
				category &&
				item.category.toLowerCase() !== category.toLowerCase()
			) {
				return false;
			}

			const matchTitle = item.title.toLowerCase().includes(cleanQ);
			const matchUrdu = item.urduTitle
				? item.urduTitle.includes(cleanQ)
				: false;
			const matchExcerpt = item.excerpt.toLowerCase().includes(cleanQ);
			const matchTags = item.tags.some((t) =>
				t.toLowerCase().includes(cleanQ),
			);
			const matchCategory = item.category.toLowerCase().includes(cleanQ);

			return (
				matchTitle ||
				matchUrdu ||
				matchExcerpt ||
				matchTags ||
				matchCategory
			);
		});

		return filtered.slice(0, limit);
	}
}
