import type { Metadata } from "next";
import { MapPin, Phone, Printer, Mail, Clock, MessageCircle } from "lucide-react";
import { getServices, getSettings } from "@/lib/repo";
import { RfqForm } from "@/components/site/rfq-form";
import { LocationMapClient } from "@/components/site/location-map-loader";

export const metadata: Metadata = { title: "Hubungi Kami" };

export default async function HubungiPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Hubungi Kami</p>
      <h1 className="mt-2 max-w-2xl text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold text-[var(--color-ink)]">
        Minta penawaran untuk proyek Anda
      </h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-6 sm:p-8">
          <RfqForm services={services} />
        </div>

        <div className="space-y-5">
          <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg font-bold text-[var(--color-ink)]">Kantor Kediri</h2>
            <dl className="mt-4 space-y-3 text-[14.5px] text-[var(--color-ink-2)]">
              <div className="flex gap-2.5">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                <dd>{settings.address}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={17} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                <dd>
                  <a href={`tel:${settings.phone.replace(/[^0-9+]/g, "")}`}>{settings.phone}</a>
                </dd>
              </div>
              <div className="flex items-center gap-2.5">
                <Printer size={17} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                <dd>{settings.fax}</dd>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={17} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                <dd className="break-all">
                  <a href={`mailto:${settings.email}`}>{settings.email}</a>
                </dd>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock size={17} className="shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                <dd>{settings.workingHours}</dd>
              </div>
            </dl>

            <div className="mt-5 h-[180px] w-full">
              <LocationMapClient lat={settings.officeLat} lng={settings.officeLng} />
            </div>

            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 flex items-center justify-center gap-2 rounded-md bg-[#25D366] py-3 text-[14.5px] font-semibold text-white"
            >
              <MessageCircle size={17} aria-hidden="true" />
              Chat via WhatsApp
            </a>
          </div>

          <div className="rounded-md bg-[var(--color-surface-2)] p-6 text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">
            Untuk vendor registration atau permintaan dokumen legal, lihat halaman{" "}
            <a href="/legalitas" className="font-medium text-[var(--color-teal-text)]">
              Legalitas &amp; Sertifikasi
            </a>
            .
          </div>
        </div>
      </div>
    </section>
  );
}
