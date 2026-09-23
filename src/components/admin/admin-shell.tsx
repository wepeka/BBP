"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck,
  Inbox,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { LogoFull } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/app/admin/(protected)/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/proyek", label: "Proyek", icon: Building2, exact: false },
  { href: "/admin/klien", label: "Klien", icon: Users, exact: false },
  { href: "/admin/sertifikat", label: "Sertifikat", icon: ShieldCheck, exact: false },
  { href: "/admin/rfq", label: "Inbox RFQ", icon: Inbox, exact: false },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings, exact: false },
] as const;

export function AdminShell({
  children,
  userName,
  rfqBadge,
  certBadge,
}: {
  children: React.ReactNode;
  userName: string;
  rfqBadge: number;
  certBadge: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const NavList = (
    <nav className="flex flex-1 flex-col gap-0.5 px-3" aria-label="Navigasi admin">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
        const Icon = item.icon;
        const badge = item.href === "/admin/rfq" ? rfqBadge : item.href === "/admin/sertifikat" ? certBadge : 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between rounded-md px-3 py-2.5 text-[14px] font-medium transition-colors ${
              active
                ? "bg-[var(--color-teal)] text-[var(--color-on-teal)]"
                : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon size={17} aria-hidden="true" />
              {item.label}
            </span>
            {badge > 0 && (
              <span
                className={`rounded-full px-1.5 py-0.5 font-data text-[10.5px] ${
                  active
                    ? "bg-[var(--color-on-teal)]/20 text-[var(--color-on-teal)]"
                    : "bg-[var(--color-yellow)] text-[var(--color-yellow-ink)]"
                }`}
              >
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)] py-5 lg:flex">
        <div className="px-4 pb-5">
          <LogoFull />
        </div>
        {NavList}
        <div className="mt-auto space-y-1 px-3 pt-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13.5px] text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)]"
          >
            <ExternalLink size={16} aria-hidden="true" /> Lihat situs
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13.5px] text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)]"
            >
              <LogOut size={16} aria-hidden="true" /> Keluar
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile topbar + drawer */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)] px-4 lg:hidden">
          <LogoFull className="scale-90" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Tutup menu" : "Buka menu"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-ink)]"
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </header>
        {open && (
          <div className="border-b border-[var(--color-line)] bg-[var(--color-surface)] py-3 lg:hidden">
            {NavList}
          </div>
        )}

        <header className="hidden h-16 items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)] px-6 lg:flex">
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">Selamat datang, {userName}</p>
          <ThemeToggle />
        </header>

        <main id="konten-utama" className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
