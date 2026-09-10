import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getDispatchBySlug, getAllDispatches } from "@/lib/content/client";
import { getRelatedContent } from "@/lib/content/related";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { constructMetadata } from "@/lib/seo/metadata";
import { ScholarlyArticleJsonLd, BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { formatISODate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dispatches = await getAllDispatches();
  return dispatches.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const dispatch = await getDispatchBySlug(slug);
  if (!dispatch) return {};

  return constructMetadata({
    title: dispatch.frontmatter.title,
    description: dispatch.frontmatter.excerpt,
    canonicalUrl: `/twasi-al-haq/${slug}`,
  });
}

export default async function DispatchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dispatch = await getDispatchBySlug(slug);

  if (!dispatch) {
    notFound();
  }

  const { frontmatter, content } = dispatch;

  const related = await getRelatedContent({
    currentType: "article",
    currentSlug: slug,
    explicitSlugs: frontmatter.relatedArticleSlugs,
    topics: frontmatter.topics,
    tags: frontmatter.tags,
    category: frontmatter.category,
    limit: 3,
  });

  return (
    <article className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg">
      <ScholarlyArticleJsonLd
        title={frontmatter.title}
        description={frontmatter.excerpt}
        datePublished={frontmatter.publishedAt}
        authorName={frontmatter.author.name}
        url={`https://adalwise.com/twasi-al-haq/${slug}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://adalwise.com" },
          { name: "Twasi al-Haq", url: "https://adalwise.com/twasi-al-haq" },
          { name: frontmatter.title, url: `https://adalwise.com/twasi-al-haq/${slug}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs text-body-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/twasi-al-haq" className="hover:text-primary transition-colors">
          Twasi al-Haq
        </Link>
        <span>/</span>
        <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">
          {frontmatter.title}
        </span>
      </nav>

      {/* Header Cartouche */}
      <header className="flex flex-col gap-space-xs pb-space-md border-b border-surface-container-high">
        <div className="flex items-center gap-space-xs">
          <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-sm uppercase tracking-wider font-bold">
            {frontmatter.category}
          </span>
          <span className="text-on-surface-variant font-label-sm text-[12px]">
            {frontmatter.readTime} • {formatISODate(frontmatter.publishedAt)}
          </span>
        </div>

        <h1 className="font-display-lg text-[32px] sm:text-display-lg text-primary font-bold font-serif leading-tight mt-space-2xs">
          {frontmatter.title}
        </h1>

        {frontmatter.urduTitle && (
          <p className="font-urdu text-[22px] text-tertiary-container dir-rtl text-right font-bold mt-1">
            {frontmatter.urduTitle}
          </p>
        )}

        <div className="flex items-center gap-space-sm mt-space-sm pt-space-xs border-t border-surface-container-high/60">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-tertiary-fixed font-bold font-serif shadow-sm overflow-hidden relative shrink-0">
            <Image
              src="/images/haseeb-chair.jpg"
              alt={frontmatter.author.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-[15px] text-primary font-semibold font-serif">
              {frontmatter.author.name}
            </span>
            <span className="font-body-sm text-[12px] text-on-surface-variant">
              {frontmatter.author.title}
            </span>
          </div>
        </div>
      </header>

      {/* Main Prose Body */}
      <MDXRenderer content={content} />

      {/* Related Content Knowledge Graph */}
      {related.length > 0 && (
        <section className="mt-space-2xl pt-space-xl border-t border-surface-container-high flex flex-col gap-space-md">
          <h3 className="font-headline-md text-primary font-bold font-serif">
            Related Discourses &amp; Lectures
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={item.url}
                className="p-space-md rounded-[20px] bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container-highest/60 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-space-2xs">
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
                    {item.type === "media" ? "Video Lecture" : "Article"} • {item.category}
                  </span>
                  <h4 className="font-headline-sm text-[15px] text-primary font-bold font-serif line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2">
                    {item.excerpt}
                  </p>
                </div>
                <span className="font-label-sm text-primary font-bold text-[11px] flex items-center gap-1 mt-space-sm">
                  View {item.type === "media" ? "Lecture" : "Treatise"}{" "}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
