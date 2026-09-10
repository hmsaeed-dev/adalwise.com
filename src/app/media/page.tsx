import React, { Suspense } from "react";
import { getPaginatedMedia } from "@/lib/media/client";
import { MediaHero, MediaSearchFilter, MediaGrid } from "@/features/media";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Lectures & Discourses — Archival Video Catalog",
  description:
    "Curated video catalog of classical Quranic exegesis, Usul al-Fiqh, and socio-political lectures by Dr. Hafiz Haseeb.",
  canonicalUrl: "/media",
});

interface PageProps {
  searchParams: Promise<{
    category?: string;
    q?: string;
    page?: string;
    series?: string;
  }>;
}

export default async function MediaCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const category = resolvedParams.category;
  const query = resolvedParams.q;
  const seriesId = resolvedParams.series;

  const result = await getPaginatedMedia({
    page,
    limit: 12,
    category,
    query,
    seriesId,
  });

  return (
    <div className="flex flex-col w-full pb-space-2xl">
      <MediaHero />

      <Suspense fallback={<div className="h-16" />}>
        <MediaSearchFilter />
      </Suspense>

      <MediaGrid
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
