import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { getLayout, getServices, getTexts } from "@/lib/repo";
import { parseList } from "@/lib/texts";
import { iconFor } from "@/lib/icons";
import { visibleSections } from "@/lib/sections";
import { PageHeader, SectionHeading } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.layanan.title"], description: t["seo.layanan.description"], alternates: { canonical: "/layanan" } };
}

export default async function LayananPage() {
  const [services, t, layout] = await Promise.all([getServices(), getTexts(), getLayout()]);

  const blocks: Record<string, () => React.ReactNode> = {
    intro: () => (
      <PageHeader key="intro" eyebrow={t["services.eyebrow"]} title={t["services.title"]} intro={t["services.intro"]}>
        {services.length > 1 && (
          <nav aria-label="Lompat ke layanan" className="mt-9 flex flex-wrap gap-2">
            {services.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-[4px] border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-[13px] font-medium text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-text)]"
              >
                {s.nameId}
              </a>
            ))}
          </nav>
        )}
      </PageHeader>
    ),

    list: () => (
      <section id="sec-list" key="list" className="container-x py-16 sm:py-24">
        <div className="space-y-6">
          {services.map((s) => {
            const Icon = iconFor(s.icon);
            const points = (s.points ?? []).filter(Boolean);
            return (
              <article
                key={s.id}
                id={s.id}
                className={`card grid scroll-mt-28 overflow-hidden ${s.image ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}
              >
                <div className="p-7 sm:p-10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[6px] bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-2xl font-extrabold text-[var(--color-ink)] sm:text-[1.75rem]">{s.nameId}</h2>
                  {s.nameEn && <p className="mt-1 font-data text-[12px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]">{s.nameEn}</p>}
                  <p className="mt-5 max-w-2xl whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-ink-2)]">{s.descriptionId}</p>
                  {points.length > 0 && (
                    <div className="mt-6">
                      <p className="font-data text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{t["services.scopeLabel"]}</p>
                      <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {points.map((p, i) => (
                          <li key={i} className="flex gap-2 text-[14.5px] text-[var(--color-ink-2)]">
                            <Check size={16} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {s.category && (
                    <Link href={`/proyek?kategori=${s.category}`} className="link-arrow mt-7 text-[14px]">
                      {t["services.projectsLink"]} <ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  )}
                </div>
                {s.image && (
                  <div className="relative min-h-[240px] bg-[var(--color-wf-fill)]">
                    <Image src={s.image} alt={s.nameId} fill sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    ),

    process: () => {
      const steps = parseList(t["home.process.items"]);
      return (
        <section id="sec-process" key="process" className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-20">
          <div className="container-x">
            <SectionHeading eyebrow={t["home.process.eyebrow"]} title={t["home.process.title"]} />
            <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {steps.map(([title, text], i) => (
                <li key={i} className="card p-6">
                  <span className="font-data text-[12px] font-medium text-[var(--color-teal-text)]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-[16.5px] font-bold text-[var(--color-ink)]">{title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    },

    cta: () => (
      <section id="sec-cta" key="cta" className="container-x py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[8px] bg-[var(--color-panel-dark)] p-8 sm:flex-row sm:items-center sm:p-10">
          <p className="max-w-xl font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-on-panel-dark)] sm:text-2xl">
            {t["services.cta.text"]}
          </p>
          <Link href="/hubungi" className="btn btn-yellow shrink-0">
            {t["services.cta.button"]} <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    ),
  };

  return <>{visibleSections("layanan", layout).map((id) => blocks[id]?.())}</>;
}
