"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Shows a thin progress bar from the moment an internal link is clicked
 * until the new route commits, so slower (uncached) navigations still feel
 * responsive.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [loadingFor, setLoadingFor] = useState<string | null>(null);

  // Reset when the route actually changes (adjust state during render).
  const [prev, setPrev] = useState(pathname);
  if (prev !== pathname) {
    setPrev(pathname);
    setLoadingFor(null);
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      setLoadingFor(url.pathname);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return loadingFor ? <div key={loadingFor} className="nav-progress" aria-hidden="true" /> : null;
}
