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
      <div className="flex mx-auto pb-8 mb-8">
        <div>
          <h2
            id="majlis-archive-heading"
            className="font-serif text-3xl mx-auto sm:text-4xl sm:mx-auto font-bold tracking-editorial text-brand-primary mt-1"
          >
            The Majlis Archive
          </h2>
        </div>
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
