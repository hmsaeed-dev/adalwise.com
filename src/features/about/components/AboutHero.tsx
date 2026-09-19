import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function AboutHero() {
	return (
		<section className="relative w-full bg-[#0a2318] text-brand-warm-white overflow-hidden pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-24  border-primary-container/60">
			{/* Ambient Architectural Lighting */}
			<div
				aria-hidden="true"
				className="absolute inset-0 pointer-events-none select-none overflow-hidden"
			>
				<div className="absolute -top-32 right-10 w-[550px] h-[550px] bg-[radial-gradient(circle_at_center,_rgba(184,142,63,0.14)_0%,_transparent_70%)] blur-3xl" />
				<div className="absolute -bottom-20 left-10 w-[500px] h-[400px] bg-[radial-gradient(circle_at_center,_rgba(20,56,38,0.4)_0%,_transparent_70%)] blur-2xl" />
			</div>

			<div className="relative z-10 w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Balanced 2-Column Lockup: Left English Proposition, Right Grounded Calligraphic Plaque */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
					{/* Left: Primary Focal Proposition */}
					<div className="lg:col-span-7 flex flex-col items-start">
						{/* Primary Heading */}
						<h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] text-brand-warm-white font-normal leading-[1.12] tracking-tight">
							A physician’s inquiry into the Quran, Islamic
							thought & living jurisprudence.
						</h1>

						{/* Quick Action Anchors */}
						<div className="mt-8 flex flex-wrap items-center gap-4">
							<a
								href="#method"
								className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold hover:bg-[#c99e4c] text-[#0a2318] text-xs font-semibold uppercase tracking-widest transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
							>
								<span>The Thesis</span>
								<ArrowDown className="w-3.5 h-3.5" />
							</a>

							<Link
								href="/lectures"
								className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 text-brand-warm-white border border-white/20 text-xs font-semibold uppercase tracking-widest transition-all duration-200"
							>
								<span>Listen</span>
								<ArrowRight className="w-3.5 h-3.5" />
							</Link>
						</div>
					</div>

					{/* Right: Grounded Calligraphic Plaque (Crest Anchor) */}
					<div className="lg:col-span-5 flex justify-center lg:justify-end">
						<div className="w-full max-w-md p-8 sm:p-10 flex flex-col items-center text-center relative overflow-hidden">

							{/* Nastaliq Calligraphic Mark */}
							<span className="font-urdu py-20 text-5xl sm:text-6xl text-brand-gold font-bold leading-[1.5] dir-rtl select-none drop-shadow-md">
								عدل و حکمت
							</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
