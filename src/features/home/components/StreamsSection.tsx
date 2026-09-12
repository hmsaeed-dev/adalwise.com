import React from "react";
import Link from "next/link";

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
			"Deliberative critiques, academic treatises, statecraft and  jurisprudence.",
		href: "/twasi-al-haq",
		image: "/images/twasi-al-haq.jpg",
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
		href: "/media",
		image: "/images/lectures-hero.jpg",
	},
];

export function StreamsSection() {
  return (
		<section className="w-full overflow-hidden bg-background px-gutter-mobile pt-space-2xl pb-space-2xl md:px-gutter-desktop">
			<div className="mx-auto w-full max-w-container-max">
				{/* Heading */}
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="font-headline-lg text-5xl font-medium tracking-tight text-primary md:text-4xl">
						Academic Streams
					</h2>
				</div>

				{/* Streams */}
				<div className="relative mt-14 md:mt-20">
					{/* Mobile vertical connecting line */}
					<div
						aria-hidden="true"
						className="absolute left-[18px] top-0 bottom-0 w-px bg-secondary/45 md:hidden "
					/>

					<div className="relative flex flex-col gap-12 md:grid md:grid-cols-3 md:gap-8 ">
						{streams.map((stream) => (
							<Link
								key={stream.title}
								href={stream.href}
								className="group relative pl-12 md:pl-0"
							>
								{/* Mobile connection node */}
								<span
									aria-hidden="true"
									className="absolute left-[13px] top-7 h-2.5 w-2.5 rounded-full bg-secondary md:hidden"
								/>

								{/* Card */}
								<div className="overflow-hidden bg-surface-container-low transition-transform duration-500 ease-out group-hover:-translate-y-2 border rounded-3xl">
									{/* Image */}
									<div className="relative aspect-[16/10] overflow-hidden">
										<img
											src={stream.image}
											alt=""
											className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
										/>

										<div className="absolute inset-0 bg-primary/5 transition-opacity duration-500 group-hover:opacity-0" />
									</div>

									{/* Content */}
									<div className="px-5 pb-7 pt-6 md:px-6 md:pb-8 md:pt-7">
										<h3 className="font-headline-sm text-2xl font-medium tracking-tight text-primary transition-colors duration-300 group-hover:text-secondary">
											{stream.title}
										</h3>

										<p className="mt-3 font-body-md leading-relaxed text-on-surface-variant">
											{stream.description}
										</p>
									</div>
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
  );
}
