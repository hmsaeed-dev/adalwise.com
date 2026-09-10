import React from "react";

export default function MediaLoading() {
  return (
    <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg animate-pulse">
      {/* Search Skeleton */}
      <div className="h-12 w-full max-w-2xl mx-auto bg-surface-container-high rounded-full" />
      {/* Category Pills Skeleton */}
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 w-24 bg-surface-container-high rounded-full" />
        ))}
      </div>
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md mt-space-md">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[22px] overflow-hidden border border-surface-container-high p-space-sm flex flex-col gap-space-xs"
          >
            <div className="w-full aspect-video bg-surface-container-high rounded-xl" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded mt-2" />
            <div className="h-3 w-1/2 bg-surface-container-high rounded" />
            <div className="h-10 w-full bg-surface-container-high rounded mt-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
