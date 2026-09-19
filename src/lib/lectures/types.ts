import { MainCategory } from "@/lib/taxonomy/types";
import { Speaker } from "@/lib/speakers/registry";

export type LectureFormat =
	| "Standalone Keynote"
	| "Serial Coursework"
	| "Sermon / Khutba"
	| "Thematic Academic Seminar"
	| "Public Dialogue";

export type PrimaryDomainId =
	| "tafsir"
	| "seerah"
	| "constitutional-law"
	| "iqbal"
	| "civic-ethics"
	| "lisan-ul-quran";

export interface QuranContext {
	surahNumber: number;
	surahNameEnglish: string;
	surahNameUrdu: string;
	surahEndNumber?: number;
	ayahStart?: number;
	ayahEnd?: number;
	juzNumber: number;
	juzEndNumber?: number;
}

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
	speakerId?: string;
	speaker?: LectureSpeaker | Speaker;
	description: string;
	summary?: string;
	durationSeconds: number;
	publishedAt: string;
	thumbnailUrl: string;
	category: MainCategory;
	domainId?: PrimaryDomainId | string;
	subCategory?: string;
	format?: LectureFormat | string;
	seriesId?: string;
	seriesTitle?: string;
	batchYear?: number;
	broadcastContext?: string;
	isCoursework?: boolean;
	isKhutba?: boolean;
	topics: string[];
	tags: string[];
	relatedArticleSlugs?: string[];
	audioUrl?: string;
	hasNotes?: boolean;
	quranContext?: QuranContext;
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
