import React, { Suspense } from "react";
import { getPaginatedlectures } from "@/lib/lectures/client";
import {
	LecturesHero,
	LecturesSearchFilter,
	LecturesGrid,
} from "@/features/lectures";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
	title: "Lectures & Live Streams",
	description:
		"Video catalog of classical Quran tafsir and socio-political lectures by Dr. Hafiz Haseeb.",
	canonicalUrl: "/lectures",
});

interface PageProps {
	searchParams: Promise<{
		category?: string;
		q?: string;
		page?: string;
		series?: string;
	}>;
}

export default async function lecturesCatalogPage({ searchParams }: PageProps) {
	const resolvedParams = await searchParams;
	const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
	const category = resolvedParams.category;
	const query = resolvedParams.q;
	const seriesId = resolvedParams.series;

	const result = await getPaginatedlectures({
		page,
		limit: 12,
		category,
		query,
		seriesId,
	});

	return (
		<div className="flex flex-col w-full pb-space-2xl">
			<LecturesHero />

			<Suspense fallback={<div className="h-16" />}>
				<LecturesSearchFilter />
			</Suspense>

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
