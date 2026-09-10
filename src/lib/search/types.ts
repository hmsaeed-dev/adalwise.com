export interface SearchResult {
  type: "article" | "media" | "dispatch" | "majlis";
  id: string;
  title: string;
  urduTitle?: string;
  url: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  meta?: string;
}

export interface SearchOptions {
  type?: "article" | "media" | "dispatch" | "majlis" | "all";
  category?: string;
  limit?: number;
}

export interface SearchProvider {
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>;
}
