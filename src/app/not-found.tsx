import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, Compass, Home, Search, Video } from "lucide-react";

export const metadata: Metadata = {
  title: "Record Not Found | Adlwise",
  description: "The requested manuscript, lecture, or page could not be located in the Adlwise archive.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="w-full max-w-xl mx-auto px-gutter-mobile py-space-3xl flex flex-col items-center justify-center text-center gap-space-lg min-h-[75vh]">
      <div className="flex flex-col gap-2 items-center">
        <span className="font-urdu text-3xl text-tertiary-container font-bold dir-rtl">
          عدمِ دستیابی
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-primary font-bold tracking-tight">
          Record Not Found
        </h1>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed max-w-md mt-1">
          The manuscript, lecture, or inquiry you requested may have been reclassified or moved under an updated reference title.
        </p>
      </div>

      {/* Suggested Directories */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-left">
        <Link
          href="/lectures"
          className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high flex items-center gap-3 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Video className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-xs font-bold text-primary">Lectures Library</span>
            <span className="text-[11px] text-on-surface-variant truncate">600+ recorded discourses</span>
          </div>
        </Link>

        <Link
          href="/twasi-al-haq"
          className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high flex items-center gap-3 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-xs font-bold text-primary">Twasi al-Haq</span>
            <span className="text-[11px] text-on-surface-variant truncate">Monographs &amp; treatises</span>
          </div>
        </Link>

        <Link
          href="/tarjuma-e-quran"
          className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high flex items-center gap-3 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-xs font-bold text-primary">Tarjuma-e-Quran</span>
            <span className="text-[11px] text-on-surface-variant truncate">114 Surahs curriculum</span>
          </div>
        </Link>

        <Link
          href="/search"
          className="p-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high flex items-center gap-3 transition-colors group"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-xs font-bold text-primary">Archive Search</span>
            <span className="text-[11px] text-on-surface-variant truncate">Keywords &amp; topics</span>
          </div>
        </Link>
      </div>

      <div className="pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-sans text-xs uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
