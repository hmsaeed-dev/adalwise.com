import React from "react";
import { HelpCircle, CheckCircle2 } from "lucide-react";
import { MajlisKeyTakeaway } from "@/lib/content/schemas";

interface MajlisDetailBriefingProps {
	takeaways?: MajlisKeyTakeaway[];
	inquiries?: string[];
}

export function MajlisDetailBriefing({
	takeaways,
	inquiries,
}: MajlisDetailBriefingProps) {
	const hasTakeaways = takeaways && takeaways.length > 0;
	const hasInquiries = inquiries && inquiries.length > 0;

	if (!hasTakeaways && !hasInquiries) return null;

	return (
		<section
			aria-labelledby="briefing-heading"
			className="rounded-3xl bg-surface-container-low/50 border border-surface-container-high/60 p-6 sm:p-8 md:p-10 flex flex-col gap-6 sm:gap-8"
		>

			{/* 2-Column Split: Inquiries (Left) + Takeaways (Right) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
				{/* Left Column: Central Inquiries Debated */}
				{hasInquiries && (
					<div
						className={`${
							hasTakeaways ? "lg:col-span-5" : "lg:col-span-12"
						} flex flex-col gap-4`}
					>
						<div className="flex items-center gap-2 text-primary font-medium">
							<HelpCircle className="w-4 h-4 text-brand-gold shrink-0" aria-hidden="true" />
							<h3 className="font-serif text-base sm:text-lg font-semibold">
								Inquiries Debated
							</h3>
						</div>

						<ul className="flex flex-col gap-3 font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
							{inquiries.map((q, idx) => (
								<li
									key={idx}
									className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-container-lowest/80 border border-surface-container-high/40"
								>
									<span className="text-xs font-bold text-brand-gold mt-0.5 select-none shrink-0">
										0{idx + 1}
									</span>
									<span className="text-primary/90 font-medium">{q}</span>
								</li>
							))}
						</ul>
					</div>
				)}

				{/* Right Column: Juristic Findings & Benchmarks */}
				{hasTakeaways && (
					<div
						className={`${
							hasInquiries ? "lg:col-span-7" : "lg:col-span-12"
						} flex flex-col gap-4`}
					>
						<div className="flex items-center gap-2 text-primary font-medium">
							<CheckCircle2 className="w-4 h-4 text-brand-gold shrink-0" aria-hidden="true" />
							<h3 className="font-serif text-base sm:text-lg font-semibold">
								Outcomes
							</h3>
						</div>

						<div className="flex flex-col gap-3.5">
							{takeaways.map((item, idx) => (
								<div
									key={idx}
									className="p-4 sm:p-5 rounded-2xl bg-surface-container-lowest/80 border border-surface-container-high/40 flex items-start gap-3.5 sm:gap-4 shadow-2xs"
								>
									<span className="font-serif text-xl sm:text-2xl font-bold text-brand-gold shrink-0 select-none leading-none mt-0.5">
										0{idx + 1}
									</span>
									<div className="flex flex-col gap-1 min-w-0">
										<h4 className="font-serif text-sm sm:text-base font-semibold text-primary leading-snug">
											{item.title}
										</h4>
										<p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
											{item.summary}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
