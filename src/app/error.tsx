"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

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
		<div
			className="
				w-full
				min-h-[90vh]
				flex items-center justify-center
				px-gutter-mobile
				mx-auto
				my-auto
				py-space-3xl
				sm:px-gutter-tablet
				lg:px-gutter-desktop
			"
		>
			<div
				className="
					w-full
					max-w-xl
					mx-auto
					my-auto
					flex flex-col
					items-center
					justify-center
					text-center
				"
			>
				{/* Error Icon */}
				<div
					className="
						w-16 h-16
						sm:w-[4.5rem] sm:h-[4.5rem]
						rounded-full
						bg-surface-container
						border border-primary/15
						flex items-center justify-center
						mb-space-lg
					"
				>
					<div
						className="
							w-10 h-10
							sm:w-11 sm:h-11
							rounded-full
							bg-primary/8
							flex items-center justify-center
						"
					>
						<AlertCircle
							className="
								w-5 h-5
								sm:w-[1.35rem] sm:h-[1.35rem]
								text-primary
							"
							strokeWidth={1.7}
						/>
					</div>
				</div>

				{/* Heading */}
				<div className="flex flex-col items-center">
					<h2
						className="
							font-headline-lg
							text-primary
							font-semibold
							leading-tight
							tracking-tight
							max-w-md
						"
					>
						Something went wrong.
					</h2>
				</div>

				{/* Description */}
				<p
					className="
						font-body-sm
						sm:font-body-md
						text-on-surface-variant
						leading-relaxed
						max-w-lg
						mt-space-md
					"
				>
					This page isn't available right now
				</p>

				{/* Actions */}
				<div
					className="
						flex flex-col
						sm:flex-row
						items-stretch sm:items-center
						gap-space-xs
						mt-space-xl
						w-full sm:w-auto
					"
				>
					<button
						type="button"
						onClick={() => reset()}
						className="
							inline-flex
							items-center
							justify-center
							min-h-11
							px-space-lg
							py-space-xs
							rounded-full
							bg-primary
							text-on-primary
							font-label-md
							uppercase
							tracking-wider
							font-semibold
							transition-all
							duration-200
							hover:bg-primary-container
							hover:shadow-sm
							active:scale-[0.98]
						"
					>
						Try Again
					</button>

					<Link
						href="/lectures"
						className="
							group
							inline-flex
							items-center
							justify-center
							gap-2
							min-h-11
							px-space-lg
							py-space-xs
							rounded-full
							bg-surface-container
							text-primary
							border
							border-surface-container-highest
							font-label-md
							uppercase
							tracking-wider
							font-semibold
							transition-all
							duration-200
							hover:bg-surface-container-high
							hover:border-primary/20
							active:scale-[0.98]
						"
					>
						Explore Lectures
						<ArrowRight
							className="
								w-4 h-4
								transition-transform
								duration-200
								group-hover:translate-x-0.5
							"
							strokeWidth={1.8}
						/>
					</Link>
				</div>

				{/* Editorial Detail */}
				<div
					className="
						flex
						items-center
						gap-2
						mt-space-2xl
					"
				></div>
			</div>
		</div>
	);
}
