"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/config/nav";
import { cn } from "@/lib/utils";

interface NewsItem {
	id: string;
	text: string;
	href?: string;
}

const NEWS_UPDATES: NewsItem[] = [
	{
		id: "1",
		text: "Autumn Fellowship cycle are now Open.",
		href: "/majlis",
	},
	{
		id: "2",
		text: "Charter of Madinah.",
		href: "/lectures",
	},
	{
		id: "3",
		text: "New Article released.",
		href: "/twasi-al-haq",
	},
];

export function Updates() {
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	const isMainNavRoot = mainNavItems.some((item) => item.href === pathname);
	const isTransparentHero = isMainNavRoot && !isScrolled;

	// Repetition ensures density across ultrawide monitors without gaps or jumps
	const repeatedUpdates = useMemo(
		() => Array.from({ length: 4 }).flatMap(() => NEWS_UPDATES),
		[]
	);

	useEffect(() => {
		let ticking = false;
		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setIsScrolled(window.scrollY > 40);
					ticking = false;
				});
				ticking = true;
			}
		};
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Reusable track items renderer with consistent trailing gap
	const renderTrackItems = (keyPrefix: string) => (
		<div className="flex shrink-0 items-center gap-10 pr-10">
			{repeatedUpdates.map((item, index) => {
				const content = (
					<span className="inline-flex items-center gap-3">
						<span
							className={cn(
								"transition-colors duration-150 font-sans",
								isTransparentHero
									? "hover:text-brand-warm-white"
									: "hover:text-brand-primary font-medium"
							)}
						>
							{item.text}
						</span>
					</span>
				);

				return item.href ? (
					<Link
						key={`${keyPrefix}-${item.id}-${index}`}
						href={item.href}
						className="inline-flex items-center outline-none focus-visible:ring-1 focus-visible:ring-brand-gold"
					>
						{content}
					</Link>
				) : (
					<span
						key={`${keyPrefix}-${item.id}-${index}`}
						className="inline-flex items-center"
					>
						{content}
					</span>
				);
			})}
		</div>
	);

	return (
		<aside
			aria-label="Announcements ticker"
			className={cn(
				"fixed top-0 left-0 w-full z-50 h-10 select-none overflow-hidden transition-[background-color,border-color,color] duration-300 text-xs tracking-wide",
				isTransparentHero
					? "bg-transparent text-brand-warm-white/80 border-white/10 drop-shadow-sm"
					: "bg-surface/90 backdrop-blur-xl text-brand-charcoal/80 border-surface-container-high/40 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
			)}
		>
			{/* Edge Fade Gradients */}
			<div
				className={cn(
					"pointer-events-none absolute inset-y-0 left-0 z-10 w-16 transition-colors duration-300",
					isTransparentHero
						? "bg-gradient-to-r from-black/20 to-transparent"
						: "bg-gradient-to-r from-surface to-transparent"
				)}
			/>
			<div
				className={cn(
					"pointer-events-none absolute inset-y-0 right-0 z-10 w-16 transition-colors duration-300",
					isTransparentHero
						? "bg-gradient-to-l from-black/20 to-transparent"
						: "bg-gradient-to-l from-surface to-transparent"
				)}
			/>

			{/* Continuous Horizontal Infinite Dual Track (No Hover Pausing) */}
			<div className="marquee-strip flex h-full w-full overflow-hidden items-center">
				<div
					className="marquee-track"
					style={{ animationDuration: "45s" }}
				>
					{renderTrackItems("track-1")}
				</div>
				<div
					aria-hidden="true"
					className="marquee-track"
					style={{ animationDuration: "45s" }}
				>
					{renderTrackItems("track-2")}
				</div>
			</div>
		</aside>
	);
}
