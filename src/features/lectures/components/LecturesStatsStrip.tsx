"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatItem {
	value: number;
	decimals: number;
	label: string;
}

const STATS_DATA: StatItem[] = [
	{ value: 507, decimals: 0, label: "Hours" },
	{ value: 88256, decimals: 0, label: "Views" },
	{ value: 4258, decimals: 0, label: "Watch Hrs" },
];

function formatNumber(num: number, decimals: number): string {
	return num.toLocaleString("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
}

function easeOutCubic(t: number): number {
	return 1 - Math.pow(1 - t, 3);
}

export function LecturesStatsStrip() {
	const containerRef = useRef<HTMLElement>(null);
	const [counts, setCounts] = useState<number[]>([0, 0, 0]);
	const [isVisible, setIsVisible] = useState(false);
	const hasAnimatedRef = useRef(false);

	useEffect(() => {
		const element = containerRef.current;
		if (!element || hasAnimatedRef.current) return;

		let animationFrameId: number;
		let timeoutId: NodeJS.Timeout;

		const startCounterAnimation = () => {
			const duration = 2000; // ms (2-second dynamic count-up)
			let startTime: number | null = null;

			const step = (timestamp: number) => {
				if (!startTime) startTime = timestamp;
				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = easeOutCubic(progress);

				setCounts(STATS_DATA.map((s) => Math.round(s.value * eased)));

				if (progress < 1) {
					animationFrameId = requestAnimationFrame(step);
				} else {
					// Final exact precision lock
					setCounts(STATS_DATA.map((s) => s.value));
				}
			};

			animationFrameId = requestAnimationFrame(step);
		};

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && !hasAnimatedRef.current) {
					hasAnimatedRef.current = true;
					observer.disconnect();

					// 1. Trigger visible entrance of the strip
					setIsVisible(true);

					// 2. Start the count-up after a short 150ms pause so the eye catches the 0 start
					timeoutId = setTimeout(() => {
						startCounterAnimation();
					}, 150);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "0px 0px -10px 0px",
			},
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
			if (timeoutId) clearTimeout(timeoutId);
			if (animationFrameId) cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<section
			ref={containerRef}
			role="region"
			aria-label="Archive Statistics"
			className={`w-full bg-surface-container-low/90 border-y border-surface-container-high/60 shadow-[0_1px_3px_rgba(0,0,0,0.02)] py-3 sm:py-3.5 select-none overflow-hidden transition-all duration-700 ease-out ${
				isVisible
					? "opacity-100 translate-y-0"
					: "opacity-0 translate-y-2.5"
			}`}
		>
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				<div className="flex items-center justify-around sm:justify-center sm:gap-10 md:gap-14 lg:gap-20">
					{STATS_DATA.map((stat, idx) => (
						<React.Fragment key={stat.label}>
							<div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0.5 sm:gap-2 whitespace-nowrap">
								<span
									className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-primary tracking-tight tabular-nums leading-none select-none"
									aria-live="polite"
								>
									{formatNumber(counts[idx], stat.decimals)}
								</span>
								<span className="font-sans text-[11px] sm:text-xs uppercase tracking-widest text-on-surface-variant font-medium leading-none select-none">
									{stat.label}
								</span>
							</div>
						</React.Fragment>
					))}
				</div>
			</div>
		</section>
	);
}
