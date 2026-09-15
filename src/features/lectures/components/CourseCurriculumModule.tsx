import React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle, ArrowRight, FileText } from "lucide-react";

interface CourseCurriculumModuleProps {
	onOpenNotes?: () => void;
}

const MILESTONES = [
	{
		phase: "Phase I · Sessions 001–050",
		title: "Foundations of Covenant & Law",
		surahs: "Surah Al-Fatiha to Surah Al-Baqarah",
		urdu: "فاتحہ اور بقرہ: ایمانیات و احکامِ شریعت",
		desc: "Linguistic roots of Hidayah, covenantal ethics, legal ordinances, and societal stewardship.",
	},
	{
		phase: "Phase II · Sessions 051–150",
		title: "Prophetic Struggles & Moral Statehood",
		surahs: "Surah Al-Imran to Surah Al-Kahf",
		urdu: "آلِ عمران تا کہف: جہد و صبر، آزمائش اور نظام",
		desc: "Juristic extraction of Maslahah, warfare ethics, the Battle of Uhud, and historical parables.",
	},
	{
		phase: "Phase III · Sessions 151–250",
		title: "Spiritual Metaphysics & Monotheism",
		surahs: "Surah Maryam to Surah Ya-Sin",
		urdu: "مریم تا یٰسین: کائنات، معرفت اور دعوت",
		desc: "Prophetic lineage, divine signs in creation, resurrection, and internalizing Tawheed.",
	},
	{
		phase: "Phase IV · Sessions 251–324",
		title: "Eschatology & The Closing Maxims",
		surahs: "Surah As-Saffat to Surah An-Nas",
		urdu: "صافات تا الناس: فہمِ آخرت اور قرآنی اختتام",
		desc: "The Short Surahs (Mufassal), moral accountability, socio-political decadence, and divine protection.",
	},
];

export function CourseCurriculumModule({ onOpenNotes }: CourseCurriculumModuleProps) {
	return (
		<section className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-24 border-b border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Curriculum Masthead */}
				<div className="max-w-3xl mb-12">

					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-semibold leading-[1.18] tracking-tight">
						Systematic Study of Revelation
					</h2>
					<p className="mt-3 font-serif italic text-base sm:text-lg text-secondary max-w-2xl font-medium">
						Verse-by-verse linguistic exegesis and thematic reflection across all 114 Surahs—designed to be studied sequentially from beginning to end.
					</p>
				</div>

				{/* Sequential Curriculum Ledger (Not a Video Grid) */}
				<div className="rounded-3xl bg-surface-container-low border border-surface-container-high p-8 sm:p-10 md:p-12 shadow-sm">
					{/* Progress Indicator Header */}
					<div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-surface-container-high gap-4">
						<div>
							<span className="font-sans text-xs uppercase tracking-wider font-bold text-primary block">
								Curriculum Track: 4 Progressive Stages
							</span>
							<p className="font-sans text-xs text-on-surface-variant mt-0.5">
								Structured chronologically by Quranic order from Surah 001 to Surah 114
							</p>
						</div>

						<div className="flex items-center gap-2 text-xs font-sans font-bold text-secondary">
							<CheckCircle className="w-4 h-4 text-brand-gold" />
							<span>Complete Canon Verified (324 Hours)</span>
						</div>
					</div>

					{/* 4-Stage Sequential Milestones */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-8 divide-y md:divide-y-0 md:divide-x divide-surface-container-high">
						{MILESTONES.map((m, idx) => (
							<div
								key={m.phase}
								className={`flex flex-col justify-between pt-6 md:pt-0 ${idx > 0 ? "md:pl-6" : ""}`}
							>
								<div>
									<span className="font-sans text-[11px] uppercase tracking-wider font-bold text-secondary block">
										{m.phase}
									</span>
									<h4 className="font-serif text-xl font-semibold text-primary mt-2">
										{m.title}
									</h4>
									<span className="font-urdu text-sm text-tertiary font-bold dir-rtl block mt-1">
										{m.urdu}
									</span>
									<p className="font-sans text-xs font-semibold text-primary/80 mt-2">
										{m.surahs}
									</p>
									<p className="mt-2 font-sans text-xs text-[#121915] leading-relaxed">
										{m.desc}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Companion Study Materials Integration Banner */}
					<div className="mt-8 pt-8 border-t border-surface-container-high flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-surface-container-lowest/80 p-6 rounded-2xl border border-surface-container-high/60">
						<div className="flex items-start gap-4">
							<div className="w-10 h-10 rounded-xl bg-primary text-brand-warm-white flex items-center justify-center shrink-0 shadow-sm">
								<FileText className="w-5 h-5 text-brand-gold" />
							</div>
							<div>
								<h5 className="font-serif text-lg font-semibold text-primary">
									Includes 17 Lisan-ul-Quran Study Sheets &amp; Morphology Charts
								</h5>
								<p className="font-sans text-xs text-on-surface-variant mt-0.5 leading-relaxed max-w-xl">
									Companion visual infographics covering Arabic grammar rules, possessive compounds
									(<em>Murakkab-e-Izafi</em>), verb conjugation, and sentence syntax are paired with
									the curriculum.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-3 shrink-0">
							{onOpenNotes && (
								<button
									type="button"
									onClick={onOpenNotes}
									className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-high text-xs font-bold uppercase tracking-wider transition-colors"
								>
									<span>View Grammar Charts</span>
								</button>
							)}

							<Link
								href="/lectures/tarjuma-e-quran"
								className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-container text-brand-warm-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md group"
							>
								<span>Open 324-Session Syllabus</span>
								<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
