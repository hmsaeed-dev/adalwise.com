import React from "react";
import { MajlisDoc } from "@/lib/content/schemas";
import { MajlisArchiveItem } from "./MajlisArchiveItem";

interface MajlisArchiveProps {
  sessions: MajlisDoc[];
}

function getSessionYear(dateStr: string, fallbackYear?: string): string {
  if (fallbackYear) return fallbackYear;
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d.getFullYear().toString();
  } catch {
    // fallback
  }
  return new Date().getFullYear().toString();
}

export function MajlisArchive({ sessions }: MajlisArchiveProps) {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="majlis-archive-heading">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 mb-12 border-b border-brand-primary/10">
        <div>
          <span className="font-sans text-xs uppercase tracking-[0.25em] font-semibold text-brand-primary">
            Chronicle of Inquiries
          </span>
          <h2
            id="majlis-archive-heading"
            className="font-serif text-2xl sm:text-3xl font-medium tracking-editorial text-brand-primary mt-1"
          >
            The Majlis Archive
          </h2>
        </div>
        <p className="font-sans text-xs sm:text-sm text-brand-primary/60 max-w-sm mt-2 sm:mt-0 leading-relaxed">
          An institutional record of themes explored, questions raised, and
          the jurisprudential continuity developed across gatherings.
        </p>
      </div>

      {/* Chronological Spine & Entries */}
      <div className="space-y-16">
        {sessions.map((item, index) => {
          const itemYear = getSessionYear(item.session.date, item.session.year);
          const prevYear =
            index > 0
              ? getSessionYear(
                  sessions[index - 1].session.date,
                  sessions[index - 1].session.year
                )
              : null;
          const isFirstOfYear = index === 0 || itemYear !== prevYear;

          return (
            <MajlisArchiveItem
              key={item.slug}
              doc={item}
              isFirstOfYear={isFirstOfYear}
              year={itemYear}
            />
          );
        })}
      </div>
    </section>
  );
}
