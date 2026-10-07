"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renders `children` only once the placeholder comes near the viewport, so
 * heavy widgets (Leaflet maps) don't load for visitors who never scroll to
 * them.
 */
export function LazyMount({
  children,
  placeholder,
  className = "",
  rootMargin = "400px",
}: {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : placeholder}
    </div>
  );
}

export function MapPlaceholder({ label = "Memuat peta…" }: { label?: string }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-[6px] border border-[var(--color-line)] font-data text-xs text-[var(--color-ink-3)]"
      style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--color-wf-fill) 0 10px, var(--color-line) 10px 11px)" }}
    >
      {label}
    </div>
  );
}
