import { cache } from "react";
import catalogData from "./catalog.json";
import { MediaItem, MediaQueryParams, PaginatedMediaResult } from "./types";

const mediaCatalog = catalogData as MediaItem[];

// Fast in-memory lookup map by slug
const mediaBySlugMap = new Map<string, MediaItem>(
  mediaCatalog.map((item) => [item.slug, item])
);

export const getAllMedia = cache(async (): Promise<MediaItem[]> => {
  return mediaCatalog;
});

export const getMediaBySlug = cache(
  async (slug: string): Promise<MediaItem | null> => {
    return mediaBySlugMap.get(slug) || null;
  }
);

export const getFeaturedMedia = cache(async (): Promise<MediaItem | null> => {
  return mediaCatalog[0] || null;
});

export const getRecentMedia = cache(async (limit = 4): Promise<MediaItem[]> => {
  return mediaCatalog.slice(0, limit);
});

export const getMediaBySeries = cache(
  async (seriesId: string): Promise<MediaItem[]> => {
    return mediaCatalog.filter((item) => item.seriesId === seriesId);
  }
);

export const getPaginatedMedia = cache(
  async (params: MediaQueryParams = {}): Promise<PaginatedMediaResult> => {
    const { page = 1, limit = 24, category, seriesId, topic, query } = params;

    let filtered = mediaCatalog;

    if (category && category.toLowerCase() !== "all") {
      const catLower = category.toLowerCase();
      filtered = filtered.filter(
        (item) => item.category.toLowerCase() === catLower
      );
    }

    if (seriesId) {
      filtered = filtered.filter((item) => item.seriesId === seriesId);
    }

    if (topic) {
      const topicLower = topic.toLowerCase();
      filtered = filtered.filter((item) =>
        item.topics.some((t) => t.toLowerCase() === topicLower)
      );
    }

    if (query && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.urduTitle && item.urduTitle.includes(q)) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.topics.some((t) => t.toLowerCase().includes(q))
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
  }
);
