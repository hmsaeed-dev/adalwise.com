import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	Download,
	FileText,
	BookOpen,
	Video,
	MapPin,
	ExternalLink,
	Camera,
	Compass,
} from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";
import { LectureItem } from "@/lib/lectures/types";
import { MDXRenderer } from "@/components/content/MDXRenderer";

interface MajlisDetailChronicleProps {
	session: MajlisSession;
	content: string;
	relatedLectures: LectureItem[];
}

export function MajlisDetailChronicle({
	session,
	content,
	relatedLectures,
}: MajlisDetailChronicleProps) {
	const hasDownloads = Boolean(session.slidesUrl || session.workingPaperUrl);
	const hasLectures = relatedLectures.length > 0;
	const hasGallery = session.gallery && session.gallery.length > 0;
	const hasContent = Boolean(content && content.trim().length > 0);

	return (
		<section
			aria-labelledby="chronicle-heading"
			className="w-full flex flex-col gap-8 sm:gap-10"
		>
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
				{/* Main Column (8 cols): Narrative Chronicle & Integrated Photo Story */}
				<div className="lg:col-span-8 flex flex-col gap-8">
					{/* Narrative Prose */}
					{hasContent && (
						<div className="flex flex-col gap-4">

							<div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:text-on-surface/90 prose-p:leading-relaxed prose-a:text-brand-gold hover:prose-a:underline">
								<MDXRenderer content={content} />
							</div>
						</div>
					)}

					{/* Integrated Documentary Photography */}
					{hasGallery && (
						<div className="flex flex-col gap-4 pt-2">

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
								{session.gallery.map((photo, idx) => (
									<figure
										key={idx}
										className={`group relative rounded-2xl overflow-hidden bg-surface-container-low border border-surface-container-high/60 flex flex-col transition-all duration-300 hover:shadow-md ${
											idx === 0 ? "sm:col-span-2" : ""
										}`}
									>
										<div
											className={`relative w-full overflow-hidden ${
												idx === 0 ? "h-64 sm:h-80" : "h-52 sm:h-60"
											}`}
										>
											<Image
												src={photo.url}
												alt={
													photo.caption ||
													`Majlis gathering photograph ${idx + 1}`
												}
												fill
												className="object-cover object-center group-hover:scale-103 transition-transform duration-500"
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
											/>
										</div>
									</figure>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Sidebar Column (4 cols): Companion Resources & Video Discourses */}
				<aside
					aria-label="Companion Resources"
					className="lg:col-span-4 flex flex-col gap-6"
				>
					{/* Deliberation Materials (Downloads) */}
					{hasDownloads && (
						<div className="p-5 rounded-2xl flex flex-col gap-3.5">

							<div className="flex flex-col gap-2.5">
								{session.slidesUrl && (
									<a
										href={session.slidesUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="group p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all flex items-center justify-between gap-3 border border-surface-container-high/40 shadow-2xs"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-9 h-9 rounded-lg bg-brand-gold/15 text-primary flex items-center justify-center shrink-0">
												<FileText className="w-4 h-4 text-brand-gold" aria-hidden="true" />
											</div>
											<div className="min-w-0">
												<h4 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate">
													{session.slidesTitle || "Slide Deck"}
												</h4>
												<span className="text-[10px] text-on-surface-variant/80">
													PDF
												</span>
											</div>
										</div>
										<div className="w-7 h-7 rounded-full flex items-center justify-center text-primary shrink-0">
											<Download className="w-3.5 h-3.5" aria-hidden="true" />
										</div>
									</a>
								)}

								{session.workingPaperUrl && (
									<a
										href={session.workingPaperUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="group p-3 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all flex items-center justify-between gap-3 shadow-2xs"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
												<BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
											</div>
											<div className="min-w-0">
												<h4 className="font-serif text-sm font-semibold text-primary group-hover:text-primary-hover truncate">
													{session.workingPaperTitle || "Research Memo"}
												</h4>
												<span className="text-[10px] text-on-surface-variant/80">
													Research Memo
												</span>
											</div>
										</div>
										<div className="w-7 h-7 rounded-full group-hover:text-brand-warm-white transition-colors flex items-center justify-center text-primary shrink-0">
											<Download className="w-3.5 h-3.5" aria-hidden="true" />
										</div>
									</a>
								)}
							</div>
						</div>
					)}

					{/* Related Video Discourses from Catalogue */}
					{hasLectures && (
						<div className="p-5 rounded-2xl flex flex-col gap-3.5">

							<div className="flex flex-col gap-2.5">
								{relatedLectures.map((lec) => (
									<Link
										key={lec.slug}
										href={`/lectures/${lec.slug}`}
										className="p-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container transition-all flex items-center gap-3 group shadow-2xs"
									>
										<div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-surface-container-high">
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
										</div>

										<div className="min-w-0 flex-1">
											<h4 className="font-serif text-xs font-semibold text-primary group-hover:text-primary-hover truncate leading-snug mt-0.5">
												{lec.title}
											</h4>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}

				</aside>
			</div>
		</section>
	);
}
