import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, FileText } from "lucide-react";
import { STUDY_NOTES_REGISTRY } from "@/lib/lectures/notes-registry";

export function CourseCurriculumRibbon() {
	const notesCount = STUDY_NOTES_REGISTRY?.length ?? 0;

	return (
		<aside
			aria-label="Course curriculum ribbon"
			className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop mt-8 mb-4"
		>
			<div className="relative overflow-hidden rounded-2xl bg-surface-container-low border border-surface-container-high/80 p-4 sm:p-5 transition-all duration-300 hover:border-brand-gold/50 hover:shadow-md">
				{/* Subtle Decorative Gradient / Accent Line */}
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-gold via-brand-gold/60 to-transparent" />
				<div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-gold/5 blur-2xl" />

				<div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
					{/* Left Block: Icon & Copy */}
					<div className="flex items-start sm:items-center gap-3.5 min-w-0">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/95 text-brand-gold shadow-sm ring-1 ring-primary/10">
							<BookOpen className="h-5 w-5" aria-hidden="true" />
						</div>

						<div className="min-w-0 space-y-0.5">

							<h3 className="font-serif text-base sm:text-lg font-semibold tracking-tight text-primary truncate">
								Tarjuma-e-Quran
							</h3>

							<p className="font-sans text-xs text-on-surface-variant leading-relaxed line-clamp-1">
								Verse-by-verse linguistic exegesis paired with
								companion grammar infographics.
							</p>
						</div>
					</div>

					{/* Right Block: Action Buttons */}
					<div className="flex flex-wrap items-center gap-2.5 sm:self-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-surface-container-high/50">
						<Link
							href="/lectures/notes"
							className="inline-flex h-9 items-center gap-1.5 rounded-full border border-surface-container-high/90 bg-surface/50 px-3.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-surface-container hover:border-surface-container-highest active:scale-[0.98]"
						>
							<FileText
								className="h-3.5 w-3.5 text-secondary shrink-0"
								aria-hidden="true"
							/>
							<span>Notes</span>
						</Link>

						<Link
							href="/tarjuma-e-quran"
							className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-primary px-4 text-xs font-semibold text-brand-warm-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow active:scale-[0.98]"
						>
							<span>Syllabus</span>
							<ArrowRight
								className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
								aria-hidden="true"
							/>
						</Link>
					</div>
				</div>
			</div>
		</aside>
	);
}
