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
      </div>
    </section>
  );
}
