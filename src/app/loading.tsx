import React from "react";

export default function GlobalLoading() {
  return (
    <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-3xl flex flex-col items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-space-md animate-pulse">
        <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-primary-container">
          <span className="material-symbols-outlined text-[24px] animate-spin">
            progress_activity
          </span>
        </div>
        <div className="h-4 w-40 bg-surface-container-highest rounded-full" />
        <div className="h-3 w-28 bg-surface-container-high rounded-full" />
      </div>
    </div>
  );
}
