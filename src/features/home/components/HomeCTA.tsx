import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export function HomeCTA() {
	return (
		<section className="w-full">
			<div className="relative isolate overflow-hidden border-y border-[#0f3d2e] bg-[#00261a] px-5 py-10 my-10 shadow-[0_4px_24px_rgba(0,38,26,0.12)] sm:my-20 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-14">
				{/* Atmospheric lighting */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl sm:h-80 sm:w-80 lg:h-96 lg:w-96"
				/>

				<div
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full bg-primary-container/25 blur-3xl sm:h-72 sm:w-72"
				/>

				{/* Content */}
				<div className="relative z-10 mx-auto flex w-full max-w-container-max flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
					{/* Text */}
					<div className="max-w-2xl">
						<h2 className="font-serif text-2xl font-medium tracking-tight text-brand-warm-white sm:text-3xl lg:text-[2rem]">
							Join the Circle
						</h2>

						<p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-brand-warm-white/70 sm:text-[0.95rem]">
							Join a dedicated fellowship convening regularly for
							deliberative critiques and research roundtables.
						</p>
					</div>

					{/* Actions */}
					<div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
						<Link
							href="/join"
							className="group inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-brand-warm-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#00261a] sm:w-auto"
						>
							<span>Join Us</span>

							<ArrowRight
								aria-hidden="true"
								className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
							/>
						</Link>

						<Link
							href="/about"
							className="group inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-warm-white/75 transition-colors duration-300 hover:text-brand-warm-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-warm-white/60 sm:w-auto"
						>
							<span>Our Philosophy</span>

							<ChevronRight
								aria-hidden="true"
								className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
							/>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
