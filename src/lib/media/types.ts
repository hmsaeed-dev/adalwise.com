import { MainCategory } from "@/lib/taxonomy/types";

export interface MediaSpeaker {
  name: string;
  urduName?: string;
  title: string;
  avatarUrl?: string;
}

export interface MediaItem {
  id: string;
  slug: string;
  youtubeId: string;
  title: string;
  urduTitle?: string;
  speaker: MediaSpeaker;
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

export interface MediaQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  seriesId?: string;
  topic?: string;
  query?: string;
}

export interface PaginatedMediaResult {
  items: MediaItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
