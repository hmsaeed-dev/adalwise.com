import React from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { MajlisDoc } from "@/lib/content/schemas";

interface MajlisUpcomingProps {
	doc: MajlisDoc;
}

function formatSessionDate(dateStr: string): string {
	try {
		const d = new Date(dateStr);
		if (isNaN(d.getTime())) return dateStr;
		return d.toLocaleDateString("en-GB", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	} catch {
		return dateStr;
	}
}

export function MajlisUpcoming({ doc }: MajlisUpcomingProps) {
	const { session } = doc;
	const inquiries =
		session.keyInquiries.length > 0
			? session.keyInquiries
			: session.discussionPoints;
	const formattedDate = formatSessionDate(session.date);

	return (
		<section
			aria-labelledby="upcoming-majlis-heading"
			className=" border-brand-primary/15 pb-20 mb-20"
		>
			<div className="flex items-center gap-3 mb-6">
				<span
					className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"
					aria-hidden="true"
				/>
				<span className="font-sans text-xs uppercase tracking-[0.25em] font-medium text-brand-primary">
					Upcoming Majlis
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
				{/* Left Monogram & Convocator Details */}
				<div className="lg:col-span-4 flex flex-col justify-between">
					<div>
						<span className="font-serif text-6xl md:text-7xl lg:text-8xl font-light tracking-tighter text-brand-primary/25 select-none leading-none">
							{session.number || "01"}
						</span>
					</div>

					<div className="mt-8 space-y-2 font-sans text-sm text-brand-primary/75">
						<div className="flex items-center gap-2.5">
							<Calendar
								className="w-4 h-4 text-brand-primary/70 shrink-0"
								aria-hidden="true"
							/>
							<span>{formattedDate}</span>
						</div>
						<div className="flex items-center gap-2.5">
							<MapPin
								className="w-4 h-4 text-brand-primary/70 shrink-0"
								aria-hidden="true"
							/>
							<span>
								{session.venue ? `${session.venue} · ` : ""}
								{session.location}
							</span>
						</div>
					</div>
				</div>

				{/* Central Thesis & Dialogue Points */}
				<div className="lg:col-span-8 flex flex-col justify-between space-y-8">
					<div>
						<div className="flex items-baseline justify-between gap-4 flex-wrap mb-4">
							<h2
								id="upcoming-majlis-heading"
								className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-brand-primary"
							>
								{session.title}
							</h2>
							{session.urduTitle && (
								<span className="font-urdu text-2xl sm:text-3xl text-brand-primary/80 font-bold select-none dir-rtl">
									{session.urduTitle}
								</span>
							)}
						</div>

						{(session.thesis || session.description) && (
							<p className="font-serif text-lg sm:text-xl text-brand-primary/85 leading-relaxed max-w-3xl">
								{session.thesis || session.description}
							</p>
						)}
					</div>

					{/* Inquiry Points */}
					{inquiries.length > 0 && (
						<div className="bg-brand-parchment/60 border-l-2 border-brand-gold p-6 sm:p-7 space-y-4 rounded-r-lg">
							<h3 className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-brand-primary/70">
								Inquiries for Deliberation
							</h3>
							<ul className="space-y-3 font-sans text-sm sm:text-[15px] text-brand-primary/85 leading-relaxed">
								{inquiries.map((inquiry, index) => (
									<li
										key={index}
										className="flex items-start gap-3"
									>
										<span className="font-serif text-xs text-brand-primary font-medium mt-0.5 select-none">
											0{index + 1}
										</span>
										<span>{inquiry}</span>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Action Callout */}
					<div className="pt-2 flex items-center justify-between flex-wrap gap-4">
						<Link
							href={session.registrationUrl || "/join"}
							className="inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-brand-warm-white rounded-full text-xs tracking-[0.2em] font-medium uppercase transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 group"
						>
							<span>Reserve Your Seat</span>
							<ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</Link>
						<span className="text-xs text-brand-primary/60 font-sans tracking-wide">
							Limited to 25 participants
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
