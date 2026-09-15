import React, { Suspense } from "react";
import {
	getPaginatedLectures,
	getCuratedStartHerePicks,
} from "@/lib/lectures/client";
import {
	LecturesHero,
	LecturesIntro,
	StartHereSection,
	LecturesViewContainer,
	LecturesSearchFilter,
	LecturesGrid,
	RoutedElsewhereNote,
} from "@/features/lectures";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Lectures & Discourses — The Academic Corpus",
	description:
		"An organized body of teaching across Quranic hermeneutics, prophetic statecraft, constitutional jurisprudence, and civilizational thought by Dr. Hafiz Haseeb.",
	canonicalUrl: "/lectures",
});

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
			{/* 1. Hero: Dignified Lockup */}
			<LecturesHero />

			{/* 2. Editorial Intro: Matn/Hashiya Split with Domain Margin TOC */}
			<LecturesIntro />

			{/* 3. Start Here: Asymmetric Spotlight & Annotated Reading Ledger */}
			<StartHereSection curatedPicks={curatedPicks} />

			{/* 4. The Translation Course: Sequential 324-Session Module + Notes Drawer */}
			<LecturesViewContainer />

			{/* 5. Full Archive Search & Typographic Filter Rails */}
			<Suspense fallback={<div className="h-20" />}>
				<LecturesSearchFilter />
			</Suspense>

			{/* 6. High-Density Archive Grid & Pagination */}
			<LecturesGrid
				items={result.items}
				total={result.total}
				page={result.page}
				totalPages={result.totalPages}
				hasMore={result.hasMore}
				searchParams={resolvedParams}
			/>

			{/* 7. Routed-Elsewhere Note: Khutba-e-Jumma to Twasi al-Haq */}
			<RoutedElsewhereNote />
		</div>
	);
}
