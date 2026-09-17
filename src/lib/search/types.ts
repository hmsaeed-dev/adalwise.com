export interface SearchResult {
	type: "article" | "lectures" | "dispatch" | "majlis";
	id: string;
	title: string;
	urduTitle?: string;
	url: string;
	excerpt: string;
	category: string;
	tags: string[];
	date: string;
	meta?: string;
	thumbnailUrl?: string;
	youtubeId?: string;
	durationSeconds?: number;
	isCoursework?: boolean;
	slug?: string;
}

export interface SearchOptions {
	type?: "article" | "lectures" | "dispatch" | "majlis" | "all";
	category?: string;
	limit?: number;
}

export interface SearchProvider {
	search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
