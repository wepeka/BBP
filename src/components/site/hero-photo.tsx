"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_MS = 6000;

/**
 * Hero photo. One photo shows as before (slow Ken Burns drift); when the
 * admin adds more, they crossfade in the same frame. No auto-advance for
 * visitors who prefer reduced motion.
 */
export function HeroPhoto({ photos }: { photos: { src: string; alt: string }[] }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => window.clearInterval(t);
  }, [count]);

  return (
    <>
      {photos.map((p, i) => (
        <Image
          key={`${p.src}-${i}`}
          src={p.src}
          alt={p.alt}
          fill
          loading={i === 0 ? "eager" : "lazy"}
          fetchPriority={i === 0 ? "high" : "auto"}
          quality={85}
          sizes="(min-width: 1024px) 520px, 100vw"
          aria-hidden={i !== index}
          className={`ken-burns object-cover transition-opacity duration-[1200ms] ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </>
  );
}
