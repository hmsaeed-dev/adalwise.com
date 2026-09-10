import React, { Suspense } from "react";
import Link from "next/link";
import { Search, SearchX, ArrowRight } from "lucide-react";
import { searchService } from "@/lib/search/service";
import { constructMetadata } from "@/lib/seo/metadata";

export const metadata = constructMetadata({
  title: "Archive Search — Unified Intellectual Repository",
  description:
    "Unified search across Adalwise research treatises, lecture archives, Twasi al-Haq dispatches, and Majlis sessions.",
  canonicalUrl: "/search",
});

interface PageProps {
  searchParams: Promise<{
    q?: string;
    type?: "article" | "media" | "dispatch" | "majlis" | "all";
  }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const resolved = await searchParams;
  const query = resolved.q || "";
  const filterType = resolved.type || "all";

  const results = query
    ? await searchService.search(query, {
        type: filterType,
        limit: 30,
      })
    : [];

  return (
    <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg pb-space-3xl">
      {/* Search Header */}
      <div className="flex flex-col gap-space-xs text-center items-center">
        <span className="font-label-sm uppercase tracking-widest text-secondary font-bold text-[11px]">
          Unified Archive Search
        </span>
        <h1 className="font-display-lg text-[32px] sm:text-display-lg text-primary font-bold font-serif leading-tight">
          Search Intellectual Corpus
        </h1>
        <p className="font-body-sm text-on-surface-variant max-w-md leading-relaxed">
          Explore across 620+ lectures, constitutional treatises, and deliberative dispatches.
        </p>
      </div>

      {/* Search Input Form */}
      <form
        method="GET"
        action="/search"
        className="w-full max-w-2xl mx-auto flex items-center bg-surface-container-lowest p-2 rounded-full shadow-md border border-surface-container-high focus-within:ring-2 focus-within:ring-primary/20"
      >
        <Search className="w-5 h-5 text-outline ml-space-sm mr-space-xs shrink-0" />
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by topic, keyword, or classical Arabic/Urdu term..."
          className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm focus:outline-none"
        />
        <button
          type="submit"
          className="px-space-md py-2 bg-primary text-on-primary rounded-full font-label-sm uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm shrink-0"
        >
          Search
        </button>
      </form>

      {/* Results Filter Bar */}
      {query && (
        <div className="flex items-center justify-between border-b border-surface-container-high pb-space-xs">
          <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
            Found {results.length} results for “{query}”
          </span>
        </div>
      )}

      {/* Results List */}
      {query && results.length === 0 ? (
        <div className="py-space-2xl text-center flex flex-col items-center justify-center gap-space-xs">
          <SearchX className="w-12 h-12 text-on-surface-variant/40" />
          <h3 className="font-headline-md text-primary font-bold font-serif">
            No Records Found
          </h3>
          <p className="font-body-sm text-on-surface-variant max-w-sm">
            Try searching for broader terms like "Tafsir", "Constitution", "Madinah", or "Sovereignty".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {results.map((res) => {
            const typeLabels: Record<string, string> = {
              article: "Treatise",
              media: "Video Lecture",
              dispatch: "Twasi Dispatch",
              majlis: "Majlis Session",
            };

            return (
              <Link
                key={res.id}
                href={res.url}
                className="p-space-md rounded-[20px] bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container-high/60 flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col gap-space-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-label-sm uppercase tracking-wider text-secondary font-bold">
                      {typeLabels[res.type] || res.type} • {res.category}
                    </span>
                    {res.meta && (
                      <span className="text-on-surface-variant font-medium">
                        {res.meta}
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline-sm text-primary font-bold font-serif leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
                    {res.title}
                  </h3>

                  {res.urduTitle && (
                    <p className="font-urdu text-[13px] text-tertiary font-semibold dir-rtl text-right -mt-1">
                      {res.urduTitle}
                    </p>
                  )}

                  <p className="font-body-sm text-on-surface-variant line-clamp-2 mt-1">
                    {res.excerpt}
                  </p>
                </div>

                <div className="pt-space-xs mt-space-sm border-t border-surface-container-high flex items-center justify-between text-[11px] text-primary font-semibold">
                  <span>{res.date}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open {typeLabels[res.type] || "Record"}{" "}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
