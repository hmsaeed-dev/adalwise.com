import React from "react";

export default function ArticlesLoading() {
  return (
    <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg animate-pulse">
      <div className="h-10 w-48 bg-surface-container-high rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-[22px] overflow-hidden border border-surface-container-high p-space-md flex flex-col gap-space-sm"
          >
            <div className="w-full h-48 bg-surface-container-high rounded-xl" />
            <div className="h-5 w-3/4 bg-surface-container-high rounded mt-2" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-2/3 bg-surface-container-high rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
