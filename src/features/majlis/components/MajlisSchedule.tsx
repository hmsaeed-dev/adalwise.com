import React from "react";
import Link from "next/link";
import { MajlisSession } from "@/lib/content/schemas";
import { formatISODate } from "@/lib/utils";

interface MajlisScheduleProps {
  sessions: { slug: string; session: MajlisSession }[];
}

export function MajlisSchedule({ sessions }: MajlisScheduleProps) {
  return (
    <section className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg">
      <div className="flex items-baseline justify-between border-b border-surface-container-high pb-space-xs">
        <h2 className="font-headline-lg text-primary font-bold font-serif">
          Gatherings &amp; Deliberation Roster
        </h2>
        <span className="font-urdu text-[16px] text-primary font-bold">
          نظام الاوقات
        </span>
      </div>

      <div className="flex flex-col gap-space-md">
        {sessions.map(({ slug, session }) => (
          <div
            key={slug}
            className="p-space-lg bg-surface-container-low rounded-[22px] border border-surface-container-high flex flex-col gap-space-md"
          >
            <div className="flex flex-wrap items-center justify-between gap-space-xs text-on-surface-variant text-[12px]">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary-container text-[18px]">
                  calendar_today
                </span>
                <span className="font-semibold text-primary">
                  {formatISODate(session.date)}
                </span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary-container text-[18px]">
                  location_on
                </span>
                <span>{session.location}</span>
              </div>
            </div>

            <div className="flex flex-col gap-space-2xs">
              <h3 className="font-headline-md text-primary font-bold font-serif">
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
                  Key Deliberation Foci:
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

            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-surface-container-high mt-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm uppercase tracking-wider text-on-surface-variant text-[11px]">
                  Conducted by:
                </span>
                <span className="font-headline-sm text-[14px] text-primary font-semibold font-serif">
                  {session.host.name}
                </span>
              </div>
              <Link
                href="/join"
                className="px-space-md py-space-xs bg-primary text-on-primary font-label-md uppercase tracking-wider rounded-full hover:bg-primary-container transition-colors font-semibold shadow-sm"
              >
                Request Attendance / RSVP
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
