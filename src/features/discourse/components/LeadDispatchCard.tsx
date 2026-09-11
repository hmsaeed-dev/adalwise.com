import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { ArticleDoc } from "@/lib/content/schemas";

interface LeadDispatchCardProps {
  article: ArticleDoc;
}

export function LeadDispatchCard({ article }: LeadDispatchCardProps) {
  const { frontmatter, slug } = article;

  return (
    <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-md max-w-container-max mx-auto">
      <div className="bg-primary-container text-surface rounded-[24px] p-space-lg shadow-lg relative overflow-hidden flex flex-col gap-space-md border border-primary/50">
        <div className="flex items-center justify-between text-tertiary-fixed text-label-sm font-label-sm uppercase tracking-wider">
          <span className="font-semibold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Featured Article
          </span>
          <span>{frontmatter.readTime}</span>
        </div>

        <div className="flex flex-col gap-space-2xs">
          <h2 className="font-headline-lg text-[26px] sm:text-headline-lg text-surface leading-snug font-bold">
            {frontmatter.title}
          </h2>
          {frontmatter.urduTitle && (
            <p className="font-urdu text-[16px] text-tertiary-fixed dir-rtl text-right font-bold">
              {frontmatter.urduTitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-space-sm bg-primary/60 p-space-sm rounded-xl">
          <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-tertiary-container shrink-0 bg-primary shadow-sm">
            <Image
              src="/images/haseeb-chair.jpg"
              alt={frontmatter.author.name}
              fill
              className="object-cover object-top"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-[15px] text-surface font-semibold">
              {frontmatter.author.name}
            </span>
            <span className="font-label-sm text-primary-fixed-dim text-[11px]">
              {frontmatter.author.title}
            </span>
          </div>
        </div>

        <p className="font-body-sm text-surface-container leading-relaxed">
          {frontmatter.excerpt}
        </p>

        <div className="pt-space-xs">
          <Link
            href={`/twasi-al-haq/${slug}`}
            className="w-full sm:w-auto px-space-md py-space-sm bg-tertiary-container text-on-tertiary-container font-label-md uppercase tracking-wider font-semibold rounded-full shadow flex items-center justify-center gap-space-xs hover:bg-tertiary-fixed transition-colors"
          >
            <span>Read Article</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
