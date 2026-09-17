import React from "react";
import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
return (
		<main className="min-h-[70vh] w-full flex items-center justify-center px-gutter-mobile md:px-gutter-desktop">
			<div className="flex flex-col items-center text-center">
				<span className="text-sm tracking-[0.2em] uppercase text-primary">
					Adalwise
				</span>

				<div className="mt-space-md h-px w-20 overflow-hidden bg-outline-variant">
					<div className="h-full w-1/2 bg-primary animate-[loading_1.8s_ease-in-out_infinite]" />
				</div>

				<p className="mt-space-sm text-xs text-on-surface-variant">
					Preparing page
				</p>
			</div>
		</main>
);
}
