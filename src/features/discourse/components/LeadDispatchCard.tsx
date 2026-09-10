import React from "react";
import Link from "next/link";
import Image from "next/image";
import { DispatchDoc } from "@/lib/content/schemas";

interface LeadDispatchCardProps {
  dispatch: DispatchDoc;
}

export function LeadDispatchCard({ dispatch }: LeadDispatchCardProps) {
  const { frontmatter, slug } = dispatch;

  return (
    <section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-md max-w-container-max mx-auto">
      <div className="bg-primary-container text-surface rounded-[24px] p-space-lg shadow-lg relative overflow-hidden flex flex-col gap-space-md border border-primary/50">
        <div className="flex items-center justify-between text-tertiary-fixed text-label-sm font-label-sm uppercase tracking-wider">
          <span className="font-semibold">Featured Essay</span>
          <span>{frontmatter.readTime}</span>
        </div>

        <div className="flex flex-col gap-space-2xs">
          <h2 className="font-headline-lg text-[26px] sm:text-headline-lg text-surface leading-snug font-bold font-serif">
            {frontmatter.title}
          </h2>
          {frontmatter.urduTitle && (
            <p className="font-urdu text-[16px] text-tertiary-fixed dir-rtl text-right font-bold">
              {frontmatter.urduTitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-space-sm bg-primary/60 p-space-sm rounded-xl">
          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-tertiary-container shrink-0 bg-primary">
            <Image
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHUdFkOkBBnh8rj1rOIil1YM_edKeWWsoXSFd_Lcr9nhy6J9YUD82AxMDmTncS3w2ch9Vg2Tv_r0HGs2by2DuZlRG4bXHRSyef7KkDqPCf0b4hDqP42Afy1JSI00T30ZdzoUbpPPtcvHRVCwVjcLKzlgyDxQJKydP-RkLlgiTfa8yGP103pRBtJ0FE8IDyAicoce_AFRshW2VUXfzhbRC_sDduaf3X80xFVClOLssVW_62dCvWzON7"
              alt={frontmatter.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-[15px] text-surface font-semibold font-serif">
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
            <span>Read Discourse</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
