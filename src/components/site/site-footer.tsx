import Link from "next/link";
import { MapPin, Phone, Printer, Mail, Clock, ArrowUpRight } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { SocialIcons } from "@/components/site/social-icons";
import type { Settings } from "@/lib/types";
import { fill, type Texts } from "@/lib/texts";
import { mapsLink, telHref } from "@/lib/site";
import type { NavItem } from "@/components/site/site-header";

export function SiteFooter({
  settings,
  texts: t,
  nav,
  logoSrc,
}: {
  settings: Settings;
  texts: Texts;
  nav: NavItem[];
  logoSrc?: string;
}) {
  const year = new Date().getFullYear();
  const links = [...nav, { href: "/hubungi", label: t["common.headerCta"] }];

  return (
    <footer className="relative border-t border-[var(--color-line)] bg-[var(--color-surface)]">
      <div aria-hidden="true" className="h-1 bg-[linear-gradient(90deg,var(--color-teal)_0_70%,var(--color-yellow)_70%_100%)]" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1.1fr_1fr]">
        <div>
          <LogoMark className="h-16 w-auto" src={logoSrc} />
          <p className="mt-5 max-w-sm whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
            {fill(t["common.footer.about"], { taglinePanjang: settings.taglineLong, tanggalBerdiri: settings.established })}
          </p>
          <SocialIcons social={settings.social} className="mt-6" />
        </div>

        <div>
          <h2 className="font-data text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-3)]">Jelajahi</h2>
          <ul className="mt-5 space-y-2.5 text-[14.5px]">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[var(--color-ink-2)] transition-colors hover:text-[var(--color-teal-text)]">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-data text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-3)]">Kantor</h2>
          <ul className="mt-5 space-y-3 text-[14px] text-[var(--color-ink-2)]">
            <li className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <a href={mapsLink(settings)} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-ink)]">
                {settings.address}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <a href={telHref(settings.phone)} className="font-data hover:text-[var(--color-ink)]">
                {settings.phone}
              </a>
            </li>
            {settings.fax && (
              <li className="flex items-center gap-2.5">
                <Printer size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                <span className="font-data">{settings.fax}</span>
              </li>
            )}
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-[var(--color-ink)]">
                {settings.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock size={16} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
              {settings.workingHours}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-data text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-ink-3)]">Legalitas</h2>
          <dl className="mt-5 space-y-2.5 font-data text-[13px] text-[var(--color-ink-2)]">
            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-2">
              <dt className="text-[var(--color-ink-3)]">NIB</dt>
              <dd>{settings.legal.nib}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-2">
              <dt className="text-[var(--color-ink-3)]">NPWP</dt>
              <dd>{settings.legal.npwp}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--color-line)] pb-2">
              <dt className="text-[var(--color-ink-3)]">SIUP</dt>
              <dd>{settings.legal.siup}</dd>
            </div>
          </dl>
          <p className="mt-4 text-[13px] leading-relaxed text-[var(--color-ink-2)]">{t["common.footer.memberships"]}</p>
          <Link href="/legalitas" className="link-arrow mt-3 text-[13.5px]">
            Lihat dokumen <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="container-x flex flex-col gap-2 py-5 text-[12.5px] text-[var(--color-ink-3)] sm:flex-row sm:items-center sm:justify-between">
          <p>{fill(t["common.footer.copyright"], { tahun: year, namaPerusahaan: settings.companyName })}</p>
          <p>{settings.akta}</p>
        </div>
      </div>
    </footer>
  );
}
