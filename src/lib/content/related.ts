import { getAllArticles, getAllMajlisSessions } from "./client";
import { getAllLectures } from "@/lib/lectures/client";
import { LectureItem } from "@/lib/lectures/types";
import { ArticleDoc, MajlisDoc } from "./schemas";

export interface UnifiedRelatedItem {
	type: "article" | "lectures" | "majlis";
	title: string;
	urduTitle?: string;
	slug: string;
	url: string;
	excerpt: string;
	category: string;
	seriesId?: string;
	publishedAt: string;
	thumbnailUrl?: string;
	topics: string[];
}

export async function getRelatedContent(params: {
	currentType: "article" | "lectures" | "majlis";
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

	const [articles, lectureList, majlisSessions] = await Promise.all([
		getAllArticles(),
		getAllLectures(),
		getAllMajlisSessions(),
	]);

	const results: { item: UnifiedRelatedItem; score: number }[] = [];
	const addedSlugs = new Set<string>([currentSlug]);

	// Convert articles to unified model
	const unifiedArticles: UnifiedRelatedItem[] = articles.map((a) => ({
		type: "article",
		title: a.frontmatter.title,
		urduTitle: a.frontmatter.urduTitle,
		slug: a.slug,
		url: `/twasi-al-haq/${a.slug}`,
		excerpt: a.frontmatter.excerpt,
		category: a.frontmatter.category,
		seriesId: a.frontmatter.seriesId,
		publishedAt: a.frontmatter.publishedAt,
		thumbnailUrl: a.frontmatter.coverImage,
		topics: a.frontmatter.topics || [],
	}));

	// Convert lectures to unified model
	const unifiedLectures: UnifiedRelatedItem[] = lectureList.map((m) => ({
		type: "lectures",
		title: m.title,
		urduTitle: m.urduTitle,
		slug: m.slug,
		url: `/lectures/${m.slug}`,
		excerpt: m.description,
		category: m.category,
		seriesId: m.seriesId,
		publishedAt: m.publishedAt,
		thumbnailUrl: m.thumbnailUrl,
		topics: m.topics || [],
	}));

	// Convert majlis symposia to unified model
	const unifiedMajlis: UnifiedRelatedItem[] = majlisSessions.map((ms) => ({
		type: "majlis",
		title: ms.session.title,
		urduTitle: ms.session.urduTitle,
		slug: ms.slug,
		url: `/majlis/${ms.slug}`,
		excerpt: ms.session.thesis || ms.session.description || "",
		category: "Statecraft",
		publishedAt: ms.session.date,
		thumbnailUrl: "/images/majlis-hero.jpg",
		topics: ms.session.topics || [],
	}));

	const pool = [...unifiedArticles, ...unifiedLectures, ...unifiedMajlis];
	const poolMap = new Map<string, UnifiedRelatedItem>(
		pool.map((item) => [item.slug, item]),
	);

	// 1. Check Explicit Slugs
	for (const explicit of explicitSlugs) {
		const match = poolMap.get(explicit);
		if (match && !addedSlugs.has(match.slug)) {
			results.push({ item: match, score: 100 });
			addedSlugs.add(match.slug);
		}
	}

	// 2. Check Inferred Reverse References
	if (currentType === "lectures") {
		// Check if an article references this lecture
		for (const a of articles) {
			if (
				a.frontmatter.relatedLectureSlugs.includes(currentSlug) &&
				!addedSlugs.has(a.slug)
			) {
				const item = poolMap.get(a.slug);
				if (item) {
					results.push({ item, score: 90 });
					addedSlugs.add(item.slug);
				}
			}
		}
		// Check if a Majlis deliberation references this lecture
		for (const ms of majlisSessions) {
			const matchesRecording = ms.session.recordingSlug === currentSlug;
			const matchesRelated = ms.session.relatedLectureSlugs.includes(currentSlug);
			if ((matchesRecording || matchesRelated) && !addedSlugs.has(ms.slug)) {
				const item = poolMap.get(ms.slug);
				if (item) {
					results.push({ item, score: 95 });
					addedSlugs.add(item.slug);
				}
			}
		}
	} else if (currentType === "article") {
		for (const m of lectureList) {
			if (
				m.relatedArticleSlugs?.includes(currentSlug) &&
				!addedSlugs.has(m.slug)
			) {
				const item = poolMap.get(m.slug);
				if (item) {
					results.push({ item, score: 90 });
					addedSlugs.add(item.slug);
				}
			}
		}
	}

	// 3. Taxonomic scoring for remainder if limit not reached
	if (results.length < limit) {
		const targetTopicsLower = new Set(topics.map((t) => t.toLowerCase()));

		for (const candidate of pool) {
			if (addedSlugs.has(candidate.slug)) continue;

			let score = 0;
			if (seriesId && candidate.seriesId === seriesId) score += 40;
			if (category && candidate.category.toLowerCase() === category.toLowerCase()) score += 15;

			// Direct O(1) topic overlap without re-scanning arrays
			if (targetTopicsLower.size > 0 && candidate.topics.length > 0) {
				let overlap = 0;
				for (const t of candidate.topics) {
					if (targetTopicsLower.has(t.toLowerCase())) {
						overlap++;
					}
				}
				score += overlap * 10;
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
