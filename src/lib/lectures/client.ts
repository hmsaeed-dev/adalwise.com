import { cache } from "react";
import catalogData from "./catalog.json";
import {
	lecturesItem,
	lecturesQueryParams,
	PaginatedlecturesResult,
} from "./types";

const lecturesCatalog = catalogData as lecturesItem[];

// Fast in-memory lookup map by slug
const lecturesBySlugMap = new Map<string, lecturesItem>(
	lecturesCatalog.map((item) => [item.slug, item]),
);

export const getAlllectures = cache(async (): Promise<lecturesItem[]> => {
	return lecturesCatalog;
});

export const getlecturesBySlug = cache(
	async (slug: string): Promise<lecturesItem | null> => {
		return lecturesBySlugMap.get(slug) || null;
	},
);

export const getFeaturedlectures = cache(
	async (): Promise<lecturesItem | null> => {
		return lecturesCatalog[0] || null;
	},
);

export const getRecentlectures = cache(
	async (limit = 4): Promise<lecturesItem[]> => {
		return lecturesCatalog.slice(0, limit);
	},
);

export const getlecturesBySeries = cache(
	async (seriesId: string): Promise<lecturesItem[]> => {
		return lecturesCatalog.filter((item) => item.seriesId === seriesId);
	},
);

export const getPaginatedlectures = cache(
	async (
		params: lecturesQueryParams = {},
	): Promise<PaginatedlecturesResult> => {
		const {
			page = 1,
			limit = 24,
			category,
			seriesId,
			topic,
			query,
		} = params;

		let filtered = lecturesCatalog;

		if (category && category.toLowerCase() !== "all") {
			const catLower = category.toLowerCase();
			filtered = filtered.filter(
				(item) => item.category.toLowerCase() === catLower,
			);
		}

		if (seriesId) {
			filtered = filtered.filter((item) => item.seriesId === seriesId);
		}

		if (topic) {
			const topicLower = topic.toLowerCase();
			filtered = filtered.filter((item) =>
				item.topics.some((t) => t.toLowerCase() === topicLower),
			);
		}

		if (query && query.trim() !== "") {
			const q = query.toLowerCase().trim();
			filtered = filtered.filter(
				(item) =>
					item.title.toLowerCase().includes(q) ||
					(item.urduTitle && item.urduTitle.includes(q)) ||
					item.description.toLowerCase().includes(q) ||
					item.tags.some((t) => t.toLowerCase().includes(q)) ||
					item.topics.some((t) => t.toLowerCase().includes(q)),
			);
		}

		const total = filtered.length;
		const totalPages = Math.ceil(total / limit) || 1;
		const startIndex = (page - 1) * limit;
		const items = filtered.slice(startIndex, startIndex + limit);
		const hasMore = page < totalPages;

		return {
			items,
			total,
			page,
			totalPages,
			hasMore,
		};
	},
);
