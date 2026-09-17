export type MainCategory =
	| "Tafsir"
	| "Seerat"
	| "Socio-Political"
	| "Constitutional Law"
	| "Ethics"
	| "Statecraft"
	| "Iqbalian Thought"
	| "Lisan-ul-Quran";

export interface SubCategory {
	id: string;
	slug: string;
	title: string;
	urduTitle?: string;
}

export interface PrimaryDomain {
	id: string;
	slug: string;
	title: string;
	urduTitle: string;
	description: string;
}

export interface Series {
	id: string;
	slug: string;
	title: string;
	urduTitle?: string;
	description: string;
	category: MainCategory;
	domainId?: string;
	totalEpisodes?: number;
	hasCompanionNotes?: boolean;
}

export interface Topic {
	id: string;
	slug: string;
	name: string;
	urduName?: string;
	description?: string;
}

export interface ContentTaxonomy {
	category: MainCategory;
	domainId?: string;
	subCategoryId?: string;
	seriesId?: string;
	topics: string[];
	tags: string[];
}
