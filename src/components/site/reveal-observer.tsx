"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Elements that fade/slide in as they scroll into view. Grid children are
// staggered by their position so a row of cards cascades in.
const SELECTOR = [
  "[data-reveal]",
  "main section h1",
  "main section h2",
  "main section .eyebrow",
  "main section .grid > *",
].join(",");

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // No reveal animation for reduced motion or inside the admin preview frame.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.self !== window.top) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(
      (el) => !el.closest("[data-no-reveal]") && !el.classList.contains("is-visible")
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    for (const el of els) {
      const parent = el.parentElement;
      if (parent && getComputedStyle(parent).display === "grid") {
        const index = Array.prototype.indexOf.call(parent.children, el);
        el.style.setProperty("--reveal-delay", `${Math.min(index, 8) * 80}ms`);
      }
      el.classList.add("reveal");
      io.observe(el);
    }

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
