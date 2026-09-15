import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { siteConfig } from "@/config/site";

export function MoharClose() {
	return (
		<section className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-24">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* ─── GROUNDED CLOSURE CONTAINER (High-Contrast Archival Sanctuary) ─── */}
				<div className="w-full relative overflow-hidden rounded-3xl bg-[#00261a] border border-[#0f3d2e] shadow-2xl p-8 sm:p-12 md:p-16 text-brand-warm-white flex flex-col gap-10">
					{/* Ambient Atmospheric Glow */}
					<div
						aria-hidden="true"
						className="absolute -right-20 -top-20 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none"
					/>
					<div
						aria-hidden="true"
						className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary-container/40 rounded-full blur-2xl pointer-events-none"
					/>

					{/* Top Lockup: Mohar Seal & Classical Colophon Inscription */}
					<div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-12 pb-10 border-b border-white/15">
						{/* Inked Mohar Seal Crest */}
						<div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0a2318] border-2 border-brand-gold/40 flex items-center justify-center p-3.5 shadow-2xl shrink-0">
							<Image
								src="/images/assets/mountain-mark.svg"
								alt="Adalwise Mohar Seal"
								width={64}
								height={64}
								className="w-full h-full object-contain filter invert opacity-90"
							/>
						</div>

						{/* Inscription & Provenance */}
						<div className="flex-1 flex flex-col">


							<p className="font-quran text-2xl sm:text-3xl lg:text-4xl text-brand-gold font-medium leading-relaxed dir-rtl text-right md:text-left">
								بِالْعَدْلِ قَامَتِ السَّمَاوَاتُ وَالأَرْضُ
							</p>

							<p className="font-serif italic text-base sm:text-lg text-brand-warm-white/90 mt-1 font-normal">
								“By justice the heavens and the earth are established.”
							</p>
						</div>
					</div>

					{/* Bottom Action Bridge: Definitive Next Steps */}
					<div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
						<div>
							<h4 className="font-serif text-xl sm:text-2xl text-brand-warm-white font-semibold">
								Continue the Inquiry
							</h4>
							<p className="font-sans text-xs sm:text-sm text-brand-warm-white/75 mt-1 max-w-lg leading-relaxed">
								Engage with Dr. Haseeb’s systematic Quranic lectures or join the research
								fellowship for structured textual study.
							</p>
						</div>

						{/* High-Contrast Interactive Buttons */}
						<div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
							<Link
								href="/lectures"
								className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-brand-gold hover:bg-[#c99e4c] text-[#00261a] text-xs font-bold uppercase tracking-widest transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 group"
							>
								<span>Explore Lectures</span>
								<ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
							</Link>

							<Link
								href="/join"
								className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-brand-warm-white border border-white/20 text-xs font-bold uppercase tracking-widest transition-all duration-200"
							>
								<BookOpen className="w-4 h-4 text-brand-gold" />
								<span>Join Fellowship</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
