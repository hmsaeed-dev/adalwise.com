import React from "react";
import Link from "next/link";
import { Video, BookOpen, Users, Compass, ArrowRight } from "lucide-react";

interface StreamItem {
	title: string;
	urduTitle: string;
	description: string;
	href: string;
	actionLabel: string;
	icon: React.ElementType;
	badge: string;
}

const streams: StreamItem[] = [
	{
		title: "Recorded Lectures",
		urduTitle: "درس و خطابات",
		description:
			"A systematic digital archive of Quranic Tafsir, Seerah as living methodology, and thematic public lectures by Dr. Hafiz Haseeb.",
		href: "/lectures",
		actionLabel: "Explore Lecture Archive",
		icon: Video,
		badge: "Digital Archive",
	},
	{
		title: "Twasi al-Haq",
		urduTitle: "تواصی بالحق",
		description:
			"Deliberative monographs, constitutional inquiries, and juridical critiques addressing state authority, legal theory, and civic ethics.",
		href: "/twasi-al-haq",
		actionLabel: "Read Treatises & Dissertations",
		icon: BookOpen,
		badge: "Monographs & Papers",
	},
	{
		title: "Majlis Seminars",
		urduTitle: "مجلسِ مکالمہ",
		description:
			"Fortnightly in-person and digital assemblies convening jurists, fellows, and researchers for structured, recorded debate.",
		href: "/majlis",
		actionLabel: "Explore Majlis Sessions",
		icon: Users,
		badge: "Fortnightly Assembly",
	},
	{
		title: "Quranic Direct Study",
		urduTitle: "تعلیمِ قرآن",
		description:
			"Foundational textual grounding, Quranic vocabulary, and classical grammar designed to give serious students direct access to the text.",
		href: "/join",
		actionLabel: "Join Study Fellowship",
		icon: Compass,
		badge: "Foundational Fellowship",
	},
];

export function WorkSection() {
	return (
		<section className="w-full bg-surface text-on-surface py-16 sm:py-20 md:py-24  border-surface-container-high/80">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop">
				{/* Section Header */}
				<div className="max-w-3xl mb-10 sm:mb-12">
					<h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-semibold leading-[1.18] tracking-tight">
						Manifestation of Work
					</h2>
					<p className="mt-3 font-serif italic text-base sm:text-lg text-secondary max-w-2xl font-medium">
						The method is carried forward across four practical
						mediums—linking foundational direct study to published
						research monographs and public discourse.
					</p>
				</div>

				{/* 2x2 Interactive Feature Grid with High Affordance */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
					{streams.map((stream) => {
						const IconComponent = stream.icon;
						return (
							<Link
								key={stream.title}
								href={stream.href}
								className="group relative rounded-2xl bg-surface-container-low border border-surface-container-high p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
							>
								<div>
									{/* Stream Title */}
									<h3 className="font-serif text-2xl text-primary font-semibold tracking-tight mt-5 group-hover:text-secondary transition-colors">
										{stream.title}
									</h3>

									{/* Expository Description */}
									<p className="mt-3 font-sans text-sm text-[#121915] leading-relaxed font-normal">
										{stream.description}
									</p>
								</div>

								
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
