"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Bookmark } from "lucide-react";
import { formatDuration } from "@/lib/utils";

interface AudioPlayerWidgetProps {
  title?: string;
  urduTag?: string;
  audioSrc?: string;
  totalDurationSeconds?: number;
  initialSeconds?: number;
}

export function AudioPlayerWidget({
  title = "Surah al-An'am — Divine Justice and Ontological Order",
  urduTag = "تفسیرِ قرآن",
  audioSrc,
  totalDurationSeconds = 1480, // 24:40
  initialSeconds = 255, // 04:15
}: AudioPlayerWidgetProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(initialSeconds);
  const [duration, setDuration] = useState(totalDurationSeconds);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fallback timer if audioSrc is not provided (demo mode)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && !audioSrc) {
      timer = setInterval(() => {
        setCurrentSeconds((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, duration, playbackRate, audioSrc]);

  const togglePlay = () => {
    if (audioSrc && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentSeconds(Math.floor(audioRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNaN(audioRef.current.duration)) {
      setDuration(Math.floor(audioRef.current.duration));
    }
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 1.75];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSeconds = Math.floor(newPercent * duration);
    setCurrentSeconds(targetSeconds);
    if (audioRef.current) {
      audioRef.current.currentTime = targetSeconds;
    }
  };

  const progressPercent = Math.min(100, (currentSeconds / duration) * 100);

  return (
    <div className="w-full bg-primary-container text-on-primary p-space-lg flex flex-col gap-space-sm shadow-md rounded-[26px] border border-primary/40">
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Mic className="w-4 h-4 text-tertiary-fixed shrink-0" />
          <span className="font-label-sm text-tertiary-fixed uppercase tracking-wider text-[11px] font-bold">
            Scholarly Audio Exegesis
          </span>
        </div>
        <span className="font-urdu text-[13px] text-surface-variant font-semibold">
          {urduTag}
        </span>
      </div>

      <h4 className="font-headline-sm text-surface-bright font-medium leading-snug">
        {title}
      </h4>

      <div className="w-full bg-primary/60 p-space-sm flex items-center gap-space-sm mt-space-xs rounded-xl border border-primary-container/40">
        <button
          type="button"
          aria-label={isPlaying ? "Pause audio recitation" : "Play audio recitation"}
          onClick={togglePlay}
          className="w-10 h-10 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center transition-transform active:scale-95 shrink-0 shadow-sm hover:bg-tertiary-fixed select-none"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        <div className="flex-1 flex flex-col gap-1 min-w-0">
          <div className="flex justify-between text-[11px] font-label-sm text-on-primary-container">
            <span className="font-mono">{formatDuration(currentSeconds)}</span>
            <span className="font-mono">{formatDuration(duration)}</span>
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

        {/* Speed Multiplier Button */}
        <button
          type="button"
          onClick={handleSpeedChange}
          title="Adjust playback speed"
          className="px-2 py-1 rounded bg-primary/80 hover:bg-primary text-tertiary-fixed font-mono text-[11px] font-bold transition-colors select-none"
        >
          {playbackRate}x
        </button>

        {/* Bookmark Button */}
        <button
          type="button"
          aria-label="Bookmark session"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className="w-8 h-8 flex items-center justify-center text-on-primary-container hover:text-surface transition-colors"
        >
          <Bookmark
            className={`w-4 h-4 ${isBookmarked ? "fill-current text-tertiary-fixed" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
