import React from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, FileText } from "lucide-react";
import { STUDY_NOTES_REGISTRY } from "@/lib/lectures/notes-registry";

interface CourseCurriculumRibbonProps {
	onOpenNotes?: () => void;
}

export function CourseCurriculumRibbon({ onOpenNotes }: CourseCurriculumRibbonProps) {
	return (
		<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop mt-8 mb-2">
			<div className="rounded-2xl bg-surface-container-low border border-surface-container-high/90 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:border-brand-gold/40 transition-colors">
				<div className="flex items-start sm:items-center gap-3.5 min-w-0">
					<div className="w-10 h-10 rounded-xl bg-primary text-brand-warm-white flex items-center justify-center shrink-0 shadow-sm">
						<BookOpen className="w-5 h-5 text-brand-gold" />
					</div>

					<div className="min-w-0">

						<h3 className="font-serif text-base sm:text-lg font-semibold text-primary truncate">
							Tarjuma-e-Quran
						</h3>

						<p className="font-sans text-xs text-on-surface-variant line-clamp-1">
							Verse-by-verse linguistic exegesis across all 114 Surahs paired with companion grammar infographics.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
					<Link
						href="/lectures/notes"
						className="px-3.5 py-1.5 rounded-full border border-surface-container-high text-primary hover:bg-surface-container text-xs font-bold font-sans uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
					>
						<FileText className="w-3.5 h-3.5 text-secondary" />
						<span>Notes &amp; Charts ({STUDY_NOTES_REGISTRY.length})</span>
					</Link>

					<Link
						href="/lectures/tarjuma-e-quran"
						className="px-4 py-1.5 rounded-full bg-primary text-brand-warm-white hover:bg-primary-container text-xs font-bold font-sans uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm group"
					>
						<span>Full Syllabus</span>
						<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</div>
			</div>
		</div>
	);
}
