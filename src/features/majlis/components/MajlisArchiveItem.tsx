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
			<div className="grid grid-cols-1 gap-6 items-baseline">

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
						<p className="font-serif text-sm sm:text-base text-brand-primary/80 leading-relaxed max-w-xl">
							{session.thesis || session.description}
						</p>
					)}

					{/* Locational Metadata */}
					<div className="flex items-center gap-3 text-xs text-brand-primary/60 font-sans tracking-wide pt-1">
						<span>{formattedDate}</span>
						<span aria-hidden="true">·</span>
						<span>{session.location}</span>

					</div>
				</div>

			</div>
		</article>
  );
}
