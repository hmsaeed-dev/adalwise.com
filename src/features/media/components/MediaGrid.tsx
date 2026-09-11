import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { MediaItem } from "@/lib/media/types";
import { MediaCard } from "./MediaCard";

interface MediaGridProps {
  items: MediaItem[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export function MediaGrid({
  items,
  total,
  page,
  totalPages,
  hasMore,
  searchParams = {},
}: MediaGridProps) {
  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      if (k !== "page" && typeof v === "string") {
        params.set(k, v);
      }
    });
    params.set("page", newPage.toString());
    return `/media?${params.toString()}`;
  };

  return (
    <section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-md flex flex-col gap-space-lg">
      <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
        <span className="font-label-md uppercase tracking-wider text-on-surface-variant font-bold text-[12px]">
          Showing {items.length} of {total} Lectures
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-space-3xl text-center flex flex-col items-center justify-center gap-space-xs">
          <SearchX className="w-12 h-12 text-on-surface-variant/40" />
          <h3 className="font-headline-md text-primary font-bold">
            No Lectures Found
          </h3>
          <p className="font-body-sm text-on-surface-variant max-w-sm">
            Adjust your search keywords or switch category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {items.map((media) => (
            <MediaCard key={media.slug} media={media} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <nav aria-label="Catalog pagination" className="flex flex-wrap items-center justify-center gap-2 sm:gap-space-sm pt-space-lg">
          {page > 1 ? (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-3 sm:px-space-md py-1.5 sm:py-space-xs bg-surface-container hover:bg-surface-container-high text-primary rounded-full text-[12px] sm:text-label-md uppercase tracking-wider font-semibold transition-colors border border-surface-container-highest flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </Link>
          ) : (
            <span className="px-3 sm:px-space-md py-1.5 sm:py-space-xs bg-surface-container/40 text-on-surface-variant/40 rounded-full text-[12px] sm:text-label-md uppercase tracking-wider font-semibold cursor-not-allowed border border-surface-container-highest/40 flex items-center gap-1 select-none">
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </span>
          )}

          <div className="flex items-center gap-1 text-[13px] font-semibold text-primary px-3 py-1 bg-surface-container-low rounded-full border border-surface-container-high">
            <span>Page</span>
            <span className="font-bold text-secondary">{page}</span>
            <span className="text-on-surface-variant/70">of</span>
            <span>{totalPages}</span>
          </div>

          {hasMore ? (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-3 sm:px-space-md py-1.5 sm:py-space-xs bg-primary text-on-primary hover:bg-primary-container rounded-full text-[12px] sm:text-label-md uppercase tracking-wider font-semibold transition-colors shadow-sm flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="px-3 sm:px-space-md py-1.5 sm:py-space-xs bg-surface-container/40 text-on-surface-variant/40 rounded-full text-[12px] sm:text-label-md uppercase tracking-wider font-semibold cursor-not-allowed border border-surface-container-highest/40 flex items-center gap-1 select-none">
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </nav>
      )}
    </section>
  );
}
