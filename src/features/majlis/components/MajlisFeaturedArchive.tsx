import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowRight,
	Calendar,
	MapPin,
	Camera,
	Video,
	FileText,
	Sparkles,
	BookOpen,
} from "lucide-react";
import { MajlisDoc } from "@/lib/content/schemas";

interface MajlisFeaturedArchiveProps {
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

export function MajlisFeaturedArchive({ doc }: MajlisFeaturedArchiveProps) {
	const { session, slug } = doc;
	const formattedDate = formatSessionDate(session.date);
	const heroImage =
		session.gallery && session.gallery.length > 0
			? session.gallery[0].url
			: "/images/majlis-hero.jpg";

	return (
		<section
			aria-labelledby="featured-majlis-heading"
			className="w-full mb-16 md:mb-24"
		>
			{/* Top Eyebrow Section */}
			<div className="flex items-center justify-between flex-wrap gap-3 mb-6">
				<div className="flex items-center gap-2.5">
					<span className="w-2 h-2 rounded-full bg-brand-gold" aria-hidden="true" />
					<span className="font-mono text-xs uppercase tracking-[0.25em] font-semibold text-primary">
						Latest Majlis
					</span>
				</div>
			</div>

			{/* Main Editorial Card Container */}
			<div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c281c] to-[#061710] text-brand-warm-white shadow-xl transition-all duration-300">
				<div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
					{/* Left: Atmospheric Photography Showcase */}
					<div className="lg:col-span-5 relative min-h-[300px] sm:min-h-[360px] lg:min-h-full overflow-hidden">
						<Image
							src={heroImage}
							alt={session.title}
							fill
							priority
							sizes="(max-width: 1024px) 100vw, 42vw"
							className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
						/>
						{/* Vignette & Gradients */}
						<div className="absolute inset-0 bg-gradient-to-t from-[#061710] via-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-[#061710]/40 lg:to-[#0c281c]" />

						{/* Setting Badge Overlay */}
					</div>

					{/* Right: Rich Editorial Content & Metadata */}
					<div className="lg:col-span-7 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between gap-6 sm:gap-8">
						<div className="space-y-4 sm:space-y-5">
							{/* Location & Date */}
							<div className="flex items-center gap-4 flex-wrap text-xs sm:text-sm text-brand-warm-white/75 font-sans">
								<div className="flex items-center gap-1.5 text-brand-gold font-medium">
									<Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
									<span>{formattedDate}</span>
								</div>
							</div>

							{/* Title & Urdu Title */}
							<div className="flex items-baseline justify-between gap-4 flex-wrap">
								<h2
									id="featured-majlis-heading"
									className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-brand-warm-white leading-tight"
								>
									{session.title}
								</h2>
								{session.urduTitle && (
									<span className="font-urdu text-2xl sm:text-3xl md:text-4xl text-brand-gold font-bold dir-rtl select-none">
										{session.urduTitle}
									</span>
								)}
							</div>

							{/* Concept Subtitle */}
							{session.theme && (
								<p className="text-sm sm:text-base font-sans font-medium text-brand-gold tracking-wide">
									{session.theme}
								</p>
							)}


						</div>

						{/* Primary Action Button */}
						<div className="pt-4 flex items-center justify-between flex-wrap gap-4">
							<Link
								href={`/majlis/${slug}`}
								className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 bg-brand-gold hover:bg-brand-gold/90 text-[#061710] font-sans text-xs uppercase tracking-[0.2em] font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 group/btn"
							>
								<span>Explore</span>
								<ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
