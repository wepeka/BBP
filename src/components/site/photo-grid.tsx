"use client";

import Image from "next/image";
import { useState } from "react";
import { Expand } from "lucide-react";
import { Lightbox, type LightboxPhoto } from "./lightbox";

/** A simple grid of photos that open in the lightbox. */
export function PhotoGrid({ photos, className = "" }: { photos: LightboxPhoto[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {photos.map((p, i) => (
          <button
            key={`${p.src}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[var(--color-surface-2)]"
            aria-label={`Perbesar foto: ${p.alt}`}
          >
            <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 380px, (min-width:640px) 45vw, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-[6px] bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
              <Expand size={16} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
      <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </>
  );
}
