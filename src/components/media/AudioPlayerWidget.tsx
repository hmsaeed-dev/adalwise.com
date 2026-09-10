"use client";

import React, { useState, useEffect } from "react";
import { formatDuration } from "@/lib/utils";

interface AudioPlayerWidgetProps {
  title?: string;
  urduTag?: string;
  totalDurationSeconds?: number;
  initialSeconds?: number;
}

export function AudioPlayerWidget({
  title = "Surah al-An'am — Divine Justice and Ontological Order",
  urduTag = "تفسیرِ قرآن",
  totalDurationSeconds = 1480, // 24:40
  initialSeconds = 255, // 04:15
}: AudioPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(initialSeconds);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDurationSeconds]);

  const progressPercent = Math.min(100, (currentSeconds / totalDurationSeconds) * 100);

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentSeconds(Math.floor(newPercent * totalDurationSeconds));
  };

  return (
    <div className="w-full bg-primary-container text-on-primary p-space-lg flex flex-col gap-space-sm shadow-md rounded-[26px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-tertiary-fixed text-[18px]">
            mic
          </span>
          <span className="font-label-sm text-tertiary-fixed uppercase tracking-wider text-[11px]">
            Audio Exegesis
          </span>
        </div>
        <span className="font-urdu text-[13px] text-surface-variant font-semibold">
          {urduTag}
        </span>
      </div>

      <h4 className="font-headline-sm text-surface-bright font-medium font-serif leading-snug">
        {title}
      </h4>

      <div className="w-full bg-primary/60 p-space-sm flex items-center gap-space-sm mt-space-xs rounded-xl">
        <button
          type="button"
          aria-label={isPlaying ? "Pause recitation clip" : "Play recitation clip"}
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center transition-transform active:scale-95 shrink-0 shadow-sm hover:bg-tertiary-fixed"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isPlaying ? "pause" : "play_arrow"}
          </span>
        </button>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex justify-between text-[11px] font-label-sm text-on-primary-container">
            <span>{formatDuration(currentSeconds)}</span>
            <span>{formatDuration(totalDurationSeconds)}</span>
          </div>
          <div
            onClick={handleScrub}
            className="w-full h-2 bg-primary rounded-full relative cursor-pointer overflow-hidden group"
          >
            <div
              className="h-full bg-tertiary-fixed rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          aria-label="Bookmark session"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="w-8 h-8 flex items-center justify-center text-on-primary-container hover:text-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isBookmarked ? "bookmark" : "bookmark_add"}
          </span>
        </button>
      </div>
    </div>
  );
}
