"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { LogoFull } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

export interface NavItem {
  href: string;
  label: string;
}

export function SiteHeader({
  nav,
  ctaLabel,
  phone,
  phoneHref,
  companyName,
  tagline,
  logoSrc,
}: {
  nav: NavItem[];
  ctaLabel: string;
  phone: string;
  phoneHref: string;
  companyName: string;
  tagline: string;
  logoSrc?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile menu on navigation (adjusted during render, per React's
  // guidance for resetting state on a prop change).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (open) setOpen(false);
  }

  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <header
      style={{ viewTransitionName: "site-header" }}
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled || open
          ? "border-[var(--color-line)] bg-[var(--color-surface)]/90 shadow-[0_10px_30px_-22px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          : "border-transparent bg-[var(--color-surface)]/55 backdrop-blur-md"
      }`}
    >
      <div className={`container-x flex items-center justify-between gap-4 transition-[height] duration-300 ${scrolled ? "h-16" : "h-[76px]"}`}>
        <Link href="/" className="shrink-0" aria-label={`${companyName} — beranda`}>
          <LogoFull src={logoSrc} eager name={companyName} tagline={tagline} />
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Navigasi utama">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link px-3 py-2 text-[14.5px] font-medium transition-colors ${
                isActive(item.href) ? "text-[var(--color-ink)]" : "text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
              }`}
              aria-current={isActive(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={phoneHref}
            className="hidden items-center gap-1.5 whitespace-nowrap font-data text-[13px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)] xl:flex"
          >
            <Phone size={14} aria-hidden="true" />
            {phone}
          </a>
          <ThemeToggle />
          <Link href="/hubungi" className="btn btn-primary btn-sm whitespace-nowrap">
            {ctaLabel}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-[var(--color-line)] text-[var(--color-ink)]"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span key={open ? "x" : "menu"} className="menu-item-in">
              {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-menu" className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-[var(--color-line)] bg-[var(--color-surface)] lg:hidden">
          <nav className="container-x flex flex-col pt-2" aria-label="Navigasi mobile">
            {[{ href: "/", label: "Beranda" }, ...nav].map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ "--d": `${i * 40}ms` } as React.CSSProperties}
                aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                className="menu-item-in flex items-center justify-between border-b border-[var(--color-line)] py-4 font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)] aria-[current=page]:text-[var(--color-teal-text)]"
              >
                {item.label}
                <ArrowRight size={18} className="text-[var(--color-ink-3)]" aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="container-x menu-item-in mt-6 flex flex-col gap-3 pb-10" style={{ "--d": "320ms" } as React.CSSProperties}>
            <Link href="/hubungi" className="btn btn-primary w-full">
              {ctaLabel}
            </Link>
            <a href={phoneHref} className="btn btn-ghost w-full">
              <Phone size={16} aria-hidden="true" />
              {phone}
            </a>
          </div>
        </div>
      )}
      <span className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
