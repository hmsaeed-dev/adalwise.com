import React from "react";
import Image from "next/image";

interface MajlisHeroProps {
  desktopImageSrc?: string;
  mobileImageSrc?: string;
}

export function MajlisHero({
  desktopImageSrc = "/images/hero-section/majlis-hero.jpg",
  mobileImageSrc = "/images/hero-section/majlis-hero.jpg",
}: MajlisHeroProps = {}) {
  return (
    <section className="relative w-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex flex-col items-center justify-center overflow-hidden bg-[#0d2619]">
      {/* ================= FULL-BLEED BACKGROUND IMAGES ================= */}
      <div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
        {/* Desktop Image (Hidden on Mobile) */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          <Image
            src={desktopImageSrc}
            alt="Adlwise Majlis - Study Gatherings"
            fill
            priority
            quality={85}
            className="object-cover object-center transform scale-105 animate-fade-in"
            sizes="100vw"
          />
        </div>

        {/* Mobile Image (Hidden on Desktop) */}
        <div className="block md:hidden absolute inset-0 w-full h-full">
          <Image
            src={mobileImageSrc}
            alt="Adlwise Majlis - Study Gatherings"
            fill
            priority
            quality={85}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* ================= EDITORIAL OVERLAYS ================= */}
        {/* Base darkening vignette to ensure gold and off-white serif contrast */}
        <div className="absolute inset-0 bg-[#0d2619]/45 md:bg-[#0d2619]/40 backdrop-brightness-95" />

        {/* Radial warm golden wash from the center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d2619]/30 to-[#0a1b12]/80" />

        {/* Top gradient for nav bar contrast */}
        <div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-[#0a1b12]/75 via-[#0a1b12]/30 to-transparent pointer-events-none" />

        {/* Bottom gradient fade that bridges smoothly into the body background */}
        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
      </div>

      {/* ================= HERO CONTENT LOCKUP (With top padding for transparent overlay navbar) ================= */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 text-center flex flex-col items-center justify-center">
        {/* Bilingual Header: English Display Serif + Urdu Nastaliq */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4 animate-fade-in-up flex-wrap">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-editorial text-[#FAF8F5] drop-shadow-md uppercase">
            Majlis
          </h1>
          <span className="font-urdu text-2xl sm:text-3xl md:text-4xl text-brand-gold font-bold leading-none dir-rtl select-none drop-shadow-sm">
            مجلسِ
          </span>
        </div>

        {/* Subtle decorative gold divider */}
        <div className="h-[2px] w-16 sm:w-20 bg-brand-gold/70 my-1 rounded-full drop-shadow" />

        {/* Subtext description */}
        <p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/85 max-w-xl font-sans tracking-wide leading-relaxed font-normal">
          Fortnightly gatherings convened in Dr. Hafiz Haseeb’s Lahore library over tea, text, and candid jurisprudential inquiry.
        </p>
      </div>
    </section>
  );
}
