import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Compass, BookOpen } from "lucide-react";
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
	const remainingCurated = items.slice(3, 10);

	return (
		<section className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-24 border-b border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Section Header with Stamped Mohar Seal */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 ">
					<div className="max-w-2xl">
						<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-semibold leading-[1.18] tracking-tight">
							Start Here
						</h2>
						<p className="mt-3 font-serif italic text-base sm:text-lg text-secondary font-medium">
							Ten foundational discourses offering an immediate
							entry point into Dr. Haseeb’s methodology across
							revelation, governance, and philosophy.
						</p>
					</div>
				</div>

				{/* ─── ASYMMETRIC SPOTLIGHT (Anti-YouTube Look) ─── */}
				<div className="mt-12 flex flex-col gap-10">
					{/* 1. LEAD MASTERCLASS PLATE (Full-width High-Contrast Architectural Banner) */}
					{leadLecture && (
						<Link
							href={`/lectures/${leadLecture.slug}`}
							className="group relative rounded-3xl overflow-hidden bg-[#00261a] border border-[#0f3d2e] shadow-xl p-8 sm:p-12 text-brand-warm-white flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-transform hover:-translate-y-0.5 duration-300"
						>
							<div
								aria-hidden="true"
								className="absolute -right-20 -top-20 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
							/>

							<div className="relative z-10 max-w-2xl flex flex-col items-start">
								<h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-warm-white font-semibold leading-tight group-hover:text-brand-gold transition-colors">
									{leadLecture.title}
								</h3>

								{leadLecture.urduTitle && (
									<span className="font-urdu text-xl text-brand-gold font-bold dir-rtl mt-2">
										{leadLecture.urduTitle}
									</span>
								)}

								<p className="mt-4 font-sans text-sm text-brand-warm-white/85 leading-relaxed max-w-xl">
									{leadLecture.thesisBlurb}
								</p>
							</div>

							<div className="relative z-10 shrink-0 flex items-center justify-center">
								<div className="w-16 h-16 rounded-full bg-brand-gold text-[#00261a] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
									<Play className="w-6 h-6 fill-current ml-1" />
								</div>
							</div>
						</Link>
					)}

					{/* 2. DUAL SECONDARY SPOTLIGHTS */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{spotlightTwo && (
							<Link
								href={`/lectures/${spotlightTwo.slug}`}
								className="group rounded-2xl bg-surface-container-low border border-surface-container-high p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-brand-gold/60 transition-all duration-200"
							>
								<div>
									<h4 className="font-serif text-2xl text-primary font-semibold mt-3 group-hover:text-secondary transition-colors">
										{spotlightTwo.title}
									</h4>
									{spotlightTwo.urduTitle && (
										<span className="font-urdu text-base text-tertiary font-bold dir-rtl block mt-1">
											{spotlightTwo.urduTitle}
										</span>
									)}
									<p className="mt-3 font-sans text-sm text-[#121915] leading-relaxed">
										{spotlightTwo.thesisBlurb}
									</p>
								</div>
								<div className="mt-6 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-sans font-bold text-primary">
									<span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-secondary">
										<span>Listen Now</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</span>
								</div>
							</Link>
						)}

						{spotlightThree && (
							<Link
								href={`/lectures/${spotlightThree.slug}`}
								className="group rounded-2xl bg-surface-container-low border border-surface-container-high p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-brand-gold/60 transition-all duration-200"
							>
								<div>
									<h4 className="font-serif text-2xl text-primary font-semibold mt-3 group-hover:text-secondary transition-colors">
										{spotlightThree.title}
									</h4>
									{spotlightThree.urduTitle && (
										<span className="font-urdu text-base text-tertiary font-bold dir-rtl block mt-1">
											{spotlightThree.urduTitle}
										</span>
									)}
									<p className="mt-3 font-sans text-sm text-[#121915] leading-relaxed">
										{spotlightThree.thesisBlurb}
									</p>
								</div>
								<div className="mt-6 pt-4 border-t border-surface-container-high flex items-center justify-between text-xs font-sans font-bold text-primary">
									<span className="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-secondary">
										<span>Listen Now</span>
										<ArrowRight className="w-3.5 h-3.5" />
									</span>
								</div>
							</Link>
						)}
					</div>

					{/* 3. ANNOTATED READING & LISTENING LEDGER (Remaining Essential Picks) */}
					{remainingCurated.length > 0 && (
						<div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-surface-container-high">
							<div className="flex items-center justify-between pb-4 border-b border-surface-container-high mb-4">
								<span className="font-sans text-xs uppercase tracking-[0.2em] font-bold text-secondary">
									Essential Thematic Shortlist
								</span>
								<span className="font-sans text-xs text-on-surface-variant font-medium">
									{remainingCurated.length} Additional Core
									Talks
								</span>
							</div>

							<div className="divide-y divide-surface-container-high/60">
								{remainingCurated.map((item, idx) => (
									<Link
										key={item.id}
										href={`/lectures/${item.slug}`}
										className="py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-6 group hover:bg-surface-container-lowest/60 px-3 -mx-3 rounded-lg transition-colors"
									>
										<div className="flex items-baseline gap-3 flex-1 min-w-0">
											<span className="font-serif text-xs font-bold text-secondary shrink-0">
												0{idx + 4}
											</span>
											<div className="flex-1">
												<h5 className="font-serif text-lg font-semibold text-primary group-hover:text-secondary transition-colors">
													{item.title}
												</h5>
												{item.urduTitle && (
													<span className="font-urdu text-sm text-tertiary font-bold dir-rtl block mt-0.5">
														{item.urduTitle}
													</span>
												)}
												<p className="mt-1 font-sans text-xs text-on-surface-variant/90 line-clamp-1">
													{item.thesisBlurb}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-4 text-xs font-sans shrink-0 self-end sm:self-auto">
											<span className="font-semibold text-secondary uppercase tracking-wider text-[11px]">
												{item.domainTitle}
											</span>
											<span className="text-on-surface-variant">
												{item.durationFormatted}
											</span>
											<ArrowRight className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
										</div>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
