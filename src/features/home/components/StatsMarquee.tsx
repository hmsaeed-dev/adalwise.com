"use client";

import React, { useMemo } from "react";

interface StatItem {
	value: string;
	label: string;
}

const STATS: StatItem[] = [
	{ value: "1,200+", label: "subscribers" },
	{ value: "600+", label: "lectures" },
	{ value: "500+", label: "community members" },
];

export interface StatsMarqueeProps {
	className?: string;
	repeatCount?: number;
	duration?: number;
}

export function StatsMarquee({
	className = "",
	repeatCount = 5,
	duration = 40,
}: StatsMarqueeProps) {
	// Repeating stats across the track ensures continuous density across all viewport resolutions
	const marqueeStats = useMemo(() => {
		return Array.from({ length: repeatCount }).flatMap(() => STATS);
	}, [repeatCount]);

	const trackStyle: React.CSSProperties = {
		animationDuration: `${duration}s`,
	};

	return (
		<section
			className={`w-full bg-surface-container-low/90 border-y border-surface-container-high/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] py-3 md:py-3.5 select-none overflow-hidden ${className}`}
			role="region"
			aria-label="Key Statistics"
		>
			{/* Simple, continuous, non-interactive infinite horizontal marquee */}
			<div className="marquee-strip flex w-full overflow-hidden">
				{/* Primary track (read once by screen readers) */}
				<div className="marquee-track" style={trackStyle}>
					{marqueeStats.map((stat, idx) => (
						<div
							key={`primary-stat-${idx}`}
							className="flex items-center shrink-0 flex-nowrap"
						>
							<div className="flex items-baseline gap-2 px-6 md:px-8 whitespace-nowrap">
								<span className="font-serif text-lg md:text-xl font-bold text-primary tracking-tight">
									{stat.value}
								</span>
								<span className="font-sans text-[11px] md:text-xs uppercase tracking-widest text-on-surface-variant font-medium">
									{stat.label}
								</span>
							</div>
						</div>
					))}
				</div>

				{/* Cloned duplicate track for seamless infinite loop without visible jump */}
				<div aria-hidden="true" className="marquee-track" style={trackStyle}>
					{marqueeStats.map((stat, idx) => (
						<div
							key={`clone-stat-${idx}`}
							className="flex items-center shrink-0 flex-nowrap"
						>
							<div className="flex items-baseline gap-2 px-6 md:px-8 whitespace-nowrap">
								<span className="font-serif text-lg md:text-xl font-bold text-primary tracking-tight">
									{stat.value}
								</span>
								<span className="font-sans text-[11px] md:text-xs uppercase tracking-widest text-on-surface-variant font-medium">
									{stat.label}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
