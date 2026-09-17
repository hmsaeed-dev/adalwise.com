"use client";

import React, {
	useState,
	useMemo,
	useRef,
	useEffect,
	useDeferredValue,
} from "react";
import {
	Search,
	X,
	Play,
	BookOpen,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import {
	TarjumaEditionMeta,
	ParsedTarjumaSession,
	QURAN_JUZ_LIST,
} from "@/lib/lectures/tarjuma-quran";
import { YouTubeEmbed } from "@/components/lectures/YouTubeEmbed";
import Image from "next/image";

interface TarjumaCurriculumViewProps {
	editions: TarjumaEditionMeta[];
	initialSessionSlug?: string;
}

export function TarjumaCurriculumView({
	editions,
	initialSessionSlug,
}: TarjumaCurriculumViewProps) {
	// Find initial session and its edition if initialSessionSlug is provided
	const initialMatch = useMemo(() => {
		if (!initialSessionSlug) return null;
		for (const ed of editions) {
			const found = ed.sessions.find(
				(s) => s.slug === initialSessionSlug,
			);
			if (found) return { editionId: ed.id, session: found };
		}
		return null;
	}, [editions, initialSessionSlug]);

	// 1. Selected Edition (default to matched edition or 2026)
	const [selectedEditionId, setSelectedEditionId] = useState<string>(
		initialMatch?.editionId || editions[0]?.id || "2026",
	);

	// 2. Active Session for the Sanctum Player
	const [activeSession, setActiveSession] =
		useState<ParsedTarjumaSession | null>(initialMatch?.session || null);

	// 3. Active Juz filter (null means All Juz)
	const [selectedJuz, setSelectedJuz] = useState<number | null>(null);

	// 4. Search query
	const [searchQuery, setSearchQuery] = useState<string>("");
	const deferredSearchQuery = useDeferredValue(searchQuery);

	// Refs for scrolling
	const theaterRef = useRef<HTMLDivElement>(null);
	const juzRailRef = useRef<HTMLDivElement>(null);

	const activeEdition = useMemo(() => {
		return (
			editions.find((e) => e.id === selectedEditionId) ||
			editions[0] || {
				id: "2026",
				year: 2026,
				label: "2026",
				badge: "",
				description: "",
				sessionCount: 0,
				sessions: [],
			}
		);
	}, [editions, selectedEditionId]);

	// Update active session if initialSessionSlug changes
	useEffect(() => {
		if (initialMatch) {
			setSelectedEditionId(initialMatch.editionId);
			setActiveSession(initialMatch.session);
		}
	}, [initialMatch]);

	// Filter sessions by Juz and Search Query
	const filteredSessions = useMemo(() => {
		let list = activeEdition.sessions;

		// Filter by Juz
		if (selectedJuz !== null) {
			list = list.filter((s) => s.juzList.includes(selectedJuz));
		}

		// Filter by Search Query (deferred for responsive input)
		if (deferredSearchQuery.trim()) {
			const q = deferredSearchQuery.toLowerCase().trim();
			list = list.filter((s) => {
				const titleMatch = s.title.toLowerCase().includes(q);
				const rawMatch = s.rawTitle.toLowerCase().includes(q);
				const urduMatch = s.urduTitle.toLowerCase().includes(q);
				const codeMatch = s.sessionCode.toLowerCase() === q;
				const rangeMatch = s.rangeLabel?.toLowerCase().includes(q);
				return (
					titleMatch ||
					rawMatch ||
					urduMatch ||
					codeMatch ||
					rangeMatch
				);
			});
		}

		return list;
	}, [activeEdition, selectedJuz, deferredSearchQuery]);

	// Find Prev and Next session indices within the current edition
	const { prevSession, nextSession } = useMemo(() => {
		if (!activeSession) return { prevSession: null, nextSession: null };
		const idx = activeEdition.sessions.findIndex(
			(s) => s.slug === activeSession.slug,
		);
		if (idx === -1) return { prevSession: null, nextSession: null };
		return {
			prevSession: idx > 0 ? activeEdition.sessions[idx - 1] : null,
			nextSession:
				idx < activeEdition.sessions.length - 1
					? activeEdition.sessions[idx + 1]
					: null,
		};
	}, [activeSession, activeEdition]);

	// Handle selecting a session to play
	const handleSelectSession = (session: ParsedTarjumaSession) => {
		setActiveSession(session);
		// Update URL query without full reload
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.set("session", session.slug);
			window.history.replaceState(null, "", url.toString());
		}
		// Scroll to theater
		setTimeout(() => {
			theaterRef.current?.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}, 50);
	};

	const handleCloseTheater = () => {
		setActiveSession(null);
		if (typeof window !== "undefined") {
			const url = new URL(window.location.href);
			url.searchParams.delete("session");
			window.history.replaceState(null, "", url.toString());
		}
	};

	const handleClearFilters = () => {
		setSelectedJuz(null);
		setSearchQuery("");
	};

	return (
		<div className="w-full space-y-8">
			{/* ================= IN-PLACE SANCTUM THEATER (SEAMLESS SINGLE-FRAME PLAYER) ================= */}
			{activeSession && (
				<div
					ref={theaterRef}
					className="scroll-mt-28 w-full rounded-2xl overflow-hidden border border-brand-gold/30 shadow-xl bg-black animate-fade-in"
				>
					{/* Flush Top Utility Bar */}
					<div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-[#0a2318]  border-brand-gold/25 text-xs text-brand-warm-white">
						{/* Prev Surah Icon Button */}
						<div className="flex items-center">
							{prevSession ? (
								<button
									onClick={() =>
										handleSelectSession(prevSession)
									}
									className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0e3120] hover:bg-brand-gold hover:text-[#06170e] text-brand-warm-white transition-colors border border-brand-gold/25 shadow-xs"
									title={`Previous: ${prevSession.cleanSurahTitle}`}
									aria-label={`Previous: ${prevSession.cleanSurahTitle}`}
								>
									<ChevronLeft className="w-4 h-4" />
								</button>
							) : (
								<div className="w-8 h-8" />
							)}
						</div>

						{/* Center Surah Info (Responsive & Truncated) */}
						<div className="flex items-center justify-center gap-1.5 sm:gap-2 text-center truncate px-2 min-w-0 flex-1">
							<span className="font-mono text-xs font-bold text-brand-gold shrink-0">
								Session {activeSession.sessionCode}
							</span>
							<span className="text-white/40 hidden sm:inline">
								·
							</span>
							<span className="font-serif text-xs sm:text-sm font-semibold text-white truncate">
								{activeSession.cleanSurahTitle}
							</span>
							{activeSession.urduTitle && (
								<span className="font-urdu text-sm sm:text-base text-brand-gold hidden md:inline dir-rtl">
									({activeSession.urduTitle})
								</span>
							)}
						</div>

						{/* Next Surah & Close Icon Buttons */}
						<div className="flex items-center gap-1.5">
							{nextSession && (
								<button
									onClick={() =>
										handleSelectSession(nextSession)
									}
									className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#0e3120] hover:bg-brand-gold hover:text-[#06170e] text-brand-warm-white transition-colors border border-brand-gold/25 shadow-xs"
									title={`Next: ${nextSession.cleanSurahTitle}`}
									aria-label={`Next: ${nextSession.cleanSurahTitle}`}
								>
									<ChevronRight className="w-4 h-4" />
								</button>
							)}

							<button
								onClick={handleCloseTheater}
								aria-label="Close player"
								className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Flush Video Player (Zero nested frames) */}
					<YouTubeEmbed
						youtubeId={activeSession.youtubeId}
						title={activeSession.title}
						thumbnailUrl={activeSession.thumbnailUrl}
						className="rounded-none border-0 shadow-none"
					/>
				</div>
			)}

			{/* ================= CONTROLS: COMPACT YEAR TABS & JUZ RAIL ================= */}
			<div className="space-y-4">
				{/* Top Bar: Year Selector & Quick Summary */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3">
					{/* High-Contrast Year Switcher */}
					<div
						className="inline-flex p-1 w-full justify-between bg-surface-container-high/80 rounded-xl border border-surface-container-highest shadow-xs"
						role="tablist"
						aria-label="Ramadan Editions"
					>
						{editions.map((edition) => {
							const isSelected = edition.id === selectedEditionId;
							return (
								<button
									key={edition.id}
									onClick={() => {
										setSelectedEditionId(edition.id);
										setSelectedJuz(null);
									}}
									role="tab"
									aria-selected={isSelected}
									className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm transition-all flex items-center justify-between gap-2 ${
										isSelected
											? "bg-primary text-brand-warm-white font-bold shadow-sm border border-brand-gold/30"
											: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-medium"
									}`}
								>
									<span>{edition.year}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* Search & 30-Juz Quick-Jump Rail */}
				<div className="space-y-3">
					{/* High-Contrast Search Bar */}
					<div className="relative w-full">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search by surah, session or ayah..."
							className="w-full pl-11 pr-10 py-3 text-sm bg-surface-container-lowest border border-surface-container-high rounded-xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
						/>
						{searchQuery && (
							<button
								onClick={() => setSearchQuery("")}
								aria-label="Clear search"
								className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
							>
								<X className="w-4 h-4" />
							</button>
						)}
					</div>

					{/* 30 Juz Horizontal Quick-Jump Rail */}
					<div className="flex items-center gap-2">
						<div
							ref={juzRailRef}
							className="flex items-center gap-1.5 overflow-x-auto py-1.5 scrollbar-none no-scrollbar text-xs"
							style={{ scrollbarWidth: "none" }}
						>
							{/* All Juz Pill */}
							<button
								onClick={() => setSelectedJuz(null)}
								className={`shrink-0 px-3.5 py-1.5 rounded-lg font-medium transition-all ${
									selectedJuz === null
										? "bg-primary text-brand-warm-white font-bold shadow-xs border border-primary"
										: "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface border border-surface-container-high"
								}`}
							>
								All Parahs
							</button>

							{/* Individual Juz 1 to 30 */}
							{QURAN_JUZ_LIST.map((juz) => {
								const isSelected = selectedJuz === juz.number;
								return (
									<button
										key={juz.number}
										onClick={() =>
											setSelectedJuz(
												isSelected ? null : juz.number,
											)
										}
										title={`${juz.transliteration} (${juz.urduName})`}
										className={`shrink-0 px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
											isSelected
												? "bg-brand-gold text-primary font-bold shadow-xs border border-brand-gold"
												: "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low hover:border-primary/40 hover:text-on-surface border border-surface-container-high"
										}`}
									>
										<span className="font-mono text-[11px] font-bold">
											{juz.number < 10
												? `0${juz.number}`
												: juz.number}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{/* Filter Status Line */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 text-xs text-on-surface-variant">
				<div>
					<span>Showing </span>
					<strong className="text-primary font-bold font-mono">
						{filteredSessions.length}
					</strong>
					<span> of {activeEdition.sessionCount} sessions</span>
					{selectedJuz !== null && (
						<span>
							{" "}
							in{" "}
							<span className="text-primary font-bold">
								Juz {selectedJuz} (
								{QURAN_JUZ_LIST[selectedJuz - 1]?.urduName})
							</span>
						</span>
					)}
					{searchQuery && (
						<span>
							{" "}
							matching &ldquo;
							<span className="text-primary font-bold">
								{searchQuery}
							</span>
							&rdquo;
						</span>
					)}
				</div>

				{(selectedJuz !== null || searchQuery) && (
					<button
						onClick={handleClearFilters}
						className="text-xs text-brand-gold hover:underline font-bold self-start sm:self-auto"
					>
						Reset all filters
					</button>
				)}
			</div>

			{/* ================= CURRICULUM LEDGER (DOMINANT FOREST GREEN HEADER + CREAM BODY) ================= */}
			{filteredSessions.length === 0 ? (
				<div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest py-16 px-6 text-center shadow-sm">
					<BookOpen className="w-10 h-10 text-primary/40 mx-auto mb-3" />
					<h3 className="font-serif text-lg font-bold text-primary">
						No sessions found
					</h3>
					<p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mt-1 mb-5">
						No recordings match your current filter criteria in the{" "}
						{activeEdition.year} cycle.
					</p>
					<button
						onClick={handleClearFilters}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-primary text-brand-warm-white hover:bg-primary-hover transition-colors shadow-xs"
					>
						Clear Filters
					</button>
				</div>
			) : (
				<div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest overflow-hidden shadow-md">
					{/* Table Column Header: DOMINANT DEEP FOREST GREEN ANCHOR */}
					<div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#0a2318]  border-brand-gold/30 text-[11px] font-mono font-bold uppercase tracking-widest text-brand-gold">
						<div className="col-span-2 md:col-span-1">Session</div>
						<div className="col-span-6 md:col-span-8">Surah</div>
						<div className="col-span-4 md:col-span-3 text-right">
							Recording
						</div>
					</div>

					{/* Ledger Rows on Warm Cream Parchment */}
					<div className="divide-y divide-surface-container-high/60">
						{filteredSessions.map((session) => {
							const isCurrentlyActive =
								activeSession?.slug === session.slug;

							return (
								<button
									key={session.slug}
									type="button"
									onClick={() => handleSelectSession(session)}
									className={`w-full text-left group block transition-all duration-150 ${
										isCurrentlyActive
											? "bg-[#f4efe0] border-l-4 border-l-brand-gold shadow-xs"
											: "bg-surface-container-lowest hover:bg-[#f8f5ea] focus:bg-[#f8f5ea] focus:outline-none"
									}`}
								>
									{/* Responsive Ledger Row (Unified single subtree) */}
									<div className="p-3.5 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-4 sm:items-center">
										{/* Session Number / Code */}
										<div className="sm:col-span-2 md:col-span-1 flex items-center">
											<span
												className={`font-mono text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded sm:rounded-md transition-colors shadow-xs ${
													isCurrentlyActive
														? "bg-primary text-brand-gold font-extrabold border border-brand-gold/40"
														: "bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-brand-gold"
												}`}
											>
												<span className="sm:hidden">
													Session{" "}
												</span>
												{session.sessionCode}
											</span>
										</div>

										{/* Content & Media Container (flex on mobile, contents on desktop) */}
										<div className="flex items-start justify-between gap-3 sm:contents">
											{/* Surah Title & Range */}
											<div className="flex-1 min-w-0 sm:col-span-6 md:col-span-8 pr-0 sm:pr-2">
												<div className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1">
													<span
														className={`font-serif text-sm sm:text-base font-bold sm:font-semibold transition-colors leading-snug ${
															isCurrentlyActive
																? "text-primary"
																: "text-on-surface group-hover:text-primary"
														}`}
													>
														{
															session.cleanSurahTitle
														}
													</span>
													{session.urduTitle && (
														<span className="font-urdu text-base sm:text-lg text-tertiary font-bold dir-rtl">
															{session.urduTitle}
														</span>
													)}
												</div>
												{session.rangeLabel && (
													<span className="inline-block mt-0.5 font-sans text-[11px] text-on-surface-variant">
														{session.rangeLabel}
													</span>
												)}
											</div>

											{/* Video Thumbnail with Play Button Overlay */}
											<div className="shrink-0 sm:col-span-4 md:col-span-3 text-right flex justify-end">
												<div className="relative w-20 h-12 sm:w-28 md:w-32 sm:aspect-video rounded-md sm:rounded-lg overflow-hidden border border-surface-container-high shrink-0 shadow-xs bg-black/10 group-hover:border-primary/40 transition-colors">
													{session.thumbnailUrl && (
														<Image
															src={
																session.thumbnailUrl
															}
															alt={
																session.cleanSurahTitle
															}
															fill
															sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 128px"
															className="object-cover transition-transform duration-300 group-hover:scale-105"
														/>
													)}
													<div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors flex items-center justify-center">
														<span
															className={`inline-flex items-center justify-center w-5 h-5 sm:w-7 sm:h-7 rounded-full transition-all shadow-xs ${
																isCurrentlyActive
																	? "bg-brand-gold text-primary font-bold shadow-sm sm:scale-110"
																	: "bg-surface-container-high/90 text-primary group-hover:bg-primary group-hover:text-brand-warm-white sm:group-hover:scale-110"
															}`}
														>
															<Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current ml-0.5" />
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
