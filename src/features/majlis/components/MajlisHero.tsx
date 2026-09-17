import React from "react";
import Image from "next/image";

interface MajlisHeroProps {
  desktopImageSrc?: string;
  mobileImageSrc?: string;
  imageSrc?: string;
}

export function MajlisHero({
  desktopImageSrc,
  mobileImageSrc,
  imageSrc = "/images/majlis-hero.jpg",
}: MajlisHeroProps = {}) {
  const effectiveImageSrc = desktopImageSrc || mobileImageSrc || imageSrc;

  return (
    <section className="relative w-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex flex-col items-center justify-center overflow-hidden bg-[#0d2619]">
      {/* ================= FULL-BLEED BACKGROUND IMAGE ================= */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={effectiveImageSrc}
            alt="Adlwise Majlis - Study Gatherings"
            fill
            priority
            quality={85}
            className="object-cover object-center md:scale-105 animate-fade-in"
            sizes="100vw"
          />
        </div>

        {/* ================= EDITORIAL OVERLAYS ================= */}
        {/* Base darkening vignette to ensure gold and off-white serif contrast */}
        <div className="absolute inset-0 bg-[#0d2619]/45 md:bg-[#0d2619]/20 backdrop-brightness-95" />

        {/* Radial warm golden wash from the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d2619]/30 to-[#0a1b12]/80" />

        {/* Top gradient for nav bar contrast */}
        <div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-[#0a1b12]/75 via-[#0a1b12]/30 to-transparent pointer-events-none" />

      </div>

      {/* ================= HERO CONTENT LOCKUP (With top padding for transparent overlay navbar) ================= */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 text-center flex flex-col items-center justify-center">
        {/* Bilingual Header: English Display Serif + Urdu Nastaliq */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4 animate-fade-in-up flex-wrap">

          <h1 className="font-urdu text-6xl sm:text-4xl md:text-8xl md:mb-12 text-brand-warm-white  font-bold leading-none dir-rtl select-none drop-shadow-sm">
            مجلسِ مکالمہ
          </h1>
        </div>

        {/* Subtext description */}
        <p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/85 max-w-xl font-sans tracking-wide leading-relaxed font-normal">
          Fortnightly gatherings convened in Dr. Hafiz Haseeb’s Lahore library over tea, text, and candid jurisprudential inquiry.
        </p>
      </div>
    </section>
  );
}
