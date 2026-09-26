import type { Metadata } from "next";
import Image from "next/image";
import { getSettings, getTeam, getTexts } from "@/lib/repo";
import { fill, parseList } from "@/lib/texts";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Tentang Kami" };
}


export default async function TentangPage() {
  const [settings, team, t] = await Promise.all([getSettings(), getTeam(), getTexts()]);
  const timeline = parseList(t["about.timeline.items"]);

  return (
    <>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["about.eyebrow"]}</p>
          <h1 className="mt-2 max-w-3xl text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold text-[var(--color-ink)]">
            {t["about.title"]}
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <p className="whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-ink-2)]">
              {fill(t["about.body"], { tanggalBerdiri: settings.established, akta: settings.akta })}
            </p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--color-surface-2)]">
              <Image
                src="/images/about/1.jpeg"
                alt="Kantor PT. Bina Bangun Perkasa, Jl. Urip Sumoharjo, Kediri"
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Director */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["about.director.eyebrow"]}</p>
        <div className="mt-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">{settings.director.name}</h2>
          <p className="text-[14.5px] text-[var(--color-ink-3)]">{settings.director.role}</p>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-2)]">
            {settings.director.bioId}
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["about.team.eyebrow"]}</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl">{t["about.team.title"]}</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div
                key={m.id}
                className="card-lift rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
              >
                <p className="font-semibold text-[var(--color-ink)]">{m.name}</p>
                <p className="mt-0.5 text-[13.5px] text-[var(--color-ink-2)]">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["about.timeline.eyebrow"]}</p>
        <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl">{t["about.timeline.title"]}</h2>
        <ol className="mt-8 border-l-2 border-[var(--color-line)] pl-6">
          {timeline.map(([year, text], i) => (
            <li key={i} className="relative pb-9 last:pb-0">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-teal)]" />
              <p className="font-data text-[13px] font-medium uppercase tracking-wide text-[var(--color-teal-text)]">
                {year}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-ink-2)]">{text ?? ""}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
