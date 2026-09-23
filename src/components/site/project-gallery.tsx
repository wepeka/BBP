"use client";

import { useState } from "react";
import Image from "next/image";

export function ProjectGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-md font-data text-sm text-[var(--color-ink-3)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--color-wf-fill) 0 10px, var(--color-line) 10px 11px)",
        }}
      >
        Dokumentasi foto menyusul
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-[var(--color-surface-2)]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 620px, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat foto ${i + 1}`}
              aria-current={active === i}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-colors ${
                active === i ? "border-[var(--color-teal)]" : "border-transparent"
              }`}
            >
              <Image src={src} alt="" fill sizes="90px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
