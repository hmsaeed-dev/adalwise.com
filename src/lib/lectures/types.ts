import { MainCategory } from "@/lib/taxonomy/types";

export interface lecturesSpeaker {
	name: string;
	urduName?: string;
	title: string;
	avatarUrl?: string;
}

export interface lecturesItem {
	id: string;
	slug: string;
	youtubeId: string;
	title: string;
	urduTitle?: string;
	speaker: lecturesSpeaker;
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

export interface lecturesQueryParams {
	page?: number;
	limit?: number;
	category?: string;
	seriesId?: string;
	topic?: string;
	query?: string;
}

export interface PaginatedlecturesResult {
	items: lecturesItem[];
	total: number;
	page: number;
	totalPages: number;
	hasMore: boolean;
}
