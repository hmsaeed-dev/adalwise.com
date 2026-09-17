"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavItems } from "@/config/nav";
import { cn } from "@/lib/utils";

interface NewsItem {
	id: string;
	badge?: string;
	text: string;
	href?: string;
}

const NEWS_UPDATES: NewsItem[] = [
	{
		id: "1",
		badge: "Cohort",
		text: "Applications for the Autumn Fellowship cycle are now open.",
		href: "/majlis",
	},
	{
		id: "2",
		badge: "Lecture Series",
		text: "New discourse: Constitutional Principles of the Charter of Madinah.",
		href: "/lectures",
	},
	{
		id: "3",
		badge: "Publication",
		text: "Twasi al-Haq monograph on Legal Philosophy released.",
		href: "/twasi-al-haq",
	},
];

export function Updates() {
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	const isMainNavRoot = mainNavItems.some((item) => item.href === pathname);
	const isTransparentHero = isMainNavRoot && !isScrolled;

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

	// Reusable track items renderer
	const renderTrackItems = (keyPrefix: string) => (
		<div className="flex shrink-0 items-center gap-10 pr-10">
			{NEWS_UPDATES.map((item, index) => {
				const content = (
					<span className="inline-flex items-center gap-3">
						{item.badge && (
							<span
								className={cn(
									"rounded-full px-2 py-0.5 font-medium text-[10px] uppercase tracking-wider transition-colors",
									isTransparentHero
										? "bg-white/15 text-brand-warm-white border border-white/20"
										: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
								)}
							>
								{item.badge}
							</span>
						)}
						<span
							className={cn(
								"transition-colors duration-150 font-sans",
								isTransparentHero
									? "hover:text-brand-warm-white"
									: "hover:text-brand-primary font-medium",
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
					? "bg-transparent text-brand-warm-white/80  border-white/10 drop-shadow-sm"
					: "bg-surface/90 backdrop-blur-xl text-brand-charcoal/80  border-surface-container-high/40 shadow-[0_1px_4px_rgba(0,0,0,0.02)]",
			)}
		>
			{/* Edge Fade Gradients */}
			<div
				className={cn(
					"pointer-events-none absolute inset-y-0 left-0 z-10 w-16 transition-colors duration-300",
					isTransparentHero
						? "bg-gradient-to-r from-black/20 to-transparent"
						: "bg-gradient-to-r from-surface to-transparent",
				)}
			/>
			<div
				className={cn(
					"pointer-events-none absolute inset-y-0 right-0 z-10 w-16 transition-colors duration-300",
					isTransparentHero
						? "bg-gradient-to-l from-black/20 to-transparent"
						: "bg-gradient-to-l from-surface to-transparent",
				)}
			/>

			{/* Seamless Infinite Dual Track */}
			<div className="group flex h-full w-max items-center">
				<div className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
					{renderTrackItems("track-1")}
				</div>
				<div
					aria-hidden="true"
					className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
				>
					{renderTrackItems("track-2")}
				</div>
			</div>
		</aside>
	);
}
