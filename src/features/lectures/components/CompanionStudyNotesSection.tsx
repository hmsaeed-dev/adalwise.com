"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Eye, X, FileText, Image as ImageIcon, ArrowRight } from "lucide-react";
import { StudyNote } from "@/lib/lectures/notes-registry";

interface CompanionStudyNotesSectionProps {
	notes: StudyNote[];
	seriesTitle?: string;
}

export function CompanionStudyNotesSection({
	notes,
	seriesTitle,
}: CompanionStudyNotesSectionProps) {
	const [activeNote, setActiveNote] = useState<StudyNote | null>(null);

	// Close modal on Escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setActiveNote(null);
			}
		};
		if (activeNote) {
			window.addEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [activeNote]);

	if (!notes || notes.length === 0) return null;

	return (
		<section className="w-full bg-surface-container-low/70 border border-surface-container-high rounded-[24px] p-space-md sm:p-space-lg flex flex-col gap-space-md shadow-sm">
			<div className="flex items-center justify-between border-b border-surface-container-high pb-space-xs">
				<div className="flex items-center gap-2">
					<div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center shrink-0">
						<FileText className="w-4 h-4" />
					</div>
					<div className="flex flex-col">
						<h3 className="font-headline-sm text-primary font-bold text-base sm:text-lg">
							Companion Study Reference Material
						</h3>
						<span className="text-xs text-on-surface-variant font-sans">
							{seriesTitle ? `Integrated academic resources for ${seriesTitle}` : "Curated visual infographics and academic treatises"}
						</span>
					</div>
				</div>

				<Link
					href="/lectures/notes"
					className="hidden sm:flex items-center gap-1 text-xs font-semibold text-secondary hover:text-primary transition-colors"
				>
					<span>All Study Notes</span>
					<ArrowRight className="w-3.5 h-3.5" />
				</Link>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
				{notes.map((note) => {
					const isPdf = note.type === "pdf";

					return (
						<div
							key={note.id}
							className="bg-surface-container-lowest border border-surface-container-high/80 rounded-2xl p-4 flex flex-col justify-between gap-4 hover:border-brand-gold/40 transition-all shadow-xs"
						>
							<div className="flex gap-3">
								{/* Thumbnail / File Type Badge */}
								<div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-surface-container overflow-hidden shrink-0 relative border border-surface-container-high/60 flex items-center justify-center">
									{isPdf ? (
										<div className="flex flex-col items-center justify-center p-2 text-center text-primary">
											<FileText className="w-8 h-8 text-brand-gold mb-1" />
											<span className="text-[10px] font-bold uppercase tracking-wider bg-surface-container-high px-1.5 py-0.5 rounded">
												PDF
											</span>
										</div>
									) : (
										<>
											<Image
												src={note.filePath}
												alt={note.title}
												fill
												sizes="96px"
												className="object-cover"
											/>
											<button
												type="button"
												onClick={() => setActiveNote(note)}
												title="View full infographic"
												aria-label="View full infographic"
												className="absolute inset-0 bg-primary/40 opacity-0 hover:opacity-100 flex items-center justify-center text-on-primary transition-opacity cursor-pointer"
											>
												<Eye className="w-5 h-5" />
											</button>
										</>
									)}
								</div>

								{/* Info */}
								<div className="flex flex-col min-w-0 justify-center">
									<div className="flex items-center gap-2 mb-1">
										<span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label-sm text-[10px] uppercase tracking-wider font-semibold rounded-md border border-surface-container-highest">
											{note.category}
										</span>
										<span className="text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-medium">
											{note.type}
										</span>
									</div>

									<h4 className="font-headline-sm text-sm font-bold text-primary truncate">
										{note.title}
									</h4>

									{note.urduTitle && (
										<span className="text-xs font-urdu text-on-surface-variant line-clamp-1 mt-0.5">
											{note.urduTitle}
										</span>
									)}

									<p className="text-xs text-on-surface-variant/80 line-clamp-2 mt-1 font-sans">
										{note.description}
									</p>
								</div>
							</div>

							{/* Actions */}
							<div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container-high/50">
								{!isPdf && (
									<button
										type="button"
										onClick={() => setActiveNote(note)}
										className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
									>
										<Eye className="w-3.5 h-3.5" />
										<span>Preview</span>
									</button>
								)}

								<a
									href={note.filePath}
									target="_blank"
									rel="noopener noreferrer"
									className="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
								>
									<ExternalLink className="w-3.5 h-3.5" />
									<span>Open</span>
								</a>

								<a
									href={note.filePath}
									download
									className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-on-primary rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
								>
									<Download className="w-3.5 h-3.5" />
									<span>Download</span>
								</a>
							</div>
						</div>
					);
				})}
			</div>

			{/* Lightbox / Modal for Infographic Preview */}
			{activeNote && (
				<div
					className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
					onClick={() => setActiveNote(null)}
				>
					<div
						className="relative max-w-4xl max-h-[90vh] bg-surface-container-lowest rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-surface-container-high"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b border-surface-container-high bg-surface-container-low">
							<div>
								<h3 className="text-sm font-bold text-primary truncate max-w-md">
									{activeNote.title}
								</h3>
								{activeNote.urduTitle && (
									<span className="text-xs text-on-surface-variant font-urdu">
										{activeNote.urduTitle}
									</span>
								)}
							</div>

							<div className="flex items-center gap-2">
								<a
									href={activeNote.filePath}
									download
									className="p-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg transition-colors"
									title="Download"
									aria-label="Download image"
								>
									<Download className="w-4 h-4" />
								</a>
								<button
									type="button"
									onClick={() => setActiveNote(null)}
									className="p-1.5 bg-surface-container hover:bg-surface-container-high text-primary rounded-lg transition-colors cursor-pointer"
									title="Close (Esc)"
									aria-label="Close modal"
								>
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Modal Image Display */}
						<div className="overflow-auto p-4 flex items-center justify-center bg-black/40 max-h-[calc(90vh-120px)]">
							<Image
								src={activeNote.filePath}
								alt={activeNote.title}
								width={1200}
								height={1600}
								className="max-h-[75vh] w-auto object-contain rounded-lg shadow-lg"
							/>
						</div>

						{/* Modal Footer */}
						<div className="p-3 bg-surface-container-low text-xs text-on-surface-variant border-t border-surface-container-high text-center">
							{activeNote.description}
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
