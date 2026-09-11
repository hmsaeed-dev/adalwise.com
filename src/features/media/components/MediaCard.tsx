import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, ArrowRight } from "lucide-react";
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
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-95"
        />
        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors" />

        {/* Centered Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>
      </Link>

      {/* Content Meta */}
      <div className="p-space-md flex flex-col flex-1 gap-space-2xs">
        <h3 className="font-headline-sm text-[16px] text-primary font-bold leading-snug group-hover:text-primary-container transition-colors line-clamp-2">
          <Link href={`/media/${media.slug}`}>{media.title}</Link>
        </h3>

        {media.urduTitle && (
          <p className="font-urdu text-[13px] text-tertiary font-semibold dir-rtl text-right line-clamp-1 -mt-1">
            {media.urduTitle}
          </p>
        )}

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
            <ArrowRight className="w-4.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
