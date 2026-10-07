"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Lightbox } from "./lightbox";

export function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-[6px] font-data text-sm text-[var(--color-ink-3)]"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--color-wf-fill) 0 10px, var(--color-line) 10px 11px)" }}
      >
        Dokumentasi foto menyusul
      </div>
    );
  }

  const photos = images.map((src, i) => ({ src, alt: `${alt} — foto ${i + 1}` }));

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(active)}
        className="group relative block aspect-[16/10] w-full overflow-hidden rounded-[6px] bg-[var(--color-surface-2)]"
        aria-label="Perbesar foto"
      >
        <Image key={images[active]} src={images[active]} alt={photos[active].alt} fill loading="eager" fetchPriority="high" quality={85} sizes="(min-width: 1024px) 680px, 100vw" className="object-cover" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-[4px] bg-black/55 px-2.5 py-1.5 font-data text-[11px] text-white backdrop-blur">
          <Expand size={13} aria-hidden="true" /> {active + 1} / {images.length}
        </span>
      </button>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-7">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat foto ${i + 1}`}
              aria-current={active === i}
              className={`relative aspect-square overflow-hidden rounded-[4px] ring-2 ring-offset-2 ring-offset-[var(--color-bg)] transition ${
                active === i ? "ring-[var(--color-teal)]" : "ring-transparent opacity-75 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <Lightbox photos={photos} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  );
}
