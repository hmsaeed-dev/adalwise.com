import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function IqbalGatewaySection() {
	return (
		<section
			aria-labelledby="iqbal-gateway-title"
			className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop mt-8 mb-14 sm:mt-12 sm:mb-18 md:mt-16 md:mb-20"
		>
			<Link
				href="/iqbal"
				className="group block relative rounded-2xl sm:rounded-3xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high hover:border-brand-gold/50 transition-all duration-300 p-6 sm:p-8 md:p-10 shadow-xs hover:shadow-md overflow-hidden"
			>
				{/* Atmospheric Watermark: Urdu Calligraphy */}
				<div
					aria-hidden="true"
					className="absolute -right-8 -bottom-6 pointer-events-none select-none opacity-[0.045] group-hover:opacity-[0.075] transition-opacity duration-500 font-urdu text-[110px] sm:text-[160px] md:text-[200px] text-primary leading-none whitespace-nowrap dir-rtl"
				>
					اقبال
				</div>

				<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
					{/* Left: Editorial Context Lockup */}
					<div className="lg:col-span-7 flex flex-col gap-3 sm:gap-3.5">

						<div className="flex items-baseline gap-3.5 sm:gap-4 flex-wrap">
							<h2
								id="iqbal-gateway-title"
								className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold text-primary tracking-tight leading-[1.15]"
							>
								Allama Iqbal
							</h2>
							<span className="font-urdu text-xl sm:text-2xl md:text-3xl text-brand-gold font-bold dir-rtl select-none">
								علامہ اقبال
							</span>
						</div>

						<p className="font-sans text-xs sm:text-sm md:text-[15px] text-on-surface-variant/90 max-w-xl leading-relaxed font-normal">
							A dedicated pathway exploring the Reconstruction of Religious Thought,
							the juristic principle of <em>Ijtihad</em>, and civilizational revival through Dr. Hafiz Haseeb&apos;s
							thematic discourses on <em>Zarb-e-Kaleem</em> and modern Islamic philosophy.
						</p>

						<div className="pt-1.5">
							<span className="inline-flex items-center gap-2 text-xs sm:text-sm font-sans uppercase tracking-widest font-semibold text-primary group-hover:text-brand-gold transition-colors">
								<span>Explore</span>
								<ArrowUpRight
									className="w-4 h-4 text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
									aria-hidden="true"
								/>
							</span>
						</div>
					</div>

					{/* Right: Archival Couplet Epigraph */}
					<div className="lg:col-span-5 flex justify-start lg:justify-end">
						<div className="w-full max-w-md p-5 sm:p-6 rounded-2xl bg-surface-container-lowest/80 border border-surface-container-high/60 group-hover:border-brand-gold/30 transition-colors">
							<p className="font-urdu text-sm sm:text-base md:text-lg text-primary font-bold dir-rtl leading-[2.3] text-center">
								سبق پھر پڑھ صداقت کا، عدالت کا، شجاعت کا
								<br />
								لیا جائے گا تجھ سے کام دنیا کی امامت کا
							</p>
						</div>
					</div>
				</div>
			</Link>
		</section>
	);
}
