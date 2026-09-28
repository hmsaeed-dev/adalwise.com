"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
	AlertTriangle,
	RotateCcw,
	Home,
	Search,
} from "lucide-react";

interface ErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
	const [copied, setCopied] = useState(false);
	const [showDetails, setShowDetails] = useState(false);

	useEffect(() => {
		// Log error to telemetry / console for diagnostics
		console.error("Adlwise System Exception:", error);
	}, [error]);

	const handleCopy = () => {
		const text = `Adlwise Error Report:\nDigest: ${error.digest || "N/A"}\nMessage: ${error.message || "Unknown error"}`;
		navigator.clipboard.writeText(text).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<div className="relative w-full min-h-[85vh] flex items-center justify-center px-gutter-mobile md:px-gutter-desktop py-space-2xl overflow-hidden selection:bg-brand-gold/20 selection:text-primary">
			{/* Ambient Rub-el-Hizb Geometric Lattice Watermark */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.025] pointer-events-none"
				style={{
					backgroundImage: "url('/images/patterns/islamic-star.svg')",
					backgroundRepeat: "repeat",
					backgroundSize: "80px 80px",
				}}
			/>

			{/* Subtle Radial Glow */}
			<div
				aria-hidden="true"
				className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[500px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(184,142,63,0.08),transparent_70%)] pointer-events-none"
			/>

			<div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center animate-fade-in-up">
				{/* Scholarly Insignia Crest */}
				<div className="relative mb-6">
					<div className="w-20 h-20 rounded-3xl bg-surface-container-low border border-surface-container-high/80 shadow-xs flex items-center justify-center p-4 transition-transform hover:scale-105 duration-300">
						<div className="w-12 h-12 rounded-2xl bg-primary/8 text-primary flex items-center justify-center">
							<AlertTriangle className="w-6 h-6 text-brand-gold stroke-[1.8]" />
						</div>
					</div>
					{/* Small decorative corner accents */}
					<div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-brand-gold/40 rounded-tr" />
					<div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-brand-gold/40 rounded-bl" />
				</div>

				{/* Primary Headline */}
				<h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] text-primary font-normal leading-relaxed max-w-lg mb-8">
					Something went wrong.
				</h1>

				{/* Action CTAs */}
				<div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto mb-10">
					<button
						type="button"
						onClick={() => reset()}
						className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-primary hover:bg-brand-primary-hover text-brand-warm-white rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 group"
					>
						<RotateCcw className="w-4 h-4 transition-transform duration-500 group-hover:-rotate-90" />
						<span>Retry</span>
					</button>

					<Link
						href="/"
						className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-highest rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
					>
						<Home className="w-4 h-4 text-on-surface-variant" />
						<span>Home</span>
					</Link>

					<Link
						href="/search"
						className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-surface-container-low hover:bg-surface-container text-on-surface-variant hover:text-primary border border-surface-container-high rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200"
					>
						<Search className="w-4 h-4 text-on-surface-variant" />
						<span>Search</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
