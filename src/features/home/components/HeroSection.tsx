import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
	return (
		<section className="relative w-full px-gutter-mobile md:px-gutter-desktop pt-space-2xl pb-space-3xl overflow-hidden bg-primary text-on-primary">
			{/* Background Graphic Atmosphere */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-container/80 via-primary to-[#00140c] pointer-events-none" />
			<div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-tertiary-container/10 blur-3xl pointer-events-none" />
			<div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-tertiary-fixed/10 blur-3xl pointer-events-none" />

			<div className="relative z-10 max-w-container-max mx-auto flex flex-col items-center text-center py-space-xl">
				{/* Official Adlwise Crest Badge */}
				<div className="mb-space-md relative flex items-center justify-center">
					<div className="absolute inset-0 rounded-full bg-tertiary-container/25 blur-lg" />
					<div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-tertiary-container/50 via-tertiary-fixed/40 to-primary-container shadow-2xl ring-2 ring-tertiary-container/60 flex items-center justify-center">
						<div className="w-full h-full rounded-full overflow-hidden bg-primary flex items-center justify-center">
							<Image
								src="/images/logomark.png"
								alt="Adlwise Institute Crest"
								width={96}
								height={96}
								className="w-full h-full object-contain p-1"
								priority
							/>
						</div>
					</div>
				</div>

				<div className="font-urdu text-[34px] sm:text-[42px] text-tertiary-fixed font-bold leading-normal mb-space-md select-none drop-shadow-sm">
					عدل و حکمت
				</div>

				<h1 className="font-headline-sm sm:font-headline-md text-surface-container-highest max-w-md mx-auto leading-relaxed mb-space-2xl">
					Classical Jurisprudence &amp; Civic Constitutionalism
				</h1>

				<div className="flex flex-col sm:flex-row w-full gap-space-sm max-w-xs justify-center">
					<Link
						href="/twasi-al-haq"
						className="w-full min-h-[46px] px-space-md py-space-xs bg-tertiary-container text-on-tertiary-container font-label-md uppercase tracking-wider flex items-center justify-center gap-space-xs rounded-full shadow-md hover:bg-tertiary-fixed transition-colors font-semibold"
					>
						<span>Explore</span>
						<ArrowRight className="w-4 h-4" />
					</Link>
					<Link
						href="/join"
						className="w-full min-h-[46px] px-space-md py-space-xs bg-surface-container/15 text-surface-bright font-label-md uppercase tracking-wider flex items-center justify-center gap-space-2xs rounded-full backdrop-blur-sm hover:bg-surface-container/25 transition-colors font-semibold border border-surface-container/20"
					>
						Join Us
					</Link>
				</div>
			</div>
		</section>
	);
}
