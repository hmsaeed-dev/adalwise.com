import React from "react";
import { Target } from "lucide-react";

interface MajlisDetailCharterProps {
	objective: string;
}

export function MajlisDetailCharter({ objective }: MajlisDetailCharterProps) {
	return (
		<section
			aria-labelledby="objective-heading"
			className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a2318] text-brand-warm-white p-5 sm:p-7 md:p-9 shadow-sm"
		>
			<div
				aria-hidden="true"
				className="absolute -right-20 -top-20 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
			/>

			<div className="relative z-10 flex flex-col gap-3 sm:gap-3.5">
				<div className="flex items-center gap-2.5 text-brand-gold">
					<Target className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
					<h2
						id="objective-heading"
						className="font-mono text-xs uppercase tracking-widest font-bold"
					>
						Charter of Deliberation
					</h2>
				</div>

				<p className="font-sans text-sm sm:text-base md:text-[16px] text-brand-warm-white/90 leading-relaxed max-w-4xl font-normal">
					{objective}
				</p>
			</div>
		</section>
	);
}
