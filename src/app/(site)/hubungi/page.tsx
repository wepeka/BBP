import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Printer, Mail, Clock, MessageCircle, ExternalLink } from "lucide-react";
import { getMedia, getServices, getSettings, getTexts } from "@/lib/repo";
import { firstMedia } from "@/lib/media";
import { mapsLink, telHref, waLink } from "@/lib/site";
import { RfqForm } from "@/components/site/rfq-form";
import { LocationMapClient } from "@/components/site/location-map-loader";
import { PageHeader } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.hubungi.title"], description: t["seo.hubungi.description"], alternates: { canonical: "/hubungi" } };
}

export default async function HubungiPage() {
  const [services, settings, t, media] = await Promise.all([getServices(), getSettings(), getTexts(), getMedia()]);
  const office = firstMedia(media, "contact.office");

  return (
    <>
      <PageHeader eyebrow={t["contact.eyebrow"]} title={t["contact.title"]} intro={t["contact.intro"]} />
      <section className="container-x py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-start">
          <div id="sec-form" className="card p-6 sm:p-9" data-no-reveal>
            <h2 className="text-xl font-extrabold text-[var(--color-ink)]">{t["contact.form.title"]}</h2>
            <div className="mt-6">
              <RfqForm
                services={services.map((s) => ({ id: s.id, name: s.nameId }))}
                submitLabel={t["contact.form.submit"]}
                note={t["contact.form.note"]}
              />
            </div>
          </div>

          <div id="sec-office" className="space-y-5 lg:sticky lg:top-24">
            <div className="card overflow-hidden">
              {office && (
                <div className="relative aspect-[16/9] bg-[var(--color-surface-2)]">
                  <Image src={office.src} alt={office.alt ?? t["contact.office"]} fill sizes="(min-width:1024px) 460px, 92vw" className="object-cover" />
                </div>
              )}
              <div className="p-6 sm:p-7">
                <h2 className="text-lg font-extrabold text-[var(--color-ink)]">{t["contact.office"]}</h2>
                <ul className="mt-5 space-y-3.5 text-[15px] text-[var(--color-ink-2)]">
                  <li className="flex gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                    <span>{settings.address}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={18} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                    <a href={telHref(settings.phone)} className="font-data hover:text-[var(--color-ink)]">{settings.phone}</a>
                  </li>
                  {settings.fax && (
                    <li className="flex items-center gap-3">
                      <Printer size={18} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                      <span className="font-data">{settings.fax}</span>
                    </li>
                  )}
                  <li className="flex items-center gap-3">
                    <Mail size={18} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                    <a href={`mailto:${settings.email}`} className="break-all hover:text-[var(--color-ink)]">{settings.email}</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock size={18} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                    <span>{settings.workingHours}</span>
                  </li>
                </ul>

                <div className="mt-6 h-[190px] w-full overflow-hidden rounded-[6px] border border-[var(--color-line)]">
                  <LocationMapClient lat={settings.officeLat} lng={settings.officeLng} zoom={14} />
                </div>
                <a href={mapsLink(settings)} target="_blank" rel="noopener noreferrer" className="link-arrow mt-3 text-[13.5px]">
                  {t["contact.maps"]} <ExternalLink size={13} aria-hidden="true" />
                </a>

                <a
                  href={waLink(settings.whatsapp, settings.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-6 w-full bg-[#25D366] text-white hover:bg-[#1fb958]"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  {t["contact.whatsapp"]}
                </a>
              </div>
            </div>

            <p className="rounded-[6px] border border-[var(--color-line)] bg-[var(--color-band)] p-5 text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              {t["contact.legalNote"]}{" "}
              <Link href="/legalitas" className="font-semibold text-[var(--color-teal-text)] hover:underline">
                Legalitas &amp; Sertifikasi
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
