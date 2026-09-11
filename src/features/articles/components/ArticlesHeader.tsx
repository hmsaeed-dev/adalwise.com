import React from "react";

export function ArticlesHeader() {
  return (
    <section className="relative overflow-hidden pt-8 pb-10 px-gutter-mobile md:px-gutter-desktop border-b border-surface-container-highest/60 bg-gradient-to-b from-surface-container-low/70 via-surface to-surface">
      <div className="relative z-10 flex flex-col gap-space-sm max-w-container-max mx-auto">
        <div className="flex items-baseline justify-between gap-space-sm flex-wrap">
          <h1 className="font-display-lg text-[34px] sm:text-display-lg text-primary tracking-tight font-bold leading-tight">
            Treatises &amp; Monographs
          </h1>
        </div>
        <div className="h-[2px] w-20 bg-tertiary-container/60 my-1 rounded-full" />
        <p className="font-body-lg text-[16px] sm:text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          In-depth academic monographs on contractual equity, classical constitutionalism, and legal maxims.
        </p>
      </div>
    </section>
  );
}
