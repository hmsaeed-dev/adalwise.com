"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, FileText, Download, ExternalLink, Eye } from "lucide-react";
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
	const [activeNote, setActiveNote] = useState<StudyNote | null>(null);

	// Close on ESC
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				if (activeNote) {
					setActiveNote(null);
				} else {
					onClose();
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
	}, [isOpen, activeNote, onClose]);

	if (!isOpen) return null;

	const filteredNotes =
		selectedCategory === "All"
			? STUDY_NOTES_REGISTRY
			: STUDY_NOTES_REGISTRY.filter((n) => n.category === selectedCategory);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-primary/60 backdrop-blur-md animate-fade-in">
			<div className="relative w-full max-w-5xl max-h-[90vh] bg-surface rounded-3xl border border-surface-container-high shadow-2xl flex flex-col overflow-hidden">
				{/* Drawer Header */}
				<div className="px-6 sm:px-8 py-6 border-b border-surface-container-high flex items-center justify-between bg-surface-container-low/60">
					<div>
						<div className="flex items-center gap-2 mb-1">
							<span className="font-sans text-[11px] uppercase tracking-[0.2em] font-bold text-secondary">
								Academic Notes
							</span>
						</div>
						<h3 className="font-serif text-2xl text-primary font-semibold">
							Companion Study Notes &amp; Handouts
						</h3>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"
						aria-label="Close notes drawer"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Category Filters */}
				<div className="px-6 sm:px-8 py-3 border-b border-surface-container-high/60 flex items-center gap-3 overflow-x-auto bg-surface">
					{["All", "Lisan-ul-Quran", "Seerah", "Statecraft"].map((cat) => (
						<button
							key={cat}
							type="button"
							onClick={() => setSelectedCategory(cat)}
							className={`px-4 py-1.5 rounded-full text-xs font-sans font-semibold uppercase tracking-wider transition-colors shrink-0 ${
								selectedCategory === cat
									? "bg-primary text-brand-warm-white"
									: "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
							}`}
						>
							{cat}
						</button>
					))}
				</div>

				{/* Main Body */}
				<div className="p-6 sm:p-8 overflow-y-auto flex-1">
					{activeNote ? (
						// Full Resolution Preview
						<div className="flex flex-col gap-6">
							<button
								type="button"
								onClick={() => setActiveNote(null)}
								className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-secondary hover:underline self-start"
							>
								← Back to All Notes
							</button>

							<div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-surface-container-high">
								<div>
									<h4 className="font-serif text-2xl text-primary font-semibold">
										{activeNote.title}
									</h4>
									{activeNote.urduTitle && (
										<span className="font-urdu text-lg text-tertiary font-bold dir-rtl block mt-1">
											{activeNote.urduTitle}
										</span>
									)}
								</div>

								<a
									href={activeNote.filePath}
									download
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-brand-warm-white text-xs font-bold uppercase tracking-wider hover:bg-primary-container transition-colors shadow-sm"
								>
									<Download className="w-3.5 h-3.5" />
									<span>Download File</span>
								</a>
							</div>

							<div className="relative w-full min-h-[500px] rounded-2xl overflow-hidden bg-surface-container-low border border-surface-container-high flex items-center justify-center p-4">
								{activeNote.type === "pdf" ? (
									<div className="flex flex-col items-center justify-center p-12 text-center">
										<FileText className="w-16 h-16 text-secondary mb-4" />
										<p className="font-sans text-sm text-[#121915] max-w-md mb-6">
											{activeNote.description}
										</p>
										<a
											href={activeNote.filePath}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-gold text-[#00261a] text-xs font-bold uppercase tracking-wider"
										>
											<ExternalLink className="w-4 h-4" />
											<span>Open PDF in New Tab</span>
										</a>
									</div>
								) : (
									<img
										src={activeNote.filePath}
										alt={activeNote.title}
										className="w-auto h-auto max-h-[70vh] object-contain rounded-lg shadow-sm"
									/>
								)}
							</div>
						</div>
					) : (
						// Notes Grid
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredNotes.map((note) => (
								<div
									key={note.id}
									className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-high hover:border-brand-gold/60 transition-all flex flex-col justify-between shadow-sm group"
								>
									<div>
										<div className="flex items-center justify-between gap-2 mb-3">
											<span className="font-sans text-[10px] uppercase tracking-wider font-bold text-secondary bg-surface-container-lowest border border-surface-container-high px-2 py-0.5 rounded">
												{note.category}
											</span>
											<span className="font-sans text-[10px] uppercase text-on-surface-variant font-medium">
												{note.type}
											</span>
										</div>

										<h4 className="font-serif text-lg text-primary font-semibold group-hover:text-secondary transition-colors">
											{note.title}
										</h4>
										{note.urduTitle && (
											<span className="font-urdu text-sm text-tertiary font-bold dir-rtl block mt-0.5">
												{note.urduTitle}
											</span>
										)}

										<p className="mt-2.5 font-sans text-xs text-[#121915] line-clamp-2 leading-relaxed">
											{note.description}
										</p>
									</div>

									<div className="mt-5 pt-4 border-t border-surface-container-high flex items-center justify-between">
										<button
											type="button"
											onClick={() => setActiveNote(note)}
											className="inline-flex items-center gap-1.5 text-xs font-sans font-bold text-primary group-hover:text-secondary transition-colors"
										>
											<Eye className="w-3.5 h-3.5" />
											<span>View Guide</span>
										</button>

										<a
											href={note.filePath}
											download
											target="_blank"
											rel="noopener noreferrer"
											className="w-7 h-7 rounded-full bg-surface-container-lowest border border-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
											title="Download note"
										>
											<Download className="w-3 h-3" />
										</a>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
