import React from "react";

export function BioSection() {
	return (
		<section className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-28 ">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Section Header */}
				<div className="max-w-3xl mb-10 sm:mb-12">


					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-semibold leading-[1.18] tracking-tight">
						Dr. Hafiz Haseeb
					</h2>
					<p className="mt-2 font-serif italic text-lg sm:text-xl text-secondary font-medium">
						Clinical discipline applied to sacred texts.
					</p>
				</div>

				{/* ─── MATN (PROSE) & HASHIYA (MARGINALIA) BALANCED GRID ─── */}
				<div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
					{/* Left: The Matn Narrative (Constrained to 65ch measure) */}
					<div className="lg:col-span-7 flex flex-col gap-6">

						<div className="font-serif text-lg sm:text-[19px] text-[#121915] leading-[1.8] space-y-6 max-w-[65ch]">
							<p>
								Dr. Hafiz Haseeb is a consultant hematologist and researcher who has
								dedicated over two decades to the systematic study, contextualization,
								and teaching of the Quran.
							</p>
							<p>
								His reading of sacred texts reflects his clinical discipline. In medicine,
								diagnostic pathology demands meticulous observation, distinguishing
								superficial symptoms from root etiology, and testing conclusions against
								verifiable evidence. He brings that exact forensic discipline to Islamic
								jurisprudence and Quranic hermeneutics—treating textual inquiry not as an
								arena for rhetoric or sectarian polemics, but as a rigorous science
								requiring linguistic precision, constitutional context, and intellectual
								sobriety.
							</p>
							<p>
								His intellectual formation was profoundly shaped by years of direct study
								and close personal association with Dr. Israr Ahmed (رحمہ اللہ). The
								emphasis on Quran-centric revival, systemic thought, intellectual honesty,
								and civilizational responsibility that defined Dr. Israr’s work remains
								a foundational benchmark in Dr. Haseeb’s own pedagogical and research
								undertakings.
							</p>
							<p>
								In public life, Dr. Haseeb founded the Peaceful Quranic Revival Society
								(PQRS) to establish serious, non-sectarian study circles among students,
								jurists, and working professionals. His weekly discourses, recorded
								thematic series, and television broadcasts on <em>Noor-e-Sahar</em> (24
								News HD) investigate how classical jurisprudence speaks directly to
								contemporary public ethics, constitutional covenants, and human
								flourishing.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
