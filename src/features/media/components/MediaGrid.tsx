import React from "react";
import Link from "next/link";
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
        <span className="font-label-sm text-on-surface-variant">
          Page {page} of {totalPages}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="py-space-3xl text-center flex flex-col items-center justify-center gap-space-xs">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">
            search_off
          </span>
          <h3 className="font-headline-md text-primary font-bold font-serif">
            No Lectures Found
          </h3>
          <p className="font-body-sm text-on-surface-variant max-w-sm">
            Try adjusting your search keywords or switching category filters.
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
        <div className="flex items-center justify-center gap-space-sm pt-space-md">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-space-md py-space-xs bg-surface-container hover:bg-surface-container-high text-primary rounded-full font-label-md uppercase tracking-wider font-semibold transition-colors border border-surface-container-highest flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Previous</span>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === page;
              return (
                <Link
                  key={p}
                  href={buildPageUrl(p)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-label-md font-semibold transition-colors ${
                    isCurrent
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>

          {hasMore && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-space-md py-space-xs bg-primary text-on-primary hover:bg-primary-container rounded-full font-label-md uppercase tracking-wider font-semibold transition-colors shadow-sm flex items-center gap-1"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
