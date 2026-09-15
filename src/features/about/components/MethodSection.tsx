import React from "react";

export function MethodSection() {
	return (
		<section
			id="method"
			className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-24 border-b border-surface-container-high/80 scroll-mt-20"
		>
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				<div className="max-w-3xl">

					{/* Primary Section Heading */}
					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-semibold leading-[1.18] tracking-tight">
						The Indivisibility of Justice and Wisdom
					</h2>

					{/* Framed Maxim Container */}
					<div className="mt-8 sm:mt-10 p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-surface-container-high shadow-sm">
						<p className="font-quran text-2xl sm:text-3xl text-primary font-medium leading-relaxed dir-rtl text-right sm:text-left">
							بِالْعَدْلِ قَامَتِ السَّمَاوَاتُ وَالأَرْضُ
						</p>
						<p className="mt-3 font-serif italic text-base sm:text-lg text-secondary leading-relaxed font-medium">
							By justice the heavens and the earth are established.
						</p>
					</div>

					{/* High-Contrast Expository Prose (Constrained to optimal 65ch measure) */}
					<div className="mt-8 sm:mt-10 max-w-[65ch] font-serif text-lg sm:text-[19px] text-[#121915] leading-[1.8] space-y-6">
						<p>
							In classical Islamic thought, justice (<em>‘Adl</em>) and wisdom (<em>Hikmah</em>)
							were never understood as distinct pursuits. Justice without wisdom degenerates
							into mechanical formalism—enforcing the outward letter of law while extinguishing
							its moral purpose and human equity. Wisdom without justice degrades into
							unprincipled pragmatism—clever accommodation without ethical backbone.
						</p>
						<p>
							Adalwise exists to restore their union. We approach the Seerah not as a closed
							historical chronicle to be preserved with nostalgic reverence, but as an
							active, living methodology of statecraft, ethics, and civic reasoning capable of
							addressing modern constitutional, legal, and human dilemmas.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
