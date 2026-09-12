import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles, getAllMajlisSessions } from "@/lib/content/client";
import { getAlllectures } from "@/lib/lectures/client";
import { SERIES_LIST, TOPICS_LIST } from "@/lib/taxonomy/registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = siteConfig.url;

	// Static core routes
	const staticRoutes: MetadataRoute.Sitemap = [
		{
			url: `${baseUrl}`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/twasi-al-haq`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/lectures`,
			lastModified: new Date(),
			changeFrequency: "daily",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/majlis`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/about`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/join`,
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.7,
		},
	];

	// Dynamic articles (Twasi al-Haq)
	const articles = await getAllArticles();
	const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
		url: `${baseUrl}/twasi-al-haq/${a.slug}`,
		lastModified: new Date(a.frontmatter.publishedAt),
		changeFrequency: "monthly",
		priority: 0.85,
	}));

	// Dynamic lectures items
	const lecturesItems = await getAlllectures();
	const lecturesRoutes: MetadataRoute.Sitemap = lecturesItems.map((m) => ({
		url: `${baseUrl}/lectures/${m.slug}`,
		lastModified: new Date(m.publishedAt),
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	// Dynamic series
	const seriesRoutes: MetadataRoute.Sitemap = SERIES_LIST.map((s) => ({
		url: `${baseUrl}/lectures?series=${s.slug}`,
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
		...lecturesRoutes,
		...seriesRoutes,
		...topicRoutes,
	];
}
