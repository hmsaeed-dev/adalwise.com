import { MainCategory } from "@/lib/taxonomy/types";

export interface LectureSpeaker {
	name: string;
	urduName?: string;
	title: string;
	avatarUrl?: string;
}

export interface LectureItem {
	id: string;
	slug: string;
	youtubeId: string;
	title: string;
	urduTitle?: string;
	speaker: LectureSpeaker;
	description: string;
	summary?: string;
	durationSeconds: number;
	publishedAt: string;
	thumbnailUrl: string;
	category: MainCategory;
	seriesId?: string;
	topics: string[];
	tags: string[];
	relatedArticleSlugs?: string[];
	audioUrl?: string;
}

export interface LectureQueryParams {
	page?: number;
	limit?: number;
	category?: string;
	seriesId?: string;
	topic?: string;
	query?: string;
}

export interface PaginatedLecturesResult {
	items: LectureItem[];
	total: number;
	page: number;
	totalPages: number;
	hasMore: boolean;
}

// Backward compatibility aliases during refactor
export type lecturesSpeaker = LectureSpeaker;
export type lecturesItem = LectureItem;
export type lecturesQueryParams = LectureQueryParams;
export type PaginatedlecturesResult = PaginatedLecturesResult;
