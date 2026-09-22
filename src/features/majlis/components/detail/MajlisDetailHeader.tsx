import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";

interface MajlisDetailHeaderProps {
	session: MajlisSession;
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

export function MajlisDetailHeader({ session }: MajlisDetailHeaderProps) {
	const formattedDate = formatSessionDate(session.date);

	return (
		<div className="flex flex-col gap-10 sm:gap-14">
			{/* Breadcrumb Navigation */}
			<nav
				aria-label="Breadcrumb"
				className="flex items-center justify-between flex-wrap gap-3 text-[11px] sm:text-xs font-sans uppercase tracking-widest text-on-surface-variant"
			>
				<div className="flex items-center gap-2">
					<Link
						href="/majlis"
						className="hover:text-primary transition-colors inline-flex items-center gap-1.5 font-medium"
					>
						<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
						<span>Majlis</span>
					</Link>
					<span aria-hidden="true" className="text-surface-container-highest">/</span>
					<span className="text-primary font-bold">
						Session {session.number || "01"}
					</span>
				</div>
			</nav>

			{/* Header Cartouche */}
			<header className="flex flex-col gap-3.5 sm:gap-4">
				{/* Date & Location */}
				<div className="flex items-center justify-between flex-wrap gap-y-2 gap-x-4 text-xs sm:text-sm font-sans tracking-wide text-on-surface-variant">
					<div className="flex items-center gap-3 sm:gap-4 flex-wrap">
						<span className="flex items-center gap-1.5 text-primary font-medium">
							<Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold shrink-0" aria-hidden="true" />
							<span>{formattedDate}</span>
						</span>
						<span className="flex items-center gap-1.5">
							<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold shrink-0" aria-hidden="true" />
							<span>
								{session.venue ? `${session.venue}, ` : ""}
								{session.location}
							</span>
						</span>
					</div>
				</div>

				{/* Title Lockup */}
				<div className="flex flex-col gap-2.5 sm:gap-3 mt-1 sm:mt-2">
					<div className="flex items-baseline justify-between gap-3 sm:gap-4 flex-wrap">
						<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-primary tracking-tight leading-[1.12]">
							{session.title}
						</h1>

						{session.urduTitle && (
							<span className="font-urdu text-2xl sm:text-3xl md:text-4xl text-brand-gold font-bold dir-rtl select-none tracking-normal">
								{session.urduTitle}
							</span>
						)}
					</div>

					{/* Concept Subtitle */}
					{session.theme && (
						<p className="text-sm sm:text-base md:text-lg font-sans font-medium text-primary/80">
							{session.theme}
						</p>
					)}

					{session.thesis && (
						<div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low/70 mt-1 sm:mt-2 border-l-2 border-brand-gold">
							<p className="font-serif italic text-base sm:text-lg md:text-xl text-on-surface/90 leading-relaxed">
								&ldquo;{session.thesis}&rdquo;
							</p>
						</div>
					)}
				</div>
			</header>
		</div>
	);
}
