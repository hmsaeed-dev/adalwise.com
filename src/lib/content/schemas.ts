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
    "Usul al-Fiqh",
    "Ethics",
    "Statecraft",
  ]),
  seriesId: z.string().optional(),
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  coverImage: z.string().optional(),
  relatedMediaSlugs: z.array(z.string()).default([]),
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
    "Usul al-Fiqh",
    "Ethics",
    "Statecraft",
  ]),
  topics: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  relatedMediaSlugs: z.array(z.string()).default([]),
  relatedArticleSlugs: z.array(z.string()).default([]),
});

export type DispatchFrontmatter = z.infer<typeof DispatchFrontmatterSchema>;

export interface DispatchDoc {
  slug: string;
  frontmatter: DispatchFrontmatter;
  content: string;
}

export const MajlisSessionSchema = z.object({
  title: z.string(),
  urduTitle: z.string().optional(),
  date: z.string(),
  location: z.string(),
  urduLocation: z.string().optional(),
  theme: z.string(),
  description: z.string(),
  host: AuthorSchema,
  status: z.enum(["upcoming", "completed"]),
  recordingSlug: z.string().optional(),
  discussionPoints: z.array(z.string()).default([]),
});

export type MajlisSession = z.infer<typeof MajlisSessionSchema>;
