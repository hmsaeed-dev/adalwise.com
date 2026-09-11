"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

interface YouTubeEmbedProps {
  youtubeId: string;
  title: string;
  thumbnailUrl?: string;
}

export function YouTubeEmbed({ youtubeId, title, thumbnailUrl }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-primary-container shadow-md border border-surface-container-highest">
      {!isLoaded && thumbnailUrl ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer group">
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105 opacity-100"
          />
          <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/20 transition-colors" />
          <button
            type="button"
            aria-label={`Play ${title}`}
            onClick={() => setIsLoaded(true)}
            className="relative z-20 w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-xl transition-transform group-hover:scale-110 active:scale-95"
          >
            <Play className="w-8 h-8 fill-current ml-1" />
          </button>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      )}
    </div>
  );
}
