"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxPhoto {
  src: string;
  alt: string;
}

/**
 * Full-screen photo viewer on a native <dialog> (focus stays inside, Esc
 * closes). Arrow keys and swipes move between photos.
 */
export function Lightbox({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: LightboxPhoto[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const count = photos.length;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndex((index + delta + count) % count);
    },
    [index, count, onIndex]
  );

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  const photo = index !== null ? photos[index] : null;

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="lightbox-backdrop fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-black/92 p-0 text-white backdrop:bg-transparent"
      aria-label="Foto"
    >
      {photo && (
        <div
          className="relative flex h-full w-full flex-col"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <span className="font-data text-[12px] tabular-nums text-white/70">
              {String((index ?? 0) + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={onClose}
              autoFocus
              aria-label="Tutup"
              className="flex h-11 w-11 items-center justify-center rounded-[6px] text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <Image key={photo.src} src={photo.src} alt={photo.alt} fill sizes="100vw" quality={85} className="object-contain p-2 sm:p-6" />
          </div>
          <p className="min-h-[52px] px-6 pb-5 pt-2 text-center text-[14px] text-white/75">{photo.alt}</p>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Foto sebelumnya"
                className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[6px] bg-black/40 text-white hover:bg-black/70 sm:left-5"
              >
                <ChevronLeft size={26} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Foto berikutnya"
                className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-[6px] bg-black/40 text-white hover:bg-black/70 sm:right-5"
              >
                <ChevronRight size={26} aria-hidden="true" />
              </button>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
