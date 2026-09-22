import React from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { MajlisSession } from "@/lib/content/schemas";

interface MajlisDetailGalleryProps {
	gallery: MajlisSession["gallery"];
}

export function MajlisDetailGallery({ gallery }: MajlisDetailGalleryProps) {
	if (!gallery || gallery.length === 0) return null;

	return (
		<section aria-labelledby="gallery-heading" className="flex flex-col gap-4 sm:gap-5">
			<div className="flex items-baseline justify-between flex-wrap gap-2">
				<div className="flex items-center gap-2 sm:gap-2.5">
					<ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-brand-gold shrink-0" aria-hidden="true" />
					<h2
						id="gallery-heading"
						className="font-serif text-lg sm:text-xl md:text-2xl font-semibold text-primary"
					>
						Photographic Chronicle &amp; Fellowship
					</h2>
				</div>
				<div className="flex items-center gap-3">
					<span className="md:hidden text-[11px] font-sans text-on-surface-variant/70">
						Swipe →
					</span>
				</div>
			</div>

			{/* Responsive Carousel (Mobile) / Grid (Desktop) */}
			<div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2 gap-3.5 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:overflow-visible md:mx-0 md:px-0 md:pb-0">
				{gallery.map((photo, idx) => (
					<figure
						key={idx}
						className={`group relative rounded-2xl overflow-hidden bg-surface-container-low shadow-xs hover:shadow-md transition-all duration-300 flex flex-col shrink-0 snap-center w-[82vw] max-w-[320px] md:w-auto md:max-w-none md:shrink ${
							idx === 1 ? "md:col-span-2 lg:col-span-2" : ""
						}`}
					>
						<div
							className={`relative w-full overflow-hidden ${
								idx === 1 ? "h-64 sm:h-72" : "h-52 sm:h-56"
							}`}
						>
							<Image
								src={photo.url}
								alt={photo.caption || `Majlis gathering photograph ${idx + 1}`}
								fill
								className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
								sizes="(max-width: 640px) 82vw, (max-width: 1024px) 50vw, 33vw"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
						</div>
					</figure>
				))}
			</div>
		</section>
	);
}
