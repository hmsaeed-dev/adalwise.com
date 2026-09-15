import { cache } from "react";
import catalogData from "./catalog.json";
import {
	LectureItem,
	LectureQueryParams,
	PaginatedLecturesResult,
} from "./types";
import { CURATED_START_HERE_PICKS, CuratedPick } from "./curated-picks";

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

// Curated picks for "Start Here" section (10 verified foundational masterclasses)
export const getCuratedStartHerePicks = cache(
	async (): Promise<CuratedPick[]> => {
		return CURATED_START_HERE_PICKS;
	},
);

// Backward compatibility helper returning LectureItems
export const getStartHereLectures = cache(async (): Promise<LectureItem[]> => {
	const hallmarkYtIds = CURATED_START_HERE_PICKS.map((p) => p.youtubeId);
	return hallmarkYtIds
		.map((id) => lecturesCatalog.find((item) => item.youtubeId === id))
		.filter(Boolean) as LectureItem[];
});

// Flagship 324-Session Tarjuma-e-Quran series lectures
export const getTarjumaQuranLectures = cache(
	async (): Promise<LectureItem[]> => {
		return lecturesCatalog
			.filter((item) => item.isCoursework)
			.sort(
				(a, b) =>
					new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
			);
	},
);

export const getPaginatedLectures = cache(
	async (
		params: LectureQueryParams & { includeCoursework?: boolean } = {},
	): Promise<PaginatedLecturesResult> => {
		const {
			page = 1,
			limit = 18,
			category,
			domain,
			subCategory,
			seriesId,
			topic,
			query,
			includeCoursework = false,
		} = params;

		let filtered = lecturesCatalog;

		// 1. By default, separate daily repetitive coursework from the open thematic archive
		// unless explicitly requested (includeCoursework === true), searching keywords, or specifically requesting coursework sub-category
		const shouldIncludeCoursework =
			includeCoursework ||
			Boolean(query && query.trim().length > 0) ||
			subCategory === "dora-tarjuma-e-quran";

		if (!shouldIncludeCoursework) {
			filtered = filtered.filter((item) => !item.isCoursework);
		}

		// 2. Filter by domain
		if (domain && domain.toLowerCase() !== "all") {
			const d = domain.toLowerCase();
			filtered = filtered.filter((item) => item.domainId === d);
		} else if (category && category.toLowerCase() !== "all") {
			const catLower = category.toLowerCase();
			filtered = filtered.filter(
				(item) => item.category.toLowerCase() === catLower,
			);
		}

		// 3. Filter by sub-category
		if (subCategory && subCategory.toLowerCase() !== "all") {
			const sub = subCategory.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					(item.subCategory && item.subCategory.toLowerCase() === sub) ||
					item.title.toLowerCase().includes(sub) ||
					item.description.toLowerCase().includes(sub),
			);
		}

		// 4. Filter by series
		if (seriesId) {
			filtered = filtered.filter((item) => item.seriesId === seriesId);
		}

		// 5. Filter by topic
		if (topic) {
			const topicLower = topic.toLowerCase();
			filtered = filtered.filter((item) =>
				item.topics.some((t) => t.toLowerCase() === topicLower),
			);
		}

		// 6. Tokenized bilingual search
		if (query && query.trim() !== "") {
			const q = query.toLowerCase().trim();
			filtered = filtered.filter(
				(item) =>
					(item.searchText && item.searchText.includes(q)) ||
					item.title.toLowerCase().includes(q) ||
					(item.urduTitle && item.urduTitle.includes(q)) ||
					item.description.toLowerCase().includes(q),
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
