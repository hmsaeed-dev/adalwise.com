import React from "react";
import Image from "next/image";

export function MediaHero() {
  return (
    <section className="relative w-full overflow-hidden rounded-b-[2.5rem] shadow-md bg-primary">
      <div className="absolute inset-0">
        <Image
          src="/images/haseeb-chair.jpg"
          alt="Classical library study of Dr. Hafiz Haseeb"
          fill
          className="object-cover opacity-25 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/85 to-primary/80 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 w-full px-gutter-mobile md:px-gutter-desktop pt-16 pb-16 max-w-container-max mx-auto flex flex-col justify-center items-center text-center gap-space-xs">
        <div className="flex items-center gap-space-2xs mb-1">
          <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
          <span className="font-label-sm text-tertiary-fixed uppercase tracking-widest text-[11px] font-bold">
            Archival Repository
          </span>
        </div>
        <h1 className="font-display-lg text-[34px] sm:text-display-lg text-surface tracking-tight font-bold font-serif">
          Lectures &amp; Discourses
        </h1>
        <p className="font-body-md text-surface-variant max-w-md leading-relaxed opacity-90">
          Curated exegesis, jurisprudential treatises, and recorded seminars from Dr. Hafiz Haseeb.
        </p>
        <span className="font-urdu text-[16px] text-tertiary-fixed font-semibold mt-1">
          دروس، خطابات و علمی مباحث
        </span>
      </div>
    </section>
  );
}
