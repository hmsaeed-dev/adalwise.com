import React from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { footerNav } from "@/config/nav";

export function Footer() {
	return (
		<footer className="w-full bg-primary px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-3xl mt-space-2xl text-brand-warm-white ">
			<div className="max-w-container-max mx-auto flex flex-col gap-space-xl">
				{/* Brand Bar */}
				<div className="flex items-center justify-between pb-space-md  border-surface-container-highest">
					<div className="flex items-center gap-space-xs">
						<div className="relative w-9 h-9 rounded-full overflow-hidden p-0.5 shrink-0">
							<Image
								src="/images/assets/mountain-mark.svg"
								alt={`${siteConfig.name} Crest`}
								width={36}
								height={36}
								className="brightness-0 invert w-full h-full object-contain rounded-full"
							/>
						</div>
						<div className="flex flex-col">
							<span className="font-headline-sm text-headline-sm text-brand-warm-white font-bold tracking-wider uppercase leading-none">
								{siteConfig.name}
							</span>
						</div>
					</div>
				</div>

				{/* Links Grid */}
				<div className="grid grid-cols-2 md:grid-cols-3 gap-space-lg">
					<div className="flex flex-col gap-space-xs">
						<span className="font-label-md text-label-md text-brand-warm-white font-bold uppercase tracking-wider">
							Holdings
						</span>
						<div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-brand-warm-white">
							{footerNav.navigation.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="hover:text-tertiary hover:underline transition-colors"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-space-xs">
						<span className="font-label-md text-label-md text-brand-warm-white font-bold uppercase tracking-wider">
							Curriculum
						</span>
						<div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-brand-warm-white">
							{footerNav.curriculum.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="hover:text-tertiary hover:underline transition-colors"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>

					<div className="flex flex-col gap-space-xs">
						<span className="font-label-md text-label-md text-brand-warm-white font-bold uppercase tracking-wider">
							Initiative
						</span>
						<div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-brand-warm-white">
							{footerNav.academy.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="hover:text-tertiary hover:underline transition-colors"
								>
									{item.title}
								</Link>
							))}
						</div>
					</div>
				</div>

				{/* Copyright & Meta */}
				<div className="pt-space-md  border-surface-container-highest flex flex-col sm:flex-row items-center justify-between gap-space-xs text-center sm:text-left">
					<p className="font-label-sm text-label-sm text-brand-warm-white text-[11px] tracking-wide">
						© {new Date().getFullYear()} Adlwise. All rights
						reserved.
					</p>
					<span className="font-urdu text-[18px] text-brand-warm-white">
						عدل و حکمت
					</span>
				</div>
			</div>
		</footer>
	);
}
