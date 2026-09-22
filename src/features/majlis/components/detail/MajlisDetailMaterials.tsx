import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, BookOpen, Download, FileText, Video } from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";
import { LectureItem } from "@/lib/lectures/types";

interface MajlisDetailMaterialsProps {
	session: MajlisSession;
	relatedLectures: LectureItem[];
}

export function MajlisDetailMaterials({
	session,
	relatedLectures,
}: MajlisDetailMaterialsProps) {
	const hasDownloads = Boolean(session.slidesUrl || session.workingPaperUrl);
	const hasLectures = relatedLectures.length > 0;

	if (!hasDownloads && !hasLectures) return null;

	return (
		<section aria-labelledby="materials-heading" className="flex flex-col gap-4 sm:gap-5">
			<div className="flex items-baseline justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 sm:gap-2.5">
					<FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
					<h2
						id="materials-heading"
						className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
					>
						Deliberation Materials &amp; Media Archive
					</h2>
				</div>
				<span className="font-urdu text-sm sm:text-base text-brand-gold font-bold dir-rtl">
					علمی مواد، سلائیڈز و ویڈیوز
				</span>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
				{/* Downloadable Presentation Slides & Working Papers */}
				{hasDownloads && (
					<div className="lg:col-span-5 flex flex-col gap-3">
						{session.slidesUrl && (
							<a
								href={session.slidesUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-3.5 shadow-xs"
							>
								<div className="flex items-center gap-3.5 min-w-0">
									<div className="w-11 h-11 rounded-xl bg-brand-gold/15 text-primary flex items-center justify-center shrink-0">
										<FileText className="w-5 h-5 text-brand-gold" aria-hidden="true" />
									</div>
									<div className="min-w-0">
										<span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant font-bold">
											Session Presentation
										</span>
										<h3 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate">
											{session.slidesTitle || "Presentation Slide Deck"}
										</h3>
										<span className="text-[11px] text-on-surface-variant/80 font-mono">
											PDF Format {session.slidesCount ? `· ${session.slidesCount} Slides` : ""}
										</span>
									</div>
								</div>

								<div className="w-8 h-8 rounded-full bg-surface-container-high/60 group-hover:bg-primary group-hover:text-brand-warm-white transition-colors flex items-center justify-center text-primary shrink-0">
									<Download className="w-4 h-4" aria-hidden="true" />
								</div>
							</a>
						)}

						{session.workingPaperUrl && (
							<a
								href={session.workingPaperUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="group p-4 sm:p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-3.5 shadow-xs"
							>
								<div className="flex items-center gap-3.5 min-w-0">
									<div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
										<BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
									</div>
									<div className="min-w-0">
										<span className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant font-bold">
											Juristic Paper
										</span>
										<h3 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate">
											{session.workingPaperTitle || "Session Working Paper"}
										</h3>
										<span className="text-[11px] text-on-surface-variant/80 font-mono">
											Research Memo · PDF
										</span>
									</div>
								</div>

								<div className="w-8 h-8 rounded-full bg-surface-container-high/60 group-hover:bg-primary group-hover:text-brand-warm-white transition-colors flex items-center justify-center text-primary shrink-0">
									<Download className="w-4 h-4" aria-hidden="true" />
								</div>
							</a>
						)}
					</div>
				)}

				{/* Related Recorded Discourses from Video Catalogue */}
				{hasLectures && (
					<div
						className={`${
							hasDownloads ? "lg:col-span-7" : "lg:col-span-12"
						} flex flex-col gap-3`}
					>
						{relatedLectures.map((lec) => (
							<Link
								key={lec.slug}
								href={`/lectures/${lec.slug}`}
								className="p-3.5 sm:p-4 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center justify-between gap-3.5 group shadow-xs"
							>
								<div className="flex items-center gap-3.5 min-w-0">
									<div className="relative w-16 sm:w-20 h-12 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-surface-container-high">
										{lec.thumbnailUrl ? (
											<Image
												src={lec.thumbnailUrl}
												alt={lec.title}
												fill
												className="object-cover object-center group-hover:scale-105 transition-transform"
											/>
										) : (
											<div className="w-full h-full flex items-center justify-center bg-primary text-brand-gold">
												<Video className="w-4 h-4" />
											</div>
										)}
										<div className="absolute inset-0 bg-black/20 flex items-center justify-center">
											<div className="w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center">
												<Video className="w-3 h-3 fill-current ml-0.5" />
											</div>
										</div>
									</div>

									<div className="min-w-0">
										<div className="flex items-center gap-2">
											<span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold">
												{lec.category}
											</span>
											{lec.durationSeconds > 0 && (
												<span className="text-[10px] font-mono text-on-surface-variant">
													· {Math.round(lec.durationSeconds / 60)} mins
												</span>
											)}
										</div>
										<h3 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate mt-0.5">
											{lec.title}
										</h3>
										{lec.urduTitle && (
											<p className="font-urdu text-xs text-on-surface-variant/80 dir-rtl truncate">
												{lec.urduTitle}
											</p>
										)}
									</div>
								</div>

								<ArrowUpRight
									className="w-4 h-4 text-brand-gold shrink-0 group-hover:translate-x-0.5 transition-transform"
									aria-hidden="true"
								/>
							</Link>
						))}
					</div>
				)}
			</div>
		</section>
	);
}
