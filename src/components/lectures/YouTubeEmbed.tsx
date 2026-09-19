"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
	youtubeId: string;
	title: string;
	thumbnailUrl?: string;
	className?: string;
	priority?: boolean;
	autoPlay?: boolean;
}

export function YouTubeEmbed({
	youtubeId,
	title,
	thumbnailUrl,
	className,
	priority = false,
	autoPlay = true,
}: YouTubeEmbedProps) {
	const [isLoaded, setIsLoaded] = useState(autoPlay);
	const [isImageLoaded, setIsImageLoaded] = useState(false);

	const effectiveThumbnail =
		thumbnailUrl ||
		(youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : undefined);

	return (
		<div
			className={`relative w-full aspect-video overflow-hidden bg-surface-container-low ${
				className ?? "rounded-2xl shadow-md border border-surface-container-highest"
			}`}
		>
			{!isLoaded && effectiveThumbnail ? (
				<div
					className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group select-none"
					onClick={() => setIsLoaded(true)}
				>
					{/* Shimmer skeleton placeholder for zero layout shifts and instant visual feedback */}
					<div
						className={`absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container to-surface-container-low animate-pulse transition-opacity duration-500 ${
							isImageLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
						}`}
						aria-hidden="true"
					/>

					{/* Next.js LCP-Optimized Thumbnail Image */}
					<Image
						src={effectiveThumbnail}
						alt={title}
						fill
						priority={priority}
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
						onLoad={() => setIsImageLoaded(true)}
						className={`object-cover transition-all duration-500 group-hover:scale-105 ${
							isImageLoaded ? "opacity-100" : "opacity-0"
						}`}
					/>

					{/* Ambient Overlay */}
					<div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/20 transition-colors duration-300" />

					{/* Tactile Play Button */}
					<button
						type="button"
						aria-label={`Play ${title}`}
						onClick={(e) => {
							e.stopPropagation();
							setIsLoaded(true);
						}}
						className="relative z-20 w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110 active:scale-95 cursor-pointer"
					>
						<Play className="w-8 h-8 fill-current ml-1" />
					</button>
				</div>
			) : (
				<iframe
					src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
					title={title}
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
					className="absolute inset-0 w-full h-full border-0"
				/>
			)}
		</div>
	);
}
