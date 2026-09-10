import { getAllArticles } from "./client";
import { getAllMedia } from "@/lib/media/client";
import { MediaItem } from "@/lib/media/types";
import { ArticleDoc } from "./schemas";

export interface UnifiedRelatedItem {
  type: "article" | "media";
  title: string;
  urduTitle?: string;
  slug: string;
  url: string;
  excerpt: string;
  category: string;
  seriesId?: string;
  publishedAt: string;
  thumbnailUrl?: string;
}

export async function getRelatedContent(params: {
  currentType: "article" | "media";
  currentSlug: string;
  explicitSlugs?: string[];
  seriesId?: string;
  topics?: string[];
  tags?: string[];
  category?: string;
  limit?: number;
}): Promise<UnifiedRelatedItem[]> {
  const {
    currentType,
    currentSlug,
    explicitSlugs = [],
    seriesId,
    topics = [],
    tags = [],
    category,
    limit = 3,
  } = params;

  const [articles, mediaItems] = await Promise.all([
    getAllArticles(),
    getAllMedia(),
  ]);

  const results: { item: UnifiedRelatedItem; score: number }[] = [];
  const addedSlugs = new Set<string>([currentSlug]);

  // Convert articles to unified model
  const unifiedArticles: UnifiedRelatedItem[] = articles.map((a) => ({
    type: "article",
    title: a.frontmatter.title,
    urduTitle: a.frontmatter.urduTitle,
    slug: a.slug,
    url: `/articles/${a.slug}`,
    excerpt: a.frontmatter.excerpt,
    category: a.frontmatter.category,
    seriesId: a.frontmatter.seriesId,
    publishedAt: a.frontmatter.publishedAt,
    thumbnailUrl: a.frontmatter.coverImage,
  }));

  // Convert media to unified model
  const unifiedMedia: UnifiedRelatedItem[] = mediaItems.map((m) => ({
    type: "media",
    title: m.title,
    urduTitle: m.urduTitle,
    slug: m.slug,
    url: `/media/${m.slug}`,
    excerpt: m.description,
    category: m.category,
    seriesId: m.seriesId,
    publishedAt: m.publishedAt,
    thumbnailUrl: m.thumbnailUrl,
  }));

  const pool = [...unifiedArticles, ...unifiedMedia];

  // 1. Check Explicit Slugs
  for (const explicit of explicitSlugs) {
    const match = pool.find((p) => p.slug === explicit && !addedSlugs.has(p.slug));
    if (match) {
      results.push({ item: match, score: 100 });
      addedSlugs.add(match.slug);
    }
  }

  // 2. Check Inferred Reverse References (e.g. if an article references this media item)
  if (currentType === "media") {
    for (const a of articles) {
      if (
        a.frontmatter.relatedMediaSlugs.includes(currentSlug) &&
        !addedSlugs.has(a.slug)
      ) {
        const item = unifiedArticles.find((u) => u.slug === a.slug);
        if (item) {
          results.push({ item, score: 90 });
          addedSlugs.add(item.slug);
        }
      }
    }
  } else if (currentType === "article") {
    for (const m of mediaItems) {
      if (
        m.relatedArticleSlugs?.includes(currentSlug) &&
        !addedSlugs.has(m.slug)
      ) {
        const item = unifiedMedia.find((u) => u.slug === m.slug);
        if (item) {
          results.push({ item, score: 90 });
          addedSlugs.add(item.slug);
        }
      }
    }
  }

  // 3. Taxonomic scoring for remainder if limit not reached
  if (results.length < limit) {
    for (const candidate of pool) {
      if (addedSlugs.has(candidate.slug)) continue;

      let score = 0;
      if (seriesId && candidate.seriesId === seriesId) score += 40;
      if (category && candidate.category === category) score += 15;

      // Check topics overlap
      if (candidate.type === "article") {
        const art = articles.find((a) => a.slug === candidate.slug);
        if (art) {
          const overlap = art.frontmatter.topics.filter((t) => topics.includes(t)).length;
          score += overlap * 10;
        }
      } else {
        const med = mediaItems.find((m) => m.slug === candidate.slug);
        if (med) {
          const overlap = med.topics.filter((t) => topics.includes(t)).length;
          score += overlap * 10;
        }
      }

      if (score > 0) {
        results.push({ item: candidate, score });
        addedSlugs.add(candidate.slug);
      }
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.item);
}
