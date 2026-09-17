"use client";

import React, { useState, useMemo, useEffect, useDeferredValue } from "react";
import Link from "next/link";
import {
	Search,
	X,
	Download,
	ExternalLink,
	Eye,
	FileText,
	ChevronLeft,
	ChevronRight,
	ArrowRight,
} from "lucide-react";
import { STUDY_NOTES_REGISTRY, StudyNote } from "@/lib/lectures/notes-registry";
import MiniSearch from "minisearch";
import { normalizeUrduArabic, tokenizeBilingual } from "@/lib/search/normalizer";

export function StudyNotesArchiveView() {
	const [searchQuery, setSearchQuery] = useState("");
	const deferredSearchQuery = useDeferredValue(searchQuery);
	const [selectedCategory, setSelectedCategory] = useState<string>("All");
	const [activeModalNote, setActiveModalNote] = useState<StudyNote | null>(null);

	// Memoized MiniSearch engine for study notes
	const notesSearchEngine = useMemo(() => {
		const ms = new MiniSearch<StudyNote>({
			fields: ["title", "urduTitle", "description", "category", "type"],
			storeFields: ["id", "category"],
			tokenize: tokenizeBilingual,
			processTerm: (term) => normalizeUrduArabic(term),
			searchOptions: {
				boost: {
					title: 4.0,
					urduTitle: 3.5,
					category: 2.0,
					description: 1.5,
					type: 1.0,
				},
				prefix: true,
				fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
				combineWith: "AND",
			},
		});

		ms.addAll(STUDY_NOTES_REGISTRY);
		return ms;
	}, []);

	// Filter notes by search query and category
	const filteredNotes = useMemo(() => {
		let list = STUDY_NOTES_REGISTRY;

		if (selectedCategory !== "All") {
			list = list.filter((n) => n.category === selectedCategory);
		}

		if (deferredSearchQuery.trim()) {
			const cleanQ = normalizeUrduArabic(deferredSearchQuery);
			if (cleanQ) {
				let hits = notesSearchEngine.search(cleanQ, {
					filter: (result) =>
						selectedCategory === "All" || result.category === selectedCategory,
					combineWith: "AND",
					prefix: true,
					fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
				});

				if (hits.length === 0 && cleanQ.includes(" ")) {
					hits = notesSearchEngine.search(cleanQ, {
						filter: (result) =>
							selectedCategory === "All" || result.category === selectedCategory,
						combineWith: "OR",
						prefix: true,
						fuzzy: (term) => (term.length >= 4 ? 0.2 : false),
					});
				}

				const hitRankMap = new Map<string, number>();
				hits.forEach((h, idx) => hitRankMap.set(h.id, idx));

				list = list
					.filter((n) => hitRankMap.has(n.id))
					.sort(
						(a, b) =>
							(hitRankMap.get(a.id) ?? 0) - (hitRankMap.get(b.id) ?? 0),
					);
			}
		}

		return list;
	}, [selectedCategory, deferredSearchQuery, notesSearchEngine]);

	// Navigation within the inspection modal
	const currentIdx = useMemo(() => {
		if (!activeModalNote) return -1;
		return filteredNotes.findIndex((n) => n.id === activeModalNote.id);
	}, [activeModalNote, filteredNotes]);

	const handlePrevNote = () => {
		if (filteredNotes.length <= 1 || currentIdx === -1) return;
		const prevIdx = (currentIdx - 1 + filteredNotes.length) % filteredNotes.length;
		setActiveModalNote(filteredNotes[prevIdx]);
	};

	const handleNextNote = () => {
		if (filteredNotes.length <= 1 || currentIdx === -1) return;
		const nextIdx = (currentIdx + 1) % filteredNotes.length;
		setActiveModalNote(filteredNotes[nextIdx]);
	};

	// Keyboard shortcuts for modal (ESC to close, Left/Right arrows to cycle)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!activeModalNote) return;

			if (e.key === "Escape") {
				setActiveModalNote(null);
			} else if (e.key === "ArrowRight") {
				handleNextNote();
			} else if (e.key === "ArrowLeft") {
				handlePrevNote();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		if (activeModalNote) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "unset";
		};
	}, [activeModalNote, currentIdx, filteredNotes]);

	const categories: { id: string; label: string; count: number }[] = [
		{ id: "All", label: "All", count: STUDY_NOTES_REGISTRY.length },
		{
			id: "Lisan-ul-Quran",
			label: "Grammar",
			count: STUDY_NOTES_REGISTRY.filter((n) => n.category === "Lisan-ul-Quran").length,
		},
		{
			id: "Seerah",
			label: "Chronologies",
			count: STUDY_NOTES_REGISTRY.filter((n) => n.category === "Seerah").length,
		},
	];

	return (
		<div className="w-full bg-surface text-on-surface py-8 sm:py-12">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col gap-8 sm:gap-12">
				{/* ─── MASTHEAD & BREADCRUMB ─── */}
				<header className="flex flex-col gap-4 pb-8">
					{/* Navigation back-link */}
					<div className="flex items-center gap-2 text-xs font-sans">
						<Link
							href="/lectures"
							className="text-on-surface-variant hover:text-primary transition-colors font-medium"
						>
							Lectures
						</Link>
						<span className="text-outline-variant">/</span>
						<span className="text-secondary font-semibold">
							Notes &amp; References
						</span>
					</div>

					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
						<div className="max-w-3xl">
							<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-bold tracking-tight leading-[1.15]">
								Notes &amp; References
							</h1>

							<p className="mt-3 font-serif italic text-base sm:text-lg text-secondary font-medium max-w-2xl leading-relaxed">
								Visual linguistic infographics, prophetic chronologies, and research monographs accompanying Dr. Hafiz Haseeb’s discourses.
							</p>
						</div>

						{/* Quick Cross-Link to Quranic Coursework */}
						<Link
							href="/lectures/tarjuma-e-quran"
							className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-highest text-xs font-sans font-bold uppercase tracking-wider transition-colors shrink-0"
						>
							<span>Tarjuma-e-Quran</span>
							<ArrowRight className="w-3.5 h-3.5" />
						</Link>
					</div>

					{/* Category Filter Pills & Live Search Bar */}
					<div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
						{/* Category Tabs */}
						<div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
							{categories.map((cat) => {
								const isActive = selectedCategory === cat.id;
								return (
									<button
										key={cat.id}
										type="button"
										onClick={() => setSelectedCategory(cat.id)}
										className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-bold transition-all shrink-0 flex items-center gap-1.5 ${
											isActive
												? "bg-primary text-brand-warm-white shadow-xs"
												: "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-primary border border-surface-container-high/60"
										}`}
									>
										<span>{cat.label}</span>
									</button>
								);
							})}
						</div>

						{/* Live Search Bar */}
						<div className="relative w-full md:w-80 shrink-0">
							<div className="flex items-center bg-surface-container-lowest px-3.5 py-2 rounded-xl border border-surface-container-high shadow-xs focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20 transition-all">
								<Search className="w-4 h-4 text-outline mr-2 shrink-0" />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Search notes & charts..."
									className="w-full bg-transparent text-primary placeholder:text-on-surface-variant/60 font-sans text-xs focus:outline-none"
								/>
								{searchQuery && (
									<button
										type="button"
										onClick={() => setSearchQuery("")}
										title="Clear search"
										className="p-0.5 text-on-surface-variant hover:text-primary transition-colors ml-1"
									>
										<X className="w-3.5 h-3.5" />
									</button>
								)}
							</div>
						</div>
					</div>
				</header>

				{/* ─── NOTES HOLDINGS GRID ─── */}
				<main>
					{filteredNotes.length === 0 ? (
						<div className="py-16 text-center flex flex-col items-center justify-center gap-2">
							<p className="font-serif text-lg text-primary font-semibold">
								No reference notes matched.
							</p>
							<p className="font-sans text-xs text-on-surface-variant">
								Try clearing your search query or selecting &ldquo;All Holdings&rdquo;.
							</p>
							<button
								type="button"
								onClick={() => {
									setSearchQuery("");
									setSelectedCategory("All");
								}}
								className="mt-3 px-4 py-1.5 rounded-full bg-primary text-brand-warm-white font-sans text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors"
							>
								Reset Filters
							</button>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredNotes.map((note) => {
								const isPdf = note.type === "pdf";

								return (
									<article
										key={note.id}
										className="group bg-surface-container-low rounded-2xl border border-surface-container-high hover:border-brand-gold/60 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
									>
										{/* Metadata & Actions */}
										<div className="p-4 flex flex-col flex-1 justify-between gap-3">
											<div>
												<h3 className="font-urdu text-center text-base font-bold text-primary dir-rtl transition-colors block mt-1 select-none">
													{note.urduTitle}
												</h3>
											</div>
										</div>
										{/* Visual Preview Container */}
										<div
											onClick={() =>
												setActiveModalNote(note)
											}
											className="relative w-full aspect-4/3 bg-surface-container-lowest overflow-hidden block text-left cursor-zoom-in group/preview select-none"
										>
											{
												<>
													{/* Direct native static image to ensure 100% reliable rendering without URL-encoding issues */}
													{/* eslint-disable-next-line @next/next/no-img-element */}
													<img
														src={encodeURI(
															note.filePath,
														)}
														alt={note.title}
														loading="lazy"
														className="w-full h-full object-contain p-2 group-hover/preview:scale-103 transition-transform duration-300"
													/>
													{/* Hover Inspection Overlay */}
													<div className="absolute inset-0 bg-primary/0 group-hover/preview:bg-primary/20 transition-colors flex items-center justify-center"></div>
												</>
											}
										</div>
									</article>
								);
							})}
						</div>
					)}
				</main>
			</div>

			{/* ─── FULL-SCREEN WINDOW SCREEN MODAL (LIKE PREVIOUS DRAWER) ─── */}
			{activeModalNote && (
				<div
					className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-8 animate-fade-in"
					onClick={() => setActiveModalNote(null)}
				>
					<div
						className="relative w-full max-w-5xl max-h-[92vh] bg-surface rounded-3xl border border-surface-container-high shadow-2xl flex flex-col overflow-hidden"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Window Header */}
						<div className="px-5 sm:px-8 py-5 border-b border-surface-container-high flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-low/80">
							<div className="min-w-0 pr-2">

									<h3 className="font-urdu text-xl sm:text-2xl text-primary font-bold dir-rtl block mt-0.5">
										{activeModalNote.urduTitle}
									</h3>
							</div>

							{/* Actions */}
							<div className="flex items-center gap-2 shrink-0 self-end sm:self-center">

								<a
									href={encodeURI(activeModalNote.filePath)}
									download
									className="px-4 py-1.5 rounded-full bg-primary text-brand-warm-white hover:bg-primary-container text-xs font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-xs"
								>
									<Download className="w-3.5 h-3.5" />
									<span>Download</span>
								</a>

								<button
									type="button"
									onClick={() => setActiveModalNote(null)}
									className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors ml-1"
									aria-label="Close viewer"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Window Canvas Body */}
						<div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-surface-container-lowest/60">
							{(
								<div className="w-full h-full flex flex-col items-center justify-center">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={encodeURI(activeModalNote.filePath)}
										alt={activeModalNote.title}
										className="w-auto h-auto max-h-[68vh] max-w-full object-contain rounded-xl shadow-lg border border-surface-container-high bg-surface select-none"
									/>
								</div>
							)}
						</div>

						{/* Window Footer Navigation */}
						<div className="px-6 py-3 border-t border-surface-container-high bg-surface-container-low/60 flex items-center justify-between text-xs font-sans text-on-surface-variant">
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={handlePrevNote}
									disabled={filteredNotes.length <= 1}
									className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold transition-colors inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
								>
									<ChevronLeft className="w-3.5 h-3.5" />
									<span>Previous</span>
								</button>

								<button
									type="button"
									onClick={handleNextNote}
									disabled={filteredNotes.length <= 1}
									className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-bold transition-colors inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
								>
									<span>Next</span>
									<ChevronRight className="w-3.5 h-3.5" />
								</button>
							</div>

							{currentIdx !== -1 && (
								<span className="font-semibold text-primary">
									{currentIdx + 1} of {filteredNotes.length}
								</span>
							)}

							<div className="hidden sm:flex items-center gap-4 text-[11px] text-on-surface-variant/70">
								<span>Arrow keys to navigate</span>
								<span>ESC to close</span>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
