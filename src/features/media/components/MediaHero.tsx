import React from 'react';
import Image from 'next/image';

interface LecturesHeroProps {
  desktopImageSrc?: string;
  mobileImageSrc?: string;
}

export function MediaHero({
	desktopImageSrc = "/images/hero-section/lectures-page-hero-image.jpg",
	mobileImageSrc = "/images/hero-section/lectures-page-hero-image.jpg",
}: LecturesHeroProps) {
	return (
		<section className="relative w-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex flex-col items-center justify-center overflow-hidden bg-[#0d2619]">
			{/* ================= FULL-BLEED BACKGROUND IMAGES ================= */}
			<div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
				{/* Desktop Image (Hidden on Mobile) */}
				<div className="hidden md:block absolute inset-0 w-full h-full">
					<Image
						src={desktopImageSrc}
						alt="Adlwise Scholarly Discourses and Lectures"
						fill
						priority
						className="object-cover object-center transform scale-105 animate-fade-in"
						sizes="100vw"
					/>
				</div>

				{/* Mobile Image (Hidden on Desktop) */}
				<div className="block md:hidden absolute inset-0 w-full h-full">
					<Image
						src={mobileImageSrc}
						alt="Adlwise Scholarly Discourses and Lectures"
						fill
						priority
						className="object-cover object-center"
						sizes="100vw"
					/>
				</div>

				{/* ================= EDITORIAL OVERLAYS ================= */}
				{/* Base darkening vignette to ensure gold and off-white serif contrast */}
				<div className="absolute inset-0 bg-[#0d2619]/45 md:bg-[#0d2619]/40 backdrop-brightness-95" />

				{/* Radial warm golden wash from the arched window center */}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d2619]/30 to-[#0a1b12]/80" />

				{/* Bottom gradient fade that bridges smoothly into the body background */}
				<div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
			</div>

			{/* ================= HERO CONTENT LOCKUP (With top padding for transparent overlay navbar) ================= */}
			<div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 text-center flex flex-col items-center justify-center">
				{/* Bilingual Header: English Display Serif + Arabic Thuluth/Nastaliq */}
				<div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 mb-3 sm:mb-4 animate-fade-in-up">
					<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-editorial text-[#FAF8F5] drop-shadow-md uppercase">
						Discourses{" "}
						<span className="font-light text-[#B88E3F]">
							&amp;
						</span>{" "}
						Lectures
					</h1>
				</div>

				{/* Subtle Horizontal Flourish */}
				<div className="w-24 md:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#B88E3F]/80 to-transparent my-3 sm:my-4" />

				{/* Tagline: Italicized Classic Serif */}
				<p className="font-serif italic text-base sm:text-lg md:text-xl text-[#FAF8F5]/90 max-w-2xl font-light leading-relaxed drop-shadow">
					Oral traditions, textual treatises, and jurisprudential inquiries.
				</p>

				{/* Subtext description */}
				<p className="mt-2 text-xs sm:text-sm text-[#FAF8F5]/75 max-w-xl font-sans tracking-wide leading-relaxed font-normal drop-shadow-sm">
					Curated Tafsir, civil jurisprudence, and recorded scholarly seminars from Dr. Hafiz Haseeb.
				</p>
			</div>
		</section>
	);
}
