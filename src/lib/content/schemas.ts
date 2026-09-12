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
	relatedlecturesSlugs: z.array(z.string()).default([]),
	relatedArticleSlugs: z.array(z.string()).default([]),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;

export interface ArticleDoc {
	slug: string;
	frontmatter: ArticleFrontmatter;
	content: string;
}

export const DispatchFrontmatterSchema = z.object({
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
	topics: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	relatedlecturesSlugs: z.array(z.string()).default([]),
	relatedArticleSlugs: z.array(z.string()).default([]),
});

export type DispatchFrontmatter = z.infer<typeof DispatchFrontmatterSchema>;

export interface DispatchDoc {
	slug: string;
	frontmatter: DispatchFrontmatter;
	content: string;
}

export const MajlisMarginaliaSchema = z.object({
	questionsCount: z.number().default(0),
	referencesCount: z.number().default(0),
	recordAvailable: z.boolean().default(false),
});

export type MajlisMarginalia = z.infer<typeof MajlisMarginaliaSchema>;

export const MajlisSessionSchema = z.object({
	number: z.string().optional(),
	year: z.string().optional(),
	title: z.string(),
	urduTitle: z.string().optional(),
	date: z.string(),
	location: z.string(),
	venue: z.string().optional(),
	theme: z.string().optional(),
	thesis: z.string().optional(),
	description: z.string().optional(),
	host: AuthorSchema.default({
		name: "Dr. Hafiz Haseeb",
		urduName: "ڈاکٹر حافظ حسیب",
		title: "Director, Adlwise Institute",
	}),
	status: z.enum(["upcoming", "completed"]).default("completed"),
	recordingSlug: z.string().optional(),
	discussionPoints: z.array(z.string()).default([]),
	keyInquiries: z.array(z.string()).default([]),
	marginalia: MajlisMarginaliaSchema.optional(),
	registrationUrl: z.string().optional(),
});

export type MajlisSession = z.infer<typeof MajlisSessionSchema>;

export interface MajlisDoc {
	slug: string;
	session: MajlisSession;
	content: string;
}
