import React, { Suspense } from "react";
import {
	getCuratedStartHerePicks,
	getThematicArchiveLectures,
} from "@/lib/lectures/client";
import {
	LecturesHero,
	LecturesStatsStrip,
	IqbalGatewaySection,
	StartHereSection,
	CourseCurriculumRibbon,
	LecturesArchiveInteractive,
} from "@/features/lectures";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";

export const metadata = constructMetadata({
	title: "Lectures & Discourses",
	description:
		"An organized body of teaching across Quranic hermeneutics, prophetic statecraft, constitutional jurisprudence, and civilizational thought by Dr. Hafiz Haseeb.",
	canonicalUrl: "/lectures",
});

export const dynamic = "force-dynamic";

interface PageProps {
	searchParams: Promise<{
		category?: string;
		domain?: string;
		q?: string;
		page?: string;
		series?: string;
		format?: string;
		sort?: string;
	}>;
}

function LecturesSearchFilterSkeleton() {
	return (
		<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop mt-4 mb-4 flex flex-col gap-5">
			<div className="w-full h-[52px] bg-surface-container-low/80 border border-surface-container-high/60 rounded-2xl shadow-sm animate-pulse" />
			<div className="flex items-center gap-6 h-8 animate-pulse">
				<div className="w-12 h-4 bg-surface-container-high/80 rounded" />
				<div className="w-24 h-4 bg-surface-container-high/60 rounded" />
				<div className="w-28 h-4 bg-surface-container-high/60 rounded" />
				<div className="w-32 h-4 bg-surface-container-high/60 rounded" />
			</div>
		</div>
	);
}

export default async function LecturesCatalogPage({ searchParams }: PageProps) {
	const resolvedParams = await searchParams;

	// Fetch curated foundational masterclasses and the entire thematic holdings in parallel
	// The 324-session translation course is exclusively hosted in /tarjuma-e-quran
	const [curatedPicks, allThematicLectures] = await Promise.all([
		getCuratedStartHerePicks(),
		getThematicArchiveLectures(),
	]);

	return (
		<div className="flex flex-col w-full bg-surface text-on-surface">
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Lectures", url: `${siteConfig.url}/lectures` },
				]}
			/>
			{/* ZONE 1: Curated Foundations ("Where should I start?") */}
			{/* 1. Hero: Dignified Lockup */}
			<LecturesHero />

			{/* 2. Compact Statistics Strip */}
			<LecturesStatsStrip />

			{/* 3. Zero-Latency Interactive Archive (Search, Domain Rails, Format Chips, Multi-dimensional Sorting & Grid) */}
			<Suspense fallback={<LecturesSearchFilterSkeleton />}>
				<LecturesArchiveInteractive
					allLectures={allThematicLectures}
					initialParams={resolvedParams}
				/>
			</Suspense>

			{/* 4. Dedicated Iqbal Collection Gateway */}
			<IqbalGatewaySection />
		</div>
	);
}
