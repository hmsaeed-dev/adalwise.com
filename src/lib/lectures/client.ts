import { cache } from "react";
import catalogData from "./catalog.json";
import {
	LectureItem,
	LectureQueryParams,
	PaginatedLecturesResult,
} from "./types";

const lecturesCatalog = (catalogData as unknown) as LectureItem[];

// Fast in-memory lookup map by slug
const lecturesBySlugMap = new Map<string, LectureItem>(
	lecturesCatalog.map((item) => [item.slug, item]),
);

export const getAllLectures = cache(async (): Promise<LectureItem[]> => {
	return lecturesCatalog;
});

export const getLectureBySlug = cache(
	async (slug: string): Promise<LectureItem | null> => {
		return lecturesBySlugMap.get(slug) || null;
	},
);

export const getFeaturedLecture = cache(
	async (): Promise<LectureItem | null> => {
		return lecturesCatalog[0] || null;
	},
);

export const getRecentLectures = cache(
	async (limit = 4): Promise<LectureItem[]> => {
		return lecturesCatalog.slice(0, limit);
	},
);

export const getLecturesBySeries = cache(
	async (seriesId: string): Promise<LectureItem[]> => {
		return lecturesCatalog.filter((item) => item.seriesId === seriesId);
	},
);

export const getPaginatedLectures = cache(
	async (
		params: LectureQueryParams = {},
	): Promise<PaginatedLecturesResult> => {
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

// Backward-compatibility aliases
export const getAlllectures = getAllLectures;
export const getlecturesBySlug = getLectureBySlug;
export const getFeaturedlectures = getFeaturedLecture;
export const getRecentlectures = getRecentLectures;
export const getlecturesBySeries = getLecturesBySeries;
export const getPaginatedlectures = getPaginatedLectures;
