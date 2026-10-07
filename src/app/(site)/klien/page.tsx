import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink } from "lucide-react";
import { getClients, getLayout, getProjects, getTexts } from "@/lib/repo";
import { fill } from "@/lib/texts";
import { visibleSections } from "@/lib/sections";
import { sameClient } from "@/lib/site";
import { PageHeader } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.klien.title"], description: t["seo.klien.description"], alternates: { canonical: "/klien" } };
}

export default async function KlienPage() {
  const [clients, projects, t, layout] = await Promise.all([getClients(), getProjects(), getTexts(), getLayout()]);
  const flagship = clients.filter((c) => c.flagship);
  const others = clients.filter((c) => !c.flagship);
  const year = new Date().getFullYear();

  const blocks: Record<string, () => React.ReactNode> = {
    intro: () => <PageHeader key="intro" eyebrow={t["clients.eyebrow"]} title={t["clients.title"]} intro={t["clients.intro"]} />,

    flagship: () =>
      flagship.length ? (
        <section id="sec-flagship" key="flagship" className="container-x space-y-5 py-16 sm:py-20">
          {flagship.map((c) => {
            const clientProjects = projects.filter((p) => sameClient(p.client, c.name));
            const cities = new Set(clientProjects.map((p) => p.city)).size;
            const stats = [
              c.projectCount ? [`${c.projectCount}+`, "proyek dikerjakan"] : null,
              c.since ? [String(year - c.since), "tahun kerja sama"] : null,
              cities ? [String(cities), "kota berbeda"] : null,
            ].filter(Boolean) as [string, string][];
            return (
              <article key={c.id} className="card overflow-hidden">
                <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                  <div>
                    <p className="eyebrow">{fill(t["clients.flagship.label"], { tahun: c.since ?? "" })}</p>
                    <div className="mt-5 flex items-center gap-4">
                      {c.logo && (
                        <span className="relative h-14 w-24 shrink-0">
                          <Image src={c.logo} alt="" fill sizes="96px" className="object-contain object-left" />
                        </span>
                      )}
                      <h2 className="h-section text-[var(--color-ink)]">{c.name}</h2>
                    </div>
                    <p className="mt-3 text-[15px] text-[var(--color-ink-2)]">
                      {c.city}, {c.province}
                      {c.note ? ` · ${c.note}` : ""}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-4">
                      {clientProjects.length > 0 && (
                        <Link href={`/proyek?klien=${encodeURIComponent(c.name)}`} className="btn btn-primary btn-sm">
                          {fill(t["clients.flagship.link"], { klien: c.name })} <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                      )}
                      {c.website && (
                        <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noopener noreferrer" className="link-arrow text-[14px]">
                          Situs resmi <ExternalLink size={14} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                  {stats.length > 0 && (
                    <dl className="grid grid-cols-3 overflow-hidden rounded-[6px] border border-[var(--color-line)]">
                      {stats.map(([n, l], i) => (
                        <div key={l} className={`p-4 sm:p-5 ${i > 0 ? "border-l border-[var(--color-line)]" : ""}`}>
                          <dd className="font-[family-name:var(--font-display)] text-3xl font-extrabold text-[var(--color-teal-text)] sm:text-4xl">{n}</dd>
                          <dt className="mt-1 text-[13px] text-[var(--color-ink-2)]">{l}</dt>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      ) : null,

    others: () =>
      others.length ? (
        <section id="sec-others" key="others" className="border-t border-[var(--color-line)] bg-[var(--color-band-2)] py-16 sm:py-20">
          <div className="container-x">
            <h2 className="h-section text-[var(--color-ink)]">{t["clients.others"]}</h2>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((c) => {
                const count = projects.filter((p) => sameClient(p.client, c.name)).length;
                return (
                  <li key={c.id} className="card card-lift flex items-center gap-4 p-5">
                    <span className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-white">
                      {c.logo ? (
                        <Image src={c.logo} alt="" fill sizes="56px" className="object-contain p-1.5" />
                      ) : (
                        <span className="font-[family-name:var(--font-display)] text-[15px] font-extrabold text-[var(--color-teal)]">
                          {c.name.replace(/^(PT|CV)\.?\s*/i, "").slice(0, 2).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug text-[var(--color-ink)]">{c.name}</p>
                      <p className="mt-0.5 text-[13px] text-[var(--color-ink-2)]">
                        {c.city}, {c.province}
                        {c.note ? ` · ${c.note}` : ""}
                      </p>
                      {count > 0 && (
                        <Link href={`/proyek?klien=${encodeURIComponent(c.name)}`} className="mt-1 inline-block text-[12.5px] font-medium text-[var(--color-teal-text)] hover:underline">
                          {count} proyek →
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      ) : null,
  };

  return <>{visibleSections("klien", layout).map((id) => blocks[id]?.())}</>;
}
