import React from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
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

	return (
		<section className="w-full bg-surface text-on-surface py-12 sm:py-16 md:py-20  border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Section Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 ">
					<div className="max-w-2xl">
						<h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-primary font-semibold leading-[1.18] tracking-tight">
							Start Here
						</h2>
					</div>

					{/* Cross-Link to About Lineage */}
					<Link
						href="/about"
						className="shrink-0 inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest font-bold text-primary hover:text-secondary transition-colors group"
					>
						<span>Taught by</span>
						<span className="no-underline group-hover:underline">
							Dr. Hafiz Haseeb
						</span>
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
								<h3 className="font-serif text-xl sm:text-2xl lg:text-3xl text-brand-warm-white font-semibold leading-tight transition-colors">
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
				</div>
			</div>
		</section>
	);
}
