import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllArticles, getAllMajlisSessions } from "@/lib/content/client";
import { getAllLectures } from "@/lib/lectures/client";

function safeDate(dateStr?: string | Date): Date {
	if (!dateStr) return new Date();
	const d = new Date(dateStr);
	return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = siteConfig.url;

	// Core canonical static routes (Search is excluded to avoid crawler traps)
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
			url: `${baseUrl}/lectures/tarjuma-e-quran`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: `${baseUrl}/majlis`,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/lectures/notes`,
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
			url: `${baseUrl}/about/reading-list`,
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

	// Dynamic monographs & treatises (Twasi al-Haq)
	const articles = await getAllArticles();
	const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
		url: `${baseUrl}/twasi-al-haq/${a.slug}`,
		lastModified: safeDate(a.frontmatter.publishedAt),
		changeFrequency: "monthly",
		priority: 0.85,
	}));

	// Dynamic scholarly discourses (Lectures Archive)
	const lectures = await getAllLectures();
	const lecturesRoutes: MetadataRoute.Sitemap = lectures.map((m) => ({
		url: `${baseUrl}/lectures/${m.slug}`,
		lastModified: safeDate(m.publishedAt),
		changeFrequency: "weekly",
		priority: 0.8,
	}));

	// Dynamic Majlis deliberative assemblies
	const majlisSessions = await getAllMajlisSessions();
	const majlisRoutes: MetadataRoute.Sitemap = majlisSessions.map((s) => ({
		url: `${baseUrl}/majlis/${s.slug}`,
		lastModified: safeDate(s.session.date),
		changeFrequency: "monthly",
		priority: 0.8,
	}));

	return [
		...staticRoutes,
		...articleRoutes,
		...lecturesRoutes,
		...majlisRoutes,
	];
}
