import React, { Suspense } from "react";
import {
	getPaginatedLectures,
	getCuratedStartHerePicks,
} from "@/lib/lectures/client";
import {
	LecturesHero,
	StartHereSection,
	CourseCurriculumRibbon,
	LecturesSearchFilter,
	LecturesGrid,
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
	const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
	const category = resolvedParams.category;
	const domain = resolvedParams.domain;
	const query = resolvedParams.q;
	const seriesId = resolvedParams.series;

	// Fetch curated foundational masterclasses and paginated catalog in parallel
	// The 324-session translation course is exclusively hosted in /lectures/tarjuma-e-quran
	const [curatedPicks, result] = await Promise.all([
		getCuratedStartHerePicks(),
		getPaginatedLectures({
			page,
			limit: 18,
			category,
			domain,
			query,
			seriesId,
			includeCoursework: false,
		}),
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

			{/* 2. Core Inquiries: 3 Hallmark Masterclasses ONLY (No 10-item list) */}
			<StartHereSection curatedPicks={curatedPicks.slice(0, 3)} />

			{/* ZONE 2: The Living Library ("Explore & Search the Holdings") */}
			{/* 3. The 324-Session Course Ribbon (Compact 1-row capsule) */}
			<CourseCurriculumRibbon />

			{/* 4. Instant Search & Typographic Filter Rails */}
			<Suspense fallback={<LecturesSearchFilterSkeleton />}>
				<LecturesSearchFilter />
			</Suspense>

			{/* 5. Holdings Grid & Colophon */}
			<LecturesGrid
				items={result.items}
				total={result.total}
				page={result.page}
				totalPages={result.totalPages}
				hasMore={result.hasMore}
				searchParams={resolvedParams}
			/>
		</div>
	);
}
