import { getAllArticles, getAllDispatches, getAllMajlisSessions } from "@/lib/content/client";
import { getAllMedia } from "@/lib/media/client";
import { formatDuration, formatISODate } from "@/lib/utils";
import { SearchOptions, SearchProvider, SearchResult } from "./types";

export class LocalSearchProvider implements SearchProvider {
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const { type = "all", category, limit = 20 } = options;
    const cleanQ = query.toLowerCase().trim();

    if (!cleanQ) {
      return [];
    }

    const [articles, dispatches, mediaList, majlisList] = await Promise.all([
      getAllArticles(),
      getAllDispatches(),
      getAllMedia(),
      getAllMajlisSessions(),
    ]);

    const pool: SearchResult[] = [];

    // Articles
    if (type === "all" || type === "article") {
      for (const a of articles) {
        pool.push({
          type: "article",
          id: a.slug,
          title: a.frontmatter.title,
          urduTitle: a.frontmatter.urduTitle,
          url: `/articles/${a.slug}`,
          excerpt: a.frontmatter.excerpt,
          category: a.frontmatter.category,
          tags: a.frontmatter.tags,
          date: formatISODate(a.frontmatter.publishedAt),
          meta: a.frontmatter.readTime,
        });
      }
    }

    // Twasi Dispatches
    if (type === "all" || type === "dispatch") {
      for (const d of dispatches) {
        pool.push({
          type: "dispatch",
          id: d.slug,
          title: d.frontmatter.title,
          urduTitle: d.frontmatter.urduTitle,
          url: `/twasi-al-haq/${d.slug}`,
          excerpt: d.frontmatter.excerpt,
          category: d.frontmatter.category,
          tags: d.frontmatter.tags,
          date: formatISODate(d.frontmatter.publishedAt),
          meta: d.frontmatter.readTime,
        });
      }
    }

    // Media / Videos
    if (type === "all" || type === "media") {
      for (const m of mediaList) {
        pool.push({
          type: "media",
          id: m.slug,
          title: m.title,
          urduTitle: m.urduTitle,
          url: `/media/${m.slug}`,
          excerpt: m.description,
          category: m.category,
          tags: m.tags,
          date: formatISODate(m.publishedAt),
          meta: `${formatDuration(m.durationSeconds)} duration`,
        });
      }
    }

    // Majlis Sessions
    if (type === "all" || type === "majlis") {
      for (const m of majlisList) {
        pool.push({
          type: "majlis",
          id: m.slug,
          title: m.session.title,
          urduTitle: m.session.urduTitle,
          url: `/majlis`,
          excerpt: m.session.description,
          category: "Majlis",
          tags: ["Majlis", "Lahore"],
          date: formatISODate(m.session.date),
          meta: m.session.location,
        });
      }
    }

    // Filter by query and category
    const filtered = pool.filter((item) => {
      if (category && item.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }

      const matchTitle = item.title.toLowerCase().includes(cleanQ);
      const matchUrdu = item.urduTitle ? item.urduTitle.includes(cleanQ) : false;
      const matchExcerpt = item.excerpt.toLowerCase().includes(cleanQ);
      const matchTags = item.tags.some((t) => t.toLowerCase().includes(cleanQ));
      const matchCategory = item.category.toLowerCase().includes(cleanQ);

      return matchTitle || matchUrdu || matchExcerpt || matchTags || matchCategory;
    });

    return filtered.slice(0, limit);
  }
}
