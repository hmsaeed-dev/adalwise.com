import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles, getAllDispatches, getAllMajlisSessions } from "@/lib/content/client";
import { getAllMedia } from "@/lib/media/client";
import { SERIES_LIST, TOPICS_LIST } from "@/lib/taxonomy/registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/twasi-al-haq`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/media`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/majlis`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/join`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic articles
  const articles = await getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: new Date(a.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // Dynamic dispatches (Twasi al-Haq)
  const dispatches = await getAllDispatches();
  const dispatchRoutes: MetadataRoute.Sitemap = dispatches.map((d) => ({
    url: `${baseUrl}/twasi-al-haq/${d.slug}`,
    lastModified: new Date(d.frontmatter.publishedAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic media items
  const mediaItems = await getAllMedia();
  const mediaRoutes: MetadataRoute.Sitemap = mediaItems.map((m) => ({
    url: `${baseUrl}/media/${m.slug}`,
    lastModified: new Date(m.publishedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic series
  const seriesRoutes: MetadataRoute.Sitemap = SERIES_LIST.map((s) => ({
    url: `${baseUrl}/media?series=${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Dynamic topics
  const topicRoutes: MetadataRoute.Sitemap = TOPICS_LIST.map((t) => ({
    url: `${baseUrl}/search?q=${encodeURIComponent(t.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...articleRoutes,
    ...dispatchRoutes,
    ...mediaRoutes,
    ...seriesRoutes,
    ...topicRoutes,
  ];
}
