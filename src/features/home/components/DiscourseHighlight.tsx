import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function DiscourseHighlight() {
	return (
		<section className="w-full px-gutter-mobile md:px-gutter-desktop -mt-6 relative z-20 max-w-container-max mx-auto">
			<div className="w-full bg-surface-container-lowest p-space-lg shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-surface-container-high/60 flex flex-col gap-space-xs rounded-[24px]">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-space-2xs">
						<span className="w-2 h-2 bg-tertiary-container rounded-full animate-pulse" />
						<span className="font-label-sm text-tertiary uppercase tracking-wider text-[10px] font-bold">
							Active Discourse
						</span>
					</div>
				</div>

				<h2 className="font-headline-md text-primary font-bold leading-snug mt-space-2xs">
					Moral Limits of Statutory Law
				</h2>

				<p className="font-urdu text-[15px] text-secondary font-medium leading-relaxed dir-rtl text-right">
					ریاستی قانون کی اخلاقی حدود
				</p>

				<div className="flex items-center justify-between pt-space-xs mt-space-xs  border-surface-container-high">
					<Link
						href="/twasi-al-haq"
						className="font-label-sm text-secondary font-bold flex items-center gap-1 hover:text-primary transition-colors uppercase tracking-wider"
					>
						<span>Read</span>
						<ChevronRight className="w-3.5 h-3.5" />
					</Link>
				</div>
			</div>
		</section>
	);
}
