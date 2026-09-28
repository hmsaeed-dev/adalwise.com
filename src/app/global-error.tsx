"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Adlwise Global Root Layout Exception:", error);
	}, [error]);

	return (
		<html lang="en">
			<body className="bg-[#fff9e9] text-[#1e1c12] font-sans antialiased m-0 p-0 min-h-screen flex items-center justify-center">
				<div className="w-full max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">
					{/* Crest */}
					<div className="w-16 h-16 rounded-2xl bg-[#eee8d7] border border-[#d8d0bd] flex items-center justify-center mb-6 shadow-xs">
						<AlertTriangle className="w-8 h-8 text-[#b88e3f]" />
					</div>

					<h1 className="text-3xl sm:text-4xl text-[#00261a] font-serif font-normal tracking-tight mb-4">
						Something went wrong.
					</h1>

					{/* Action */}
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => reset()}
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#00261a] hover:bg-[#143826] text-[#faf8f5] rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm active:scale-95"
						>
							<RotateCcw className="w-4 h-4" />
							<span>Reload Archive</span>
						</button>

						<a
							href="/"
							className="inline-flex items-center gap-2 px-6 py-3 bg-[#eee8d7] hover:bg-[#e4dcbf] text-[#00261a] rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200"
						>
							<span>Homepage</span>
						</a>
					</div>
				</div>
			</body>
		</html>
	);
}
