import catalogData from "./catalog.json";
import { MediaItem, MediaQueryParams, PaginatedMediaResult } from "./types";

const mediaCatalog = catalogData as MediaItem[];

export async function getAllMedia(): Promise<MediaItem[]> {
  return mediaCatalog;
}

export async function getMediaBySlug(slug: string): Promise<MediaItem | null> {
  const found = mediaCatalog.find((item) => item.slug === slug);
  return found || null;
}

export async function getFeaturedMedia(): Promise<MediaItem | null> {
  return mediaCatalog[0] || null;
}

export async function getRecentMedia(limit = 4): Promise<MediaItem[]> {
  return mediaCatalog.slice(0, limit);
}

export async function getMediaBySeries(seriesId: string): Promise<MediaItem[]> {
  return mediaCatalog.filter((item) => item.seriesId === seriesId);
}

export async function getPaginatedMedia(
  params: MediaQueryParams = {}
): Promise<PaginatedMediaResult> {
  const { page = 1, limit = 24, category, seriesId, topic, query } = params;

  let filtered = [...mediaCatalog];

  if (category && category.toLowerCase() !== "all") {
    filtered = filtered.filter(
      (item) => item.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (seriesId) {
    filtered = filtered.filter((item) => item.seriesId === seriesId);
  }

  if (topic) {
    filtered = filtered.filter((item) =>
      item.topics.some((t) => t.toLowerCase() === topic.toLowerCase())
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
