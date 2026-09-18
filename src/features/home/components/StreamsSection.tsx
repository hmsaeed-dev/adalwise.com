import React from "react";
import Link from "next/link";
import Image from "next/image";

interface StreamCard {
	title: string;
	description: string;
	href: string;
	image: string;
}

const streams: StreamCard[] = [
	{
		title: "Twasi al-Haq",
		description:
			"Deliberative critiques, academic treatises, statecraft and jurisprudence.",
		href: "/twasi-al-haq",
		image: "/images/twasi.jpg",
	},
	{
		title: "Majlis Events",
		description:
			"Fortnightly in-person seminars convening jurists, fellows, and students.",
		href: "/majlis",
		image: "/images/majlis-hero.jpg",
	},
	{
		title: "Lecture Series",
		description:
			"Systematic Quranic Tafsir, Seerat, and a growing catalogue of recorded lectures.",
		href: "/lectures",
		image: "/images/lectures-hero.jpg",
	},
];

export function StreamsSection() {
	return (
		<section className="w-full overflow-hidden bg-background px-gutter-mobile pt-space-2xl pb-space-2xl md:px-gutter-desktop">
			<div
				id="academic-streams"
				className="mx-auto w-full max-w-container-max"
			>
				{/* Heading */}
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-headline-lg text-3xl font-medium tracking-tight text-primary md:text-5xl">
						Academic Streams
					</h2>
				</div>

				{/* Streams */}
				<div className="mt-6 md:mt-20">
					<div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
						{streams.map((stream) => (
							<Link
								key={stream.title}
								href={stream.href}
								className="group relative block aspect-[16/10] overflow-hidden rounded-3xl border border-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 md:aspect-[4/5]"
							>
								{/* Background Image */}
								<Image
									src={stream.image}
									alt={stream.title}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover transition-transform duration-700 ease-out"
								/>

								{/* Subtle overall image treatment */}
								<div
									aria-hidden="true"
									className="absolute inset-0 bg-primary/5 transition-colors duration-900 group-hover:bg-primary/0"
								/>

								{/* Bottom text gradient */}
								<div
									aria-hidden="true"
									className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/75 via-black/35 to-transparent"
								/>

								{/* Content */}
								<div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
									<h3 className="font-headline-sm text-2xl font-medium tracking-tight text-white transition-transform duration-500 md:text-3xl">
										{stream.title}
									</h3>

									<p className="mt-2 max-w-[32rem] font-body-md leading-relaxed text-white/85">
										{stream.description}
									</p>
								</div>

								{/* Hover border */}
								<div
									aria-hidden="true"
									className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 transition-all duration-500 group-hover:ring-white/25"
								/>
							</Link>
						))}
					</div>
				</div>
			</div>

		</section>
	);
}
