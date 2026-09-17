"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Home, Scale, Video, Users, User } from "lucide-react";
import { mainNavItems } from "@/config/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const LiveSearchModal = dynamic(
	() =>
		import("@/components/search/LiveSearchModal").then(
			(mod) => mod.LiveSearchModal,
		),
	{ ssr: false },
);

export function Header() {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);
	const pathname = usePathname();

	// Check if the current route is one of the main root-level nav items
	const isMainNavRoot = mainNavItems.some((item) => item.href === pathname);

	// Transparent dark mode applies ONLY to root navigation pages while unscrolled
	const isTransparentHero = isMainNavRoot && !isScrolled;

	// Scroll listener: toggles scrolled state past 40px using requestAnimationFrame throttle
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

	// Global Ctrl+K / Escape listener
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				setIsSearchOpen((prev) => !prev);
			}
			if (e.key === "Escape") {
				setIsDrawerOpen(false);
				setIsSearchOpen(false);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	// Close drawer on route change
	useEffect(() => {
		setIsDrawerOpen(false);
	}, [pathname]);

	return (
		<>
			<header
				className={cn(
					"fixed top-10 w-full z-50 pt-safe transition-[background-color,border-color,box-shadow] duration-300",
					isTransparentHero
						? "bg-transparent shadow-none  border-transparent"
						: "bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]  border-surface-container-high/40",
				)}
			>
				<div className="h-16 md:h-14 px-6 max-w-7xl mx-auto flex items-center justify-between">
					{/* Brand Logo */}
					<Link href="/" className="flex items-center gap-3 group">
						<div className="relative w-12 h-12 sm:w-10 sm:h-10 rounded-full overflow-hidden p-0 flex items-center justify-center transition-transform group-hover:scale-103 shrink-0">
							<Image
								src="/images/assets/mountain-mark.svg"
								alt={`${siteConfig.name} Emblem`}
								width={36}
								height={36}
								className="w-full h-full object-contain rounded-full"
								priority
							/>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
						{mainNavItems.map((item) => {
							const isActive =
								item.href === "/"
									? pathname === "/"
									: pathname.startsWith(item.href);

							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"py-1 transition-colors relative font-sans text-sm tracking-wide",
										isTransparentHero
											? isActive
												? "text-brand-warm-white font-semibold drop-shadow"
												: "text-brand-warm-white/80 hover:text-brand-warm-white"
											: isActive
												? "text-brand-primary font-semibold"
												: "text-brand-charcoal/80 hover:text-brand-primary",
									)}
								>
									{item.title}
									{isActive && (
										<span
											className={cn(
												"absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full",
												isTransparentHero
													? "bg-brand-gold"
													: "bg-brand-primary",
											)}
										/>
									)}
								</Link>
							);
						})}
					</nav>

					{/* Action CTAs */}
					<div className="flex items-center gap-2 shrink-0">
						{/* Search Trigger */}
						<button
							type="button"
							onClick={() => setIsSearchOpen(true)}
							aria-label="Search Archive (Ctrl+K)"
							className={cn(
								"w-9 h-9 flex items-center justify-center rounded-full transition-colors",
								isTransparentHero
									? "text-brand-warm-white hover:bg-white/10"
									: "text-brand-primary hover:bg-brand-primary/5",
							)}
						>
							<Search
								className="w-[18px] h-[18px]"
								strokeWidth={2}
							/>
						</button>

						{/* Mobile Hamburger Toggle */}
						<button
							type="button"
							aria-label="Open Navigation Menu"
							onClick={() => setIsDrawerOpen(true)}
							className={cn(
								"w-9 h-9 flex md:hidden items-center justify-center rounded-full transition-colors",
								isTransparentHero
									? "text-brand-warm-white hover:bg-white/10"
									: "text-brand-primary hover:bg-brand-primary/5",
							)}
						>
							<Menu className="w-6 h-6" strokeWidth={1.75} />
						</button>
					</div>
				</div>
			</header>

			{/* Spacer: Only displayed on non-root pages so content is not hidden behind the fixed header */}
			{!isMainNavRoot && (
				<div className="h-[104px] w-full shrink-0" aria-hidden="true" />
			)}

			{/* Mobile Navigation Drawer */}
			{isDrawerOpen && (
				<div className="fixed inset-0 z-50 flex">
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity"
						onClick={() => setIsDrawerOpen(false)}
					/>

					{/* Drawer Panel */}
					<div className="relative ml-auto w-4/5 max-w-xs bg-surface/75 backdrop-blur-2xl backdrop-saturate-150 border-l border-white/20 dark:border-white/10 h-full p-space-lg flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
						<div className="flex flex-col gap-space-md">
							<div className="flex items-center justify-end pb-space-sm ">
								<button
									type="button"
									aria-label="Close Menu"
									onClick={() => setIsDrawerOpen(false)}
									className="w-8 h-8 flex place-items-end justify-end text-on-surface-variant hover:text-primary rounded-full transition-colors"
								>
									<X className="w-5 h-5" strokeWidth={4} />
								</button>
							</div>

							<nav className="flex flex-col gap-space-xs text-body-md font-medium">
								{mainNavItems.map((item) => {
									const isActive =
										item.href === "/"
											? pathname === "/"
											: pathname.startsWith(item.href);

									return (
										<Link
											key={item.href}
											href={item.href}
											className={cn(
												"py-space-xs px-space-sm rounded-xl flex items-center justify-between transition-colors",
												isActive
													? "bg-surface-container-high text-primary font-semibold"
													: "text-on-surface hover:bg-surface-container",
											)}
										>
											<div className="flex items-center gap-space-xs">
												{item.href === "/" && (
													<Home className="w-[18px] h-[18px] text-tertiary-container shrink-0" />
												)}
												{item.href ===
													"/twasi-al-haq" && (
													<Scale className="w-[18px] h-[18px] text-tertiary-container shrink-0" />
												)}
												{item.href === "/lectures" && (
													<Video className="w-[18px] h-[18px] text-tertiary-container shrink-0" />
												)}
												{item.href === "/majlis" && (
													<Users className="w-[18px] h-[18px] text-tertiary-container shrink-0" />
												)}
												{item.href === "/about" && (
													<User className="w-[18px] h-[18px] text-tertiary-container shrink-0" />
												)}
												<span>{item.title}</span>
											</div>
											{item.urduTitle && (
												<span className="font-urdu text-[13px] text-on-surface-variant">
													{item.urduTitle}
												</span>
											)}
										</Link>
									);
								})}
								<Link
									href="/search"
									className="py-space-xs px-space-sm rounded-xl flex items-center justify-between text-on-surface hover:bg-surface-container transition-colors"
								>
									<div className="flex items-center gap-space-xs">
										<Search className="w-[18px] h-[18px] text-tertiary-container shrink-0" />
										<span>Search</span>
									</div>
								</Link>
							</nav>
						</div>

						<div className="pt-space-md  border-surface-container-high flex flex-col gap-space-xs">
							<Link
								href="/join"
								className="w-full py-space-sm bg-primary text-on-primary font-label-md text-center uppercase tracking-wider block rounded-full hover:bg-primary-container transition-colors shadow-sm"
							>
								Join Us
							</Link>
						</div>
					</div>
				</div>
			)}

			{/* Live Search Modal Dialog (Dynamically loaded on-demand) */}
			{isSearchOpen && (
				<LiveSearchModal
					isOpen={isSearchOpen}
					onClose={() => setIsSearchOpen(false)}
				/>
			)}
		</>
	);
}
