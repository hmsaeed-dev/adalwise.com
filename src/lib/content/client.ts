import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ArticleDoc,
  ArticleFrontmatterSchema,
  MajlisDoc,
  MajlisSessionSchema,
} from "./schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const MAJLIS_DIR = path.join(CONTENT_DIR, "majlis");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function normalizeArticleData(data: Record<string, unknown>) {
  // Support legacy or alternate frontmatter keys gracefully
  const relatedLectureSlugs =
    data.relatedLectureSlugs ||
    data.relatedlecturesSlugs ||
    data.relatedMediaSlugs ||
    [];

  return {
    ...data,
    relatedLectureSlugs,
  };
}

// ARTICLES (Twasi al-Haq)
export const getAllArticles = cache(async (): Promise<ArticleDoc[]> => {
  ensureDirectoryExists(ARTICLES_DIR);
  const files = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const articles: ArticleDoc[] = [];

  for (const file of files) {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(ARTICLES_DIR, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const parsed = ArticleFrontmatterSchema.safeParse(normalizeArticleData(data));
    if (parsed.success) {
      articles.push({
        slug,
        frontmatter: parsed.data,
        content,
      });
    } else {
      console.warn(`Invalid frontmatter in article ${file}:`, parsed.error.issues);
    }
  }

  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
});

export const getArticleBySlug = cache(
  async (slug: string): Promise<ArticleDoc | null> => {
    ensureDirectoryExists(ARTICLES_DIR);
    const candidates = [
      path.join(ARTICLES_DIR, `${slug}.mdx`),
      path.join(ARTICLES_DIR, `${slug}.md`),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
        const { data, content } = matter(raw);
        const parsed = ArticleFrontmatterSchema.safeParse(
          normalizeArticleData(data)
        );
        if (parsed.success) {
          return { slug, frontmatter: parsed.data, content };
        }
      }
    }
    return null;
  }
);

// MAJLIS SESSIONS
export const getAllMajlisSessions = cache(async (): Promise<MajlisDoc[]> => {
  ensureDirectoryExists(MAJLIS_DIR);
  const files = fs
    .readdirSync(MAJLIS_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const sessions: MajlisDoc[] = [];

  for (const file of files) {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(MAJLIS_DIR, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const parsed = MajlisSessionSchema.safeParse(data);
    if (parsed.success) {
      sessions.push({ slug, session: parsed.data, content });
    } else {
      console.warn(
        `Invalid frontmatter in majlis session ${file}:`,
        parsed.error.issues
      );
    }
  }

  return sessions.sort(
    (a, b) =>
      new Date(b.session.date).getTime() - new Date(a.session.date).getTime()
  );
});

export const getMajlisSessionBySlug = cache(
  async (slug: string): Promise<MajlisDoc | null> => {
    ensureDirectoryExists(MAJLIS_DIR);
    const candidates = [
      path.join(MAJLIS_DIR, `${slug}.mdx`),
      path.join(MAJLIS_DIR, `${slug}.md`),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ filePath, "utf-8");
        const { data, content } = matter(raw);
        const parsed = MajlisSessionSchema.safeParse(data);
        if (parsed.success) {
          return { slug, session: parsed.data, content };
        }
      }
    }
    return null;
  }
);
