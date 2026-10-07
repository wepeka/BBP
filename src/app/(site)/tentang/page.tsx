import type { Metadata } from "next";
import Image from "next/image";
import { getLayout, getMedia, getSettings, getTeam, getTexts } from "@/lib/repo";
import { fill, parseList } from "@/lib/texts";
import { firstMedia } from "@/lib/media";
import { visibleSections } from "@/lib/sections";
import { SectionHeading } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.tentang.title"], description: t["seo.tentang.description"], alternates: { canonical: "/tentang" } };
}

function initials(name: string) {
  return name
    .replace(/,.*$/, "")
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && !/^(muh|moh|m)\.?$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export default async function TentangPage() {
  const [settings, team, t, media, layout] = await Promise.all([getSettings(), getTeam(), getTexts(), getMedia(), getLayout()]);
  const main = firstMedia(media, "about.main");
  const directorPhoto = firstMedia(media, "director.photo");

  const blocks: Record<string, () => React.ReactNode> = {
    intro: () => (
      <section id="sec-intro" key="intro" className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="container-x grid gap-12 py-14 sm:py-20 lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-16" data-no-reveal>
          <div className="hero-in">
            <SectionHeading as="h1" eyebrow={t["about.eyebrow"]} title={t["about.title"]} />
            <div className="mt-7 space-y-4">
              {fill(t["about.body"], { tanggalBerdiri: settings.established, akta: settings.akta })
                .split(/\n\s*\n/)
                .map((para, i) => (
                  <p key={i} className={i === 0 ? "lede" : "text-[16px] leading-relaxed text-[var(--color-ink-2)]"}>
                    {para}
                  </p>
                ))}
            </div>
          </div>
          {main && (
            <div className="hero-in reg-marks lg:mt-10" style={{ "--d": "120ms" } as React.CSSProperties}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[var(--color-surface-2)]">
                <Image src={main.src} alt={main.alt ?? ""} fill loading="eager" sizes="(min-width: 1024px) 500px, 92vw" className="object-cover" />
              </div>
              <div className="tblock">
                <div className="tb-last">
                  <span className="tb-label">Berdiri</span>
                  <span className="tb-value">{settings.established}</span>
                </div>
                <div className="tb-last tb-end" style={{ gridColumn: "span 2" }}>
                  <span className="tb-label">Kantor pusat</span>
                  <span className="tb-value">{settings.city}, {settings.province}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    ),

    director: () => (
      <section id="sec-director" key="director" className="container-x py-20 sm:py-24">
        <div className="card grid overflow-hidden lg:grid-cols-[300px_1fr]">
          {directorPhoto && (
            <div className="relative aspect-[4/3] bg-[var(--color-surface-2)] lg:aspect-auto">
              <Image src={directorPhoto.src} alt={directorPhoto.alt ?? settings.director.name} fill sizes="(min-width: 1024px) 300px, 92vw" className="object-cover" />
            </div>
          )}
          <div className="p-7 sm:p-10">
            <p className="eyebrow">{t["about.director.eyebrow"]}</p>
            <h2 className="mt-4 text-2xl font-extrabold text-[var(--color-ink)] sm:text-[1.9rem]">{settings.director.name}</h2>
            <p className="mt-1.5 font-data text-[12.5px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]">{settings.director.role}</p>
            <p className="mt-5 max-w-3xl whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-ink-2)]">{settings.director.bioId}</p>
          </div>
        </div>
      </section>
    ),

    team: () =>
      team.length ? (
        <section id="sec-team" key="team" className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-20 sm:py-24">
          <div className="container-x">
            <SectionHeading eyebrow={t["about.team.eyebrow"]} title={t["about.team.title"]} />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m) => (
                <div key={m.id} className="card card-lift flex items-center gap-4 p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[6px] bg-[var(--color-teal-soft)]">
                    {m.photo ? (
                      <Image src={m.photo} alt={m.name} fill sizes="64px" className="object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-[family-name:var(--font-display)] text-lg font-extrabold text-[var(--color-teal-text)]">
                        {initials(m.name)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug text-[var(--color-ink)]">{m.name}</p>
                    <p className="mt-0.5 text-[13.5px] text-[var(--color-ink-2)]">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null,

    timeline: () => {
      const timeline = parseList(t["about.timeline.items"]);
      return (
        <section id="sec-timeline" key="timeline" className="container-x py-20 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeading eyebrow={t["about.timeline.eyebrow"]} title={t["about.timeline.title"]} />
            </div>
            <ol className="relative border-l border-[var(--color-line-2)]">
              {timeline.map(([year, text], i) => (
                <li key={i} className="relative pb-10 pl-8 last:pb-0" data-reveal>
                  <span className="absolute -left-[6px] top-[7px] h-[11px] w-[11px] border-2 border-[var(--color-teal)] bg-[var(--color-bg)]" />
                  <p className="font-data text-[13px] font-medium uppercase tracking-[0.12em] text-[var(--color-teal-text)]">{year}</p>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-[var(--color-ink-2)]">{text ?? ""}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    },
  };

  return <>{visibleSections("tentang", layout).map((id) => blocks[id]?.())}</>;
}
