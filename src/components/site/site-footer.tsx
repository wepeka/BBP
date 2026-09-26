import Link from "next/link";
import { MapPin, Phone, Printer, Mail, Clock } from "lucide-react";
import { LogoMark } from "@/components/logo";
import type { Settings } from "@/lib/types";
import { fill, type Texts } from "@/lib/texts";

const LINKS = [
  { href: "/tentang", label: "Tentang Kami" },
  { href: "/layanan", label: "Layanan" },
  { href: "/proyek", label: "Referensi Proyek" },
  { href: "/kapasitas", label: "Kapasitas & Alat" },
  { href: "/legalitas", label: "Legalitas & Sertifikasi" },
  { href: "/klien", label: "Klien Kami" },
  { href: "/hubungi", label: "Minta Penawaran" },
];

export function SiteFooter({ settings, texts: t }: { settings: Settings; texts: Texts }) {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-line)] bg-[var(--color-band)] backdrop-blur-sm">
      <div aria-hidden="true" className="h-1 bg-[linear-gradient(90deg,var(--color-teal),var(--color-yellow),var(--color-teal))] bg-[size:200%_100%] [animation:footer-bar_8s_linear_infinite]" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <LogoMark className="h-16 w-auto" />
          <p className="mt-4 max-w-sm whitespace-pre-line text-[14.5px] text-[var(--color-ink-2)]">
            {fill(t["common.footer.about"], { taglinePanjang: settings.taglineLong, tanggalBerdiri: settings.established })}
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
                <Link href={l.href} className="inline-block text-[var(--color-ink-2)] transition-all duration-300 hover:translate-x-1 hover:text-[var(--color-teal-text)]">
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
          <p className="mt-4 text-[13px] text-[var(--color-ink-2)]">{t["common.footer.memberships"]}</p>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-[12.5px] text-[var(--color-ink-3)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>{fill(t["common.footer.copyright"], { tahun: year, namaPerusahaan: settings.companyName })}</p>
          <p>{settings.akta}</p>
        </div>
      </div>
    </footer>
  );
}
