import React from "react";
import Link from "next/link";
import {
	ArrowRight,
	Calendar,
	MapPin,
	Camera,
	Video,
	FileText,
	BookOpen,
} from "lucide-react";
import { MajlisDoc } from "@/lib/content/schemas";

interface MajlisArchiveItemProps {
	doc: MajlisDoc;
	isFirstOfYear?: boolean;
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
}: MajlisArchiveItemProps) {
	const { session, slug } = doc;
	const href = `/majlis/${slug}`;
	const formattedDate = formatSessionDate(session.date);

	return (
		<article className="group relative rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 hover:border-brand-gold/50 p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
			<div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
				{/* Left: Numeral & Meta */}
				<div className="flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-4 md:gap-2 shrink-0 md:w-32">
					<span className="font-serif text-4xl sm:text-5xl font-light text-primary/30 group-hover:text-brand-gold transition-colors select-none leading-none">
						{session.number || "01"}
					</span>
				</div>

				{/* Middle: Content Dossier */}
				<div className="flex-1 space-y-3.5">
					{/* Venue, Date & Format Badges */}
					<div className="flex items-center gap-3 flex-wrap text-xs text-on-surface-variant">
						<span className="flex items-center gap-1.5 font-medium text-primary">
							<Calendar className="w-3.5 h-3.5 text-brand-gold" aria-hidden="true" />
							<span>{formattedDate}</span>
						</span>
					</div>

					{/* Title Lockup */}
					<div className="flex items-baseline justify-between gap-3 flex-wrap">
						<h3 className="font-serif text-xl sm:text-2xl font-semibold text-primary group-hover:text-primary-hover transition-colors">
							<Link
								href={href}
								className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
							>
								{session.title}
							</Link>
						</h3>

						{session.urduTitle && (
							<span className="font-urdu text-xl sm:text-2xl text-brand-gold font-bold dir-rtl select-none">
								{session.urduTitle}
							</span>
						)}
					</div>

					{/* Thesis / Description */}
					{(session.thesis || session.description) && (
						<p className="font-serif text-sm sm:text-base text-on-surface/85 leading-relaxed max-w-2xl">
							{session.thesis || session.description}
						</p>
					)}
				</div>

				{/* Right: Action Arrow */}
				<div className="hidden lg:flex items-center justify-center self-center shrink-0 w-10 h-10 rounded-full bg-surface-container-low group-hover:bg-primary group-hover:text-brand-warm-white text-primary transition-all duration-300">
					<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
				</div>
			</div>
		</article>
	);
}
