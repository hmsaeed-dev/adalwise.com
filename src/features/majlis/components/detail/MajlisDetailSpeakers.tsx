import React from "react";
import Image from "next/image";
import { Users } from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";

interface MajlisDetailSpeakersProps {
	speakers: MajlisSession["speakers"];
}

export function MajlisDetailSpeakers({ speakers }: MajlisDetailSpeakersProps) {
	if (!speakers || speakers.length === 0) return null;

	return (
		<section aria-labelledby="speakers-heading" className="flex flex-col gap-4 sm:gap-5">
			<div className="flex items-baseline justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 sm:gap-2.5">
					<Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
					<h2
						id="speakers-heading"
						className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
					>
						Speakers
					</h2>
				</div>
				<span className="font-urdu text-sm sm:text-base text-brand-gold font-bold dir-rtl">
					مقالہ نگار
				</span>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
				{speakers.map((speaker, idx) => (
					<div
						key={idx}
						className="p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-4 shadow-xs"
					>
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-3">
								{speaker.avatarUrl ? (
									<div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-brand-gold/40">
										<Image
											src={speaker.avatarUrl}
											alt={speaker.name}
											fill
											className="object-cover object-center"
										/>
									</div>
								) : (
									<div className="w-12 h-12 rounded-full bg-primary text-brand-gold flex items-center justify-center font-serif text-base font-bold shrink-0 shadow-xs">
										{speaker.name.charAt(0)}
									</div>
								)}

								<div className="min-w-0">
									<h3 className="font-serif text-sm sm:text-base font-semibold text-primary truncate">
										{speaker.name}
									</h3>
									{speaker.urduName && (
										<p className="font-urdu text-xs text-brand-gold font-bold dir-rtl">
											{speaker.urduName}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Specialized Topic Card */}
						<div className="p-3">
							<p className="font-sans text-xs text-primary font-medium leading-relaxed italic">
								{speaker.topic}
							</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
