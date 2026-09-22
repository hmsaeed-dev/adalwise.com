import React from "react";
import { CheckCircle2 } from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";

interface MajlisDetailTakeawaysProps {
	takeaways?: MajlisSession["keyTakeaways"];
	inquiries: string[];
}

export function MajlisDetailTakeaways({
	takeaways,
	inquiries,
}: MajlisDetailTakeawaysProps) {
	const hasTakeaways = takeaways && takeaways.length > 0;
	const hasInquiries = inquiries && inquiries.length > 0;

	if (!hasTakeaways && !hasInquiries) return null;

	return (
		<section aria-labelledby="takeaways-heading" className="flex flex-col gap-5 sm:gap-6">
			<div className="flex items-baseline justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 sm:gap-2.5">
					<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
					<h2
						id="takeaways-heading"
						className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
					>
						Key Points
					</h2>
				</div>
				<span className="font-urdu text-sm sm:text-base text-brand-gold font-bold dir-rtl">
					اہم نکات و حاصلِ نشست
				</span>
			</div>

			{/* Numbered Executive Findings */}
			{hasTakeaways && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
					{takeaways.map((item, idx) => (
						<div
							key={idx}
							className="p-5 sm:p-6 rounded-2xl bg-surface-container-low flex flex-col gap-2.5 shadow-xs"
						>
							<span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold">
								0{idx + 1}
							</span>
							<h3 className="font-serif text-base font-semibold text-primary leading-snug">
								{item.title}
							</h3>
							<p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
								{item.summary}
							</p>
						</div>
					))}
				</div>
			)}

			{/* Specific Inquiries Explored */}
			{hasInquiries && (
				<div className="p-5 sm:p-7 rounded-2xl bg-surface-container-low/70 space-y-3">
					<h3 className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-primary/80">
						Central Inquiries Debated
					</h3>
					<ul className="space-y-2.5 font-sans text-sm sm:text-[15px] text-primary/85 leading-relaxed">
						{inquiries.map((q, idx) => (
							<li key={idx} className="flex items-start gap-3">
								<span className="font-mono text-xs font-bold text-brand-gold mt-0.5 select-none shrink-0">
									[Q0{idx + 1}]
								</span>
								<span>{q}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}
