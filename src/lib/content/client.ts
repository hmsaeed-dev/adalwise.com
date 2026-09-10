import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  ArticleDoc,
  ArticleFrontmatterSchema,
  DispatchDoc,
  DispatchFrontmatterSchema,
  MajlisSession,
  MajlisSessionSchema,
} from "./schemas";

const CONTENT_DIR = path.join(process.cwd(), "content");
const ARTICLES_DIR = path.join(CONTENT_DIR, "articles");
const DISPATCHES_DIR = path.join(CONTENT_DIR, "dispatches");
const MAJLIS_DIR = path.join(CONTENT_DIR, "majlis");

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ARTICLES
export async function getAllArticles(): Promise<ArticleDoc[]> {
  ensureDirectoryExists(ARTICLES_DIR);
  const files = fs.readdirSync(ARTICLES_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const articles: ArticleDoc[] = [];

  for (const file of files) {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(ARTICLES_DIR, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const parsed = ArticleFrontmatterSchema.safeParse(data);
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

  // Sort descending by publication date
  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<ArticleDoc | null> {
  ensureDirectoryExists(ARTICLES_DIR);
  const candidates = [
    path.join(ARTICLES_DIR, `${slug}.mdx`),
    path.join(ARTICLES_DIR, `${slug}.md`),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const parsed = ArticleFrontmatterSchema.safeParse(data);
      if (parsed.success) {
        return { slug, frontmatter: parsed.data, content };
      }
    }
  }
  return null;
}

// DISPATCHES (Twasi al-Haq)
export async function getAllDispatches(): Promise<DispatchDoc[]> {
  ensureDirectoryExists(DISPATCHES_DIR);
  const files = fs.readdirSync(DISPATCHES_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const dispatches: DispatchDoc[] = [];

  for (const file of files) {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(DISPATCHES_DIR, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(rawContent);

    const parsed = DispatchFrontmatterSchema.safeParse(data);
    if (parsed.success) {
      dispatches.push({
        slug,
        frontmatter: parsed.data,
        content,
      });
    }
  }

  return dispatches.sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );
}

export async function getDispatchBySlug(slug: string): Promise<DispatchDoc | null> {
  ensureDirectoryExists(DISPATCHES_DIR);
  const candidates = [
    path.join(DISPATCHES_DIR, `${slug}.mdx`),
    path.join(DISPATCHES_DIR, `${slug}.md`),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      const parsed = DispatchFrontmatterSchema.safeParse(data);
      if (parsed.success) {
        return { slug, frontmatter: parsed.data, content };
      }
    }
  }
  return null;
}

// MAJLIS SESSIONS
export async function getAllMajlisSessions(): Promise<{ slug: string; session: MajlisSession }[]> {
  ensureDirectoryExists(MAJLIS_DIR);
  const files = fs.readdirSync(MAJLIS_DIR).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const sessions: { slug: string; session: MajlisSession }[] = [];

  for (const file of files) {
    const slug = file.replace(/\.(mdx|md)$/, "");
    const filePath = path.join(MAJLIS_DIR, file);
    const rawContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(rawContent);

    const parsed = MajlisSessionSchema.safeParse(data);
    if (parsed.success) {
      sessions.push({ slug, session: parsed.data });
    }
  }

  return sessions.sort(
    (a, b) =>
      new Date(b.session.date).getTime() - new Date(a.session.date).getTime()
  );
}
