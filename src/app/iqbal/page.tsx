import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Sparkles } from "lucide-react";
import { getIqbalLectures } from "@/lib/lectures/client";
import { LecturesCard } from "@/features/lectures";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
	title: "Allama Iqbal — Reconstruction & Civilizational Revival",
	description:
		"A dedicated intellectual body of discourses on Allama Muhammad Iqbal's philosophy, Zarb-e-Kaleem, and the juristic reconstruction of religious thought (Ijtihad) delivered by Dr. Hafiz Haseeb.",
	canonicalUrl: "/iqbal",
});

export const dynamic = "force-static";

export default async function IqbalCollectionPage() {
	const lectures = await getIqbalLectures();

	// Calculate collection metrics
	const totalSeconds = lectures.reduce((acc, l) => acc + (l.durationSeconds || 0), 0);
	const totalHours = (totalSeconds / 3600).toFixed(1);

	return (
		<div className="flex flex-col w-full bg-surface text-on-surface pb-24">
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Lectures", url: `${siteConfig.url}/lectures` },
					{ name: "Allama Iqbal", url: `${siteConfig.url}/iqbal` },
				]}
			/>

			{/* ================= HERO SECTION: SCHOLARLY DEEP FOREST ================= */}
			<section className="relative w-full bg-[#081e14] text-brand-warm-white pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-18 overflow-hidden border-b border-[#183d2c]/60">
				{/* Ambient Islamic Star Pattern Lattice */}
				<div
					aria-hidden="true"
					className="absolute inset-0 opacity-[0.035] pointer-events-none"
					style={{
						backgroundImage: "url('/images/patterns/islamic-star.svg')",
						backgroundRepeat: "repeat",
						backgroundSize: "72px 72px",
					}}
				/>

				{/* Subtle Radial Glow */}
				<div
					aria-hidden="true"
					className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(184,142,63,0.14),transparent_75%)] pointer-events-none"
				/>

				<div className="relative z-10 w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col gap-6">
					{/* Navigation Backlink */}
					<nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-sans uppercase tracking-widest text-brand-warm-white/70">
						<Link
							href="/lectures"
							className="hover:text-brand-gold transition-colors inline-flex items-center gap-1.5"
						>
							<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
							<span>Lectures</span>
						</Link>
						<span aria-hidden="true" className="text-brand-warm-white/30">/</span>
						<span className="text-brand-gold font-semibold">Allama Iqbal</span>
					</nav>

					{/* Title & Identity Lockup */}
					<div className="flex flex-col gap-3 max-w-3xl">

						<div className="flex items-baseline gap-4 flex-wrap">
							<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-brand-warm-white tracking-tight leading-[1.12]">
								Allama Iqbal
							</h1>
							<span className="font-urdu text-2xl sm:text-3xl md:text-4xl text-brand-gold font-bold dir-rtl select-none">
								علامہ اقبال
							</span>
						</div>

						<p className="font-sans text-sm sm:text-base text-brand-warm-white/85 leading-relaxed font-normal mt-1 max-w-2xl">
							A dedicated body of thematic lectures examining the Reconstruction of Religious Thought,
							the imperative of <em>Ijtihad</em> (legal dynamism), and civilizational revival through
							analytical expositions of <em>Zarb-e-Kaleem</em> by Dr. Hafiz Haseeb.
						</p>
					</div>

					{/* Collection Metadata Strip */}
					<div className="flex items-center gap-4 sm:gap-6 flex-wrap pt-2 text-xs sm:text-sm font-sans text-brand-warm-white/75">
						<div className="flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-full border border-brand-gold/25">
							<BookOpen className="w-4 h-4 text-brand-gold" aria-hidden="true" />
							<span className="font-medium text-brand-warm-white">{lectures.length} Discourses</span>
						</div>
						<div className="flex items-center gap-2 bg-black/25 px-3.5 py-1.5 rounded-full border border-brand-gold/25">
							<Clock className="w-4 h-4 text-brand-gold" aria-hidden="true" />
							<span className="font-medium text-brand-warm-white">{totalHours} Hours of Analysis</span>
						</div>
					</div>
				</div>
			</section>

			{/* ================= MAIN COLLECTION GRID ================= */}
			<main className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-10 sm:pt-14 flex flex-col gap-8">
				{/* Section Header */}
				<div className="flex items-baseline justify-between flex-wrap gap-2 pb-3 border-b border-surface-container-high/70">
					<div className="flex flex-col gap-1">
						<h2 className="font-serif text-xl sm:text-2xl font-semibold text-primary">
							Thematic Discourses &amp; Seminars
						</h2>
						<p className="text-xs sm:text-sm text-on-surface-variant font-sans">
							Chronological archive of lectures on Zarb-e-Kaleem, Ijtihad, and Modernity
						</p>
					</div>
					<span className="font-urdu text-base sm:text-lg text-brand-gold font-bold dir-rtl">
						ضربِ کلیم و افکارِ اقبال
					</span>
				</div>

				{/* 3-Column Lecture Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{lectures.map((lec) => (
						<LecturesCard key={lec.slug} lectures={lec} />
					))}
				</div>
			</main>
		</div>
	);
}
