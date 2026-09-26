"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { LogoFull } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Settings } from "@/lib/types";

const NAV = [
  { href: "/tentang", label: "Tentang" },
  { href: "/layanan", label: "Layanan" },
  { href: "/proyek", label: "Proyek" },
  { href: "/kapasitas", label: "Kapasitas" },
  { href: "/legalitas", label: "Legalitas" },
  { href: "/klien", label: "Klien" },
] as const;

export function SiteHeader({ settings }: { settings: Settings }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation. Adjusted during render (not an
  // effect) per React's guidance for resetting state on a prop change.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open
          ? "border-[var(--color-line)] bg-[var(--color-surface)]/85 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          : "border-transparent bg-[var(--color-surface)]/40 backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 transition-[height] duration-300 sm:px-6 ${
          scrolled ? "h-16" : "h-[72px]"
        }`}
      >
        <Link
          href="/"
          className="shrink-0 transition-transform duration-300 hover:scale-[1.03]"
          aria-label={`${settings.companyName} — beranda`}
        >
          <LogoFull priority />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link rounded px-3 py-2 text-[14.5px] font-medium transition-colors ${
                  active
                    ? "text-[var(--color-teal-text)]"
                    : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
            className="hidden items-center gap-1.5 whitespace-nowrap text-sm text-[var(--color-ink-2)] hover:text-[var(--color-ink)] xl:flex"
          >
            <Phone size={15} aria-hidden="true" />
            {settings.phone}
          </a>
          <ThemeToggle />
          <Link href="/hubungi" className="btn-primary whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold">
            Minta Penawaran
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-[var(--color-ink)]"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span key={open ? "x" : "menu"} className="menu-item-in">
              {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[var(--color-line)] px-4 pb-6 pt-2 lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Navigasi mobile">
            {NAV.map((item, i) => {
              const active = pathname === item.href || pathname?.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{ "--d": `${i * 45}ms` } as React.CSSProperties}
                  aria-current={active ? "page" : undefined}
                  className={`menu-item-in flex items-center justify-between border-b border-[var(--color-line)] py-4 font-[family-name:var(--font-display)] text-lg font-bold ${
                    active ? "text-[var(--color-teal-text)]" : "text-[var(--color-ink)]"
                  }`}
                >
                  {item.label}
                  <span className="font-data text-[11px] font-normal text-[var(--color-ink-3)]">0{i + 1}</span>
                </Link>
              );
            })}
          </nav>
          <div className="menu-item-in mt-5 flex flex-col gap-3" style={{ "--d": "300ms" } as React.CSSProperties}>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
              className="btn-ghost flex items-center justify-center gap-2 rounded-full py-3 text-sm font-medium"
            >
              <Phone size={16} aria-hidden="true" />
              {settings.phone}
            </a>
            <Link
              href="/hubungi"
              className="btn-primary rounded-full py-3 text-center text-sm font-semibold"
            >
              Minta Penawaran
            </Link>
          </div>
        </div>
      )}
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
