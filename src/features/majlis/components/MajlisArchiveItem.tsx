import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MajlisDoc } from "@/lib/content/schemas";

interface MajlisArchiveItemProps {
  doc: MajlisDoc;
  isFirstOfYear: boolean;
  year: string;
}

function formatSessionDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function MajlisArchiveItem({
  doc,
  isFirstOfYear,
  year,
}: MajlisArchiveItemProps) {
  const { session, slug } = doc;
  const href = `/majlis/${slug}`;
  const inquiries =
    session.keyInquiries.length > 0
      ? session.keyInquiries
      : session.discussionPoints;
  const formattedDate = formatSessionDate(session.date);

  return (
    <article className="group relative focus-within:ring-1 focus-within:ring-brand-gold/40 rounded-lg p-1 -m-1 transition-colors">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline">

        {/* Column 1: Year (Shown when year changes) */}
        <div className="md:col-span-2">
          {isFirstOfYear ? (
            <span className="font-serif text-2xl sm:text-3xl font-normal text-brand-primary tracking-tight block">
              {year}
            </span>
          ) : (
            <span className="hidden md:block" aria-hidden="true" />
          )}
        </div>

        {/* Column 2: Number & Editorial Spine Connector */}
        <div className="md:col-span-1 flex items-baseline gap-3 relative">
          {/* Vertical Editorial Spine Line */}
          <div
            className="hidden md:block absolute left-2.5 top-6 bottom-[-64px] w-[1px] bg-brand-primary/15 group-last:hidden pointer-events-none"
            aria-hidden="true"
          />

          {/* Monogram Index */}
          <span className="font-mono text-sm tracking-wider text-brand-primary font-bold">
            {session.number || "01"}
          </span>
        </div>

        {/* Column 3: The Thesis & Discourse Identity */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <Link
              href={href}
              className="font-serif text-xl sm:text-2xl text-brand-primary hover:text-brand-primary-hover transition-colors group-hover:underline underline-offset-4 decoration-1 decoration-brand-primary/30 focus:outline-none"
            >
              {session.title}
            </Link>
            {session.urduTitle && (
              <span className="font-urdu text-lg sm:text-xl text-brand-primary/70 font-semibold select-none dir-rtl">
                {session.urduTitle}
              </span>
            )}
          </div>

          {/* Discourse Thesis */}
          {(session.thesis || session.description) && (
            <p className="font-serif italic text-sm sm:text-base text-brand-primary/80 leading-relaxed max-w-xl">
              {session.thesis || session.description}
            </p>
          )}

          {/* Revealed Research Queries on Focus/Hover (CSS Powered - Zero Client Bundle) */}
          {inquiries.length > 0 && (
            <div className="max-h-0 opacity-0 group-hover:max-h-80 group-hover:opacity-100 group-focus-within:max-h-80 group-focus-within:opacity-100 transition-all duration-300 ease-in-out overflow-hidden pt-1">
              <div className="pl-4 border-l border-brand-gold/60 py-2 space-y-1.5 my-2">
                <span className="font-sans text-[11px] uppercase tracking-widest text-brand-primary/60 font-semibold block">
                  Key Inquiries
                </span>
                {inquiries.map((q, qIndex) => (
                  <p
                    key={qIndex}
                    className="font-sans text-xs text-brand-primary/80 leading-normal"
                  >
                    • {q}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Locational Metadata */}
          <div className="flex items-center gap-3 text-xs text-brand-primary/60 font-sans tracking-wide pt-1">
            <span>{formattedDate}</span>
            <span aria-hidden="true">·</span>
            <span>{session.location}</span>
            {session.venue && (
              <>
                <span aria-hidden="true">·</span>
                <span className="hidden sm:inline">{session.venue}</span>
              </>
            )}
          </div>
        </div>

        {/* Column 4: Scholarly Marginalia */}
        <div className="md:col-span-3 md:text-right flex flex-col md:items-end justify-between self-stretch pt-1">
          {session.marginalia ? (
            <div className="space-y-1 font-mono text-[11px] text-brand-primary/55 tracking-wider uppercase">
              <div>
                {session.marginalia.questionsCount || inquiries.length} Primary Inquiries
              </div>
              <div>
                {session.marginalia.referencesCount || 4} Classical Sources
              </div>
              <div>
                {session.marginalia.recordAvailable || session.recordingSlug
                  ? "Transcript Archived"
                  : "Privately Convened"}
              </div>
            </div>
          ) : (
            <div className="space-y-1 font-mono text-[11px] text-brand-primary/55 tracking-wider uppercase">
              <div>{inquiries.length} Inquiries</div>
              <div>
                {session.recordingSlug ? "Transcript Archived" : "Privately Convened"}
              </div>
            </div>
          )}

          <Link
            href={href}
            aria-label={`Explore gathering ${session.title}`}
            className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest font-semibold text-brand-primary mt-4 group-hover:text-brand-gold transition-colors focus:outline-none focus:text-brand-gold"
          >
            <span>Explore Gathering</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>

      </div>
    </article>
  );
}
