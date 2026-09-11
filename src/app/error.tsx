"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Adlwise Global Error Boundary:", error);
	}, [error]);

	return (
		<div className="w-full max-w-md mx-auto px-gutter-mobile py-space-3xl flex flex-col items-center justify-center text-center gap-space-md min-h-[50vh]">
			<div className="w-14 h-14 rounded-full bg-error-container text-on-error-container flex items-center justify-center shadow-md">
				<AlertCircle className="w-7 h-7" />
			</div>

			<div className="flex flex-col gap-1">
				<h2 className="font-headline-lg text-primary font-bold">
					Temporary Reading Disruption
				</h2>
				<span className="font-urdu text-[15px] text-tertiary font-bold">
					معذرت، صفحہ لوڈ کرنے میں عارضی رکاوٹ
				</span>
			</div>

			<p className="font-body-sm text-on-surface-variant leading-relaxed">
				An unexpected error occurred while compiling this manuscript or
				archival view.
			</p>

			<div className="flex items-center gap-space-xs mt-space-xs">
				<button
					type="button"
					onClick={() => reset()}
					className="px-space-md py-space-xs bg-primary text-on-primary rounded-full font-label-md uppercase tracking-wider font-semibold hover:bg-primary-container transition-colors shadow-sm"
				>
					Retry View
				</button>
				<Link
					href="/"
					className="px-space-md py-space-xs bg-surface-container text-primary rounded-full font-label-md uppercase tracking-wider font-semibold hover:bg-surface-container-high transition-colors border border-surface-container-highest"
				>
					Return Home
				</Link>
			</div>
		</div>
	);
}
