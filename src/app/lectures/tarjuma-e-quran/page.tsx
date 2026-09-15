import React from "react";
import Link from "next/link";
import { getTarjumaQuranLectures } from "@/lib/lectures/client";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { LecturesCard } from "@/features/lectures";
import { ArrowLeft, BookOpen, Clock, CheckCircle } from "lucide-react";

export const metadata = constructMetadata({
	title: "Tarjuma-e-Quran — Complete 324-Session Course",
	description:
		"The monumental 324-session verse-by-verse translation and linguistic exegesis of the entire Holy Quran by Dr. Hafiz Haseeb.",
	canonicalUrl: "/lectures/tarjuma-e-quran",
});

export default async function TarjumaQuranCoursePage() {
	const lectures = await getTarjumaQuranLectures();

	return (
		<div className="flex flex-col w-full bg-surface text-on-surface pb-24">
			{/* Breadcrumb Schema */}
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: "https://adlwise.com" },
					{ name: "Lectures", url: "https://adlwise.com/lectures" },
					{
						name: "Tarjuma-e-Quran",
						url: "https://adlwise.com/lectures/tarjuma-e-quran",
					},
				]}
			/>

			{/* Course Header Banner */}
			<section className="relative w-full bg-[#0a2318] text-brand-warm-white pt-28 sm:pt-36 md:pt-40 pb-16 sm:pb-20 border-b border-primary-container/60">
				<div className="relative z-10 w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
					<div className="max-w-3xl">
						{/* Back to Lectures Hub */}
						<Link
							href="/lectures"
							className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-widest text-brand-gold hover:underline mb-6 group"
						>
							<ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
							<span>Back</span>
						</Link>

						<h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-brand-warm-white font-normal leading-[1.12] tracking-tight">
							Tarjuma-e-Quran
						</h1>

						<span className="font-urdu text-3xl sm:text-4xl text-brand-gold font-bold dir-rtl block mt-3">
							دورۂ ترجمۂ قرآن
						</span>

						<p className="mt-5 text-sm sm:text-base text-brand-warm-white/85 leading-relaxed">
							A verse-by-verse linguistic exegesis and thematic study of all 114 Surahs delivered by Dr. Hafiz Haseeb. Structured to provide students and independent learners with unmediated, rigorous access to the Quranic text.
						</p>

						<div className="mt-6 flex flex-wrap items-center gap-6 text-xs font-sans text-brand-warm-white/70 pt-4 border-t border-white/10">
							<div className="flex items-center gap-2">
								<BookOpen className="w-4 h-4 text-brand-gold" />
								<span>All 114 Surahs (Surah Al-Fatiha to An-Nas)</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-brand-gold" />
								<span>320+ Hours of Audio &amp; Video</span>
							</div>
							<div className="flex items-center gap-2">
								<CheckCircle className="w-4 h-4 text-brand-gold" />
								<span>Lisan-ul-Quran Grammar Notes</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Course Syllabus & Catalog Grid */}
			<section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-12">
				<div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 border-b border-surface-container-high gap-4 mb-8">
					<div>
						<h2 className="font-serif text-2xl sm:text-3xl text-primary font-semibold">
							Course Sessions &amp; Recordings
						</h2>
						<p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1">
							Showing {lectures.length} recorded sessions in sequential order
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{lectures.map((lecture) => (
						<LecturesCard key={lecture.slug} lectures={lecture} />
					))}
				</div>
			</section>
		</div>
	);
}
