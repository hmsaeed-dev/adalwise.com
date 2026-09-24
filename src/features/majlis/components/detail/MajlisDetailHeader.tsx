import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowLeft,
	Calendar,
	MapPin,
	ExternalLink,
	Clock,
	Video,
} from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";

interface MajlisDetailHeaderProps {
	session: MajlisSession;
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

export function MajlisDetailHeader({ session }: MajlisDetailHeaderProps) {
	const formattedDate = formatSessionDate(session.date);
	const primaryPhoto =
		session.gallery && session.gallery.length > 0
			? session.gallery[0]
			: null;
	const isUpcoming = session.status === "upcoming";

	return (
		<header className="flex flex-col gap-6 sm:gap-8">
			{/* Breadcrumb & Status Ribbon */}
			<nav
				aria-label="Breadcrumb"
				className="flex items-center justify-between flex-wrap gap-3 text-[11px] sm:text-xs font-sans uppercase tracking-widest text-on-surface-variant pb-3"
			>
				<div className="flex items-center gap-2">
					<Link
						href="/majlis"
						className="hover:text-primary transition-colors inline-flex items-center gap-1.5 font-medium"
					>
						<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
						<span>Majlis</span>
					</Link>
					<span
						aria-hidden="true"
						className="text-surface-container-highest"
					>
						/
					</span>
					<span className="text-primary font-bold">
						Session {session.number || "01"}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<span
						className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-semibold ${
							isUpcoming
								? "bg-brand-gold/15 text-brand-gold border border-brand-gold/30"
								: "bg-surface-container-high text-primary/80 border border-surface-container-highest"
						}`}
					></span>
				</div>
			</nav>

			{/* Main Masthead: 2-Column Split (Identity + Video Dispatch) */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
				{/* Left Column (7 cols): Event Identity, Charter & Compact Speaker Strip */}
				<div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
					{/* Metadata Badges */}
					<div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs sm:text-sm font-sans tracking-wide text-on-surface-variant">
						<span className="flex items-center gap-1.5 text-primary font-semibold">
							<Calendar
								className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold shrink-0"
								aria-hidden="true"
							/>
							<span>{formattedDate}</span>
						</span>
						<span className="flex items-center gap-1.5">
							<MapPin
								className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold shrink-0"
								aria-hidden="true"
							/>
							{session.mapsUrl && (
								<a
									href={session.mapsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center text-primary font-semibold gap-1 hover:underline mt-1"
								>
									<span>{session.location}</span>
								</a>
							)}
						</span>
					</div>

					{/* Title & Urdu Title Lockup */}
					<div className="flex flex-col gap-2">
						<div className="flex items-baseline justify-between gap-3 sm:gap-4 flex-wrap">
							<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold text-primary tracking-tight leading-[1.12]">
								{session.title}
							</h1>

							{session.urduTitle && (
								<span className="font-urdu text-2xl sm:text-3xl md:text-4xl text-brand-gold font-bold dir-rtl select-none tracking-normal">
									{session.urduTitle}
								</span>
							)}
						</div>

						{/* Concept Subtitle / Theme */}
						{session.theme && (
							<p className="text-sm sm:text-base md:text-lg font-sans font-medium text-primary/80">
								{session.theme}
							</p>
						)}
					</div>

					{/* Charter / Thesis Lead */}
					{(session.objective ||
						session.thesis ||
						session.description) && (
						<div className="relative pl-4 border-l-2 border-brand-gold/60 py-0.5">
							<p className="font-sans text-sm sm:text-base text-primary/90 leading-relaxed font-normal">
								{session.objective ||
									session.thesis ||
									session.description}
							</p>
						</div>
					)}

					{/* Compact Speaker Cluster */}
					{session.speakers && session.speakers.length > 0 && (
						<div className="pt-2 flex flex-col gap-2.5">
							<div className="flex flex-wrap items-center gap-3 sm:gap-4">
								{session.speakers.map((speaker, idx) => {
									const isHaseeb = speaker.name
										.toLowerCase()
										.includes("haseeb");
									const speakerHref = isHaseeb
										? "/about"
										: undefined;

									const content = (
										<div className="group flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container-high/40 hover:border-brand-gold/40">
											{speaker.avatarUrl ? (
												<div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 ring-1.5 ring-brand-gold/40 group-hover:ring-brand-gold transition-all">
													<Image
														src={speaker.avatarUrl}
														alt={speaker.name}
														fill
														className="object-cover object-center"
													/>
												</div>
											) : (
												<div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-brand-gold flex items-center justify-center font-serif text-xs font-bold shrink-0">
													{speaker.name.charAt(0)}
												</div>
											)}
											<div className="flex flex-col min-w-0">
												<span className="font-serif text-xs sm:text-sm font-semibold text-primary group-hover:text-primary-hover truncate leading-tight">
													{speaker.name}
												</span>
												<span className="text-[10px] text-on-surface-variant/80 truncate leading-tight font-sans">
													{speaker.role ||
														speaker.title}
												</span>
											</div>
										</div>
									);

									return speakerHref ? (
										<Link
											key={idx}
											href={speakerHref}
											title={`View profile of ${speaker.name}: ${speaker.topic}`}
										>
											{content}
										</Link>
									) : (
										<div
											key={idx}
											title={`${speaker.name}: ${speaker.topic}`}
										>
											{content}
										</div>
									);
								})}
							</div>
						</div>
					)}
				</div>

				{/* Right Column (5 cols): Integrated Playable Video Dispatch or Hero Visual */}
				<div className="lg:col-span-5 w-full flex flex-col gap-2">
					{session.videoUrl ? (
						<div className="w-full rounded-2xl overflow-hidden bg-black shadow-md border border-surface-container-high/60 group">
							<div className="relative aspect-[16/10] sm:aspect-video lg:aspect-[4/3] w-full bg-black flex items-center justify-center">
								<video
									src={session.videoUrl}
									controls
									playsInline
									preload="metadata"
									poster={
										primaryPhoto?.url ||
										"/images/majlis-hero.jpg"
									}
									className="w-full h-full object-contain"
								>
									Your browser does not support HTML5 video.
								</video>
							</div>
						</div>
					) : primaryPhoto ? (
						<div className="relative aspect-[16/10] sm:aspect-video lg:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-surface-container-low shadow-sm">
							<Image
								src={primaryPhoto.url}
								alt={primaryPhoto.caption || session.title}
								fill
								className="object-cover object-center"
								priority
								sizes="(max-width: 1024px) 100vw, 42vw"
							/>
						</div>
					) : null}
				</div>
			</div>
		</header>
	);
}
