import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Factory, Layers, Zap, Map as MapIcon, Package } from "lucide-react";
import { getServices, getTexts } from "@/lib/repo";

export const metadata: Metadata = { title: "Layanan" };

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "building-2": Building2,
  factory: Factory,
  layers: Layers,
  zap: Zap,
  map: MapIcon,
  package: Package,
};

export default async function LayananPage() {
  const [services, t] = await Promise.all([getServices(), getTexts()]);

  return (
    <>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["services.eyebrow"]}</p>
          <h1 className="mt-2 max-w-2xl text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold text-[var(--color-ink)]">
            {t["services.title"]}
          </h1>
          <p className="mt-4 max-w-2xl whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-ink-2)]">
            {t["services.intro"]}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col divide-y divide-[var(--color-line)]">
          {services.map((s, i) => {
            const Icon = ICONS[s.icon] ?? Building2;
            return (
              <div
                key={s.id}
                id={s.id}
                className="grid scroll-mt-24 gap-6 py-10 first:pt-0 last:pb-0 sm:grid-cols-[80px_1fr] sm:gap-10"
              >
                <div className="flex items-start gap-4 sm:flex-col sm:items-start">
                  <span className="font-data text-sm text-[var(--color-ink-3)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-ink)] sm:text-2xl">{s.nameId}</h2>
                  <p className="mt-1 text-[13.5px] italic text-[var(--color-ink-3)]">{s.nameEn}</p>
                  <p className="mt-4 max-w-2xl whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-ink-2)]">
                    {s.descriptionId}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--color-line)] bg-[var(--color-surface-2)] py-14">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 px-4 sm:flex-row sm:items-center sm:px-6">
          <p className="text-[16px] font-semibold text-[var(--color-ink)]">
            {t["services.cta.text"]}
          </p>
          <Link
            href="/hubungi"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold"
          >
            {t["services.cta.button"]} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
