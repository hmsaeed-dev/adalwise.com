import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroSectionProps {
    desktopImageSrc?: string;
    mobileImageSrc?: string;
}

export function HeroSection({
    desktopImageSrc = "/images/home-hero-desktop.jpg",
    mobileImageSrc = "/images/home-hero-mobile.jpg",
}: HeroSectionProps) {
    return (
        <section className="relative w-full h-[100svh] min-h-[560px] md:h-screen md:min-h-[680px] flex flex-col justify-start bg-brand-parchment overflow-hidden">
            {/* High-Resolution Mountain Sunrise Background */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
                {/* Desktop Image (Hidden on Mobile) */}
                <div className="hidden md:block absolute inset-0 w-full h-full">
                    <Image
                        src={desktopImageSrc}
                        alt="Mountaineers ascending ridge towards dawn above a sea of clouds"
                        fill
                        priority
                        quality={85}
                        sizes="100vw"
                        className="object-cover object-bottom select-none pointer-events-none transform-gpu"
                    />
                </div>

                {/* Mobile Image (Hidden on Desktop) */}
                <div className="block md:hidden absolute inset-0 w-full h-full">
                    <Image
                        src={mobileImageSrc}
                        alt="Mountaineers ascending ridge towards dawn above a sea of clouds"
                        fill
                        priority
                        quality={85}
                        sizes="100vw"
                        className="object-cover object-[70%_bottom] select-none pointer-events-none transform-gpu"
                    />
                </div>

                {/* Atmospheric Vignette & Contrast Overlay for WCAG AA compliance */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(245, 247, 244, 0.25) 0%, transparent 60%)",
                    }}
                />
                {/* Top gradient for nav bar contrast */}
                <div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-[#0a1b12]/75 via-[#0a1b12]/30 to-transparent pointer-events-none" />
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 sm:pt-28 md:pt-32 lg:pt-36 pb-16 flex-1 flex flex-col justify-start">
                {/* ─── DESKTOP LAYOUT (>= md: Left-aligned in upper quadrant) ─── */}
                <div className="hidden md:flex md:flex-col md:items-start max-w-2xl lg:max-w-3xl pl-4 lg:pl-10 xl:pl-14">
                    {/* Title Row: Brand Wordmark + Divider */}
                    <div className="flex items-center gap-5 lg:gap-6 animate-fade-in-up">
                        <h1 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-medium tracking-editorial text-brand-primary uppercase leading-none">
                            ADLWISE
                        </h1>
                    </div>

                    {/* Tagline */}
                    <p
                        className="font-serif italic text-xl md:text-2xl lg:text-[26px] font-light text-brand-primary mt-4 lg:mt-5 leading-snug animate-fade-in-up"
                        style={{ animationDelay: "150ms" }}
                    >
                        A living tradition of justice, statecraft, and
                        jurisprudence.
                    </p>

                    {/* CTA Buttons: Side by Side */}
                    <div
                        className="flex items-center gap-4 mt-7 lg:mt-8 animate-fade-in-up"
                        style={{ animationDelay: "350ms" }}
                    >
                        <Link
                            href="#academic-streams"
                            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-brand-warm-white rounded-full text-xs tracking-widest font-medium uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
                        >
                            <span>Explore</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/lectures"
                            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-warm-white/65 hover:bg-brand-warm-white/90 text-brand-primary border border-brand-primary backdrop-blur-sm rounded-full text-xs tracking-widest font-medium uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
                        >
                            <span>Lecture Series</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* ─── MOBILE LAYOUT (< md: Centered in upper viewport half) ─── */}
                <div className="flex flex-col items-center text-center md:hidden max-w-sm">
                    {/* Brand Title */}
                    <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-editorial text-brand-primary uppercase animate-fade-in-up">
                        ADLWISE
                    </h1>

                    {/* Centered Tagline */}
                    <p
                        className="font-serif italic text-lg sm:text-xl text-brand-primary font-light max-w-xs sm:max-w-sm leading-snug animate-fade-in-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        A living tradition of justice,
                        <br />
                        statecraft, and jurisprudence.
                    </p>

                    {/* Stacked Pill CTA Buttons */}
                    <div
                        className="flex flex-col w-full max-w-[280px] gap-2.5 mt-5 sm:mt-6 my-auto animate-fade-in-up"
                        style={{ animationDelay: "400ms" }}
                    >
                        <Link
                            href="/about"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-brand-warm-white rounded-full text-xs tracking-widest font-medium uppercase transition-all shadow-sm active:scale-[0.98] group"
                        >
                            <span>Explore</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/twasi-al-haq"
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-warm-white/65 hover:bg-brand-warm-white/90 text-brand-primary border border-brand-primary backdrop-blur-sm rounded-full text-xs tracking-widest font-medium uppercase transition-all shadow-sm active:scale-[0.98] group"
                        >
                            <span>View Archive</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
