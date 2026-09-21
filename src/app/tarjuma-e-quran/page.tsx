import React from "react";
import Link from "next/link";
import {
	getTarjumaEditions,
	getAllSurahsWithSessions,
} from "@/lib/lectures/tarjuma-quran";
import { getLisanUlQuranSessions } from "@/lib/lectures/lisan-ul-quran";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import { TarjumaCurriculumView } from "@/features/lectures";
import { BookOpen, Clock, FileText } from "lucide-react";

export const metadata = constructMetadata({
	title: "Tarjuma-e-Quran — دورۂ ترجمۂ قرآن",
	description:
		"Systematic verse-by-verse exegesis, linguistic tafsir across all 114 Surahs, and Lisan-ul-Quran Arabic grammar curriculum delivered by Dr. Hafiz Haseeb.",
	canonicalUrl: "/tarjuma-e-quran",
});

interface PageProps {
	searchParams: Promise<{ session?: string; view?: string }>;
}

export default async function TarjumaQuranCoursePage({
	searchParams,
}: PageProps) {
	const resolvedParams = await searchParams;
	const initialSessionSlug = resolvedParams?.session;
	const editions = getTarjumaEditions();
	const surahs = getAllSurahsWithSessions();
	const lisanSessions = getLisanUlQuranSessions();

	return (
		<div className="flex flex-col w-full bg-background text-on-surface pb-28 selection:bg-primary/20 selection:text-primary">
			{/* Course Structured Data */}
			<CourseJsonLd
				name="Tarjuma-e-Quran — دورۂ ترجمۂ قرآن"
				description="A systematic, verse-by-verse exegesis and thematic reflection across all 114 Surahs delivered by Dr. Hafiz Haseeb across annual Ramadan cycles."
				url={`${siteConfig.url}/tarjuma-e-quran`}
				numberOfLessons={114}
			/>

			{/* ================= COURSE HEADER: DOMINANT DEEP FOREST GREEN ANCHOR ================= */}
			<section className="relative w-full bg-[#0a2318] text-brand-warm-white pt-28 sm:pt-36 md:pt-40 pb-14 sm:pb-18 border-primary-container/60 overflow-hidden">
				{/* Classical Rub el Hizb (8-Point Star) Watermark Lattice */}
				<div
					className="absolute inset-0 opacity-[0.038] pointer-events-none"
					style={{
						backgroundImage:
							"url('/images/patterns/islamic-star.svg')",
						backgroundRepeat: "repeat",
						backgroundSize: "76px 76px",
					}}
					aria-hidden="true"
				/>

				{/* Ambient Golden Radial Halo */}
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(212,163,115,0.12),transparent_75%)] pointer-events-none" />

				<div className="relative z-10 w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">

					<div>
						<div className="flex sm:flex-row gap-20 justify-between">
							<h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-brand-warm-white font-normal leading-[1.12] tracking-tight">
								Tarjuma-e-Quran
							</h1>

							<h2 className="font-urdu text-3xl sm:text-6xl text-brand-gold font-bold dir-rtl block my-4 select-none drop-shadow-sm">
								دورۂ ترجمۂ قرآن
							</h2>
						</div>

						<p className="mt-5 text-sm sm:text-base text-brand-warm-white/85 leading-relaxed font-sans max-w-3xl">
							A systematic, verse-by-verse tafsir and thematic
							reflection across all 114 Surahs.
						</p>

						<div className="mt-8 flex flex-wrap items-center gap-6 text-xs font-sans text-brand-warm-white/70 pt-5 ">
							<div className="flex items-center gap-2">
								<BookOpen className="w-4 h-4 text-brand-gold shrink-0" />
								<span>All 114 Surahs</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-brand-gold shrink-0" />
								<span>Ramadan Cycles</span>
							</div>
							<Link
								href="/lectures/notes"
								className="flex items-center gap-2 font-medium hover:text-brand-warm-white transition-colors"
							>
								<FileText className="w-4 h-4 text-brand-gold shrink-0" />
								<span>Grammar Notes</span>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ================= INTERACTIVE CURRICULUM HUB (WARM CREAM PARCHMENT CANVAS) ================= */}
			<section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-10 sm:pt-12">
				<TarjumaCurriculumView
					editions={editions}
					surahs={surahs}
					lisanSessions={lisanSessions}
					initialSessionSlug={initialSessionSlug}
				/>
			</section>
		</div>
	);
}
