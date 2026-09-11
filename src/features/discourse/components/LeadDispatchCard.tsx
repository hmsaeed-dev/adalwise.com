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
