import React from "react";
import Image from "next/image";

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

				{/* ─── INTEGRATED SCHOLAR DOSSIER CARD (Anchor Profile) ─── */}
				<div className="w-full rounded-2xl bg-surface-container-low border border-surface-container-high p-6 sm:p-8 md:p-10 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
					{/* Portrait Plate */}
					<div className="relative w-48 h-64 sm:w-56 sm:h-72 shrink-0 rounded-xl overflow-hidden border border-surface-container-highest shadow-md bg-surface-container-high">
						<Image
							src="/images/haseeb-02.jpg"
							alt="Dr. Hafiz Haseeb, Consultant Hematologist and Quranic Researcher"
							fill
							className="object-cover object-top filter contrast-[1.03]"
							sizes="(max-width: 640px) 192px, 224px"
							priority
						/>
					</div>

					{/* Profile Header & Summary Grid */}
					<div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">

						<h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-primary font-semibold tracking-tight">
							Dr. Hafiz Haseeb (FCPS)
						</h3>

						<p className="mt-4 font-sans text-sm sm:text-base text-[#121915] leading-relaxed max-w-2xl font-normal">
							Consultant hematologist applying the evidentiary rigor, pathology diagnostics,
							and root-cause analysis of modern clinical science to classical Islamic
							jurisprudence and Quranic hermeneutics.
						</p>

						{/* Quick Credential Badges Grid */}
						<div className="mt-6 pt-6 border-t border-surface-container-high w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
							<div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60">
								<span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 shrink-0" />
								<div>
									<span className="font-sans text-xs font-bold text-primary block uppercase tracking-wider">
										Clinical Fellowship
									</span>
									<span className="font-sans text-xs text-on-surface-variant">
										FCPS (Hematology) · Consultant Specialist
									</span>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60">
								<span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 shrink-0" />
								<div>
									<span className="font-sans text-xs font-bold text-primary block uppercase tracking-wider">
										Formative Lineage
									</span>
									<span className="font-sans text-xs text-on-surface-variant">
										Direct student of Dr. Israr Ahmed (رحمہ اللہ)
									</span>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60">
								<span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 shrink-0" />
								<div>
									<span className="font-sans text-xs font-bold text-primary block uppercase tracking-wider">
										Community Initiative
									</span>
									<span className="font-sans text-xs text-on-surface-variant">
										Founder, Peaceful Quranic Revival Society (PQRS)
									</span>
								</div>
							</div>

							<div className="flex items-start gap-3 p-3 rounded-xl bg-surface-container-lowest border border-surface-container-high/60">
								<span className="w-2 h-2 rounded-full bg-brand-gold mt-1.5 shrink-0" />
								<div>
									<span className="font-sans text-xs font-bold text-primary block uppercase tracking-wider">
										National Broadcasts
									</span>
									<span className="font-sans text-xs text-on-surface-variant">
										<em>Noor-e-Sahar</em> series on 24 News HD
									</span>
								</div>
							</div>
						</div>
					</div>
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

					{/* Right: The Hashiya Marginalia Ledger (Bounded, High-Scannability Cards) */}
					<div className="lg:col-span-5 flex flex-col gap-4">

						<div className="flex flex-col gap-4">
							{/* Entry 1 */}
							<div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high border-l-4 border-l-brand-gold shadow-sm">
								<span className="font-sans text-[11px] uppercase tracking-wider text-secondary font-bold block">
									01 · Clinical Foundation
								</span>
								<h4 className="font-serif text-lg text-primary font-semibold mt-1">
									FCPS (Hematology)
								</h4>
								<p className="mt-1 font-sans text-xs text-[#2d3830] leading-relaxed">
									Consultant Hematologist. Clinical diagnostic discipline informing
									hermeneutical precision and evidentiary analysis.
								</p>
							</div>

							{/* Entry 2 */}
							<div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high border-l-4 border-l-brand-gold shadow-sm">
								<span className="font-sans text-[11px] uppercase tracking-wider text-secondary font-bold block">
									02 · Formative Mentorship
								</span>
								<h4 className="font-serif text-lg text-primary font-semibold mt-1">
									Dr. Israr Ahmed (رحمہ اللہ)
								</h4>
								<p className="mt-1 font-sans text-xs text-[#2d3830] leading-relaxed">
									Direct discipleship and sustained study. Quranic Academy and Markazi
									Anjuman Khuddam-ul-Quran revival tradition.
								</p>
							</div>

							{/* Entry 3 */}
							<div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high border-l-4 border-l-brand-gold shadow-sm">
								<span className="font-sans text-[11px] uppercase tracking-wider text-secondary font-bold block">
									03 · Public Initiative
								</span>
								<h4 className="font-serif text-lg text-primary font-semibold mt-1">
									Peaceful Quranic Revival Society (PQRS)
								</h4>
								<p className="mt-1 font-sans text-xs text-[#2d3830] leading-relaxed">
									Founder and lead facilitator. Non-sectarian study circles spanning
									Lahore and online communities.
								</p>
							</div>

							{/* Entry 4 */}
							<div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high border-l-4 border-l-brand-gold shadow-sm">
								<span className="font-sans text-[11px] uppercase tracking-wider text-secondary font-bold block">
									04 · Public Broadcasts
								</span>
								<h4 className="font-serif text-lg text-primary font-semibold mt-1">
									Noor-e-Sahar (24 News HD)
								</h4>
								<p className="mt-1 font-sans text-xs text-[#2d3830] leading-relaxed">
									National televised discourse series addressing constitutional ethics,
									social cohesion, and Quranic commentary.
								</p>
							</div>

							{/* Entry 5 */}
							<div className="p-5 rounded-xl bg-surface-container-low border border-surface-container-high border-l-4 border-l-brand-gold shadow-sm">
								<span className="font-sans text-[11px] uppercase tracking-wider text-secondary font-bold block">
									05 · Interlocutor Circle
								</span>
								<h4 className="font-serif text-lg text-primary font-semibold mt-1">
									Dr. Abdul Sami
								</h4>
								<p className="mt-1 font-sans text-xs text-[#2d3830] leading-relaxed">
									Collegiate dialogue and peer collaboration across classical legal theory
									(<em>Usul</em>), theology (<em>Kalam</em>), and statecraft.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
