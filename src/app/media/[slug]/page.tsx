import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Play, ArrowRight } from "lucide-react";
import { getMediaBySlug, getAllMedia, getMediaBySeries } from "@/lib/media/client";
import { getRelatedContent } from "@/lib/content/related";
import { YouTubeEmbed } from "@/components/media/YouTubeEmbed";
import { constructMetadata } from "@/lib/seo/metadata";
import { VideoObjectJsonLd, BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { formatDuration, formatISODate } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const media = await getAllMedia();
  return media.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const item = await getMediaBySlug(slug);
  if (!item) return {};

  return constructMetadata({
    title: item.title,
    description: item.summary || item.description,
    image: item.thumbnailUrl,
    canonicalUrl: `/media/${slug}`,
  });
}

export default async function MediaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const item = await getMediaBySlug(slug);

  if (!item) {
    notFound();
  }

  // Fetch series companion episodes if part of a series
  const seriesEpisodes = item.seriesId
    ? (await getMediaBySeries(item.seriesId)).filter((s) => s.slug !== slug)
    : [];

  // Fetch cross-domain related content (articles + videos)
  const related = await getRelatedContent({
    currentType: "media",
    currentSlug: slug,
    explicitSlugs: item.relatedArticleSlugs,
    seriesId: item.seriesId,
    topics: item.topics,
    tags: item.tags,
    category: item.category,
    limit: 3,
  });

  return (
    <article className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg">
      <VideoObjectJsonLd
        name={item.title}
        description={item.summary || item.description}
        thumbnailUrl={item.thumbnailUrl}
        uploadDate={item.publishedAt}
        durationSeconds={item.durationSeconds}
        embedUrl={`https://www.youtube.com/embed/${item.youtubeId}`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://adalwise.com" },
          { name: "Lectures", url: "https://adalwise.com/media" },
          { name: item.title, url: `https://adalwise.com/media/${slug}` },
        ]}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-space-2xs text-body-sm text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/media" className="hover:text-primary transition-colors">
          Lectures
        </Link>
        <span>/</span>
        <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">
          {item.title}
        </span>
      </nav>

      {/* Video Player */}
      <div className="w-full">
        <YouTubeEmbed
          youtubeId={item.youtubeId}
          title={item.title}
          thumbnailUrl={item.thumbnailUrl}
        />
      </div>

      {/* Video Metadata Header */}
      <header className="flex flex-col gap-space-xs pb-space-md border-b border-surface-container-high">
        <div className="flex flex-wrap items-center gap-space-xs">
          <span className="px-space-sm py-0.5 rounded-full bg-primary-container text-surface text-label-sm uppercase tracking-wider font-bold">
            {item.category}
          </span>
          <span className="text-on-surface-variant font-label-sm text-[12px]">
            {formatDuration(item.durationSeconds)} duration • {formatISODate(item.publishedAt)}
          </span>
        </div>

        <h1 className="font-display-lg text-[28px] sm:text-[34px] text-primary font-bold font-serif leading-tight mt-space-2xs">
          {item.title}
        </h1>

        {item.urduTitle && (
          <p className="font-urdu text-[22px] text-tertiary-container dir-rtl text-right font-bold mt-1">
            {item.urduTitle}
          </p>
        )}

        <div className="flex items-center gap-space-sm mt-space-sm pt-space-xs border-t border-surface-container-high/60">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-tertiary-fixed font-bold font-serif shadow-sm overflow-hidden relative shrink-0">
            <Image
              src="/images/haseeb-chair.jpg"
              alt={item.speaker.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-[15px] text-primary font-semibold font-serif">
              {item.speaker.name}
            </span>
            <span className="font-body-sm text-[12px] text-on-surface-variant">
              {item.speaker.title}
            </span>
          </div>
        </div>
      </header>

      {/* Comprehensive Textual Summary & Study Notes (Discoverability Requirement #8) */}
      <section className="bg-surface-container-low p-space-lg rounded-[24px] border border-surface-container-high flex flex-col gap-space-md">
        <h2 className="font-headline-sm text-primary font-bold font-serif flex items-center gap-space-xs">
          <BookOpen className="w-5 h-5 text-tertiary-container shrink-0" />
          <span>Discourse Synopsis &amp; Juristic Breakdown</span>
        </h2>

        <p className="font-body-md text-on-surface leading-relaxed text-[16px]">
          {item.summary || item.description}
        </p>

        {/* Conceptual Topics & Taxonomy */}
        <div className="pt-space-xs flex flex-wrap items-center gap-space-xs">
          <span className="font-label-sm text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">
            Topics:
          </span>
          {item.topics.map((t) => (
            <Link
              key={t}
              href={`/search?q=${encodeURIComponent(t)}`}
              className="px-space-sm py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-[11px] font-semibold transition-colors border border-surface-container-highest"
            >
              {t}
            </Link>
          ))}
        </div>
      </section>

      {/* Series Companion Lectures */}
      {seriesEpisodes.length > 0 && (
        <section className="pt-space-md flex flex-col gap-space-md">
          <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
            <h3 className="font-headline-sm text-primary font-bold font-serif">
              Companion Episodes in this Series
            </h3>
            <span className="font-label-sm text-on-surface-variant">
              {seriesEpisodes.length} more
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
            {seriesEpisodes.map((ep) => (
              <Link
                key={ep.slug}
                href={`/media/${ep.slug}`}
                className="p-space-sm bg-surface-container rounded-xl flex items-center gap-space-sm hover:bg-surface-container-high transition-colors border border-surface-container-highest"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-tertiary-fixed flex items-center justify-center shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-headline-sm text-[14px] text-primary font-semibold truncate">
                    {ep.title}
                  </span>
                  <span className="text-[11px] text-on-surface-variant">
                    {formatDuration(ep.durationSeconds)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related Reading & Cross-Domain Content */}
      {related.length > 0 && (
        <section className="mt-space-xl pt-space-md border-t border-surface-container-high flex flex-col gap-space-md">
          <h3 className="font-headline-sm text-primary font-bold font-serif">
            Foundational Reading &amp; Related Treatises
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={r.url}
                className="p-space-md rounded-[20px] bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container-highest/60 flex flex-col justify-between"
              >
                <div className="flex flex-col gap-space-2xs">
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
                    {r.type === "article" ? "Written Treatise" : "Companion Lecture"}
                  </span>
                  <h4 className="font-headline-sm text-[15px] text-primary font-bold font-serif line-clamp-2">
                    {r.title}
                  </h4>
                  <p className="font-body-sm text-[12px] text-on-surface-variant line-clamp-2">
                    {r.excerpt}
                  </p>
                </div>
                <span className="font-label-sm text-primary font-bold text-[11px] flex items-center gap-1 mt-space-sm">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
