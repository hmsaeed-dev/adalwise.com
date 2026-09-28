import React from "react";

export default function GlobalLoading() {
	return (
		<main className="min-h-[60vh] w-full flex items-center justify-center px-gutter-mobile md:px-gutter-desktop select-none">
			<div className="flex flex-col items-center text-center gap-3 animate-fade-in-up">
				<span className="font-serif text-xs md:text-sm tracking-[0.25em] uppercase text-primary/80 font-medium">
					Adlwise
				</span>

				{/* Hairline precision progress bar */}
				<div className="h-[2px] w-24 overflow-hidden rounded-full bg-surface-container-high/60">
					<div className="h-full w-1/2 rounded-full bg-primary animate-[loadingLine_1.5s_ease-in-out_infinite]" />
				</div>

				<span className="font-urdu text-xs text-on-surface-variant/50 dir-rtl">
					عدل و حکمت
				</span>
			</div>
		</main>
	);
}
