import React, { Suspense } from "react";
import {
	getPaginatedLectures,
	getCuratedStartHerePicks,
} from "@/lib/lectures/client";
import {
	LecturesHero,
	StartHereSection,
	LecturesViewContainer,
	LecturesSearchFilter,
	LecturesGrid,
} from "@/features/lectures";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Lectures & Discourses — The Academic Corpus",
	description:
		"An organized body of teaching across Quranic hermeneutics, prophetic statecraft, constitutional jurisprudence, and civilizational thought by Dr. Hafiz Haseeb.",
	canonicalUrl: "/lectures",
});

export const dynamic = "force-dynamic";

interface PageProps {
	searchParams: Promise<{
		category?: string;
		domain?: string;
		subCategory?: string;
		q?: string;
		page?: string;
		series?: string;
		coursework?: string;
	}>;
}

export default async function LecturesCatalogPage({ searchParams }: PageProps) {
	const resolvedParams = await searchParams;
	const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
	const category = resolvedParams.category;
	const domain = resolvedParams.domain;
	const subCategory = resolvedParams.subCategory;
	const query = resolvedParams.q;
	const seriesId = resolvedParams.series;
	const includeCoursework = resolvedParams.coursework === "true";

	// Fetch curated foundational masterclasses and paginated catalog in parallel
	const [curatedPicks, result] = await Promise.all([
		getCuratedStartHerePicks(),
		getPaginatedLectures({
			page,
			limit: 18,
			category,
			domain,
			subCategory,
			query,
			seriesId,
			includeCoursework,
		}),
	]);

	return (
		<div className="flex flex-col w-full bg-surface text-on-surface">
			{/* ZONE 1: Curated Foundations ("Where should I start?") */}
			{/* 1. Hero: Dignified Lockup */}
			<LecturesHero />

			{/* 2. Core Inquiries: 3 Hallmark Masterclasses ONLY (No 10-item list) */}
			<StartHereSection curatedPicks={curatedPicks.slice(0, 3)} />

			{/* ZONE 2: The Living Library ("Explore & Search the Holdings") */}
			{/* 3. The 324-Session Course Ribbon + Notes Drawer (Compact 1-row capsule) */}
			<LecturesViewContainer />

			{/* 4. Instant Search & Typographic Filter Rails */}
			<Suspense fallback={<div className="h-20" />}>
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
