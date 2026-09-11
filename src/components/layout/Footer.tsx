import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/nav";

export function Footer() {
	return (
		<footer className="w-full bg-surface-container-low px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-3xl mt-space-2xl text-on-surface border-t border-surface-container-high/40">
			<div className="max-w-container-max mx-auto flex flex-col gap-space-xl">
				{/* Brand Bar */}
				<div className="flex items-center justify-between pb-space-md border-b border-surface-container-highest">
					<div className="flex items-center gap-space-xs">
						<div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary ring-1 ring-tertiary-container/40 p-0.5 shadow-sm shrink-0">
							<Image
								src="/images/logo-badge.png"
								alt={`${siteConfig.name} Crest`}
								width={36}
								height={36}
								className="w-full h-full object-contain rounded-full"
							/>
						</div>
						<div className="flex flex-col">
							<span className="font-headline-sm text-headline-sm text-primary font-bold tracking-wider uppercase leading-none">
								{siteConfig.name}
							</span>
						</div>
					</div>
				</div>

				{/* Links Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-space-lg">
					<div className="flex flex-col gap-space-xs">
						<span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
							Navigation
						</span>
						<div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
							{footerNav.navigation.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="hover:text-primary transition-colors"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-space-xs">
						<span className="font-label-md text-label-md text-primary font-bold uppercase tracking-wider">
							Academy
						</span>
						<div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
							{footerNav.academy.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="hover:text-primary transition-colors"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>
				</div>

				{/* Copyright & Meta */}
				<div className="pt-space-md border-t border-surface-container-highest flex flex-col sm:flex-row items-center justify-between gap-space-xs text-center sm:text-left">
					<p className="font-label-sm text-label-sm text-on-surface-variant text-[11px] tracking-wide">
						© {new Date().getFullYear()} Adlwise. All rights
						reserved.
					</p>
					<span className="font-urdu text-[12px] text-tertiary">
						عدل و حکمت
					</span>
				</div>
			</div>
		</footer>
	);
}
