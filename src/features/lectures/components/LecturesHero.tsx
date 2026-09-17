import React from "react";
import Image from "next/image";

interface LecturesHeroProps {
	desktopImageSrc?: string;
	mobileImageSrc?: string;
	imageSrc?: string;
}

export function LecturesHero({
	desktopImageSrc,
	mobileImageSrc,
	imageSrc = "/images/lectures-hero.jpg",
}: LecturesHeroProps = {}) {
	const effectiveImageSrc = desktopImageSrc || mobileImageSrc || imageSrc;

	return (
		<section className="relative w-full min-h-[380px] sm:min-h-[420px] md:min-h-[460px] flex flex-col items-center justify-center overflow-hidden bg-[#0d2619]">
			{/* Full-Bleed Background Image */}
			<div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
				<div className="absolute inset-0 w-full h-full">
					<Image
						src={effectiveImageSrc}
						alt="Adlwise Scholarly Discourses and Lectures"
						fill
						priority
						className="object-cover object-center md:scale-105"
						sizes="100vw"
					/>
				</div>

				<div className="absolute inset-0 bg-[#0d2619]/60 backdrop-brightness-90" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d2619]/40 to-[#0a1b12]/90" />
				<div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-[#0a1b12]/80 via-[#0a1b12]/30 to-transparent pointer-events-none" />
			</div>

			{/* Hero Content Lockup */}
			<div className="relative z-10 w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 text-center flex flex-col items-center justify-center">

				<div className="flex flex-col items-center gap-2">
					<h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-brand-warm-white font-normal leading-[1.12] tracking-tight">
						Lectures &amp; Discourses
					</h1>
				</div>

				<p className="mt-4 text-sm sm:text-base text-brand-warm-white/85 max-w-2xl font-sans tracking-wide leading-relaxed font-normal">
					An organized body of teaching across Quranic hermeneutics, prophetic statecraft,
					constitutional jurisprudence, and civilizational revival by Dr. Hafiz Haseeb.
				</p>

				{/* Quick Anchor Jump */}
				<div className="mt-6 flex items-center gap-3">
					<a
						href="#archive"
						className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/30 text-brand-gold font-sans text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
					>
						<span>Jump to Library</span>
						<span className="text-sm">↓</span>
					</a>
				</div>
			</div>
		</section>
	);
}
