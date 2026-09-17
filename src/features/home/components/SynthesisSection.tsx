import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Compass } from "lucide-react";

interface Pillar {
	num: string;
	title: string;
	arabic: string;
	desc: string;
}

const PILLARS: Pillar[] = [
	{
		num: "1.",
		title: "Divine Order",
		arabic: "التوحيد والنظام الأسمى",
		desc: "Foundational grounding of divine unity and metaphysical order that frames all moral responsibility, covenantal accountability, and judicial ethics.",
	},
	{
		num: "2.",
		title: "Operative Ratio",
		arabic: "العلة التشريعية ومناط الحكم",
		desc: "Classical legal causation enabling dynamic juristic extraction of normative rulings to address novel socio-economic and statutory realities.",
	},
	{
		num: "3.",
		title: "Constitutional Statecraft",
		arabic: "السياسة الشرعية والعدل",
		desc: "Harmonizing civic constitutional covenants, institutional justice, and public welfare within a pluralistic society.",
	},
];

export function SynthesisSection() {
	return (
		<section className="w-full px-gutter-mobile md:px-gutter-desktop py-space-xl md:py-space-2xl max-w-container-max mx-auto flex flex-col gap-8 md:gap-12">
			{/* ─── SECTION HEADER: Sharp Overline & Editorial Typography ─── */}
			<div className="flex flex-col gap-2 md:gap-3">
				<div className="flex items-center gap-2 text-tertiary"></div>
				<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-primary tracking-tight leading-tight">
					Synthesis of Adl &amp; Hikmah
				</h2>
			</div>

			{/* ─── MAIN CONTENT: Split Visual Anchor + 3-Tier Codex Ledger ─── */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
				{/* LEFT: Archival / Abstract Visual Anchor Plate */}
				<div className="lg:col-span-5 flex flex-col">
					<div className="relative w-full h-[320px] sm:h-[380px] lg:h-full min-h-[320px] lg:min-h-[440px] rounded-[20px] md:rounded-[24px] overflow-hidden border border-surface-container-high/80 bg-primary shadow-sm flex flex-col justify-between p-6 sm:p-8 select-none group">
						{/* Archival Artwork with Duotone Treatment */}
						<div className="absolute inset-0 z-0">
							<Image
								src="/images/twasi.jpg"
								alt="Archival treatises and scholastic notations"
								fill
								sizes="(max-width: 1024px) 100vw, 40vw"
								className="object-cover object-center grayscale contrast-125 opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-700 ease-out"
							/>
							{/* Duotone Gradient Overlay in Brand Primary Forest Green */}
							<div className="absolute inset-0 bg-gradient-to-t from-[#00261a] via-[#00261a]/85 to-[#00261a]/60" />
							{/* Hairline Inner Frame for Archival Plate Look */}
							<div className="absolute inset-3 border border-tertiary-fixed/15 rounded-[14px] pointer-events-none" />
						</div>

						{/* Center Watermark Crest */}
						<div className="relative z-10 flex flex-col items-center justify-center my-auto py-6 opacity-35 group-hover:opacity-55 transition-opacity duration-500">
							<div className="w-16 h-16 rounded-full border border-brand-gold/40 flex items-center justify-center p-3">
								<Compass className="w-full h-full text-brand-gold stroke-1" />
							</div>
						</div>

						{/* Bottom Plate Inscription */}
						<div className="relative z-10 flex flex-col gap-1.5  border-brand-warm-white/10 pt-4">
							<span className="font-serif italic text-base sm:text-lg text-brand-warm-white leading-snug">
								&ldquo;Justice without wisdom is rigidity;
								wisdom without justice is compromise.&rdquo;
							</span>
						</div>
					</div>
				</div>

				{/* RIGHT: Stacked 3-Tier Codex Ledger */}
				<div className="lg:col-span-7 flex flex-col justify-between divide-y divide-surface-container-high/80 border-y border-surface-container-high/80">
					{PILLARS.map((p) => (
						<div
							key={p.num}
							className="py-6 sm:py-7 lg:py-8 flex flex-col gap-3 group transition-colors duration-200"
						>
							{/* Numeral + Title Row */}
							<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4">
								<div className="flex items-baseline gap-3">
									<span className="font-serif text-xl sm:text-2xl font-semibold text-tertiary tracking-tight shrink-0">
										{p.num}
									</span>
									<h3 className="font-serif text-lg sm:text-xl md:text-2xl font-medium text-primary tracking-wide uppercase">
										{p.title}{" "}
									</h3>
								</div>
								<span className="font-quran text-xs sm:text-sm text-on-surface-variant/60 dir-rtl text-right select-none">
									{p.arabic}
								</span>
							</div>

							{/* Expository Body Text */}
							<p className="font-sans text-sm sm:text-[15px] text-on-surface-variant leading-relaxed pl-7 sm:pl-9 font-normal">
								{p.desc}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* ─── BANNER: Deep Forest / Onyx with High-Contrast Brass / Ivory Accents ─── */}
			<div className="w-full relative overflow-hidden rounded-[20px] md:rounded-[24px] bg-[#00261a] border border-[#0f3d2e] shadow-[0_4px_24px_rgba(0,38,26,0.12)] p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 md:gap-8">
				{/* Background Atmospheric Lighting */}
				<div
					className="absolute -right-24 -top-24 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
					aria-hidden="true"
				/>
				<div
					className="absolute -left-20 -bottom-20 w-72 h-72 bg-primary-container/30 rounded-full blur-2xl pointer-events-none"
					aria-hidden="true"
				/>

				{/* Left Side: Fellowship Overline & Pitch */}
				<div className="relative z-10 flex flex-col gap-2 max-w-2xl">
					<h3 className="font-serif text-2xl sm:text-3xl font-medium text-brand-warm-white tracking-tight">
						Join the Circle
					</h3>

					<p className="font-sans text-xs sm:text-sm text-brand-warm-white/75 leading-relaxed mt-0.5">
						Join a dedicated fellowship convening regularly for
						deliberative critiques, research roundtables.
					</p>
				</div>

				{/* Right Side: High-Contrast Actions */}
				<div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 shrink-0">
					<Link
						href="/join"
						className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-brand-warm-white hover:bg-white text-primary rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group text-center"
					>
						<span>Apply for Cohort</span>
						<ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
					</Link>
					<Link
						href="/about"
						className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 text-brand-warm-white/80 hover:text-brand-warm-white text-xs font-semibold tracking-widest uppercase transition-colors text-center"
					>
						<span>Our Method</span>
						<ChevronRight className="w-3.5 h-3.5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
