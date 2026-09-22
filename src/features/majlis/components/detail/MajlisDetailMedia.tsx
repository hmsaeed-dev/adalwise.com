import React from "react";
import Image from "next/image";
import { MajlisSession } from "@/lib/content/schemas";

interface MajlisDetailMediaProps {
	session: MajlisSession;
}

export function MajlisDetailMedia({ session }: MajlisDetailMediaProps) {
	const primaryPhoto =
		session.gallery && session.gallery.length > 0
			? session.gallery[0]
			: null;

	return (
		<section
			aria-labelledby="masthead-media-heading"
			className="w-full flex flex-col gap-4"
		>
			<h2 id="masthead-media-heading" className="sr-only">
				Session Media Masthead
			</h2>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
				{/* Main Atmospheric Photo */}
				<div
					className={`${
						session.videoUrl ? "lg:col-span-7" : "lg:col-span-12"
					} relative rounded-3xl overflow-hidden min-h-[300px] sm:min-h-[380px] bg-surface-container-low shadow-sm group`}
				>
					<Image
						src={primaryPhoto?.url || "/images/majlis-hero.jpg"}
						alt={primaryPhoto?.caption || session.title}
						fill
						priority
						sizes="(max-width: 1024px) 100vw, 60vw"
						className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
				</div>

				{/* Embedded Video Dispatch Player */}
				{session.videoUrl && (
					<div className="lg:col-span-5 rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c281c] to-[#061710] p-5 sm:p-6 text-brand-warm-white flex flex-col justify-between gap-4 shadow-sm border border-brand-warm-white/10">
						<div className="relative aspect-[4/3] sm:aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
							<video
								src={session.videoUrl}
								controls
								playsInline
								preload="metadata"
								poster={primaryPhoto?.url || "/images/majlis-hero.jpg"}
								className="w-full h-full object-contain"
							>
								Your browser does not support HTML5 video.
							</video>
						</div>
					</div>
				)}
			</div>
		</section>
	);
}
