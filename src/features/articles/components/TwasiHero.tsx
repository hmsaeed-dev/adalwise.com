import React from "react";
import Image from "next/image";

interface TwasiHeroProps {
	desktopImageSrc?: string;
	mobileImageSrc?: string;
}

export function TwasiHero({
	desktopImageSrc = "/images/twasi.jpg",
	mobileImageSrc = "/images/twasi.jpg",
}: TwasiHeroProps = {}) {
	return (
		<section className="relative w-full min-h-[440px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex flex-col items-center justify-center overflow-hidden bg-[#0d2619]">
			{/* Full-bleed background images */}
			<div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
				<div className="hidden md:block absolute inset-0 w-full h-full">
					<Image
						src={desktopImageSrc}
						alt="Twasi al-Haq - Scholarly Treatises & Articles"
						fill
						priority
						className="object-cover object-center transform scale-105 animate-fade-in"
						sizes="100vw"
					/>
				</div>
				<div className="block md:hidden absolute inset-0 w-full h-full">
					<Image
						src={mobileImageSrc}
						alt="Twasi al-Haq - Scholarly Treatises & Articles"
						fill
						priority
						className="object-cover object-center"
						sizes="100vw"
					/>
				</div>

				<div className="absolute inset-0 bg-[#0d2619]/45 md:bg-[#0d2619]/40 backdrop-brightness-95" />
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-[#0d2619]/30 to-[#0a1b12]/80" />
				<div className="absolute inset-x-0 top-0 h-28 sm:h-32 bg-gradient-to-b from-[#0a1b12]/75 via-[#0a1b12]/30 to-transparent pointer-events-none" />
			</div>

			{/* Hero Content Lockup */}
			<div className="relative gap-12 z-10 w-full max-w-4xl mx-auto px-6 pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 text-center flex flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center gap-2 mb-2 sm:mb-3 animate-fade-in-up">
					<h1 className="font-urdu text-6xl sm:text-7xl md:text-8xl text-[#FAF8F5]/90 font-bold leading-none dir-rtl select-none drop-shadow-md">
						تواصِی بالحَق
					</h1>

				</div>

				<p className="mt-2 text-sm sm:text-base text-[#FAF8F5]/85 max-w-2xl font-sans tracking-wide leading-relaxed font-normal">
					Contemporary statecraft, constitutionalism, and public ethics examined through classical Islamic jurisprudence.
				</p>
			</div>
		</section>
	);
}
