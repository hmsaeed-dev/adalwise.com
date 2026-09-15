import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Compass } from "lucide-react";
import { LectureItem } from "@/lib/lectures/types";
import { CuratedPick } from "@/lib/lectures/curated-picks";

export interface StartHereProps {
	curatedPicks?: CuratedPick[];
	lectures?: LectureItem[];
	onSelectLecture?: (lecture: CuratedPick | LectureItem) => void;
}

export function StartHereSection({ curatedPicks, lectures }: StartHereProps) {
	// Normalize items from either rich curated picks or raw lecture items
	const items: CuratedPick[] =
		curatedPicks && curatedPicks.length > 0
			? curatedPicks
			: (lectures || []).map((l) => ({
					id: l.id,
					youtubeId: l.youtubeId,
					slug: l.slug,
					title: l.title,
					urduTitle: l.urduTitle,
					domainId: l.domainId || l.category.toLowerCase(),
					domainTitle: l.category,
					durationFormatted: `${Math.floor(l.durationSeconds / 60)} mins`,
					durationSeconds: l.durationSeconds,
					thesisBlurb: l.summary || l.description,
			  }));

	const leadLecture = items[0];
	const spotlightTwo = items[1];
	const spotlightThree = items[2];

	return (
		<section className="w-full bg-surface text-on-surface py-12 sm:py-16 md:py-20 border-b border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 ">
					<div className="max-w-2xl">


						<h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary font-semibold leading-[1.18] tracking-tight">
							Start Here
						</h2>
						<p className="mt-2 font-serif italic text-sm sm:text-base text-secondary font-medium">
							Three foundational discourses establishing Dr. Haseeb’s methodology across constitutional covenant, prophetic statecraft, and philosophical critique.
						</p>
					</div>

					{/* Cross-Link to About Lineage */}
					<Link
						href="/about"
						className="shrink-0 inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest font-bold text-primary hover:text-secondary transition-colors group"
					>
						<span>Taught by</span>
						<span className="no-underline group-hover:underline">Dr. Hafiz Haseeb</span>
					</Link>
				</div>

				{/* ─── 3 HALLMARK MASTERCLASSES (Compact, High-Signal) ─── */}
				<div className="mt-8 flex flex-col gap-6">
					{/* 1. LEAD MASTERCLASS PLATE */}
					{leadLecture && (
						<Link
							href={`/lectures/${leadLecture.slug}`}
							className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#00261a] border border-[#0f3d2e] shadow-lg p-6 sm:p-10 text-brand-warm-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all hover:shadow-xl hover:border-brand-gold/40 duration-300"
						>
							<div
								aria-hidden="true"
								className="absolute -right-20 -top-20 w-80 h-80 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
							/>

							<div className="relative z-10 max-w-2xl flex flex-col items-start">


								<h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-brand-warm-white font-semibold leading-tight group-hover:text-brand-gold transition-colors">
									{leadLecture.title}
								</h3>

								{leadLecture.urduTitle && (
									<span className="font-urdu text-base sm:text-lg text-brand-gold font-bold dir-rtl mt-1.5">
										{leadLecture.urduTitle}
									</span>
								)}

								<p className="mt-3 font-sans text-xs sm:text-sm text-brand-warm-white/85 leading-relaxed max-w-xl">
									{leadLecture.thesisBlurb}
								</p>
							</div>

							<div className="relative z-10 shrink-0 self-end lg:self-center">
								<div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-brand-gold text-[#00261a] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
									<Play className="w-5 h-5 fill-current ml-0.5" />
								</div>
							</div>
						</Link>
					)}

					{/* 2. DUAL SECONDARY SPOTLIGHTS */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{spotlightTwo && (
							<Link
								href={`/lectures/${spotlightTwo.slug}`}
								className="group rounded-2xl bg-surface-container-low border border-surface-container-high p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-brand-gold/60 transition-all duration-200"
							>
								<div>
									<h4 className="font-serif text-xl text-primary font-semibold mt-2 group-hover:text-secondary transition-colors">
										{spotlightTwo.title}
									</h4>
									{spotlightTwo.urduTitle && (
										<span className="font-urdu text-sm text-tertiary font-bold dir-rtl block mt-1">
											{spotlightTwo.urduTitle}
										</span>
									)}
									<p className="mt-2.5 font-sans text-xs sm:text-sm text-[#121915] leading-relaxed line-clamp-3">
										{spotlightTwo.thesisBlurb}
									</p>
								</div>
								<div className="mt-5 pt-3 border-t border-surface-container-high flex items-center justify-between text-xs font-sans font-bold text-primary">
									<span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-secondary">
										<span>Listen Discourse</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</span>
								</div>
							</Link>
						)}

						{spotlightThree && (
							<Link
								href={`/lectures/${spotlightThree.slug}`}
								className="group rounded-2xl bg-surface-container-low border border-surface-container-high p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-brand-gold/60 transition-all duration-200"
							>
								<div>
									<h4 className="font-serif text-xl text-primary font-semibold mt-2 group-hover:text-secondary transition-colors">
										{spotlightThree.title}
									</h4>
									{spotlightThree.urduTitle && (
										<span className="font-urdu text-sm text-tertiary font-bold dir-rtl block mt-1">
											{spotlightThree.urduTitle}
										</span>
									)}
									<p className="mt-2.5 font-sans text-xs sm:text-sm text-[#121915] leading-relaxed line-clamp-3">
										{spotlightThree.thesisBlurb}
									</p>
								</div>
								<div className="mt-5 pt-3 border-t border-surface-container-high flex items-center justify-between text-xs font-sans font-bold text-primary">
									<span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-secondary">
										<span>Listen Discourse</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</span>
								</div>
							</Link>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
