import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { searchService } from "@/lib/search/service";
import { constructMetadata } from "@/lib/seo/metadata";
import { Play, BookOpen, Mic, Search, SearchX, ArrowRight } from "lucide-react";

export const metadata = constructMetadata({
    title: "Archive Search — Unified Repository",
    description:
        "Unified search across Adlwise research articles, lecture series, and Majlis sessions.",
    canonicalUrl: "/search",
});

interface PageProps {
    searchParams: Promise<{
        q?: string;
        type?: "article" | "lectures" | "majlis" | "all";
    }>;
}

// HELPER 1: Resolves thumbnail from schema (thumbnailUrl / youtubeId)
function resolveThumbnail(res: any): string | null {
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
					className="px-space-md py-2 text-on-primary rounded-full font-label-sm uppercase tracking-wider font-semibold transition-colors shadow-sm shrink-0"
				>
					<Search className="w-5 h-5 text-outline ml-space-sm mr-space-xs shrink-0" />
				</button>
			</form>

			{/* Results Filter Bar */}
			{query && (
				<div className="w-full max-w-2xl mx-auto flex flex-col gap-3 border-b border-surface-container-high pb-3">
					<span className="font-label-sm text-on-surface-variant text-sm tracking-wider font-medium">
						Found {results.length} results
					</span>

					<div className="flex items-center gap-2 overflow-x-auto pb-1">
						{[
							{ value: "all", label: "All" },
							{ value: "article", label: "Articles" },
							{ value: "lectures", label: "Lectures" },
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

			{/* Results List */}
			{query && results.length === 0 ? (
				<div className="py-space-2xl text-center flex flex-col items-center justify-center gap-space-xs">
					<SearchX className="w-12 h-12 text-on-surface-variant/40" />
					<h3 className="font-headline-md text-primary font-bold">
						No Records Found
					</h3>
					<p className="font-body-sm text-on-surface-variant max-w-sm">
						Try searching for broader terms.
					</p>
				</div>
			) : (
				<div className="w-full max-w-2xl mx-auto flex flex-col gap-3">
					{results.map((res: any) => {
						const typeLabels: Record<
							string,
							{ label: string; icon: any }
						> = {
							article: { label: "Article", icon: BookOpen },
							lectures: { label: "Lecture", icon: Play },
							majlis: { label: "Majlis", icon: Mic },
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
											<img
												src={thumbUrl}
												alt={displayTitle}
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
										<div className="flex items-center gap-1.5 text-[11px]">
											<span className="font-bold uppercase tracking-wider text-secondary">
												{res.category || config.label}
											</span>
											{(res.date || res.publishedAt) && (
												<>
													<span className="text-secondary/40">
														•
													</span>
													<span className="text-secondary/80 font-medium">
														{res.date ||
															new Date(
																res.publishedAt,
															).toLocaleDateString(
																"en-US",
																{
																	month: "short",
																	day: "numeric",
																	year: "numeric",
																},
															)}
													</span>
												</>
											)}
										</div>

										<h3 className="font-bold text-primary text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-primary-container transition-colors">
											{displayTitle}
										</h3>

										{res.speaker?.name && (
											<p className="text-[12px] text-secondary/80 truncate">
												{res.speaker.name}
											</p>
										)}
									</div>

									<div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary/80 group-hover:text-primary">
										<span>Open {config.label}</span>
										<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
