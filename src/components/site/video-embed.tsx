"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import type { VideoInfo } from "@/lib/video";

/**
 * Lightweight video: shows a poster with a play button and only loads the
 * YouTube/Vimeo player (and its cookies/scripts) when the visitor clicks.
 */
export function VideoEmbed({ video, title, poster }: { video: VideoInfo; title: string; poster?: string | null }) {
  const [playing, setPlaying] = useState(false);
  const cover = poster || video.thumbnail;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[8px] bg-[var(--color-panel-dark)] shadow-[var(--shadow-lift)]">
      {playing ? (
        <iframe
          src={video.embedUrl}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Putar video: ${title}`}>
          {cover && <Image src={cover} alt="" fill sizes="(min-width: 1024px) 900px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-yellow)] text-[#17181a] shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <Play size={30} className="ml-1 fill-current" aria-hidden="true" />
          </span>
          <span className="absolute bottom-4 left-5 right-5 text-left font-data text-[11.5px] uppercase tracking-[0.16em] text-white/85">{title}</span>
        </button>
      )}
    </div>
  );
}
