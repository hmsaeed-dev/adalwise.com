import React from "react";

export function MediaHero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 px-gutter-mobile md:px-gutter-desktop border-b border-surface-container-highest/60 bg-gradient-to-b from-surface-container-low/70 via-surface to-surface">
      <div className="relative z-10 flex flex-col gap-space-sm max-w-container-max mx-auto">
        <div className="flex items-baseline justify-between gap-space-sm flex-wrap">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-space-2xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-secondary uppercase tracking-widest text-[11px] font-bold">
                Archival Repository
              </span>
            </div>
            <h1 className="font-display-lg text-[28px] sm:text-[34px] md:text-display-lg text-primary tracking-tight font-bold leading-tight font-serif">
              Lectures &amp; Discourses
            </h1>
          </div>
          <span className="font-urdu text-[26px] sm:text-[32px] md:text-[36px] text-tertiary-container font-bold leading-none dir-rtl select-none">
            دروس، خطابات و علمی مباحث
          </span>
        </div>
        <div className="h-[2px] w-20 bg-tertiary-container/60 my-1 rounded-full" />
        <p className="font-body-lg text-[15px] sm:text-[16px] md:text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Curated exegesis, jurisprudential treatises, and recorded seminars from Dr. Hafiz Haseeb.
        </p>
      </div>
    </section>
  );
}
