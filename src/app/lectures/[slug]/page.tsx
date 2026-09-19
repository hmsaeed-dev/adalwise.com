import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, Play, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
	getLectureBySlug,
	getAllLectures,
	getLecturesBySeries,
} from "@/lib/lectures/client";
import { siteConfig } from "@/config/site";
import { getRelatedContent } from "@/lib/content/related";
import { YouTubeEmbed } from "@/components/lectures/YouTubeEmbed";
import { constructMetadata } from "@/lib/seo/metadata";
import { VideoObjectJsonLd, BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { formatDuration, formatISODate } from "@/lib/utils";
import { STUDY_NOTES_REGISTRY } from "@/lib/lectures/notes-registry";
import { CompanionStudyNotesSection } from "@/features/lectures";
import { AcademicCitationButton } from "@/components/lectures/AcademicCitationDialog";

interface PageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	const lectures = await getAllLectures();
	return lectures.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps) {
	const { slug } = await params;
	const item = await getLectureBySlug(slug);
	if (!item) return {};

	return constructMetadata({
		title: item.title,
		description: item.summary || item.description,
		image: item.thumbnailUrl,
		canonicalUrl: `/lectures/${slug}`,
		keywords: [
			...(item.topics || []),
			...(item.tags || []),
			item.category,
			item.speaker?.name || "Dr. Hafiz Haseeb",
		].filter(Boolean),
	});
}

export default async function lecturesDetailPage({ params }: PageProps) {
	const { slug } = await params;
	const item = await getLectureBySlug(slug);

	if (!item) {
		notFound();
	}

	// If this lecture is part of the Tarjuma-e-Quran curriculum,
	// seamlessly route into the dedicated Tarjuma-e-Quran Sanctum Room
	if (item.isCoursework) {
		redirect(`/tarjuma-e-quran?session=${slug}`);
	}

	// Fetch all series episodes sequentially if part of a series
	const allSeriesEpisodes = item.seriesId
		? (await getLecturesBySeries(item.seriesId)).sort(
				(a, b) =>
					new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
			)
		: [];

	const currentIndex = allSeriesEpisodes.findIndex((e) => e.slug === slug);
	const prevEpisode = currentIndex > 0 ? allSeriesEpisodes[currentIndex - 1] : null;
	const nextEpisode =
		currentIndex >= 0 && currentIndex < allSeriesEpisodes.length - 1
			? allSeriesEpisodes[currentIndex + 1]
			: null;
	const episodeNumber = currentIndex >= 0 ? currentIndex + 1 : null;
	const totalSeriesEpisodes = allSeriesEpisodes.length;

	// Companion list (excluding current slug) capped to 6 items
	const seriesEpisodes = allSeriesEpisodes
		.filter((s) => s.slug !== slug)
		.slice(0, 6);

	// Fetch matching companion study notes (infographics/treatises)
	const companionNotes = item.seriesId
		? STUDY_NOTES_REGISTRY.filter(
				(note) => note.relatedSeriesId === item.seriesId || note.id === item.slug,
			)
		: STUDY_NOTES_REGISTRY.filter((note) => note.id === item.slug);

	// Fetch cross-domain related content (articles + videos)
	const related = await getRelatedContent({
		currentType: "lectures",
		currentSlug: slug,
		explicitSlugs: item.relatedArticleSlugs,
		seriesId: item.seriesId,
		topics: item.topics,
		tags: item.tags,
		category: item.category,
		limit: 3,
	});

	return (
		<article className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg">
			<VideoObjectJsonLd
				name={item.title}
				description={item.summary || item.description}
				thumbnailUrl={item.thumbnailUrl}
				uploadDate={item.publishedAt}
				durationSeconds={item.durationSeconds}
				embedUrl={`https://www.youtube.com/embed/${item.youtubeId}`}
				watchUrl={`https://www.youtube.com/watch?v=${item.youtubeId}`}
			/>
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Lectures", url: `${siteConfig.url}/lectures` },
					{
						name: item.title,
						url: `${siteConfig.url}/lectures/${slug}`,
					},
				]}
			/>

			{/* Breadcrumb Navigation */}
			<nav
				aria-label="Breadcrumb"
				className="flex items-center gap-space-2xs text-body-sm text-on-surface-variant"
			>
				<Link
					href="/lectures"
					className="hover:text-primary transition-colors"
				>
					Lectures
				</Link>
				<span>/</span>
				<span className="text-primary font-medium truncate max-w-[200px] sm:max-w-none">
					{item.title}
				</span>
			</nav>

			{/* Video Player */}
			<div className="w-full md:w-4/5 mx-auto flex flex-col gap-3">
				<YouTubeEmbed
					youtubeId={item.youtubeId}
					title={item.title}
					thumbnailUrl={item.thumbnailUrl}
					priority={true}
					autoPlay={true}
				/>

				{/* Sequential Series Stepper Toolbar */}
				{allSeriesEpisodes.length > 1 && episodeNumber && (
					<nav
						aria-label="Series episode sequence"
						className="w-full bg-surface-container-low border border-surface-container-high rounded-2xl p-2.5 sm:p-3.5 flex items-center justify-between gap-2 shadow-xs"
					>
						{prevEpisode ? (
							<Link
								href={`/lectures/${prevEpisode.slug}`}
								className="flex items-center gap-1.5 text-primary hover:text-brand-gold transition-colors font-medium text-xs sm:text-sm group min-w-0"
								title={prevEpisode.title}
							>
								<ChevronLeft className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
								<span className="hidden sm:inline text-on-surface-variant font-normal">Prev:</span>
								<span className="truncate max-w-[120px] md:max-w-[220px] font-semibold">
									{prevEpisode.urduTitle || prevEpisode.title}
								</span>
							</Link>
						) : (
							<span className="text-on-surface-variant/40 text-xs sm:text-sm flex items-center gap-1 select-none">
								<ChevronLeft className="w-4 h-4 shrink-0" />
								<span className="hidden sm:inline">Series Start</span>
							</span>
						)}

						<div className="flex items-center gap-1.5 shrink-0 px-3 py-1 bg-surface-container rounded-full border border-surface-container-highest text-xs font-semibold text-primary shadow-xs">
							<span className="text-on-surface-variant font-normal">Part</span>
							<span className="text-brand-gold font-bold">{episodeNumber}</span>
							<span className="text-on-surface-variant/60">of</span>
							<span>{totalSeriesEpisodes}</span>
						</div>

						{nextEpisode ? (
							<Link
								href={`/lectures/${nextEpisode.slug}`}
								className="flex items-center gap-1.5 text-primary hover:text-brand-gold transition-colors font-medium text-xs sm:text-sm group min-w-0 justify-end"
								title={nextEpisode.title}
							>
								<span className="hidden sm:inline text-on-surface-variant font-normal">Next:</span>
								<span className="truncate max-w-[120px] md:max-w-[220px] text-right font-semibold">
									{nextEpisode.urduTitle || nextEpisode.title}
								</span>
								<ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
							</Link>
						) : (
							<span className="text-on-surface-variant/40 text-xs sm:text-sm flex items-center gap-1 select-none justify-end">
								<span className="hidden sm:inline">Final Part</span>
								<ChevronRight className="w-4 h-4 shrink-0" />
							</span>
						)}
					</nav>
				)}
			</div>

			{/* Video Metadata Header with Academic Citation and Bilingual Nastaliq Pairing */}
			<header className="flex flex-col gap-3 pb-space-md">
				<div className="flex items-center justify-between gap-4 flex-wrap">
					<div className="flex items-center gap-2 text-xs font-sans text-on-surface-variant">
						<span>{formatISODate(item.publishedAt)}</span>
						<span>•</span>
						<span className="font-semibold text-secondary uppercase tracking-wider">
							{item.category}
						</span>
						{item.format && (
							<>
								<span>•</span>
								<span className="bg-surface-container px-2 py-0.5 rounded-full border border-surface-container-high text-[11px]">
									{item.format}
								</span>
							</>
						)}
					</div>
					<AcademicCitationButton lecture={item} />
				</div>

				<div className="flex flex-col gap-2 mt-1">
					<h1 className="font-display-lg text-[26px] sm:text-[32px] md:text-[36px] text-primary font-bold leading-tight">
						{item.title}
					</h1>
					{item.urduTitle && (
						<p className="font-urdu font-urdu-title text-xl sm:text-2xl text-brand-gold font-bold dir-rtl text-right select-none">
							{item.urduTitle}
						</p>
					)}
				</div>
			</header>

			{/* Comprehensive Textual Summary */}
			<section className="bg-surface-container-low p-space-lg rounded-[24px] border border-surface-container-high flex flex-col gap-space-md">
				<h2 className="font-headline-sm text-primary font-bold flex items-center gap-space-xs">
					<BookOpen className="w-5 h-5 text-tertiary-container shrink-0" />
					<span>Synopsis &amp; Breakdown</span>
				</h2>

				<p className="font-body-md text-on-surface leading-relaxed text-[16px]">
					{item.summary || item.description}
				</p>

				{/* Conceptual Topics & Taxonomy */}
				<div className="pt-space-xs flex flex-wrap items-center gap-space-xs">
					{item.topics.map((t) => (
						<Link
							key={t}
							href={`/search?q=${encodeURIComponent(t)}`}
							className="px-space-sm py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-[11px] font-semibold transition-colors border border-surface-container-highest"
						>
							{t}
						</Link>
					))}
				</div>
			</section>

			{/* Embedded Companion Study Notes */}
			{companionNotes.length > 0 && (
				<CompanionStudyNotesSection
					notes={companionNotes}
					seriesTitle={item.seriesTitle}
				/>
			)}

			{/* Series Companion Lectures */}
			{seriesEpisodes.length > 0 && (
				<section className="pt-space-md flex flex-col gap-space-md">
					<div className="flex items-baseline justify-between border-surface-container-high pb-space-xs">
						<h3 className="font-headline-sm text-primary font-bold">
							{item.seriesTitle ? `${item.seriesTitle} — Companion Episodes` : "Related Episodes"}
						</h3>
						{totalSeriesEpisodes > 6 ? (
							<Link
								href={`/lectures?series=${encodeURIComponent(item.seriesId || "")}`}
								className="font-label-sm text-secondary hover:underline font-semibold text-xs transition-colors"
							>
								View all {totalSeriesEpisodes} episodes &rarr;
							</Link>
						) : (
							<span className="font-label-sm text-on-surface-variant text-xs">
								{seriesEpisodes.length} episodes
							</span>
						)}
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
						{seriesEpisodes.map((ep) => (
							<Link
								key={ep.slug}
								href={`/lectures/${ep.slug}`}
								className="p-space-sm bg-surface-container rounded-xl flex items-center gap-space-sm hover:bg-surface-container-high transition-colors border border-surface-container-highest"
							>
								<div className="w-8 h-8 rounded-full bg-primary text-tertiary-fixed flex items-center justify-center shrink-0">
									<Play className="w-3.5 h-3.5 fill-current ml-0.5" />
								</div>
								<div className="flex flex-col min-w-0">
									<span className="font-headline-sm text-[14px] text-primary font-semibold truncate">
										{ep.title}
									</span>
									<span className="text-[11px] text-on-surface-variant">
										{formatDuration(ep.durationSeconds)}
									</span>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Related Reading, Deliberations & Cross-Domain Content */}
			{related.length > 0 && (
				<section className="mt-space-xl pt-space-md flex flex-col gap-space-md">
					<div className="flex items-baseline justify-between">
						<h3 className="font-headline-sm text-primary font-bold text-2xl">
							Related Discourses & Deliberations
						</h3>
						<span className="text-xs text-on-surface-variant">
							Cross-domain references
						</span>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
						{related.map((r) => (
							<Link
								key={r.slug}
								href={r.url}
								className="p-space-md rounded-[20px] bg-surface-container-low hover:bg-surface-container transition-all border border-surface-container-highest/60 flex flex-col justify-between group"
							>
								<div className="flex flex-col gap-space-2xs">
									<div className="flex items-center justify-between gap-2 pb-1">
										<span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
											r.type === "majlis"
												? "bg-brand-gold/15 text-brand-gold border border-brand-gold/30"
												: r.type === "article"
													? "bg-secondary/10 text-secondary border border-secondary/20"
													: "bg-primary/10 text-primary border border-primary/20"
										}`}>
											{r.type === "majlis"
												? "Majlis Deliberation"
												: r.type === "article"
													? "Written Treatise"
													: "Recorded Discourse"}
										</span>
									</div>

									<h4 className="font-headline-sm text-[15px] text-primary font-bold line-clamp-2 group-hover:text-primary-hover transition-colors">
										{r.title}
									</h4>
									{r.urduTitle && (
										<p className="font-urdu text-xs text-on-surface-variant dir-rtl truncate">
											{r.urduTitle}
										</p>
									)}
								</div>
								<span className="font-label-sm text-primary font-bold text-[11px] flex items-center gap-1 mt-space-sm group-hover:translate-x-0.5 transition-transform">
									Explore{" "}
									<ArrowRight className="w-3.5 h-3.5" />
								</span>
							</Link>
						))}
					</div>
				</section>
			)}
		</article>
	);
}
