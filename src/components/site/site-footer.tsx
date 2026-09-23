import Link from "next/link";
import { MapPin, Phone, Printer, Mail, Clock } from "lucide-react";
import { LogoFull } from "@/components/logo";
import type { Settings } from "@/lib/types";

const LINKS = [
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/proyek", label: "Referensi Proyek" },
  { href: "/kapasitas", label: "Kapasitas & Alat" },
  { href: "/legalitas", label: "Legalitas & Sertifikasi" },
  { href: "/klien", label: "Klien Kami" },
  { href: "/hubungi", label: "Minta Penawaran" },
];

export function SiteFooter({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <LogoFull />
          <p className="mt-4 max-w-sm text-[14.5px] text-[var(--color-ink-2)]">
            {settings.taglineLong}. Berdiri sejak {settings.established}, mengerjakan struktur
            beton, fabrikasi baja, MEP, dan sipil di seluruh Indonesia.
          </p>
          <dl className="mt-5 space-y-2.5 font-data text-[13px] text-[var(--color-ink-2)]">
            <div className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <dd>{settings.address}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <dd>{settings.phone}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Printer size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <dd>{settings.fax}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <dd>{settings.email}</dd>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <dd>{settings.workingHours}</dd>
            </div>
          </dl>
        </div>

        <div>
          <h2 className="font-data text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink-3)]">
            Jelajahi
          </h2>
          <ul className="mt-4 space-y-2.5 text-[14.5px]">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[var(--color-ink-2)] hover:text-[var(--color-teal-text)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-data text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink-3)]">
            Legalitas
          </h2>
          <dl className="mt-4 space-y-2 font-data text-[13px] text-[var(--color-ink-2)]">
            <div>NIB {settings.legal.nib}</div>
            <div>NPWP {settings.legal.npwp}</div>
            <div>SIUP {settings.legal.siup}</div>
          </dl>
          <p className="mt-4 text-[13px] text-[var(--color-ink-2)]">
            Anggota <span className="font-medium text-[var(--color-ink)]">GAPENSI</span> ·
            Bersertifikat <span className="font-medium text-[var(--color-ink)]">ISO 9001</span> &amp;{" "}
            <span className="font-medium text-[var(--color-ink)]">SMK3</span>
          </p>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-[12.5px] text-[var(--color-ink-3)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {year} {settings.companyName}. Seluruh hak cipta dilindungi.
          </p>
          <p>{settings.akta}</p>
        </div>
      </div>
    </footer>
  );
}
