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
  PanelsTopLeft,
  Images,
  KeyRound,
  DatabaseBackup,
} from "lucide-react";
import { LogoMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { logoutAction } from "@/app/admin/(protected)/actions";
import type { AdminRole } from "@/lib/types";
import type { UploadMode } from "@/lib/upload-client";
import { AdminProvider } from "./admin-context";

const GROUPS = [
  {
    label: null,
    items: [{ href: "/admin", label: "Ringkasan", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Konten website",
    items: [
      { href: "/admin/halaman", label: "Halaman Website", icon: PanelsTopLeft },
      { href: "/admin/proyek", label: "Proyek", icon: Building2 },
      { href: "/admin/klien", label: "Klien", icon: Users },
      { href: "/admin/sertifikat", label: "Sertifikat & Legalitas", icon: ShieldCheck },
      { href: "/admin/galeri", label: "Galeri Foto", icon: Images },
    ],
  },
  {
    label: "Penawaran",
    items: [{ href: "/admin/rfq", label: "Inbox Penawaran", icon: Inbox }],
  },
  {
    label: "Pengaturan",
    items: [
      { href: "/admin/pengaturan", label: "Info Perusahaan", icon: Settings },
      { href: "/admin/akun", label: "Akun Admin", icon: KeyRound },
      { href: "/admin/cadangan", label: "Cadangan Data", icon: DatabaseBackup },
    ],
  },
] as const;

const ROLE_LABEL: Record<AdminRole, string> = { admin: "Admin", editor: "Editor", viewer: "Hanya lihat" };

export function AdminShell({
  children,
  userName,
  role,
  rfqBadge,
  certBadge,
  uploadMode,
  logoSrc,
}: {
  children: React.ReactNode;
  userName: string;
  role: AdminRole;
  rfqBadge: number;
  certBadge: number;
  uploadMode: UploadMode;
  logoSrc?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 pb-4" aria-label="Navigasi admin">
      {GROUPS.map((group, gi) => (
        <div key={gi}>
          {group.label && (
            <p className="mb-1.5 px-3 font-data text-[10.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{group.label}</p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const exact = "exact" in item && item.exact;
              const active = exact ? pathname === item.href : pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              const badge = item.href === "/admin/rfq" ? rfqBadge : item.href === "/admin/sertifikat" ? certBadge : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center justify-between rounded-[6px] px-3 py-2 text-[14px] font-medium transition-colors ${
                      active
                        ? "bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]"
                        : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                    }`}
                  >
                    {active && <span className="absolute -left-3 top-1.5 bottom-1.5 w-[3px] rounded-r bg-[var(--color-teal)]" aria-hidden="true" />}
                    <span className="flex items-center gap-2.5">
                      <Icon size={17} aria-hidden="true" />
                      {item.label}
                    </span>
                    {badge > 0 && (
                      <span className="rounded-[4px] bg-[var(--color-yellow)] px-1.5 py-0.5 font-data text-[10.5px] font-medium text-[#17181a]">{badge}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  const footer = (
    <div className="space-y-1 border-t border-[var(--color-line)] px-3 py-3">
      <div className="px-3 pb-2">
        <p className="truncate text-[13.5px] font-semibold text-[var(--color-ink)]">{userName}</p>
        <p className="text-[12px] text-[var(--color-ink-3)]">{ROLE_LABEL[role]}</p>
      </div>
      <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-[13.5px] text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
        <ExternalLink size={16} aria-hidden="true" /> Lihat website
      </Link>
      <form action={logoutAction}>
        <button type="submit" className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-[13.5px] text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
          <LogOut size={16} aria-hidden="true" /> Keluar
        </button>
      </form>
    </div>
  );

  return (
    <AdminProvider uploadMode={uploadMode} role={role}>
      <div className="flex min-h-screen bg-[var(--color-bg)]">
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-surface)] lg:flex">
          <div className="flex items-center justify-between gap-2 px-5 py-4">
            <Link href="/admin" className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-auto" src={logoSrc} eager />
              <span className="leading-tight">
                <span className="block text-[13px] font-extrabold text-[var(--color-ink)]">Admin BBP</span>
                <span className="block font-data text-[10px] uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Pengelola website</span>
              </span>
            </Link>
            <ThemeToggle />
          </div>
          {nav}
          {footer}
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[var(--color-line)] bg-[var(--color-surface)]/95 px-4 backdrop-blur lg:hidden">
            <Link href="/admin" className="flex items-center gap-2">
              <LogoMark className="h-8 w-auto" src={logoSrc} eager />
              <span className="text-[13.5px] font-extrabold text-[var(--color-ink)]">Admin BBP</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Tutup menu" : "Buka menu"}
                aria-expanded={open}
                className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[var(--color-line)] text-[var(--color-ink)]"
              >
                {open ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
              </button>
            </div>
          </header>
          {open && (
            <div className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col overflow-y-auto bg-[var(--color-surface)] pt-4 lg:hidden">
              {nav}
              {footer}
            </div>
          )}

          <main id="konten-utama" className="mx-auto w-full max-w-[1500px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
