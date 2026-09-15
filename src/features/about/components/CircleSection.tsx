import React from "react";

interface Interlocutor {
	name: string;
	urduName?: string;
	domain: string;
	description: string;
	focusAreas: string[];
}

const interlocutors: Interlocutor[] = [
	{
		name: "Sir Hafiz Touseef",
		urduName: "حافظ توصیف",
		domain: "Politics & Constitutional Affairs",
		description:
			"Juristic inquiry into constitutional covenants, institutional history, parliamentary governance, and civic jurisprudence.",
		focusAreas: ["Constitutional Law", "Statecraft", "Civic Equity"],
	},
	{
		name: "Dr. Hassan Ayub",
		urduName: "ڈاکٹر حسن ایوب",
		domain: "Geopolitics & Political Theory",
		description:
			"Critical examination of the modern international order, sovereignty, political philosophy, and civilizational statecraft.",
		focusAreas: ["International Order", "Political Theory", "Sovereignty"],
	},
	{
		name: "Dr. Abdul Sami",
		urduName: "ڈاکٹر عبد السمیع",
		domain: "Classical Jurisprudence & Kalam",
		description:
			"Methodological examination of classical legal maxims (Qawa’id Fiqhiyyah), theology, and systemic institutional reform.",
		focusAreas: ["Usul al-Fiqh", "Theology (Kalam)", "Institutional Reform"],
	},
];

export function CircleSection() {
	return (
		<section className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-24 border-b border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Section Header */}
				<div className="max-w-3xl mb-10 sm:mb-12">


					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-semibold leading-[1.18] tracking-tight">
						The Circle
					</h2>
					<span className="font-urdu text-sm text-tertiary font-bold dir-rtl">
						حلقۂ رفقاء
					</span>
					<p className="mt-3 font-serif italic text-base sm:text-lg text-secondary max-w-2xl font-medium">
						Independent thinkers and researchers contributing
						domain-specific rigor to the ongoing discourse—without
						artificial hierarchy or corporate titles.
					</p>
				</div>

				{/* Distinct, Scannable 3-Column Card Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
					{interlocutors.map((person) => (
						<div
							key={person.name}
							className="rounded-2xl bg-surface-container-low border border-surface-container-high p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200"
						>
							<div>

								{/* Scholar Identity */}
								<h3 className="font-serif text-2xl text-primary font-semibold tracking-tight">
									{person.name}
								</h3>

								{/* Description */}
								<p className="mt-4 font-sans text-sm text-[#121915] leading-relaxed font-normal">
									{person.description}
								</p>
							</div>

							{/* Focus Area Tags Footer */}
							<div className="mt-6 pt-5 border-t border-surface-container-high flex flex-wrap gap-1.5">
								{person.focusAreas.map((area) => (
									<span
										key={area}
										className="font-sans text-[11px] px-2.5 py-0.5 rounded-md bg-surface-container-lowest border border-surface-container-high text-on-surface-variant font-medium"
									>
										{area}
									</span>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
