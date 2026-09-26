import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getClients, getProjects, getTexts } from "@/lib/repo";

export const metadata: Metadata = { title: "Klien Kami" };

export default async function KlienPage() {
  const [clients, projects, t] = await Promise.all([getClients(), getProjects(), getTexts()]);
  const flagship = clients.filter((c) => c.flagship);
  const others = clients.filter((c) => !c.flagship);

  return (
    <>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["clients.eyebrow"]}</p>
          <h1 className="mt-2 max-w-2xl text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold text-[var(--color-ink)]">
            {t["clients.title"]}
          </h1>
          <p className="mt-4 max-w-2xl whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-ink-2)]">
            {t["clients.intro"]}
          </p>
        </div>
      </section>

      {flagship.map((c) => {
        const clientProjects = projects.filter((p) => p.client === c.name);
        return (
          <section key={c.id} className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
            <div className="card-lift rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7 sm:p-9">
              <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
                Klien Utama · Sejak {c.since}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl">{c.name}</h2>
              <p className="mt-2 text-[14.5px] text-[var(--color-ink-2)]">
                {c.city}, {c.province}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums text-[var(--color-teal-text)]">
                    {c.projectCount}+
                  </p>
                  <p className="text-[13px] text-[var(--color-ink-2)]">proyek dikerjakan</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums text-[var(--color-teal-text)]">
                    {new Date().getFullYear() - (c.since ?? 2012)}
                  </p>
                  <p className="text-[13px] text-[var(--color-ink-2)]">tahun kerja sama</p>
                </div>
                <div>
                  <p className="font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums text-[var(--color-teal-text)]">
                    {new Set(clientProjects.map((p) => p.city)).size || "10+"}
                  </p>
                  <p className="text-[13px] text-[var(--color-ink-2)]">kota berbeda</p>
                </div>
              </div>
              <Link
                href={`/proyek?kota=`}
                className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-teal-text)]"
              >
                Lihat proyek untuk {c.name} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </section>
        );
      })}

      <section className="border-t border-[var(--color-line)] bg-[var(--color-surface-2)] py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-data text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink-3)]">
            {t["clients.others"]}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((c) => (
              <div key={c.id} className="card-lift rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
                <p className="font-semibold leading-snug text-[var(--color-ink)]">{c.name}</p>
                {c.note && <p className="text-[12.5px] text-[var(--color-ink-3)]">{c.note}</p>}
                <p className="mt-1.5 text-[13px] text-[var(--color-ink-2)]">
                  {c.city}, {c.province}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
