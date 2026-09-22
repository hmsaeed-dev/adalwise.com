import React from "react";
import { Clock, Coffee, Users, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";

const RETREAT_SCHEDULE = [
	{
		title: "Arrival & Dastarkhwan Breakfast",
		urduTitle: "آمد اور ناشتہ بر دسترخوان",
		description:
			"Gathering on the woven dastarkhwan for fresh kulchas, chanay, yogurt, and morning tea, establishing unhurried brotherhood before academic deliberation.",
		icon: Coffee,
	},
	{
		title: "Poolside Fraternity & Open Dialogue",
		urduTitle: "اخوت و غیر رسمی مکالمہ",
		description:
			"Informal dialogue and swimming by the farmhouse pool at Canal View Farms, dissolving social hierarchies and connecting youth with scholars.",
		icon: Users,
	},
	{
		title: "The Symposium Deliberation",
		urduTitle: "علمی مذاکرہ و سیمینار",
		description:
			"Recorded panel symposium exploring the constitutional statecraft of Madinah, Mithaq al-Madina, and the contemporary crisis of statecraft in Pakistan.",
		icon: BookOpen,
	},
	{
		title: "Communal Feast & Post-Session Exchange",
		urduTitle: "ظہرانہ و طعامِ اخوت",
		description:
			"Communal lunch of biryani, raita, and salad on the dastarkhwan, continuing the debate organically in a relaxed, hospitable setting.",
		icon: Sparkles,
	},
	{
		title: "Assembly Resolutions & Closing Dua",
		urduTitle: "قرارداد، یادگاری تصویر و دعا",
		description:
			"Synthesis of takeaways, distribution of study briefs, formal assembly portrait, and collective prayer for societal renewal.",
		icon: CheckCircle2,
	},
];

export function MajlisDetailExperience() {
	return (
		<section aria-labelledby="schedule-heading" className="flex flex-col gap-5 sm:gap-6">
			<div className="flex items-baseline justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 sm:gap-2.5">
					<Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
					<h2
						id="schedule-heading"
						className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
					>
						The Experience
					</h2>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 sm:gap-4">
				{RETREAT_SCHEDULE.map((item, idx) => {
					const IconComponent = item.icon;
					return (
						<div
							key={idx}
							className="p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-3 shadow-xs"
						>
							<div className="space-y-2">
								<div className="flex items-center justify-between gap-2">
									<IconComponent className="w-4 h-4 text-brand-gold/80" />
								</div>

								<h3 className="font-serif text-sm font-semibold text-primary leading-snug">
									{item.title}
								</h3>

								<p className="font-urdu text-xs text-brand-gold font-bold dir-rtl">
									{item.urduTitle}
								</p>
							</div>

							<p className="text-[12px] font-sans text-on-surface-variant leading-relaxed">
								{item.description}
							</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
