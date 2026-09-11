import React from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";
import { formatISODate } from "@/lib/utils";

interface MajlisScheduleProps {
  sessions: { slug: string; session: MajlisSession }[];
}

export function MajlisSchedule({ sessions }: MajlisScheduleProps) {
  return (
    <section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg">
      <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
        <h2 className="font-headline-lg text-primary font-bold">
          Gatherings
        </h2>
      </div>

      <div className="flex flex-col gap-space-md">
        {sessions.map(({ slug, session }) => (
          <div
            key={slug}
            className="p-space-lg bg-surface-container-low rounded-[22px] border border-surface-container-high flex flex-col gap-space-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant text-[12px]">
              <div className="flex items-center gap-space-xs">
                <Calendar className="w-4 h-4 text-tertiary-container shrink-0" />
                <span className="font-semibold text-primary">
                  {formatISODate(session.date)}
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <MapPin className="w-4 h-4 text-tertiary-container shrink-0" />
                <span>{session.location}</span>
              </div>
            </div>

            <div className="flex flex-col gap-space-2xs">
              <h3 className="font-headline-md text-primary font-bold">
                {session.title}
              </h3>
              {session.urduTitle && (
                <p className="font-urdu text-[16px] text-tertiary font-semibold dir-rtl text-right">
                  {session.urduTitle}
                </p>
              )}
            </div>

            <p className="font-body-md text-on-surface leading-relaxed">
              {session.description}
            </p>

            {session.discussionPoints.length > 0 && (
              <div className="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-xs border border-surface-container-high/60">
                <span className="font-label-sm uppercase tracking-wider text-secondary font-bold text-[11px]">
                  Key Points:
                </span>
                <ul className="flex flex-col gap-1 text-body-sm text-on-surface-variant">
                  {session.discussionPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-space-xs">
                      <span className="text-tertiary-container mt-0.5">♦</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pt-space-xs border-t border-surface-container-high mt-space-xs">
              <Link
                href="/join"
                className="w-full sm:w-auto text-center px-space-md py-space-xs bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-full hover:bg-primary-container transition-colors font-semibold shadow-sm"
              >
                Attend Majlis
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
