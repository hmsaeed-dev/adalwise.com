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
			{/* Chronological Spine & Entries */}
			<div>
				{sessions.map((item, index) => {
					const itemYear = getSessionYear(
						item.session.date,
						item.session.year,
					);
					const prevYear =
						index > 0
							? getSessionYear(
									sessions[index - 1].session.date,
									sessions[index - 1].session.year,
								)
							: null;
					const isFirstOfYear = index === 0 || itemYear !== prevYear;

					return (
						<MajlisArchiveItem
							key={item.slug}
							doc={item}
							isFirstOfYear={isFirstOfYear}
						/>
					);
				})}
			</div>
		</section>
	);
}
