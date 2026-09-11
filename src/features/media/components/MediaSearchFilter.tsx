"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCount {
  label: string;
  value: string;
  count: number;
}

const CATEGORIES_WITH_COUNTS: CategoryCount[] = [
  { label: "All", value: "all", count: 624 },
  { label: "Tafsir", value: "Tafsir", count: 186 },
  { label: "Seerat", value: "Seerat", count: 142 },
  { label: "Socio-Political", value: "Socio-Political", count: 114 },
  { label: "Constitutional Law", value: "Constitutional Law", count: 88 },
  { label: "Usul al-Fiqh", value: "Usul al-Fiqh", count: 94 },
];

export function MediaSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategory = searchParams.get("category") || "all";
  const currentQuery = searchParams.get("q") || "";

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("q", val);
    } else {
      params.delete("q");
    }
    params.set("page", "1");
    router.replace(`/media?${params.toString()}`);
  };

  const handleCategorySelect = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("category");
    } else {
      params.set("category", val);
    }
    params.set("page", "1");
    router.replace(`/media?${params.toString()}`);
  };

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.replace(`/media?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop pt-space-md flex flex-col gap-space-md">
      {/* Search Input Bar */}
      <div className="w-full relative">
        <div className="flex items-center bg-surface-container-lowest/90 backdrop-blur-md px-space-md py-space-sm rounded-[1.25rem] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-surface-container-high focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Search className="w-4 h-4 text-outline mr-space-xs shrink-0" />
          <input
            type="text"
            value={currentQuery}
            onChange={handleSearchChange}
            placeholder="Search surahs, topics..."
            className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm focus:outline-none"
          />
          {currentQuery && (
            <button
              type="button"
              onClick={clearSearch}
              title="Clear search"
              className="p-1 text-on-surface-variant hover:text-primary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Filter Pills */}
      <div className="-mx-gutter-mobile px-gutter-mobile md:mx-0 md:px-0 flex items-center gap-space-xs overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES_WITH_COUNTS.map((cat) => {
          const isActive =
            currentCategory.toLowerCase() === cat.value.toLowerCase();

          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => handleCategorySelect(cat.value)}
              className={cn(
                "shrink-0 px-space-sm py-1 rounded-full font-label-md text-[12px] transition-all font-semibold select-none",
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container/70 text-on-surface-variant hover:text-primary hover:bg-surface-container border border-surface-container-highest"
              )}
            >
              {cat.label} ({cat.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
