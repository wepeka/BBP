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

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="shrink-0" aria-label={`${settings.companyName} — beranda`}>
          <LogoFull />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-[14.5px] font-medium transition-colors ${
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
            className="flex items-center gap-1.5 text-sm text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
          >
            <Phone size={15} aria-hidden="true" />
            {settings.phone}
          </a>
          <ThemeToggle />
          <Link
            href="/hubungi"
            className="rounded-md bg-[var(--color-teal)] px-4 py-2.5 text-sm font-semibold text-[var(--color-on-teal)] transition-colors hover:bg-[var(--color-teal-deep)]"
          >
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
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobile-menu"
          className="border-t border-[var(--color-line)] bg-[var(--color-surface)] px-4 pb-6 pt-2 lg:hidden"
        >
          <nav className="flex flex-col" aria-label="Navigasi mobile">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-[var(--color-line)] py-3.5 text-[15px] font-medium text-[var(--color-ink)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-md border border-[var(--color-line-2)] py-3 text-sm font-medium text-[var(--color-ink)]"
            >
              <Phone size={16} aria-hidden="true" />
              {settings.phone}
            </a>
            <Link
              href="/hubungi"
              className="rounded-md bg-[var(--color-teal)] py-3 text-center text-sm font-semibold text-[var(--color-on-teal)]"
            >
              Minta Penawaran
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
