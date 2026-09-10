import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MediaItem } from "@/lib/media/types";
import { formatDuration, formatISODate } from "@/lib/utils";

interface MediaCardProps {
  media: MediaItem;
}

export function MediaCard({ media }: MediaCardProps) {
  return (
    <article className="group bg-surface-container-lowest rounded-[22px] overflow-hidden border border-surface-container-high/70 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all flex flex-col">
      {/* Thumbnail Container */}
      <Link
        href={`/media/${media.slug}`}
        className="relative w-full aspect-video overflow-hidden bg-primary-container block"
      >
        <Image
          src={media.thumbnailUrl}
          alt={media.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
        />
        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />

        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 px-space-xs py-0.5 rounded-md bg-inverse-surface/85 backdrop-blur-sm text-inverse-on-surface text-[11px] font-mono font-semibold">
          {formatDuration(media.durationSeconds)}
        </div>

        {/* Category Pill */}
        <div className="absolute top-2 left-2 px-space-xs py-0.5 rounded-full bg-primary/80 backdrop-blur-sm text-tertiary-fixed text-[10px] font-label-sm uppercase tracking-wider font-bold">
          {media.category}
        </div>

        {/* Centered Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <span className="material-symbols-outlined text-[28px]">play_arrow</span>
          </div>
        </div>
      </Link>

      {/* Content Meta */}
      <div className="p-space-md flex flex-col flex-1 gap-space-2xs">
        <div className="flex items-center justify-between text-on-surface-variant text-[11px]">
          <span>{media.speaker.name}</span>
          <span>{formatISODate(media.publishedAt)}</span>
        </div>

        <h3 className="font-headline-sm text-[16px] text-primary font-bold font-serif leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
          <Link href={`/media/${media.slug}`}>{media.title}</Link>
        </h3>

        {media.urduTitle && (
          <p className="font-urdu text-[13px] text-tertiary font-semibold dir-rtl text-right line-clamp-1 -mt-1">
            {media.urduTitle}
          </p>
        )}

        <p className="font-body-sm text-[13px] text-on-surface-variant line-clamp-2 mt-1">
          {media.description}
        </p>

        {/* Topics / Tags Bar */}
        <div className="pt-space-xs mt-auto flex items-center justify-between border-t border-surface-container-high/60 text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-1 overflow-hidden truncate">
            {media.topics.slice(0, 2).map((topic) => (
              <span
                key={topic}
                className="px-1.5 py-0.5 rounded bg-surface-container text-primary font-medium truncate"
              >
                {topic}
              </span>
            ))}
          </div>
          <Link
            href={`/media/${media.slug}`}
            className="text-primary font-semibold hover:underline flex items-center gap-0.5 shrink-0"
          >
            <span>Watch</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
