"use client";

import React, { useState, useMemo } from "react";
import { Quote, Copy, Check, X, BookMarked, Sparkles } from "lucide-react";
import { LectureItem } from "@/lib/lectures/types";
import { siteConfig } from "@/config/site";

interface AcademicCitationButtonProps {
	lecture: LectureItem;
	className?: string;
}

type CitationFormat = "plain";

export function AcademicCitationButton({
	lecture,
	className,
}: AcademicCitationButtonProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [format, setFormat] = useState<CitationFormat>("plain");
	const [copied, setCopied] = useState(false);

	const cleanTitle = useMemo(() => {
		return lecture.title.replace(/\s*[|#].*$/, "").trim() || lecture.title;
	}, [lecture.title]);

	const year = useMemo(() => {
		try {
			return new Date(lecture.publishedAt).getFullYear();
		} catch {
			return 2026;
		}
	}, [lecture.publishedAt]);

	const dateFormatted = useMemo(() => {
		try {
			return new Date(lecture.publishedAt).toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return "2026";
		}
	}, [lecture.publishedAt]);

	const monthShort = useMemo(() => {
		try {
			return new Date(lecture.publishedAt)
				.toLocaleString("en-US", { month: "short" })
				.toLowerCase();
		} catch {
			return "jan";
		}
	}, [lecture.publishedAt]);

	const lectureUrl = `${siteConfig.url}/lectures/${lecture.slug}`;

	const citations: Record<CitationFormat, { label: string; text: string }> = useMemo(() => {
		const citeKey = `haseeb${year}_${lecture.slug.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30)}`;

		return {
			plain: {
				label: "Plain Text",
				text: `Dr. Hafiz Haseeb. "${cleanTitle}" (${year}). Adlwise Digital Humanities Archives: ${lectureUrl}`,
			},
		};
	}, [cleanTitle, year, dateFormatted, monthShort, lectureUrl, lecture.slug]);

	const handleCopy = async () => {
		const textToCopy = citations[format].text;
		try {
			await navigator.clipboard.writeText(textToCopy);
			setCopied(true);
			setTimeout(() => setCopied(false), 2200);
		} catch {
			// Fallback
			const el = document.createElement("textarea");
			el.value = textToCopy;
			document.body.appendChild(el);
			el.select();
			document.execCommand("copy");
			document.body.removeChild(el);
			setCopied(true);
			setTimeout(() => setCopied(false), 2200);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className={
					className ??
					"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-primary border border-surface-container-highest transition-colors shadow-xs cursor-pointer group"
				}
				title="Cite this academic discourse"
			>
				<Quote className="w-3.5 h-3.5 text-brand-gold transition-transform group-hover:rotate-12" />
				<span>Cite</span>
			</button>

			{isOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
					onClick={() => setIsOpen(false)}
					role="dialog"
					aria-modal="true"
					aria-labelledby="citation-modal-title"
				>
					<div
						className="relative w-full max-w-lg bg-surface-container-lowest text-on-surface rounded-3xl border border-surface-container-high shadow-2xl p-5 sm:p-6 flex flex-col gap-4"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="flex items-center justify-between gap-2pb-3">
							<div className="flex items-center gap-2">
								<div className="w-8 h-8 rounded-full bg-brand-gold/15 text-brand-gold flex items-center justify-center">
									<BookMarked className="w-4 h-4" />
								</div>
								<div>
									<h2
										id="citation-modal-title"
										className="font-serif text-lg font-bold text-primary"
									>
										Academic Citation
									</h2>
								</div>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="p-1.5 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
								aria-label="Close citation modal"
							>
								<X className="w-4 h-4" />
							</button>
						</div>

						{/* Citation Box */}
						<div className="relative p-4 rounded-2xl bg-surface-container-low border border-surface-container-high text-xs font-mono leading-relaxed text-on-surface select-all break-words whitespace-pre-wrap max-h-48 overflow-y-auto">
							{citations[format].text}
						</div>

						{/* Actions */}
						<div className="flex items-center justify-between gap-3 pt-1">

							<button
								type="button"
								onClick={handleCopy}
								className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all shadow-sm cursor-pointer ${
									copied
										? "bg-emerald-600 text-white"
										: "bg-primary text-brand-warm-white hover:bg-primary/90 active:scale-98"
								}`}
							>
								{copied ? (
									<>
										<Check className="w-3.5 h-3.5" />
										<span>Copy</span>
									</>
								) : (
									<>
										<Copy className="w-3.5 h-3.5" />
										<span>Copy</span>
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
