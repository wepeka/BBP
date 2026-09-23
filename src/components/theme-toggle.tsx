"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "bbp-theme";

function getEffectiveTheme(): "light" | "dark" {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Explicit light/dark switch. Defaults to the visitor's system preference
 * (handled by the inline script in the root layout, before paint) until
 * they choose one, then remembers that choice in localStorage.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    // Reads browser-only state (localStorage / matchMedia) that isn't
    // available during SSR, so it can't be derived at render time.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getEffectiveTheme());
  }, []);

  function toggle() {
    const next: "light" | "dark" = (theme ?? getEffectiveTheme()) === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable (private mode, blocked storage) — the
      // choice just won't persist across reloads.
    }
    setTheme(next);
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      title={isDark ? "Mode terang" : "Mode gelap"}
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--color-line-2)] text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-2)] ${className}`}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
