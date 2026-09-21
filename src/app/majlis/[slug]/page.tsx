import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowLeft,
	ArrowUpRight,
	Calendar,
	MapPin,
	Video,
	Target,
	Users,
	FileText,
	Download,
	ImageIcon,
	CheckCircle2,
	BookOpen,
} from "lucide-react";
import { getAllMajlisSessions, getMajlisSessionBySlug } from "@/lib/content/client";
import { getLectureBySlug } from "@/lib/lectures/client";
import { MDXRenderer } from "@/components/content/MDXRenderer";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const sessions = await getAllMajlisSessions();
	return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const doc = await getMajlisSessionBySlug(slug);
	if (!doc) return {};

	return constructMetadata({
		title: `${doc.session.title} — Majlis ${doc.session.number || ""}`,
		description: doc.session.objective || doc.session.thesis || doc.session.description,
		canonicalUrl: `/majlis/${slug}`,
	});
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

const CATEGORY_LABELS: Record<string, string> = {
	gathering: "Assembly",
	deliberation: "Deliberation",
	fellowship: "Hospitality & Fellowship",
	venue: "Venue & Setting",
};

export default async function MajlisSessionDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const doc = await getMajlisSessionBySlug(slug);

	if (!doc) {
		notFound();
	}

	const { session, content } = doc;
	const inquiries =
		session.keyInquiries && session.keyInquiries.length > 0
			? session.keyInquiries
			: session.discussionPoints || [];
	const formattedDate = formatSessionDate(session.date);

	// Hydrate cross-referenced lectures from catalogue
	const relatedSlugs = Array.from(
		new Set([
			...(session.recordingSlug ? [session.recordingSlug] : []),
			...(session.relatedLectureSlugs || []),
		]),
	);
	const lectureResults = await Promise.all(
		relatedSlugs.map((s) => getLectureBySlug(s)),
	);
	const relatedLectures = lectureResults.filter((l): l is NonNullable<typeof l> => Boolean(l));

	const isUpcoming = session.status === "upcoming";

	// All sessions for previous/next navigation
	const allSessions = await getAllMajlisSessions();
	const currentIndex = allSessions.findIndex((s) => s.slug === slug);
	const prevSession = currentIndex > 0 ? allSessions[currentIndex - 1] : null;
	const nextSession = currentIndex < allSessions.length - 1 ? allSessions[currentIndex + 1] : null;

	return (
		<article className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 flex flex-col gap-10 sm:gap-14 md:gap-16">
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Majlis", url: `${siteConfig.url}/majlis` },
					{
						name: session.title,
						url: `${siteConfig.url}/majlis/${slug}`,
					},
				]}
			/>

			{/* =========================================================
			    1. TOP BREADCRUMB & STATUS BADGE (Border-free)
			    ========================================================= */}
			<nav
				aria-label="Breadcrumb"
				className="flex items-center justify-between flex-wrap gap-3 text-[11px] sm:text-xs font-sans uppercase tracking-widest text-on-surface-variant"
			>
				<div className="flex items-center gap-2">
					<Link
						href="/majlis"
						className="hover:text-primary transition-colors inline-flex items-center gap-1.5 font-medium"
					>
						<ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
						<span>Majlis Archive</span>
					</Link>
					<span aria-hidden="true" className="text-surface-container-highest">/</span>
					<span className="text-primary font-bold">
						Session {session.number || "01"}
					</span>
				</div>

				<span
					className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase font-mono ${
						isUpcoming
							? "bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-300"
							: "bg-brand-gold/15 text-primary"
					}`}
				>
					<span
						className={`w-2 h-2 rounded-full ${
							isUpcoming ? "bg-amber-500 animate-pulse" : "bg-brand-gold"
						}`}
					/>
					{isUpcoming ? "Upcoming Symposium" : "Completed Symposium"}
				</span>
			</nav>

			{/* =========================================================
			    2. HEADER CARTOUCHE
			    ========================================================= */}
			<header className="flex flex-col gap-3.5 sm:gap-4">
				{/* Date, Location, Venue */}
				<div className="flex items-center justify-between flex-wrap gap-y-2 gap-x-4 text-xs sm:text-sm font-sans tracking-wide text-on-surface-variant">
					<div className="flex items-center gap-3 sm:gap-4 flex-wrap">
						<span className="flex items-center gap-1.5 text-primary font-medium">
							<Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold shrink-0" aria-hidden="true" />
							<span>{formattedDate}</span>
						</span>
						<span className="text-surface-container-highest hidden sm:inline">•</span>
						<span className="flex items-center gap-1.5">
							<MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-gold shrink-0" aria-hidden="true" />
							<span>
								{session.venue ? `${session.venue}, ` : ""}
								{session.location}
							</span>
						</span>
					</div>

					{session.year && (
						<span className="font-mono text-xs font-bold text-on-surface-variant/70 uppercase">
							Cycle {session.year}
						</span>
					)}
				</div>

				{/* Title Lockup: English + Urdu Calligraphy */}
				<div className="flex flex-col gap-2.5 sm:gap-3 mt-1 sm:mt-2">
					<div className="flex items-baseline justify-between gap-3 sm:gap-4 flex-wrap">
						<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold text-primary tracking-tight leading-[1.15]">
							{session.title}
						</h1>

						{session.urduTitle && (
							<span className="font-urdu text-2xl sm:text-3xl md:text-4xl text-brand-gold font-bold dir-rtl select-none tracking-normal">
								{session.urduTitle}
							</span>
						)}
					</div>

					{session.thesis && (
						<div className="p-4 sm:p-5 rounded-2xl bg-surface-container-low/70 mt-1 sm:mt-2">
							<p className="font-serif italic text-base sm:text-lg md:text-xl text-on-surface/90 leading-relaxed">
								&ldquo;{session.thesis}&rdquo;
							</p>
						</div>
					)}
				</div>
			</header>

			{/* =========================================================
			    3. CORE OBJECTIVE & CHARTER (User Requirement #2)
			    ========================================================= */}
			{session.objective && (
				<section
					aria-labelledby="objective-heading"
					className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#0a2318] text-brand-warm-white p-5 sm:p-7 md:p-9 shadow-sm"
				>
					<div
						aria-hidden="true"
						className="absolute -right-20 -top-20 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none"
					/>

					<div className="relative z-10 flex flex-col gap-3 sm:gap-3.5">
						<div className="flex items-center gap-2.5 text-brand-gold">
							<Target className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" aria-hidden="true" />
							<h2
								id="objective-heading"
								className="font-mono text-xs uppercase tracking-widest font-bold"
							>
								Charter of Deliberation · ہدف و مقصدِ نشست
							</h2>
						</div>

						<p className="font-sans text-sm sm:text-base md:text-[16px] text-brand-warm-white/90 leading-relaxed max-w-4xl font-normal">
							{session.objective}
						</p>
					</div>
				</section>
			)}

			{/* =========================================================
			    4. ATMOSPHERE & FELLOWSHIP GALLERY (User Requirement #1)
			       Mobile-First: Horizontal Touch-Snap Carousel
			       Desktop: Multi-Column Responsive Mosaic
			    ========================================================= */}
			{session.gallery && session.gallery.length > 0 && (
				<section aria-labelledby="gallery-heading" className="flex flex-col gap-4 sm:gap-5">
					<div className="flex items-baseline justify-between flex-wrap gap-2">
						<div className="flex items-center gap-2 sm:gap-2.5">
							<ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
							<h2
								id="gallery-heading"
								className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
							>
								Atmosphere &amp; Fellowship
							</h2>
						</div>
						<div className="flex items-center gap-3">
							<span className="md:hidden text-[11px] font-sans text-on-surface-variant/70">
								Swipe →
							</span>
							<span className="font-urdu text-sm sm:text-base text-brand-gold font-bold dir-rtl">
								تصویری جھلکیاں و نشست
							</span>
						</div>
					</div>

					{/* Responsive Adaptive Photo Carousel (Mobile) / Grid (Desktop) */}
					<div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 gap-3.5 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-4 md:overflow-visible md:mx-0 md:px-0 md:pb-0">
						{session.gallery.map((photo, idx) => (
							<figure
								key={idx}
								className={`group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-xs hover:shadow-md transition-all duration-300 flex flex-col shrink-0 snap-center w-[82vw] max-w-[320px] md:w-auto md:max-w-none md:shrink ${
									idx === 0 ? "md:col-span-2 lg:col-span-2 md:row-span-2" : ""
								}`}
							>
								<div className={`relative w-full overflow-hidden ${idx === 0 ? "h-64 sm:h-72 lg:h-full min-h-[240px] md:min-h-[280px]" : "h-48"}`}>
									<Image
										src={photo.url}
										alt={photo.caption || `Majlis gathering photograph ${idx + 1}`}
										fill
										className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
										sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 25vw"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

									{photo.category && (
										<span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-brand-gold shadow-xs">
											{CATEGORY_LABELS[photo.category] || photo.category}
										</span>
									)}
								</div>

								{photo.caption && (
									<figcaption className="p-3.5 bg-surface-container-low text-xs text-on-surface-variant font-sans leading-relaxed">
										{photo.caption}
									</figcaption>
								)}
							</figure>
						))}
					</div>
				</section>
			)}

			{/* =========================================================
			    5. SYMPOSIUM SPEAKERS & SPECIALIZED TOPICS (User Requirement #3)
			       Mobile-First: Horizontal Touch-Snap Rail
			       Desktop: 3-Column Responsive Grid
			    ========================================================= */}
			{session.speakers && session.speakers.length > 0 && (
				<section aria-labelledby="speakers-heading" className="flex flex-col gap-4 sm:gap-5">
					<div className="flex items-baseline justify-between flex-wrap gap-2">
						<div className="flex items-center gap-2 sm:gap-2.5">
							<Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
							<h2
								id="speakers-heading"
								className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
							>
								Speakers &amp; Specialized Contributions
							</h2>
						</div>
						<div className="flex items-center gap-3">
							<span className="md:hidden text-[11px] font-sans text-on-surface-variant/70">
								Swipe →
							</span>
							<span className="font-urdu text-sm sm:text-base text-brand-gold font-bold dir-rtl">
								مقالہ نگار و شرکاء
							</span>
						</div>
					</div>

					<div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 gap-3.5 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:mx-0 md:px-0 md:pb-0">
						{session.speakers.map((speaker, idx) => (
							<div
								key={idx}
								className="w-[80vw] max-w-[300px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink p-5 sm:p-6 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between gap-4 shadow-xs hover:shadow-sm"
							>
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-3.5">
										{speaker.avatarUrl ? (
											<div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-brand-gold/40">
												<Image
													src={speaker.avatarUrl}
													alt={speaker.name}
													fill
													className="object-cover object-center"
												/>
											</div>
										) : (
											<div className="w-12 h-12 rounded-full bg-primary text-brand-gold flex items-center justify-center font-serif text-base font-bold shrink-0 shadow-xs">
												{speaker.name.charAt(0)}
											</div>
										)}

										<div className="min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<h3 className="font-serif text-base font-semibold text-primary truncate">
													{speaker.name}
												</h3>
											</div>
											{speaker.urduName && (
												<p className="font-urdu text-xs text-brand-gold font-bold dir-rtl">
													{speaker.urduName}
												</p>
											)}
											<p className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
												{speaker.title}
											</p>
										</div>
									</div>

									{speaker.role && (
										<span className="inline-block self-start px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-brand-gold/15 text-primary">
											{speaker.role}
										</span>
									)}
								</div>

								{/* Specialized Topic Card (Border-Free Tonal Surface) */}
								<div className="p-3.5 rounded-xl bg-surface-container-lowest/80">
									<p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant/80 font-bold mb-1">
										Specialized Topic
									</p>
									<p className="font-sans text-xs sm:text-[13px] text-primary font-medium leading-relaxed italic">
										&ldquo;{speaker.topic}&rdquo;
									</p>
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* =========================================================
			    6. KEY POINTS & DELIBERATION TAKEAWAYS (User Requirement #5)
			    ========================================================= */}
			{((session.keyTakeaways && session.keyTakeaways.length > 0) || inquiries.length > 0) && (
				<section aria-labelledby="takeaways-heading" className="flex flex-col gap-5 sm:gap-6">
					<div className="flex items-baseline justify-between flex-wrap gap-2">
						<div className="flex items-center gap-2 sm:gap-2.5">
							<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
							<h2
								id="takeaways-heading"
								className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
							>
								Key Points &amp; Juristic Takeaways
							</h2>
						</div>
						<span className="font-urdu text-sm sm:text-base text-brand-gold font-bold dir-rtl">
							اہم نکات و حاصلِ نشست
						</span>
					</div>

					{/* Numbered Executive Findings (Border-Free Tonal Surfaces) */}
					{session.keyTakeaways && session.keyTakeaways.length > 0 && (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
							{session.keyTakeaways.map((item, idx) => (
								<div
									key={idx}
									className="p-5 sm:p-6 rounded-2xl bg-surface-container-low flex flex-col gap-2.5 shadow-xs hover:shadow-sm transition-shadow"
								>
									<span className="font-serif text-2xl sm:text-3xl font-bold text-brand-gold">
										0{idx + 1}
									</span>
									<h3 className="font-serif text-base font-semibold text-primary leading-snug">
										{item.title}
									</h3>
									<p className="font-sans text-xs sm:text-sm text-on-surface-variant leading-relaxed">
										{item.summary}
									</p>
								</div>
							))}
						</div>
					)}

					{/* Specific Inquiries Explored */}
					{inquiries.length > 0 && (
						<div className="p-5 sm:p-7 rounded-2xl bg-surface-container-low/70 space-y-3">
							<h3 className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-primary/80">
								Central Inquiries Debated
							</h3>
							<ul className="space-y-2.5 font-sans text-sm sm:text-[15px] text-primary/85 leading-relaxed">
								{inquiries.map((q, idx) => (
									<li key={idx} className="flex items-start gap-3">
										<span className="font-mono text-xs font-bold text-brand-gold mt-0.5 select-none shrink-0">
											[Q0{idx + 1}]
										</span>
										<span>{q}</span>
									</li>
								))}
							</ul>
						</div>
					)}
				</section>
			)}

			{/* =========================================================
			    7. SESSION ARTIFACTS, SLIDES & MEDIA (User Requirement #4)
			    ========================================================= */}
			{(session.slidesUrl || session.workingPaperUrl || relatedLectures.length > 0) && (
				<section aria-labelledby="materials-heading" className="flex flex-col gap-4 sm:gap-5">
					<div className="flex items-baseline justify-between flex-wrap gap-2">
						<div className="flex items-center gap-2 sm:gap-2.5">
							<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
							<h2
								id="materials-heading"
								className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
							>
								Deliberation Materials &amp; Media Archive
							</h2>
						</div>
						<span className="font-urdu text-sm sm:text-base text-brand-gold font-bold dir-rtl">
							علمی مواد، سلائیڈز و ویڈیوز
						</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
						{/* Downloadable Presentation Slides & Working Papers */}
						{(session.slidesUrl || session.workingPaperUrl) && (
							<div className="lg:col-span-5 flex flex-col gap-3">
								{session.slidesUrl && (
									<a
										href={session.slidesUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="group p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-3.5 shadow-xs hover:shadow-sm"
									>
										<div className="flex items-center gap-3.5 min-w-0">
											<div className="w-11 h-11 rounded-xl bg-brand-gold/15 text-primary flex items-center justify-center shrink-0">
												<FileText className="w-5 h-5 text-brand-gold" aria-hidden="true" />
											</div>
											<div className="min-w-0">
												<span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant font-bold">
													Session Presentation
												</span>
												<h3 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate">
													{session.slidesTitle || "Presentation Slide Deck"}
												</h3>
												<span className="text-[11px] text-on-surface-variant/80 font-mono">
													PDF Format {session.slidesCount ? `· ${session.slidesCount} Slides` : ""}
												</span>
											</div>
										</div>

										<div className="w-8 h-8 rounded-full bg-surface-container-high/60 group-hover:bg-primary group-hover:text-brand-warm-white transition-colors flex items-center justify-center text-primary shrink-0">
											<Download className="w-4 h-4" aria-hidden="true" />
										</div>
									</a>
								)}

								{session.workingPaperUrl && (
									<a
										href={session.workingPaperUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="group p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-3.5 shadow-xs hover:shadow-sm"
									>
										<div className="flex items-center gap-3.5 min-w-0">
											<div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
												<BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
											</div>
											<div className="min-w-0">
												<span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant font-bold">
													Juristic Paper
												</span>
												<h3 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate">
													{session.workingPaperTitle || "Session Working Paper"}
												</h3>
												<span className="text-[11px] text-on-surface-variant/80 font-mono">
													Research Memo · PDF
												</span>
											</div>
										</div>

										<div className="w-8 h-8 rounded-full bg-surface-container-high/60 group-hover:bg-primary group-hover:text-brand-warm-white transition-colors flex items-center justify-center text-primary shrink-0">
											<Download className="w-4 h-4" aria-hidden="true" />
										</div>
									</a>
								)}
							</div>
						)}

						{/* Related Recorded Discourses from Video Catalogue */}
						{relatedLectures.length > 0 && (
							<div className={`${session.slidesUrl || session.workingPaperUrl ? "lg:col-span-7" : "lg:col-span-12"} flex flex-col gap-3`}>
								{relatedLectures.map((lec) => (
									<Link
										key={lec.slug}
										href={`/lectures/${lec.slug}`}
										className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-3.5 group shadow-xs hover:shadow-sm"
									>
										<div className="flex items-center gap-3.5 min-w-0">
											<div className="relative w-16 sm:w-20 h-12 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-surface-container-high">
												{lec.thumbnailUrl ? (
													<Image
														src={lec.thumbnailUrl}
														alt={lec.title}
														fill
														className="object-cover object-center group-hover:scale-105 transition-transform"
													/>
												) : (
													<div className="w-full h-full flex items-center justify-center bg-primary text-brand-gold">
														<Video className="w-4 h-4" />
													</div>
												)}
												<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
													<div className="w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center">
														<Video className="w-3 h-3 fill-current ml-0.5" />
													</div>
												</div>
											</div>

											<div className="min-w-0">
												<div className="flex items-center gap-2">
													<span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
														{lec.category}
													</span>
													{lec.durationSeconds > 0 && (
														<span className="text-[10px] font-mono text-on-surface-variant">
															· {Math.round(lec.durationSeconds / 60)} mins
														</span>
													)}
												</div>
												<h3 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate mt-0.5">
													{lec.title}
												</h3>
												{lec.urduTitle && (
													<p className="font-urdu text-xs text-on-surface-variant/80 dir-rtl truncate">
														{lec.urduTitle}
													</p>
												)}
											</div>
										</div>

										<ArrowUpRight
											className="w-4 h-4 text-brand-gold shrink-0 group-hover:translate-x-0.5 transition-transform"
											aria-hidden="true"
										/>
									</Link>
								))}
							</div>
						)}
					</div>
				</section>
			)}

			{/* =========================================================
			    8. DETAILED PROSE SUMMARY (MDX Content)
			    ========================================================= */}
			{content && content.trim().length > 0 && (
				<section aria-labelledby="prose-heading" className="pt-2">
					<h2 id="prose-heading" className="sr-only">
						Deliberation Proceedings &amp; Text
					</h2>
					<div className="prose prose-lg max-w-none text-on-surface/90">
						<MDXRenderer content={content} />
					</div>
				</section>
			)}

			{/* =========================================================
			    9. FOOTER NAVIGATION (Border-free)
			    ========================================================= */}
			<footer className="pt-6 sm:pt-8 flex items-center justify-between flex-wrap gap-4">
				<Link
					href="/majlis"
					className="inline-flex items-center gap-2 text-xs font-sans uppercase tracking-widest font-semibold text-primary hover:text-brand-gold transition-colors"
				>
					<ArrowLeft className="w-4 h-4" aria-hidden="true" />
					<span>Back to Majlis Archive</span>
				</Link>

				<div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
					{prevSession && (
						<Link
							href={`/majlis/${prevSession.slug}`}
							className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-sans text-primary transition-all shadow-xs"
						>
							← Session {prevSession.session.number}
						</Link>
					)}

					{nextSession && (
						<Link
							href={`/majlis/${nextSession.slug}`}
							className="px-4 py-2 rounded-full bg-surface-container-low hover:bg-surface-container text-xs font-sans text-primary transition-all shadow-xs"
						>
							Session {nextSession.session.number} →
						</Link>
					)}

					{isUpcoming && (
						<Link
							href={session.registrationUrl || "/join"}
							className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-primary hover:bg-primary-hover text-brand-warm-white text-xs font-sans uppercase tracking-widest font-semibold rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
						>
							<span>Reserve Your Seat</span>
							<ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
						</Link>
					)}
				</div>
			</footer>
		</article>
	);
}
