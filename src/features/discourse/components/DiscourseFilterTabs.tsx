"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DiscourseFilterTabsProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export function DiscourseFilterTabs({
  categories,
  activeCategory,
  onSelectCategory,
}: DiscourseFilterTabsProps) {
  return (
    <div className="flex items-center gap-space-xs overflow-x-auto py-1 -mx-gutter-mobile px-gutter-mobile md:mx-0 md:px-0 no-scrollbar">
      {categories.map((cat) => {
        const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={cn(
              "shrink-0 px-space-md py-1.5 font-label-sm text-label-sm uppercase tracking-wider rounded-full transition-all font-semibold select-none",
              isActive
                ? "bg-primary-container text-surface shadow-sm"
                : "bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high border border-surface-container-highest"
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
