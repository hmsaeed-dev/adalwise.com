"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	Search,
	X,
	Download,
	ExternalLink,
	ArrowRight,
	Maximize2,
	FileText,
	BookOpen,
	Compass,
	Scale,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { STUDY_NOTES_REGISTRY, StudyNote } from "@/lib/lectures/notes-registry";

export function StudyNotesArchiveView() {
	const [searchQuery, setSearchQuery] = useState("");
	const [activeLightboxNote, setActiveLightboxNote] = useState<StudyNote | null>(null);

	// Group holdings into the 3 canonical dossiers
	const grammarNotes = useMemo(
		() => STUDY_NOTES_REGISTRY.filter((n) => n.category === "Lisan-ul-Quran"),
		[],
	);
	const seerahNotes = useMemo(
		() => STUDY_NOTES_REGISTRY.filter((n) => n.category === "Seerah"),
		[],
	);
	const treatiseNotes = useMemo(
		() => STUDY_NOTES_REGISTRY.filter((n) => n.category === "Statecraft"),
		[],
	);

	// Filter by search query across all dossiers
	const filterNotes = (list: StudyNote[]) => {
		if (!searchQuery.trim()) return list;
		const q = searchQuery.toLowerCase().trim();
		return list.filter(
			(n) =>
				n.title.toLowerCase().includes(q) ||
				(n.urduTitle && n.urduTitle.toLowerCase().includes(q)) ||
				n.description.toLowerCase().includes(q),
		);
	};

	const filteredGrammar = filterNotes(grammarNotes);
	const filteredSeerah = filterNotes(seerahNotes);
	const filteredTreatises = filterNotes(treatiseNotes);

	const totalMatching =
		filteredGrammar.length + filteredSeerah.length + filteredTreatises.length;

	// Keyboard controls for Lightbox (ESC to close, Left/Right arrow to cycle)
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!activeLightboxNote) return;

			if (e.key === "Escape") {
				setActiveLightboxNote(null);
			} else if (e.key === "ArrowRight") {
				const currentList =
					activeLightboxNote.category === "Lisan-ul-Quran"
						? grammarNotes
						: seerahNotes;
				const idx = currentList.findIndex((n) => n.id === activeLightboxNote.id);
				if (idx !== -1) {
					setActiveLightboxNote(currentList[(idx + 1) % currentList.length]);
				}
			} else if (e.key === "ArrowLeft") {
				const currentList =
					activeLightboxNote.category === "Lisan-ul-Quran"
						? grammarNotes
						: seerahNotes;
				const idx = currentList.findIndex((n) => n.id === activeLightboxNote.id);
				if (idx !== -1) {
					setActiveLightboxNote(
						currentList[(idx - 1 + currentList.length) % currentList.length],
					);
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		if (activeLightboxNote) {
			document.body.style.overflow = "hidden";
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "unset";
		};
	}, [activeLightboxNote, grammarNotes, seerahNotes]);

	return (
		<div className="w-full bg-surface text-on-surface py-8 sm:py-12">
			<div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop flex flex-col gap-12 sm:gap-16">
				{/* ─── MASTHEAD & BREADCRUMB ─── */}
				<header className="flex flex-col gap-4 pb-8 border-b border-surface-container-high/80">
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
							Study Notes &amp; Archive
						</span>
					</div>

					<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
						<div className="max-w-3xl">
							<h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary font-bold tracking-tight leading-[1.15]">
								Study Notes &amp; Reference Archive
							</h1>

							<p className="mt-3 font-serif italic text-base sm:text-lg text-secondary font-medium max-w-2xl leading-relaxed">
								A permanent library of linguistic infographics,
								prophetic chronologies, and socio-economic
								monographs accompanying Dr. Hafiz Haseeb’s
								discourses.
							</p>
						</div>
					</div>

					{/* Live Search Bar */}
					<div className="mt-4 relative max-w-xl">
						<div className="flex items-center bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-surface-container-high/80 shadow-xs focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/20 transition-all">
							<Search className="w-4 h-4 text-outline mr-2.5 shrink-0" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search across all 3 dossiers (e.g. Izafi, Makki, Economics)..."
								className="w-full bg-transparent text-primary placeholder:text-on-surface-variant/60 font-sans text-xs sm:text-sm focus:outline-none"
							/>
							{searchQuery && (
								<button
									type="button"
									onClick={() => setSearchQuery("")}
									title="Clear search"
									className="p-1 text-on-surface-variant hover:text-primary transition-colors ml-1"
								>
									<X className="w-3.5 h-3.5" />
								</button>
							)}
						</div>
						{searchQuery && (
							<span className="font-sans text-xs text-on-surface-variant/80 mt-1.5 block">
								Found {totalMatching} matching holding
								{totalMatching === 1 ? "" : "s"}
							</span>
						)}
					</div>
				</header>

				{/* ─── DOSSIER I: QURANIC ARABIC GRAMMAR ─── */}
				<section
					id="dossier-grammar"
					className="scroll-mt-20 flex flex-col gap-6"
				>
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-surface-container-high/80">
						<div>
							<div className="flex items-center gap-2 mb-1"></div>
							<h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
								Lisan-ul-Quran
							</h2>
							<p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl">
								Visual diagrams and charts systematically
								developed to accompany the verse-by-verse
								translation curriculum.
							</p>
						</div>

						<Link
							href="/lectures?series=online-quranic-arabic-course"
							className="inline-flex items-center gap-1 text-xs font-sans font-bold text-primary hover:text-secondary transition-colors shrink-0 group"
						>
							<span>Related lectures</span>
							<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>

					{filteredGrammar.length === 0 ? (
						<p className="font-sans text-xs text-on-surface-variant italic py-6">
							No grammar charts match “{searchQuery}”.
						</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
							{filteredGrammar.map((note, idx) => (
								<article
									key={note.id}
									className="group bg-surface-container-low rounded-2xl border border-surface-container-high hover:border-brand-gold/60 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
								>
									{/* Visual Preview Box */}
									<button
										type="button"
										onClick={() =>
											setActiveLightboxNote(note)
										}
										className="relative w-full aspect-4/3 bg-surface-container-lowest overflow-hidden block text-left cursor-zoom-in group/img"
									>
										<img
											src={note.filePath}
											alt={note.title}
											className="w-full h-full object-contain p-2 group-hover/img:scale-103 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/10 transition-colors flex items-center justify-center">
											<span className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-primary/90 text-brand-warm-white text-[11px] font-sans font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
												<Maximize2 className="w-3 h-3" />
											</span>
										</div>
									</button>

									{/* Metadata & Actions */}
									<div className="p-4 flex flex-col flex-1 justify-between gap-3">
										<div>
											<h3 className="font-urdu text-sm sm:text-base font-bold text-tertiary dir-rtl block mt-0.5">
												{note.urduTitle}
											</h3>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</section>

				{/* ─── DOSSIER II: PROPHETIC SEERAH CHRONOLOGIES ─── */}
				<section
					id="dossier-seerah"
					className="scroll-mt-20 flex flex-col gap-6 pt-4"
				>
					<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 pb-4 border-b border-surface-container-high/80">
						<div>
							<h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
								Prophetic Chronologies
							</h2>
							<p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl">
								Historical timelines charting the early Makki
								persecution, the constitutional covenant of
								Medina, and the complete prophetic lifespan.
							</p>
						</div>

						<Link
							href="/lectures?series=online-seerat-sessions"
							className="inline-flex items-center gap-1 text-xs font-sans font-bold text-primary hover:text-secondary transition-colors shrink-0 group"
						>
							<span>Seerah Sessions</span>
							<ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>

					{filteredSeerah.length === 0 ? (
						<p className="font-sans text-xs text-on-surface-variant italic py-6">
							No timelines match “{searchQuery}”.
						</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{filteredSeerah.map((note, idx) => (
								<article
									key={note.id}
									className="group bg-surface-container-low rounded-2xl border border-surface-container-high hover:border-brand-gold/60 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
								>
									{/* Wide Panoramic Preview Frame */}
									<button
										type="button"
										onClick={() =>
											setActiveLightboxNote(note)
										}
										className="relative w-full aspect-16/9 bg-surface-container-lowest overflow-hidden block text-left cursor-zoom-in group/img"
									>
										<img
											src={note.filePath}
											alt={note.title}
											className="w-full h-full object-contain p-2 group-hover/img:scale-103 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-primary/0 group-hover/img:bg-primary/10 transition-colors flex items-center justify-center">
											<span className="opacity-0 group-hover/img:opacity-100 transition-opacity bg-primary/90 text-brand-warm-white text-[11px] font-sans font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
												<Maximize2 className="w-3 h-3" />
											</span>
										</div>
									</button>

									{/* Details */}
									<div className="p-5 flex flex-col flex-1 justify-between gap-3">
										<div>
											<h3 className="font-urdu text-lg text-primary font-bold leading-snug group-hover:text-secondary transition-colors dir-rtl block mt-0.5">
												{note.urduTitle}
											</h3>
											<p className="font-sans text-xs sm:text-sm text-on-surface-variant mt-2 leading-relaxed">
												{note.description}
											</p>
										</div>
									</div>
								</article>
							))}
						</div>
					)}
				</section>
			</div>

			{/* ─── FULL-SCREEN LIGHTBOX MODAL ─── */}
			{activeLightboxNote && (
				<div
					className="fixed inset-0 z-50 bg-primary/90 backdrop-blur-md flex flex-col justify-between p-2 sm:p-4 md:p-6 animate-fade-in"
					onClick={() => setActiveLightboxNote(null)}
				>
					{/* Lightbox Top Bar */}
					<div
						className="w-full max-w-5xl mx-auto flex items-center justify-between text-brand-warm-white py-2 px-3 sm:px-4 bg-surface-container-low/30 backdrop-blur-md rounded-2xl border border-white/10 shrink-0"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="min-w-0 pr-4">
							<h4 className="font-urdu text-sm sm:text-base text-brand-warm-white font-bold dir-rtl block ">
								{activeLightboxNote.urduTitle}
							</h4>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							<a
								href={activeLightboxNote.filePath}
								target="_blank"
								rel="noopener noreferrer"
								className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-brand-warm-white text-xs font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
								title="Open in new tab"
							>
								<ExternalLink className="w-3.5 h-3.5" />
								<span className="hidden sm:inline">
									Original
								</span>
							</a>

							<a
								href={activeLightboxNote.filePath}
								download
								className="px-3 py-1 rounded-full bg-brand-gold text-[#00261a] hover:bg-brand-gold/90 text-xs font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-xs"
							>
								<Download className="w-3.5 h-3.5" />
								<span>Download</span>
							</a>

							<button
								type="button"
								onClick={() => setActiveLightboxNote(null)}
								className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-brand-warm-white transition-colors ml-1"
								aria-label="Close lightbox"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>

					{/* Center Canvas */}
					<div
						className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto select-none"
						onClick={(e) => e.stopPropagation()}
					>
						<img
							src={activeLightboxNote.filePath}
							alt={activeLightboxNote.title}
							className="max-h-[82vh] max-w-full w-auto object-contain rounded-xl shadow-2xl border border-white/10"
						/>
					</div>

					{/* Lightbox Footer Navigation Hint */}
					<div
						className="w-full max-w-5xl mx-auto flex items-center justify-between text-[11px] font-sans text-brand-warm-white/70 px-4 py-1"
						onClick={(e) => e.stopPropagation()}
					>
						<span>Use Left / Right arrow keys to navigate</span>
						<span>Press ESC to close</span>
					</div>
				</div>
			)}
		</div>
	);
}
