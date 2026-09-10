import React from "react";

interface AyatBlockProps {
  arabic: string;
  translation: string;
  surah?: string;
  ayatNumber?: number | string;
}

export function AyatBlock({ arabic, translation, surah, ayatNumber }: AyatBlockProps) {
  return (
    <div className="my-space-lg p-space-lg rounded-[22px] bg-surface-container-low border border-tertiary-container/40 flex flex-col items-center text-center gap-space-sm shadow-sm relative overflow-hidden">
      {/* Decorative Gold Corner Marks */}
      <div className="absolute top-2 left-3 text-tertiary-container text-[12px] select-none">
        ♦
      </div>
      <div className="absolute top-2 right-3 text-tertiary-container text-[12px] select-none">
        ♦
      </div>

      {/* Quranic Arabic Script */}
      <p className="font-quran text-[24px] sm:text-[28px] text-primary font-medium leading-[2.2] dir-rtl select-text max-w-2xl px-space-xs">
        {arabic}
      </p>

      {/* English Translation */}
      <p className="font-serif italic text-on-surface text-[16px] sm:text-[17px] leading-relaxed max-w-xl text-secondary">
        “{translation}”
      </p>

      {/* Surah & Ayat Citation Tag */}
      {surah && (
        <span className="font-label-sm uppercase tracking-widest text-tertiary-container font-bold text-[11px] mt-1 border-t border-surface-container-high pt-space-xs px-space-md">
          {surah} {ayatNumber ? `[${ayatNumber}]` : ""}
        </span>
      )}
    </div>
  );
}
