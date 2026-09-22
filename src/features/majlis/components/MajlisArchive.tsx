import React from "react";
import { MajlisDoc } from "@/lib/content/schemas";
import { MajlisArchiveItem } from "./MajlisArchiveItem";
import { Archive } from "lucide-react";

interface MajlisArchiveProps {
	sessions: MajlisDoc[];
}

export function MajlisArchive({ sessions }: MajlisArchiveProps) {
	if (!sessions || sessions.length === 0) {
		return null;
	}

	return (
		<section
			id="majlis-archive-section"
			aria-labelledby="majlis-archive-heading"
			className="w-full space-y-6 sm:space-y-8"
		>
			{/* Section Header */}
			<div className="flex items-baseline justify-between flex-wrap gap-3 pb-4">
				<div className="flex items-center gap-2.5">
					<Archive className="w-5 h-5 text-brand-gold shrink-0" aria-hidden="true" />
					<div>
						<h2
							id="majlis-archive-heading"
							className="font-serif text-2xl sm:text-3xl font-semibold text-primary"
						>
							Gatherings
						</h2>
					</div>
				</div>
			</div>

			{/* Chronological Spine & Entries */}
			<div className="space-y-4 sm:space-y-5">
				{sessions.map((item, index) => {
					return (
						<MajlisArchiveItem
							key={item.slug}
							doc={item}
							isFirstOfYear={index === 0}
						/>
					);
				})}
			</div>
		</section>
	);
}
