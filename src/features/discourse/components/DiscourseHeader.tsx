import React from "react";
import Image from "next/image";

export function DiscourseHeader() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 px-gutter-mobile md:px-gutter-desktop border-b border-surface-container-highest/60 bg-gradient-to-b from-surface-container-low/70 via-surface to-surface">
      <div className="relative z-10 flex flex-col gap-space-lg max-w-container-max mx-auto">
        <div className="flex flex-col gap-space-xs pt-1">
          <div className="flex items-baseline justify-between gap-space-sm flex-wrap">
            <h1 className="font-display-lg text-[34px] sm:text-display-lg text-primary tracking-tight font-bold leading-tight">
              Twasi al-Haq
            </h1>
            <span className="font-urdu text-[28px] sm:text-[34px] text-tertiary-container font-bold leading-none dir-rtl select-none">
              تواصِی بالحَق
            </span>
          </div>
          <div className="h-[2px] w-20 bg-tertiary-container/60 my-1 rounded-full" />
          <p className="font-body-lg text-[16px] sm:text-body-lg text-on-surface-variant leading-relaxed tracking-normal">
            Contemporary statecraft, constitutionalism, and public ethics examined through classical jurisprudence.
          </p>
        </div>

        {/* Editorial Charter Box */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-surface-container-highest bg-surface-container-low/90 p-space-sm flex items-center gap-space-md">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-tertiary-container/40 bg-primary flex items-center justify-center p-2 shadow-sm">
            <Image
              src="/images/logo-badge.png"
              alt="Adalwise Editorial Seal"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center gap-space-2xs min-w-0 pr-1">
            <span className="font-label-sm text-[10px] tracking-wider uppercase text-secondary font-bold">
              Editorial Charter
            </span>
            <p className="font-headline-sm text-[15px] text-primary font-semibold leading-snug truncate">
              Rigorous Jurisprudential Inquiries
            </p>
            <p className="font-body-sm text-[12px] text-on-surface-variant leading-tight line-clamp-2">
              Unraveling institutional ethics, sovereignty, and statecraft through juristic precedent and legal philosophy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
