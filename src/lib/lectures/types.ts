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
	domainId?: string;
	subCategory?: string;
	format?: string;
	seriesId?: string;
	seriesTitle?: string;
	isCoursework?: boolean;
	isKhutba?: boolean;
	topics: string[];
	tags: string[];
	relatedArticleSlugs?: string[];
	audioUrl?: string;
	hasNotes?: boolean;
	searchText?: string;
}

export interface LectureQueryParams {
	page?: number;
	limit?: number;
	category?: string;
	domain?: string;
	subCategory?: string;
	format?: string;
	seriesId?: string;
	topic?: string;
	query?: string;
	includeCoursework?: boolean;
}

export interface PaginatedLecturesResult {
	items: LectureItem[];
	total: number;
	page: number;
	totalPages: number;
	hasMore: boolean;
}

// Backward compatibility aliases
export type lecturesSpeaker = LectureSpeaker;
export type lecturesItem = LectureItem;
export type lecturesQueryParams = LectureQueryParams;
export type PaginatedlecturesResult = PaginatedLecturesResult;
