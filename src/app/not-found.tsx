import React from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="w-full max-w-lg mx-auto px-gutter-mobile py-space-3xl flex flex-col items-center justify-center text-center gap-space-xl min-h-[80vh]">

      <div className="flex flex-col gap-1">
        <h1 className="font-display-lg text-[32px] sm:text-display-lg text-primary font-bold">
          Record Not Found
        </h1>
      </div>

      <p className="font-body-md text-on-surface-variant leading-relaxed max-w-sm">
        The manuscript or lecture you requested may have been moved under a new title.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-space-xs mt-space-xs">
        <Link
          href="/"
          className="px-space-md py-space-xs bg-primary text-on-primary rounded-full font-label-md uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm"
        >
          Try Again
        </Link>
        <Link
          href="/search"
          className="px-space-md py-space-xs bg-surface-container text-primary rounded-full font-label-md uppercase tracking-wider font-semibold hover:bg-surface-container-high transition-colors border border-surface-container-highest"
        >
          Search Lectures
        </Link>
      </div>
    </div>
  );
}
