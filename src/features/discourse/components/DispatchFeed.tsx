import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleDoc } from "@/lib/content/schemas";

interface DispatchFeedProps {
  articles: ArticleDoc[];
}

export function DispatchFeed({ articles }: DispatchFeedProps) {
  return (
    <section className="w-full px-gutter-mobile md:px-gutter-desktop flex flex-col gap-space-md max-w-container-max mx-auto py-space-md">
      <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
        <h2 className="font-headline-md text-primary font-bold">
          Articles &amp; Treatises
        </h2>
        <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">
          {articles.length} Entries
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/twasi-al-haq/${a.slug}`}
            className="bg-surface-container p-space-md rounded-[20px] flex flex-col gap-space-xs hover:bg-surface-container-high transition-all border border-surface-container-highest/60 group"
          >
            <div className="flex items-center justify-between gap-space-xs">
              <span className="font-label-sm text-[11px] text-secondary uppercase tracking-wider font-semibold">
                {a.frontmatter.category}
              </span>
              <span className="text-[11px] font-label-sm text-on-surface-variant">
                {a.frontmatter.readTime}
              </span>
            </div>

            <h3 className="font-headline-sm text-primary font-bold leading-snug font-serif group-hover:text-primary-container transition-colors">
              {a.frontmatter.title}
            </h3>

            {a.frontmatter.urduTitle && (
              <p className="font-urdu text-[13px] text-tertiary dir-rtl text-right -mt-1 font-semibold">
                {a.frontmatter.urduTitle}
              </p>
            )}

            <p className="font-body-sm text-on-surface-variant line-clamp-2">
              {a.frontmatter.excerpt}
            </p>

            <div className="pt-space-2xs flex items-center justify-between text-primary font-label-sm font-semibold border-t border-surface-container-high/60 mt-auto">
              <span className="text-[11px] text-on-surface-variant font-normal">
                {a.frontmatter.author.name}
              </span>
              <span className="flex items-center gap-space-2xs group-hover:translate-x-1 transition-transform">
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
