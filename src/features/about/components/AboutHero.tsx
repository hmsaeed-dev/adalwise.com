import React from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

interface AboutHeroProps {
	desktopImageSrc?: string;
	mobileImageSrc?: string;
}

export function AboutHero({
	desktopImageSrc = "/images/haseeb-02.jpg",
	mobileImageSrc = "/images/haseeb-02.jpg",
}: AboutHeroProps = {}) {
	return (
		<section className="relative w-full min-h-[420px] sm:min-h-[460px] md:min-h-[500px] flex flex-col items-center justify-center overflow-hidden bg-[#0d2619]">
			{/* Background Image with Overlays */}
			<div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
				<div className="hidden md:block absolute inset-0 w-full h-full">
					<Image
						src={desktopImageSrc}
						alt="Adlwise - Intellectual Mandate"
						fill
						priority
						className="object-cover object-center transform scale-105 opacity-40"
						sizes="100vw"
					/>
				</div>
				<div className="block md:hidden absolute inset-0 w-full h-full">
					<Image
						src={mobileImageSrc}
						alt="Adlwise - Intellectual Mandate"
						fill
						priority
						className="object-cover object-center opacity-40"
						sizes="100vw"
					/>
				</div>

				<div className="absolute inset-0 bg-[#0d2619]/60 backdrop-brightness-90" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d2619]/40 to-[#0a1b12]/90" />
				<div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-[#0a1b12]/80 via-[#0a1b12]/30 to-transparent pointer-events-none" />
			</div>

			{/* Hero Content Lockup */}
			<div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 text-center flex flex-col items-center justify-center">
				<div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4 flex-wrap">
					<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-editorial text-[#FAF8F5] drop-shadow-md uppercase">
						About Us
					</h1>
					<span className="font-urdu text-2xl sm:text-3xl md:text-4xl text-brand-gold font-bold leading-none dir-rtl select-none drop-shadow-sm">
						{siteConfig.urduName}
					</span>
				</div>

				<div className="h-[2px] w-16 sm:w-20 bg-brand-gold/70 my-1 rounded-full drop-shadow" />

				<p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/85 max-w-xl font-sans tracking-wide leading-relaxed font-normal">
					{siteConfig.tagline} • {siteConfig.urduTagline}
				</p>
			</div>
		</section>
	);
}
