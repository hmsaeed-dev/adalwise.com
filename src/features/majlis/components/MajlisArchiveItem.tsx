import React from "react";
import Link from "next/link";
import { MajlisDoc } from "@/lib/content/schemas";

interface MajlisArchiveItemProps {
	doc: MajlisDoc;
	isFirstOfYear: boolean;
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
}: MajlisArchiveItemProps) {
	const { session, slug } = doc;
	const href = `/majlis/${slug}`;
	const inquiries =
    session.keyInquiries.length > 0
    	? session.keyInquiries
    	: session.discussionPoints;
	const formattedDate = formatSessionDate(session.date);

	return (
		<article className="group w-full relative gap-0 focus-within:ring-1 rounded-lg focus-within:ring-brand-gold/40 p-8 transition-colors hover:bg-primary/10 hover:cursor-pointer hover:shadow-lg">
			<div className="grid grid-cols-1 gap-0">
				<div className="md:col-span-6 space-y-3">
					<div className="flex items-baseline justify-between gap-0 flex-wrap">
						<Link
							href={href}
							className="after:absolute after:inset-0 after:content-[''] font-serif text-xl sm:text-2xl text-brand-primary hover:text-brand-primary-hover transition-colors underline-offset-4 decoration-1 decoration-brand-primary/30 focus:outline-none"
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

					{/* Metadata */}
					<div className="flex items-center text-xs text-brand-primary/60 font-sans tracking-wide">
						<span>{formattedDate}</span>
					</div>
				</div>
			</div>
		</article>
	);
}
