import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <div className="w-full max-w-lg mx-auto px-gutter-mobile py-space-3xl flex flex-col items-center justify-center text-center gap-space-md min-h-[60vh]">
      <div className="w-16 h-16 rounded-full bg-surface-container-high border border-surface-container-highest flex items-center justify-center text-tertiary-container shadow-sm">
        <span className="material-symbols-outlined text-[32px]">menu_book</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className="font-label-sm uppercase tracking-widest text-secondary font-bold text-[11px]">
          Error 404 • Index Miss
        </span>
        <h1 className="font-display-lg text-[32px] sm:text-display-lg text-primary font-bold font-serif">
          Record Not Found
        </h1>
        <span className="font-urdu text-[18px] text-tertiary font-bold mt-1">
          یہ تحریر یا ورق آرکائیو میں موجود نہیں
        </span>
      </div>

      <p className="font-body-md text-on-surface-variant leading-relaxed max-w-sm">
        The manuscript or lecture folio you requested may have been reclassified or moved under a new title in the catalog.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-space-xs mt-space-xs">
        <Link
          href="/"
          className="px-space-md py-space-xs bg-primary text-on-primary rounded-full font-label-md uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm"
        >
          Return to Portal
        </Link>
        <Link
          href="/search"
          className="px-space-md py-space-xs bg-surface-container text-primary rounded-full font-label-md uppercase tracking-wider font-semibold hover:bg-surface-container-high transition-colors border border-surface-container-highest"
        >
          Search Archive
        </Link>
      </div>
    </div>
  );
}
