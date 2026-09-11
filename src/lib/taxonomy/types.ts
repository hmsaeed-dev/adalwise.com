export type MainCategory =
  | "Tafsir"
  | "Seerat"
  | "Socio-Political"
  | "Constitutional Law"
  | "Ethics"
  | "Statecraft";

export interface Series {
  id: string;
  slug: string;
  title: string;
  urduTitle?: string;
  description: string;
  category: MainCategory;
  totalEpisodes?: number;
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
  seriesId?: string;
  topics: string[];
  tags: string[];
}
