import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { searchService } from "@/lib/search/service";
import { SearchResult } from "@/lib/search/types";
import { constructMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/lib/seo/jsonld";
import { siteConfig } from "@/config/site";
import { Play, BookOpen, Mic, Search, SearchX, ArrowRight, LucideIcon } from "lucide-react";

export const metadata = constructMetadata({
	title: "Archive Search",
	description:
		"Unified search across Adlwise lecture series, research articles and Majlis sessions.",
	canonicalUrl: "/search",
	noIndex: true,
});


interface PageProps {
    searchParams: Promise<{
        q?: string;
        type?: "article" | "lectures" | "majlis" | "note" | "all";
    }>;
}

// HELPER 1: Resolves thumbnail from schema (thumbnailUrl / youtubeId)
function resolveThumbnail(res: SearchResult): string | null {
    if (res.thumbnailUrl) return res.thumbnailUrl;
    if (res.youtubeId) return `https://i.ytimg.com/vi/${res.youtubeId}/mqdefault.jpg`;
    return null;
}

// HELPER 2: Strips trailing hashtags (#...) from titles
function cleanTitle(title: string): string {
    return title.replace(/#\S+/g, "").trim();
}

// HELPER 3: Formats durationSeconds
function formatDuration(seconds?: number): string | null {
    if (!seconds) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

export default async function SearchPage({ searchParams }: PageProps) {
    const resolved = await searchParams;
    const query = resolved.q || "";
    const filterType = resolved.type || "all";

    const results = query
        ? await searchService.search(query, {
                type: filterType,
                limit: 30,
            })
        : [];

    return (
		<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl flex flex-col gap-space-lg pb-space-3xl">
			<BreadcrumbJsonLd
				items={[
					{ name: "Home", url: siteConfig.url },
					{ name: "Search", url: `${siteConfig.url}/search` },
				]}
			/>
			{/* Search Input Form */}
			<form
				method="GET"
				action="/search"
				className="w-full max-w-2xl mx-auto flex items-center bg-surface-container-lowest p-2 rounded-full shadow-md border border-surface-container-high focus-within:ring-2 focus-within:ring-primary/60"
			>
				<input
					type="text"
					name="q"
					defaultValue={query}
					placeholder="Search by topic ..."
					className="w-full pl-5 bg-transparent text-on-surface placeholder:text-on-surface-variant/60 font-body-sm text-body-sm focus:outline-none"
				/>
				<button
					type="submit"
					aria-label="Submit search"
					className="px-space-md py-2 bg-primary hover:bg-primary/90 text-on-primary rounded-full font-label-sm uppercase tracking-wider font-semibold transition-colors shadow-sm shrink-0 flex items-center justify-center"
				>
					<Search className="w-5 h-5 text-on-primary ml-space-sm mr-space-xs shrink-0" />
				</button>
			</form>

			{/* Results Filter Bar */}
			{query && (
				<div className="w-full max-w-2xl mx-auto flex flex-col gap-3 pb-3">
					<span className="font-label-sm text-on-surface-variant text-sm tracking-wider font-medium">
						Found {results.length} results
					</span>

					<div className="flex items-center gap-2 overflow-x-auto pb-1">
						{[
							{ value: "all", label: "All" },
							{ value: "lectures", label: "Listen" },
							{ value: "article", label: "Articles" },
							{ value: "majlis", label: "Majlis" },
						].map((filter) => {
							const isActive = filterType === filter.value;

							return (
								<Link
									key={filter.value}
									href={`/search?q=${encodeURIComponent(query)}&type=${filter.value}`}
									className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
										isActive
											? "bg-primary text-on-primary"
											: "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
									}`}
								>
									{filter.label}
								</Link>
							);
						})}
					</div>
				</div>
			)}

			{/* Results List or Zero-Results Guided Recovery Portal */}
			{query && results.length === 0 ? (
				<div className="w-full max-w-2xl mx-auto py-10 px-4 flex flex-col items-center text-center gap-6">
					<div className="flex flex-col items-center gap-2">
						<div className="w-14 h-14 rounded-2xl bg-surface-container-high/60 flex items-center justify-center text-on-surface-variant/60 shadow-xs">
							<SearchX className="w-7 h-7" />
						</div>
						<h3 className="font-headline-md text-primary font-bold text-xl sm:text-2xl mt-2">
							No Records Found for “{query}”
						</h3>
						<p className="font-body-sm text-on-surface-variant max-w-md text-sm">
							We couldn't find an exact match across our holdings. Try broader search terms, Arabic terms, or explore curated gateway portals below.
						</p>
					</div>

					{/* Suggested Topics */}
					<div className="w-full bg-surface-container-low border border-surface-container-high/60 rounded-2xl p-5 flex flex-col items-center gap-3 shadow-xs">
						<span className="text-xs font-semibold text-secondary uppercase tracking-wider">
							Suggested Canonical Inquiries
						</span>
						<div className="flex flex-wrap justify-center gap-2">
							{[
								"Adl & Social Compact",
								"Surah Al-Kahf",
								"Constitution of Pakistan",
								"Pre-Prophetic Forty Years",
								"Halal Earnings",
								"Zarb-e-Kaleem",
								"Third-Way Economics",
							].map((topic) => (
								<Link
									key={topic}
									href={`/search?q=${encodeURIComponent(topic)}`}
									className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-highest transition-colors"
								>
									{topic}
								</Link>
							))}
						</div>
					</div>

					{/* Foundational Discovery Portals */}
					<div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
						<Link
							href="/tarjuma-e-quran?view=surahs"
							className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high/60 transition-all group flex flex-col gap-1 shadow-xs"
						>
							<div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:text-secondary transition-colors">
								<span>📖 114-Surah Matrix</span>
								<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
							</div>
							<p className="text-xs text-on-surface-variant line-clamp-2">
								Systematic exegesis and linguistic tafsir across all 114 Quranic Surahs.
							</p>
						</Link>

						<Link
							href="/lectures/notes"
							className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high/60 transition-all group flex flex-col gap-1 shadow-xs"
						>
							<div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:text-secondary transition-colors">
								<span>📑 Companion Study Notes</span>
								<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
							</div>
							<p className="text-xs text-on-surface-variant line-clamp-2">
								High-resolution analytical infographics and downloadable grammar treatises.
							</p>
						</Link>

						<Link
							href="/majlis"
							className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high/60 transition-all group flex flex-col gap-1 shadow-xs"
						>
							<div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:text-secondary transition-colors">
								<span>⚖️ Majlis Symposia</span>
								<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
							</div>
							<p className="text-xs text-on-surface-variant line-clamp-2">
								Deliberations on constitutional jurisprudence and institutional ethics.
							</p>
						</Link>

						<Link
							href="/lectures"
							className="p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high/60 transition-all group flex flex-col gap-1 shadow-xs"
						>
							<div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:text-secondary transition-colors">
								<span>🏛️ Thematic Lecture Archive</span>
								<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
							</div>
							<p className="text-xs text-on-surface-variant line-clamp-2">
								Filter 279 thematic discourses by domain, format, and chronological order.
							</p>
						</Link>
					</div>
				</div>
			) : (
				<div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
					{results.map((res: SearchResult) => {
						const typeLabels: Record<
							string,
							{ label: string; icon: LucideIcon }
						> = {
							article: { label: "Article", icon: BookOpen },
							lectures: { label: "Lecture", icon: Play },
							majlis: { label: "Majlis", icon: Mic },
							note: { label: "Study Note", icon: BookOpen },
						};

						const config = typeLabels[res.type] || {
							label: res.type,
							icon: BookOpen,
						};
						const Icon = config.icon;
						const isVideo = Boolean(
							res.youtubeId ||
							res.type === "lectures" ||
							res.type === "majlis",
						);
						const thumbUrl = resolveThumbnail(res);
						const displayTitle = cleanTitle(res.title);
						const duration = formatDuration(res.durationSeconds);

						return (
							<Link
								key={res.id}
								href={res.url || `/lectures/${res.slug}`}
								className="group p-3 sm:p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-high/60 flex gap-3.5 sm:gap-4 items-center transition-all duration-200 hover:shadow-md"
							>
								{/* Thumbnail Container */}
								<div className="relative shrink-0 w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-surface-container-high/40 border border-surface-container-high/50">
									{thumbUrl ? (
										<>
											<Image
												src={thumbUrl}
												alt={displayTitle}
												fill
												sizes="(max-width: 640px) 112px, 144px"
												className="object-cover group-hover:scale-105 transition-transform duration-300"
												unoptimized={thumbUrl.includes("ytimg.com")}
											/>
											{/* Video Play Badge */}
											{isVideo && (
												<div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
													<div className="w-7 h-7 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-sm">
														<Play className="w-3.5 h-3.5 fill-current ml-0.5" />
													</div>
												</div>
											)}
											{/* Duration Pill */}
											{duration && (
												<span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 py-0.5 rounded font-mono font-medium">
													{duration}
												</span>
											)}
										</>
									) : (
										<div className="w-full h-full flex flex-col items-center justify-center text-secondary/70 bg-surface-container">
											<Icon className="w-5 h-5 mb-1" />
											<span className="text-[10px] uppercase font-bold tracking-wider">
												{config.label}
											</span>
										</div>
									)}
								</div>

								{/* Content Details */}
								<div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
									<div className="space-y-1">
										<div className="flex items-center gap-1.5 flex-wrap">
											<span className="font-label-sm text-[10px] text-secondary uppercase tracking-wider font-bold">
												{config.label} • {res.category}
											</span>
											{res.isCoursework && (
												<span className="font-sans text-[9px] uppercase tracking-wider font-semibold bg-secondary/15 text-secondary px-1.5 py-0.5 rounded">
													Coursework
												</span>
											)}
										</div>

										<h3 className="font-bold text-primary text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary-container transition-colors">
											{displayTitle}
										</h3>

										{res.urduTitle && (
											<span className="font-urdu text-[12px] text-tertiary font-semibold dir-rtl block text-right line-clamp-1">
												{res.urduTitle}
											</span>
										)}
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
}
