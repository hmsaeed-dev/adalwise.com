"use client";

import React, { useState, useMemo, useDeferredValue } from "react";
import Link from "next/link";
import {
	Search,
	X,
	Play,
	ArrowUpRight,
	BookOpen,
	Compass,
	Filter,
	Sparkles,
} from "lucide-react";
import type {
	QuranSurahWithSessions,
	ParsedTarjumaSession,
} from "@/lib/lectures/tarjuma-quran";
import { QURAN_JUZ_LIST } from "@/lib/lectures/tarjuma-quran";
import { STUDY_NOTES_REGISTRY } from "@/lib/lectures/notes-registry";

interface SurahMatrixNavigatorProps {
	surahs: QuranSurahWithSessions[];
	onSelectSession: (session: ParsedTarjumaSession) => void;
	initialSurahNumber?: number;
}

export function SurahMatrixNavigator({
	surahs,
	onSelectSession,
	initialSurahNumber,
}: SurahMatrixNavigatorProps) {
	const allSurahs = surahs;

	// Search & Filter state
	const [searchQuery, setSearchQuery] = useState<string>("");
	const deferredQuery = useDeferredValue(searchQuery);
	const [revelationFilter, setRevelationFilter] = useState<
		"all" | "Makki" | "Madani"
	>("all");
	const [selectedJuz, setSelectedJuz] = useState<number | null>(null);

	// Active Surah for the detailed inspection drawer
	const [activeSurah, setActiveSurah] = useState<QuranSurahWithSessions | null>(
		() => {
			if (initialSurahNumber) {
				return (
					allSurahs.find((s) => s.number === initialSurahNumber) || null
				);
			}
			return null;
		},
	);

	// Filter Surahs by query, revelation type, and juz
	const filteredSurahs = useMemo(() => {
		const q = deferredQuery.trim().toLowerCase();

		return allSurahs.filter((surah) => {
			// 1. Revelation type filter
			if (revelationFilter !== "all" && surah.type !== revelationFilter) {
				return false;
			}

			// 2. Juz filter
			if (selectedJuz !== null && !surah.juz.includes(selectedJuz)) {
				return false;
			}

			// 3. Search query
			if (q) {
				const numStr = surah.number.toString();
				const nameMatch = surah.name.toLowerCase().includes(q);
				const arabicMatch = surah.arabic.includes(q);
				const urduMatch = surah.urdu.includes(q);
				const numMatch = numStr === q || numStr.padStart(3, "0") === q;
				if (!nameMatch && !arabicMatch && !urduMatch && !numMatch) {
					return false;
				}
			}

			return true;
		});
	}, [allSurahs, deferredQuery, revelationFilter, selectedJuz]);

	// Find companion notes if any exist for the active Surah
	const companionNotes = useMemo(() => {
		if (!activeSurah) return [];
		return STUDY_NOTES_REGISTRY.filter((note) => {
			const noteLower = (note.title + " " + note.description).toLowerCase();
			return (
				noteLower.includes(activeSurah.name.toLowerCase()) ||
				noteLower.includes(activeSurah.urdu)
			);
		});
	}, [activeSurah]);

	return (
		<div className="w-full space-y-6 animate-fade-in">
			{/* Search & Multi-Filter Control Bar */}
			<div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
				{/* Search Input */}
				<div className="relative flex-1">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/70" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search by Surah name ..."
						className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-surface-container-lowest border border-surface-container-high rounded-xl text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs"
					/>
					{searchQuery && (
						<button
							onClick={() => setSearchQuery("")}
							aria-label="Clear search"
							className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-on-surface-variant hover:text-on-surface transition-colors"
						>
							<X className="w-3.5 h-3.5" />
						</button>
					)}
				</div>

				{/* Revelation Filter Chips */}
				<div className="flex items-center gap-1.5 p-1 bg-surface-container-high/60 rounded-xl border border-surface-container-highest shrink-0">
					{(["all", "Makki", "Madani"] as const).map((type) => {
						const isSelected = revelationFilter === type;
						const label =
							type === "all"
								? "All"
								: type === "Makki"
									? "Makki"
									: "Madani";
						return (
							<button
								key={type}
								onClick={() => setRevelationFilter(type)}
								className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
									isSelected
										? "bg-primary text-brand-warm-white font-semibold shadow-xs"
										: "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
								}`}
							>
								{label}
							</button>
						);
					})}
				</div>

				{/* Juz Quick Dropdown */}
				<div className="relative shrink-0">
					<select
						value={selectedJuz ?? ""}
						onChange={(e) =>
							setSelectedJuz(
								e.target.value ? parseInt(e.target.value, 10) : null,
							)
						}
						aria-label="Filter by Juz"
						className="w-full md:w-auto px-3 py-2.5 text-xs font-medium bg-surface-container-lowest border border-surface-container-high rounded-xl text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-xs cursor-pointer"
					>
						<option value="">All Parahs (1–30)</option>
						{QURAN_JUZ_LIST.map((j) => (
							<option key={j.number} value={j.number}>
								Juz {j.number}: {j.transliteration} ({j.urduName})
							</option>
						))}
					</select>
				</div>
			</div>

			{/* Status Bar */}
			<div className="flex items-center justify-between text-xs text-on-surface-variant px-1">
				<span>
					Showing{" "}
					<strong className="text-primary font-bold font-mono">
						{filteredSurahs.length}
					</strong>{" "}
					of 114 Surahs
					{revelationFilter !== "all" && (
						<span> · {revelationFilter} Revelations</span>
					)}
				</span>
				{(searchQuery ||
					revelationFilter !== "all" ||
					selectedJuz !== null) && (
					<button
						onClick={() => {
							setSearchQuery("");
							setRevelationFilter("all");
							setSelectedJuz(null);
						}}
						className="text-primary hover:underline font-medium"
					>
						Clear filters
					</button>
				)}
			</div>

			{/* 114 Surahs Responsive Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
				{filteredSurahs.map((surah) => {
					const isSelected = activeSurah?.number === surah.number;
					return (
						<div
							key={surah.number}
							onClick={() => setActiveSurah(surah)}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									setActiveSurah(surah);
								}
							}}
							className={`group relative p-4 rounded-xl text-left cursor-pointer transition-all border flex flex-col justify-between ${
								isSelected
									? "bg-primary-container/20 border-primary shadow-md ring-1 ring-primary"
									: "bg-surface-container-lowest hover:bg-surface-container-low border-surface-container-high hover:border-primary/40 shadow-xs hover:shadow-sm"
							}`}
						>
							{/* Card Top: Number, Revelation Tag, Session Count */}
							<div className="flex items-center justify-between gap-2 pb-2">

								<div className="flex items-center gap-1.5">
									<span className="text-[10px] font-medium text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded-md">
										{surah.sessionCount}{" "}
										{surah.sessionCount === 1 ? "record" : "records"}
									</span>
								</div>
							</div>

							{/* Card Center: Titles */}
							<div className="my-2 flex items-baseline justify-between gap-2">
								<div className="min-w-0">
									<h3 className="font-serif text-base font-semibold text-on-surface group-hover:text-primary transition-colors truncate">
										{surah.name}
									</h3>
								</div>
								<div className="shrink-0 text-right">
									<span className="font-urdu text-lg font-bold text-primary dir-rtl block leading-tight">
										{surah.arabic}
									</span>
								</div>
							</div>


						</div>
					);
				})}
			</div>

			{filteredSurahs.length === 0 && (
				<div className="py-16 text-center rounded-2xl bg-surface-container-lowest border border-dashed border-surface-container-high space-y-3">
					<BookOpen className="w-8 h-8 mx-auto text-on-surface-variant/50" />
					<h3 className="font-serif text-lg text-on-surface font-medium">
						No Surahs matched your filters
					</h3>
					<p className="text-xs text-on-surface-variant max-w-sm mx-auto">
						Try clearing your search query or switching your Revelation and
						Juz selections.
					</p>
					<button
						onClick={() => {
							setSearchQuery("");
							setRevelationFilter("all");
							setSelectedJuz(null);
						}}
						className="mt-2 px-4 py-2 bg-primary text-brand-warm-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors"
					>
						Show all 114 Surahs
					</button>
				</div>
			)}

			{/* ================= SURAH RECORDINGS MODAL DRAWER ================= */}
			{activeSurah && (
				<div
					role="dialog"
					aria-modal="true"
					aria-labelledby="surah-detail-title"
					className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
					onClick={() => setActiveSurah(null)}
				>
					<div
						className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-surface-container-lowest rounded-2xl border border-surface-container-high shadow-2xl overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Drawer Header */}
						<div className="p-5 sm:p-6 bg-[#0a2318] text-brand-warm-white flex items-start justify-between gap-4 border-b border-brand-gold/30">
							<div className="space-y-1">

								<div className="flex items-baseline gap-4 pt-1">
									<h2
										id="surah-detail-title"
										className="font-serif text-2xl sm:text-3xl text-brand-warm-white font-normal"
									>
										{activeSurah.name}
									</h2>
									<span className="font-urdu text-2xl sm:text-3xl text-brand-gold font-bold dir-rtl select-none">
										{activeSurah.urdu}
									</span>
								</div>
							</div>

							<button
								onClick={() => setActiveSurah(null)}
								aria-label="Close details"
								className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						{/* Drawer Content: Sessions List */}
						<div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
							<div className="flex items-center justify-between pb-2 border-b border-surface-container-high">
								<span className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
									Recordings ({activeSurah.sessions.length})
								</span>
							</div>

							<div className="space-y-3">
								{activeSurah.sessions.map((session) => (
									<div
										key={session.id}
										className="p-4 rounded-xl bg-surface-container border border-surface-container-high hover:border-primary/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
									>
										<div className="space-y-1 min-w-0 flex-1">
											<div className="flex items-center gap-2 text-xs">
												<span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded text-[11px]">
													{session.edition}
												</span>
												<span className="text-on-surface-variant font-mono">
													Session {session.sessionCode}
												</span>
											</div>
											<h4 className="font-serif text-sm sm:text-base font-semibold text-on-surface group-hover:text-primary transition-colors">
												{session.title}
											</h4>
											{session.urduTitle && (
												<p className="font-urdu text-xs sm:text-sm text-on-surface-variant dir-rtl">
													{session.urduTitle}
												</p>
											)}
										</div>

										<div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-surface-container-high">
											<button
												onClick={() => {
													onSelectSession(session);
													setActiveSurah(null);
												}}
												className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-brand-warm-white text-xs font-semibold hover:bg-primary-hover shadow-xs transition-colors"
											>
												<Play className="w-3.5 h-3.5 fill-current" />
												<span>Watch</span>
											</button>
										</div>
									</div>
								))}
							</div>

							{/* Companion Study Notes Section if Available */}
							{companionNotes.length > 0 && (
								<div className="mt-6 pt-5 border-t border-surface-container-high space-y-3">
									<div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-primary">
										<Sparkles className="w-4 h-4 text-brand-gold" />
										<span>Companion Study Infographics</span>
									</div>
									<div className="grid grid-cols-1 gap-2.5">
										{companionNotes.map((note) => (
											<div
												key={note.id}
												className="p-3.5 rounded-xl bg-brand-parchment/40 border border-brand-gold/30 flex items-center justify-between gap-3"
											>
												<div className="min-w-0">
													<h5 className="font-serif text-xs sm:text-sm font-semibold text-on-surface truncate">
														{note.title}
													</h5>
													<p className="text-[11px] text-on-surface-variant truncate">
														{note.category} · {note.type.toUpperCase()}
													</p>
												</div>
												<Link
													href={note.filePath}
													target="_blank"
													rel="noopener noreferrer"
													className="px-3 py-1 bg-surface-container-lowest hover:bg-primary hover:text-brand-warm-white text-primary text-xs font-medium rounded-lg border border-primary/20 transition-colors shrink-0"
												>
													View Graphic
												</Link>
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
