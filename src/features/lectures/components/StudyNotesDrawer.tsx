"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
	X,
	FileText,
	Download,
	ExternalLink,
	ArrowLeft,
	Maximize2,
	BookOpen,
} from "lucide-react";
import { STUDY_NOTES_REGISTRY, StudyNote } from "@/lib/lectures/notes-registry";

interface StudyNotesDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	defaultCategory?: string;
}

export function StudyNotesDrawer({
	isOpen,
	onClose,
	defaultCategory = "All",
}: StudyNotesDrawerProps) {
	const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
	const [activeNoteId, setActiveNoteId] = useState<string>(
		STUDY_NOTES_REGISTRY[0]?.id || "",
	);
	const [mobileView, setMobileView] = useState<"list" | "preview">("list");

	// Filtered notes based on selected category
	const filteredNotes = useMemo(() => {
		if (selectedCategory === "All") return STUDY_NOTES_REGISTRY;
		return STUDY_NOTES_REGISTRY.filter((n) => n.category === selectedCategory);
	}, [selectedCategory]);

	// Currently active note
	const activeNote = useMemo(() => {
		return (
			filteredNotes.find((n) => n.id === activeNoteId) ||
			filteredNotes[0] ||
			STUDY_NOTES_REGISTRY[0]
		);
	}, [filteredNotes, activeNoteId]);

	// If filtered list changes and active note is not in it, select first
	useEffect(() => {
		if (filteredNotes.length > 0 && !filteredNotes.some((n) => n.id === activeNoteId)) {
			setActiveNoteId(filteredNotes[0].id);
		}
	}, [filteredNotes, activeNoteId]);

	// Keyboard navigation: ESC to close/back, Up/Down arrows to cycle
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if (mobileView === "preview") {
					setMobileView("list");
				} else {
					onClose();
				}
			}

			if (e.key === "ArrowDown" || e.key === "ArrowUp") {
				const currentIndex = filteredNotes.findIndex((n) => n.id === activeNote?.id);
				if (currentIndex !== -1) {
					e.preventDefault();
					const nextIndex =
						e.key === "ArrowDown"
							? (currentIndex + 1) % filteredNotes.length
							: (currentIndex - 1 + filteredNotes.length) % filteredNotes.length;
					setActiveNoteId(filteredNotes[nextIndex].id);
				}
			}
		};

		if (isOpen) {
			window.addEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "hidden";
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, activeNote, filteredNotes, mobileView, onClose]);

	if (!isOpen) return null;

	const handleSelectNote = (note: StudyNote) => {
		setActiveNoteId(note.id);
		setMobileView("preview");
	};

	const handleClose = () => {
		setMobileView("list");
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-8 bg-primary/75 backdrop-blur-md animate-fade-in">
			<div className="relative w-full max-w-6xl h-full md:h-[94vh] md:max-h-[860px] bg-surface rounded-none md:rounded-3xl border-0 md:border border-surface-container-high shadow-2xl flex flex-col overflow-hidden">
				{/* ─── 1. DESKTOP DESK HEADER (hidden on mobile) ─── */}
				<div className="hidden md:flex px-6 lg:px-8 py-4 border-b border-surface-container-high items-center justify-between bg-surface-container-low/60 shrink-0">


					<div className="flex items-center gap-3">
						<span className="font-sans text-[11px] text-on-surface-variant/70 border border-surface-container-high px-2 py-0.5 rounded">
							ESC to close
						</span>
						<button
							type="button"
							onClick={handleClose}
							className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"
							aria-label="Close reference desk"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				</div>

				{/* ─── 2. MOBILE HEADER: LIST VIEW ─── */}
				{mobileView === "list" && (
					<div className="md:hidden px-4 py-3 border-b border-surface-container-high flex items-center justify-between bg-surface shrink-0">
						<div className="flex items-center gap-2">
							<h3 className="font-serif text-base font-semibold text-primary">
								Study Notes
							</h3>
						</div>
						<button
							type="button"
							onClick={handleClose}
							className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"
							aria-label="Close"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				)}

				{/* ─── 3. MOBILE HEADER: PREVIEW VIEW (Single Unified Top Bar) ─── */}
				{mobileView === "preview" && (
					<div className="md:hidden px-3 py-2.5 border-b border-surface-container-high flex items-center justify-between gap-2 bg-surface shrink-0 z-10">
						<button
							type="button"
							onClick={() => setMobileView("list")}
							className="px-2.5 py-1.5 -ml-1 rounded-lg text-primary hover:bg-surface-container flex items-center gap-1.5 text-xs font-sans font-bold shrink-0"
						>
							<ArrowLeft className="w-4 h-4" />
							<span>Notes</span>
						</button>

						<span className="font-serif text-xs font-semibold text-primary truncate max-w-[170px] text-center">
							{activeNote?.title}
						</span>

						<div className="flex items-center gap-1 shrink-0">
							<a
								href={activeNote?.filePath}
								target="_blank"
								rel="noopener noreferrer"
								className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container"
								title="Open full image"
							>
								<ExternalLink className="w-4 h-4" />
							</a>
							<a
								href={activeNote?.filePath}
								download
								className="p-1.5 rounded-full text-primary hover:bg-surface-container"
								title="Download"
							>
								<Download className="w-4 h-4" />
							</a>
							<button
								type="button"
								onClick={handleClose}
								className="p-1.5 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container ml-0.5"
								aria-label="Close"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</div>
				)}

				{/* ─── TWO-PANE BODY ─── */}
				<div className="flex flex-col md:flex-row flex-1 overflow-hidden divide-y md:divide-y-0 md:divide-x divide-surface-container-high">
					{/* ─── LEFT PANE: LEDGER INDEX ─── */}
					<div
						className={`w-full md:w-[320px] lg:w-[360px] shrink-0 flex-col bg-surface-container-low/30 overflow-hidden ${
							mobileView === "list" ? "flex flex-1 md:flex-initial" : "hidden md:flex"
						}`}
					>
						{/* Category Selector Tabs */}
						<div className="px-3 py-2.5 md:p-3 border-b border-surface-container-high/60 flex items-center gap-1.5 overflow-x-auto bg-surface scrollbar-none shrink-0">
							{[
								{ id: "All", label: "All", count: STUDY_NOTES_REGISTRY.length },
								{
									id: "Lisan-ul-Quran",
									label: "Grammar",
									count: STUDY_NOTES_REGISTRY.filter((n) => n.category === "Lisan-ul-Quran").length,
								},
								{
									id: "Seerah",
									label: "Seerah",
									count: STUDY_NOTES_REGISTRY.filter((n) => n.category === "Seerah").length,
								},
								{
									id: "Statecraft",
									label: "Treatises",
									count: STUDY_NOTES_REGISTRY.filter((n) => n.category === "Statecraft").length,
								},
							].map((tab) => (
								<button
									key={tab.id}
									type="button"
									onClick={() => setSelectedCategory(tab.id)}
									className={`px-3 py-1 rounded-full text-xs font-sans font-semibold transition-colors shrink-0 flex items-center gap-1 ${
										selectedCategory === tab.id
											? "bg-primary text-brand-warm-white shadow-xs"
											: "text-on-surface-variant hover:text-primary hover:bg-surface-container"
									}`}
								>
									<span>{tab.label}</span>
									<span
										className={`text-[10px] ${
											selectedCategory === tab.id
												? "text-brand-gold"
												: "text-on-surface-variant/60"
										}`}
									>
										({tab.count})
									</span>
								</button>
							))}
						</div>

						{/* Typographic Ledger List */}
						<div className="flex-1 overflow-y-auto divide-y divide-surface-container-high/40">
							{filteredNotes.map((note, idx) => {
								const isSelected = activeNote?.id === note.id;

								return (
									<button
										key={note.id}
										type="button"
										onClick={() => handleSelectNote(note)}
										className={`w-full text-left p-3 sm:p-3.5 md:p-4 transition-all flex items-center justify-between gap-3 group relative ${
											isSelected
												? "bg-surface-container-lowest border-l-4 border-brand-gold"
												: "hover:bg-surface-container-lowest/60"
										}`}
									>
										<div className="flex items-center md:items-start gap-2.5 min-w-0">
											<span
												className={`font-serif text-xs font-bold shrink-0 ${
													isSelected ? "text-secondary" : "text-on-surface-variant/60"
												}`}
											>
												{String(idx + 1).padStart(2, "0")}
											</span>

											<div className="min-w-0">
												<h4
													className={`font-serif text-sm font-semibold leading-snug line-clamp-2 ${
														isSelected
															? "text-primary font-bold"
															: "text-on-surface group-hover:text-primary"
													}`}
												>
													{note.title}
												</h4>

												{/* Urdu subtitle: shown only on desktop to keep mobile clean and high-density */}
												{note.urduTitle && (
													<span className="hidden md:block font-urdu text-xs text-tertiary font-bold dir-rtl mt-0.5 line-clamp-1">
														{note.urduTitle}
													</span>
												)}
											</div>
										</div>

										<span className="font-sans text-[10px] uppercase font-bold text-on-surface-variant/70 shrink-0 bg-surface-container px-1.5 py-0.5 rounded">
											{note.type === "pdf" ? "PDF" : "Chart"}
										</span>
									</button>
								);
							})}
						</div>
					</div>

					{/* ─── RIGHT PANE: READING CANVAS & PREVIEW ─── */}
					<div
						className={`flex-1 flex-col overflow-hidden bg-surface-container-lowest ${
							mobileView === "preview" ? "flex" : "hidden md:flex"
						}`}
					>
						{activeNote ? (
							<>
								{/* Desktop Preview Header & Actions Bar (hidden on mobile, mobile uses unified top bar) */}
								<div className="hidden md:flex px-6 lg:px-8 py-3.5 border-b border-surface-container-high/60 items-center justify-between gap-3 bg-surface shrink-0">
									<div className="min-w-0">
										<h4 className="font-serif text-lg font-semibold text-primary truncate">
											{activeNote.title}
										</h4>
										{activeNote.urduTitle && (
											<span className="font-urdu text-xs text-tertiary font-bold dir-rtl block">
												{activeNote.urduTitle}
											</span>
										)}
									</div>

									{/* Action Links */}
									<div className="flex items-center gap-2 shrink-0">
										<a
											href={activeNote.filePath}
											target="_blank"
											rel="noopener noreferrer"
											className="px-3 py-1.5 rounded-full border border-surface-container-high text-on-surface hover:text-primary hover:bg-surface-container text-xs font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
											title="Open in new tab"
										>
											<ExternalLink className="w-3.5 h-3.5" />
											<span>New Tab</span>
										</a>

										<a
											href={activeNote.filePath}
											download
											className="px-4 py-1.5 rounded-full bg-primary text-brand-warm-white hover:bg-primary-container text-xs font-sans font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-xs"
										>
											<Download className="w-3.5 h-3.5" />
											<span>Download</span>
										</a>
									</div>
								</div>

								{/* The Live Document Canvas */}
								<div className="flex-1 overflow-auto p-2 sm:p-4 md:p-8 flex items-center justify-center bg-surface-container-lowest relative select-none">
									{activeNote.type === "pdf" ? (
										<div className="max-w-sm sm:max-w-md w-full p-6 sm:p-8 rounded-2xl bg-surface-container-low border border-surface-container-high text-center flex flex-col items-center shadow-xs">
											<div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3 sm:mb-4">
												<FileText className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
											</div>

											<span className="font-sans text-[10px] uppercase tracking-widest font-bold text-secondary mb-1">
												Monograph · Research PDF
											</span>

											<h4 className="font-serif text-lg sm:text-xl font-semibold text-primary mb-1">
												{activeNote.title}
											</h4>

											{activeNote.urduTitle && (
												<span className="font-urdu text-sm text-tertiary font-bold dir-rtl mb-3">
													{activeNote.urduTitle}
												</span>
											)}

											<p className="font-sans text-xs text-on-surface-variant leading-relaxed mb-6 line-clamp-4">
												{activeNote.description}
											</p>

											<div className="flex items-center gap-3">
												<a
													href={activeNote.filePath}
													target="_blank"
													rel="noopener noreferrer"
													className="px-5 py-2 rounded-full bg-primary text-brand-warm-white hover:bg-primary-container text-xs font-sans font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
												>
													<ExternalLink className="w-3.5 h-3.5" />
													<span>Read PDF Document</span>
												</a>
											</div>
										</div>
									) : (
										<div className="relative w-full h-full flex flex-col items-center justify-center">
											<a
												href={activeNote.filePath}
												target="_blank"
												rel="noopener noreferrer"
												className="relative max-h-full max-w-full flex items-center justify-center cursor-zoom-in"
												title="Tap to view high-resolution image"
											>
												<img
													src={activeNote.filePath}
													alt={activeNote.title}
													className="max-h-[calc(100vh-100px)] md:max-h-[72vh] w-auto max-w-full object-contain rounded-md md:rounded-lg shadow-xs md:shadow-sm border border-surface-container-high/40"
												/>
											</a>

											{/* Mobile hint */}
											<div className="md:hidden mt-2 flex items-center gap-1 text-[11px] font-sans text-on-surface-variant/70">
												<Maximize2 className="w-3 h-3" />
												<span>Tap chart to view high-resolution</span>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant text-sm">
								<BookOpen className="w-8 h-8 text-on-surface-variant/40 mb-2" />
								<span>Select a study note to preview</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
