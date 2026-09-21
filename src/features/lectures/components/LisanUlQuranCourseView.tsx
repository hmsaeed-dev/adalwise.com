"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, BookOpen, FileText, Search, X } from "lucide-react";
import { ParsedLisanSession } from "@/lib/lectures/lisan-ul-quran";
import { ParsedTarjumaSession } from "@/lib/lectures/tarjuma-quran";

interface LisanUlQuranCourseViewProps {
	sessions: ParsedLisanSession[];
	onSelectSession: (session: ParsedTarjumaSession) => void;
	activeSessionSlug?: string;
}

export function LisanUlQuranCourseView({
	sessions,
	onSelectSession,
	activeSessionSlug,
}: LisanUlQuranCourseViewProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// Progressive loading: initially 12 sessions, revealed in increments of 12
	const SESSIONS_PER_PAGE = 12;
	const [visibleCount, setVisibleCount] = useState<number>(() => {
		if (activeSessionSlug) {
			const idx = sessions.findIndex((s) => s.slug === activeSessionSlug);
			if (idx !== -1) {
				return Math.max(
					SESSIONS_PER_PAGE,
					Math.ceil((idx + 1) / SESSIONS_PER_PAGE) * SESSIONS_PER_PAGE,
				);
			}
		}
		return SESSIONS_PER_PAGE;
	});

	// Reset to initial 12 when search query changes
	useEffect(() => {
		setVisibleCount(SESSIONS_PER_PAGE);
	}, [searchQuery]);

	// Filter sessions solely by search query
	const filteredSessions = useMemo(() => {
		if (!searchQuery.trim()) return sessions;
		const q = searchQuery.toLowerCase().trim();
		return sessions.filter(
			(s) =>
				s.title.toLowerCase().includes(q) ||
				s.urduTitle.toLowerCase().includes(q) ||
				s.sessionCode.toLowerCase().includes(q)
		);
	}, [sessions, searchQuery]);

	// Sliced sessions to render in DOM
	const visibleSessions = useMemo(() => {
		return filteredSessions.slice(0, visibleCount);
	}, [filteredSessions, visibleCount]);

	const hasMoreSessions = visibleCount < filteredSessions.length;

	const handleSeeMore = () => {
		setVisibleCount((prev) => prev + SESSIONS_PER_PAGE);
	};

	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Course Context Ribbon */}
			<div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<span className="font-urdu text-sm text-primary font-bold dir-rtl">
							لسان القرآن
						</span>
					</div>
				</div>

				<Link
					href="/lectures/notes"
					className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-highest transition-colors shrink-0 self-start md:self-auto shadow-xs"
				>
					<FileText className="w-3.5 h-3.5 text-brand-gold" />
					<span>Grammar Notes</span>
				</Link>
			</div>

			{/* Minimal Controls: Session Count & Fast Search */}
			<div className="flex items-center justify-between gap-3">

				{/* Search Field */}
				<div className="relative w-full max-w-xs">
					<Search className="w-3.5 h-3.5 text-on-surface-variant/60 absolute left-3 top-1/2 -translate-y-1/2" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search lessons..."
						className="w-full pl-8 pr-8 py-1.5 rounded-lg text-xs bg-surface-container-low border border-surface-container-high focus:outline-none focus:border-brand-gold/50 text-on-surface placeholder:text-on-surface-variant/60 transition-colors"
					/>
					{searchQuery && (
						<button
							type="button"
							onClick={() => setSearchQuery("")}
							className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
			</div>

			{/* ================= LEDGER TABLE (DECLUTTERED & MINIMAL) ================= */}
			{filteredSessions.length === 0 ? (
				<div className="py-16 text-center flex flex-col items-center justify-center gap-2 bg-surface-container-lowest rounded-2xl border border-surface-container-high">
					<BookOpen className="w-8 h-8 text-on-surface-variant/40 mb-1" />
					<p className="font-semibold text-sm text-primary">
						No lessons found
					</p>
					<p className="text-xs text-on-surface-variant">
						Adjust your search query.
					</p>
				</div>
			) : (
				<>
					<div className="rounded-2xl border border-surface-container-high bg-surface-container-lowest overflow-hidden shadow-md">
					{/* Table Column Header: Deep Forest Green Anchor */}
					<div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3.5 bg-[#0a2318] border-brand-gold/30 text-[11px] font-mono font-bold uppercase tracking-widest text-brand-gold">
						<div className="col-span-2 md:col-span-2">Lesson</div>
						<div className="col-span-6 md:col-span-7">Topic</div>
						<div className="col-span-4 md:col-span-3 text-right">Recording</div>
					</div>

					{/* Ledger Rows on Warm Cream Parchment */}
					<div className="divide-y divide-surface-container-high/60">
						{visibleSessions.map((session) => {
							const isCurrentlyActive =
								activeSessionSlug === session.slug;

							return (
								<button
									key={session.slug}
									type="button"
									onClick={() => onSelectSession(session)}
									className={`w-full text-left group block transition-all duration-150 cursor-pointer ${
										isCurrentlyActive
											? "bg-[#f4efe0] border-l-4 border-l-brand-gold shadow-xs"
											: "bg-surface-container-lowest hover:bg-[#f8f5ea] focus:bg-[#f8f5ea] focus:outline-none"
									}`}
								>
									{/* Responsive Ledger Row */}
									<div className="p-3.5 sm:px-6 sm:py-4 flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-4 sm:items-center">
										{/* Lesson Badge */}
										<div className="sm:col-span-2 md:col-span-2 flex items-center">
											<span
												className={`font-mono text-xs font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded sm:rounded-md transition-colors shadow-xs ${
													isCurrentlyActive
														? "bg-primary text-brand-gold font-extrabold border border-brand-gold/40"
														: "bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-brand-gold"
												}`}
											>
												<span className="sm:hidden">Lesson </span>
												{session.sessionCode}
											</span>
										</div>

										{/* Content Container */}
										<div className="flex items-start justify-between gap-3 sm:contents">
											{/* Topic Title & Urdu */}
											<div className="flex-1 min-w-0 sm:col-span-6 md:col-span-7 pr-0 sm:pr-2">
												<div className="flex flex-wrap items-baseline gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1">
													<span
														className={`font-serif text-sm sm:text-base font-bold sm:font-semibold transition-colors leading-snug ${
															isCurrentlyActive
																? "text-primary"
																: "text-on-surface group-hover:text-primary"
														}`}
													>
														{session.title}
													</span>
													{session.urduTitle && (
														<span className="font-urdu text-base sm:text-lg text-tertiary font-bold dir-rtl">
															{session.urduTitle}
														</span>
													)}
												</div>
												<span className="inline-block mt-0.5 font-sans text-[11px] text-on-surface-variant font-medium">
													{session.durationFormatted}
												</span>
											</div>

											{/* Video Thumbnail with Play Button Overlay */}
											<div className="shrink-0 sm:col-span-4 md:col-span-3 text-right flex justify-end">
												<div className="relative w-20 h-12 sm:w-28 md:w-32 sm:aspect-video rounded-md sm:rounded-lg overflow-hidden border border-surface-container-high shrink-0 shadow-xs bg-black/10 group-hover:border-primary/40 transition-colors">
													{session.thumbnailUrl && (
														<Image
															src={session.thumbnailUrl}
															alt={session.title}
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

				{/* Progressive "See More" Loading Pattern */}
				{hasMoreSessions && (
					<div className="pt-2 flex flex-col items-center justify-center gap-2">
						<button
							type="button"
							onClick={handleSeeMore}
							className="inline-flex items-center justify-center gap-2 px-8 py-2.5 bg-primary text-brand-warm-white hover:bg-primary-hover rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer border border-brand-gold/30 hover:scale-[1.02] active:scale-[0.98]"
						>
							<span>See More</span>
						</button>
						<p className="text-[11px] font-mono text-on-surface-variant/80">
							Showing {visibleSessions.length} of {filteredSessions.length} lessons
						</p>
					</div>
				)}
				</>
			)}
		</div>
	);
}
