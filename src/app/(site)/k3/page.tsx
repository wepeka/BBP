import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, HardHat, ShieldCheck } from "lucide-react";
import { getLayout, getMedia, getSettings, getTexts } from "@/lib/repo";
import { fill, parseList } from "@/lib/texts";
import { mediaFor } from "@/lib/media";
import { isPageHidden, visibleSections } from "@/lib/sections";
import { formatNumber } from "@/lib/site";
import { PageHeader, SectionHeading } from "@/components/site/section-heading";
import { PhotoGrid } from "@/components/site/photo-grid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.k3.title"], description: t["seo.k3.description"], alternates: { canonical: "/k3" } };
}

export default async function K3Page() {
  const [settings, t, media, layout] = await Promise.all([getSettings(), getTexts(), getMedia(), getLayout()]);
  if (isPageHidden("k3", settings.hiddenPages)) notFound();

  const vars = {
    regulasiSmk3: settings.smk3.regulation,
    iso: settings.iso9001.standard,
    penerbitIso: settings.iso9001.issuer,
    lingkupIso: settings.iso9001.scopeId,
  };

  const blocks: Record<string, () => React.ReactNode> = {
    intro: () => <PageHeader key="intro" eyebrow={t["k3.eyebrow"]} title={t["k3.title"]} intro={fill(t["k3.intro"], vars)} />,

    stats: () => (
      <section id="sec-stats" key="stats" className="container-x pt-16 sm:pt-20">
        <dl className="grid overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              [`${formatNumber(settings.smk3.score)}%`, t["k3.stats.score"]],
              [`${settings.smk3.criteriaMet}/${settings.smk3.criteriaTotal}`, t["k3.stats.criteria"]],
              [settings.smk3.category, t["k3.stats.category"]],
              [settings.iso9001.standard, t["k3.stats.iso"]],
            ] as const
          ).map(([value, label], i) => (
            <div key={i} className="border-b border-[var(--color-line)] p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
              <dd className="font-[family-name:var(--font-display)] text-[1.9rem] font-extrabold leading-none text-[var(--color-teal-text)]">{value}</dd>
              <dt className="mt-2.5 text-[13.5px] text-[var(--color-ink-2)]">{label}</dt>
            </div>
          ))}
        </dl>
      </section>
    ),

    program: () => {
      const items = parseList(t["k3.program.items"]);
      return (
        <section id="sec-program" key="program" className="container-x py-20 sm:py-24">
          <SectionHeading eyebrow={t["k3.program.eyebrow"]} title={t["k3.program.title"]} />
          <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map(([title, text], i) => (
              <li key={i} className="card p-6">
                <span className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[var(--color-yellow)] font-data text-[13px] font-medium text-[#17181a]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <HardHat size={20} className="text-[var(--color-teal)]" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-[var(--color-ink)]">{title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">{text}</p>
              </li>
            ))}
          </ol>
        </section>
      );
    },

    quality: () => (
      <section id="sec-quality" key="quality" className="container-x pb-20">
        <div className="flex items-start gap-5 rounded-[8px] bg-[var(--color-panel-dark)] p-7 sm:p-10">
          <ShieldCheck size={30} className="mt-0.5 shrink-0 text-[var(--color-yellow)]" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-extrabold text-[var(--color-on-panel-dark)] sm:text-2xl">{fill(t["k3.quality.title"], vars)}</h2>
            <p className="mt-3 max-w-3xl whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-on-panel-dark)]/75">{fill(t["k3.quality.body"], vars)}</p>
          </div>
        </div>
      </section>
    ),

    gallery: () => {
      const photos = mediaFor(media, "k3.gallery");
      if (!photos.length) return null;
      return (
        <section id="sec-gallery" key="gallery" className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-20">
          <div className="container-x">
            <SectionHeading title={t["k3.gallery.title"]} />
            <PhotoGrid photos={photos.map((p) => ({ src: p.src, alt: p.alt ?? t["k3.gallery.title"] }))} className="mt-8" />
          </div>
        </section>
      );
    },

    cta: () => (
      <section id="sec-cta" key="cta" className="container-x py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[8px] border border-[var(--color-line)] bg-[var(--color-surface)] p-8 sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-xl font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-ink)]">{t["k3.cta.text"]}</p>
          <Link href="/legalitas" className="btn btn-primary shrink-0">
            {t["k3.cta.button"]} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    ),
  };

  return <>{visibleSections("k3", layout).map((id) => blocks[id]?.())}</>;
}
