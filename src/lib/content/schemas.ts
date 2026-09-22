import { z } from "zod";

export const AuthorSchema = z.object({
	name: z.string(),
	urduName: z.string().optional(),
	title: z.string(),
	avatarUrl: z.string().optional(),
});

export const ArticleFrontmatterSchema = z.object({
	title: z.string(),
	urduTitle: z.string().optional(),
	excerpt: z.string(),
	author: AuthorSchema,
	publishedAt: z.string(),
	readTime: z.string(),
	category: z.enum([
		"Tafsir",
		"Seerat",
		"Socio-Political",
		"Constitutional Law",
		"Ethics",
		"Statecraft",
	]),
	seriesId: z.string().optional(),
	topics: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	coverImage: z.string().optional(),
	relatedLectureSlugs: z.array(z.string()).default([]),
	relatedArticleSlugs: z.array(z.string()).default([]),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;

export interface ArticleDoc {
	slug: string;
	frontmatter: ArticleFrontmatter;
	content: string;
}


export const MajlisSpeakerSchema = z.object({
	name: z.string(),
	urduName: z.string().optional(),
	title: z.string(),
	role: z.string().default("Contributor"),
	topic: z.string(),
	avatarUrl: z.string().optional(),
});

export const MajlisGalleryItemSchema = z.object({
	url: z.string(),
	caption: z.string().optional(),
	category: z
		.enum([
			"gathering",
			"deliberation",
			"fellowship",
			"hospitality",
			"assembly",
			"venue",
		])
		.optional(),
});

export const MajlisKeyTakeawaySchema = z.object({
	title: z.string(),
	summary: z.string(),
});

export const MajlisSessionSchema = z.object({
	number: z.string().optional(),
	year: z.string().optional(),
	title: z.string(),
	urduTitle: z.string().optional(),
	date: z.string(),
	time: z.string().optional(),
	format: z.string().optional(),
	location: z.string(),
	venue: z.string().optional(),
	theme: z.string().optional(),
	urduTheme: z.string().optional(),
	thesis: z.string().optional(),
	description: z.string().optional(),
	objective: z.string().optional(),
	host: AuthorSchema.default({
		name: "Dr. Hafiz Haseeb",
		urduName: "ڈاکٹر حافظ حسیب",
		title: "Director, Adlwise Institute",
	}),
	status: z.enum(["upcoming", "completed"]).default("completed"),
	recordingSlug: z.string().optional(),
	relatedLectureSlugs: z.array(z.string()).default([]),
	relatedArticleSlugs: z.array(z.string()).default([]),
	topics: z.array(z.string()).default([]),
	discussionPoints: z.array(z.string()).default([]),
	keyInquiries: z.array(z.string()).default([]),
	registrationUrl: z.string().optional(),
	mapsUrl: z.string().optional(),
	videoUrl: z.string().optional(),
	gallery: z.array(MajlisGalleryItemSchema).default([]),
	speakers: z.array(MajlisSpeakerSchema).default([]),
	slidesUrl: z.string().optional(),
	slidesTitle: z.string().optional(),
	slidesCount: z.number().optional(),
	workingPaperUrl: z.string().optional(),
	workingPaperTitle: z.string().optional(),
	keyTakeaways: z.array(MajlisKeyTakeawaySchema).default([]),
});

export type MajlisSession = z.infer<typeof MajlisSessionSchema>;

export interface MajlisDoc {
	slug: string;
	session: MajlisSession;
	content: string;
}
