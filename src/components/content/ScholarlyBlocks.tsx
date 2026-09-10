import React from "react";

interface UrduVerseProps {
  misra1: string;
  misra2?: string;
  poet?: string;
}

export function UrduVerse({ misra1, misra2, poet }: UrduVerseProps) {
  return (
    <div className="my-space-md p-space-md rounded-2xl bg-surface-container-low/70 border border-secondary-container/50 flex flex-col items-center text-center gap-1">
      <p className="font-urdu text-[20px] sm:text-[22px] text-secondary font-bold leading-[2.3] dir-rtl">
        {misra1}
      </p>
      {misra2 && (
        <p className="font-urdu text-[20px] sm:text-[22px] text-secondary font-bold leading-[2.3] dir-rtl">
          {misra2}
        </p>
      )}
      {poet && (
        <span className="font-urdu text-[13px] text-on-surface-variant font-medium mt-1 dir-rtl">
          — {poet}
        </span>
      )}
    </div>
  );
}

interface CitationGlossProps {
  number: number | string;
  source: string;
  text: string;
}

export function CitationGloss({ number, source, text }: CitationGlossProps) {
  return (
    <aside className="my-space-sm p-space-sm rounded-xl bg-surface-container border-l-2 border-tertiary-container flex items-start gap-space-xs text-body-sm">
      <span className="font-label-sm font-bold text-tertiary-container shrink-0 mt-0.5">
        [{number}]
      </span>
      <div className="flex flex-col">
        <span className="font-label-sm uppercase tracking-wider text-primary font-semibold text-[11px]">
          {source}
        </span>
        <span className="text-on-surface-variant text-[13px] italic font-serif leading-relaxed">
          {text}
        </span>
      </div>
    </aside>
  );
}

interface HadithBlockProps {
  arabic?: string;
  english: string;
  narrator?: string;
  reference: string;
}

export function HadithBlock({ arabic, english, narrator, reference }: HadithBlockProps) {
  return (
    <div className="my-space-md p-space-md rounded-2xl bg-surface-container-low border border-primary-container/20 flex flex-col gap-space-xs">
      <div className="flex items-center justify-between text-secondary font-label-sm text-[11px] uppercase tracking-wider font-bold">
        <span>Prophetic Tradition</span>
        <span>{reference}</span>
      </div>
      {arabic && (
        <p className="font-quran text-[20px] text-primary leading-[2.2] dir-rtl text-right">
          {arabic}
        </p>
      )}
      <p className="font-serif text-[16px] text-on-surface italic leading-relaxed">
        {narrator && <strong className="font-sans not-italic text-[14px] text-primary">{narrator}: </strong>}
        “{english}”
      </p>
    </div>
  );
}
