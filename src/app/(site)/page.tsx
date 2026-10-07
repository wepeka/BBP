import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  getCategories,
  getClients,
  getLayout,
  getMedia,
  getProjects,
  getServices,
  getSettings,
  getTexts,
} from "@/lib/repo";
import { fill, parseList } from "@/lib/texts";
import { firstMedia, mediaFor } from "@/lib/media";
import { visibleSections } from "@/lib/sections";
import { categoryLabels } from "@/lib/categories";
import { iconFor } from "@/lib/icons";
import { statVars, waLink } from "@/lib/site";
import { toMapProjects } from "@/lib/map";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectsMapClient } from "@/components/site/projects-map-loader";
import { CountUp } from "@/components/site/count-up";
import { HeroPhoto } from "@/components/site/hero-photo";
import { SectionHeading } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, t] = await Promise.all([getSettings(), getTexts()]);
  const title = t["seo.beranda.title"] || `${settings.companyName} — ${settings.tagline}`;
  return {
    title: { absolute: title },
    description: t["seo.beranda.description"],
    alternates: { canonical: "/" },
  };
}

export default async function HomePage() {
  const [settings, services, clients, projects, categories, t, media, layout] = await Promise.all([
    getSettings(),
    getServices(),
    getClients(),
    getProjects(),
    getCategories(),
    getTexts(),
    getMedia(),
    getLayout(),
  ]);

  const vars = statVars(settings, projects);
  const labels = categoryLabels(categories);
  const labelOf = (p: { categories: string[] }) => labels[p.categories[0]] ?? p.categories[0] ?? "Proyek";

  const blocks: Record<string, () => React.ReactNode> = {
    hero: () => {
      // Split e.g. "Kontraktor andalan industri. Terbukti di 17 kota sejak 2012."
      // so the second sentence gets the highlighter sweep.
      const title = t["home.hero.title"];
      const dot = title.indexOf(". ");
      const headlineA = dot === -1 ? title : title.slice(0, dot + 1);
      const headlineB = dot === -1 ? "" : title.slice(dot + 2);
      const photos = mediaFor(media, "home.hero").map((m) => ({ src: m.src, alt: m.alt || "Proyek PT. Bina Bangun Perkasa" }));

      return (
        <section id="sec-hero" key="hero" className="relative overflow-hidden border-b border-[var(--color-line)]">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.08fr_1fr] lg:items-center lg:pb-20 lg:pt-16">
            <div data-no-reveal>
              <p
                className="hero-in inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-surface)]/80 px-3.5 py-1.5 font-data text-[11px] uppercase tracking-[0.14em] text-[var(--color-teal-text)] backdrop-blur"
                style={{ "--d": "0ms" } as React.CSSProperties}
              >
                <span className="pulse-dot h-2 w-2 rounded-full bg-[var(--color-teal)] text-[var(--color-teal)]" />
                {t["home.hero.badge"]}
              </p>
              <h1
                className="hero-in mt-6 whitespace-pre-line text-[clamp(2.2rem,5vw,3.75rem)] font-black leading-[1.04] tracking-[-0.02em] text-[var(--color-ink)]"
                style={{ "--d": "90ms" } as React.CSSProperties}
              >
                <span className="text-[var(--color-teal-text)]">{headlineA}</span>
                {headlineB && (
                  <>
                    {" "}
                    <span className="mark-sweep">{headlineB}</span>
                  </>
                )}
              </h1>
              <p
                className="hero-in mt-6 max-w-xl whitespace-pre-line text-[17px] leading-relaxed text-[var(--color-ink-2)]"
                style={{ "--d": "180ms" } as React.CSSProperties}
              >
                {t["home.hero.subtitle"]}
              </p>
              <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ "--d": "270ms" } as React.CSSProperties}>
                <Link href="/hubungi" className="btn-primary fx-lift fx-sweep inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold">
                  {t["home.hero.ctaPrimary"]}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link href="/proyek" className="btn-ghost fx-lift inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold">
                  {t["home.hero.ctaSecondary"]}
                </Link>
              </div>
            </div>

            <div data-no-reveal className="hero-in relative mx-auto w-full max-w-[520px]" style={{ "--d": "200ms" } as React.CSSProperties}>
              {/* yellow sun from the logo, with a slowly turning ring behind the photo */}
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-[78%] w-[78%] rounded-full bg-[var(--color-yellow)] opacity-90" />
              <div aria-hidden="true" className="spin-slow absolute -right-16 -top-16 h-[92%] w-[92%] rounded-full border-2 border-dashed border-[var(--color-teal)]/40" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[var(--color-panel-dark)] shadow-[var(--shadow-lift)] ring-1 ring-black/5 sm:aspect-[5/5]">
                <HeroPhoto photos={photos} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-5 right-5 font-data text-[11px] uppercase tracking-[0.14em] text-white/85">
                  {t["home.hero.imageCaption"]}
                </p>
              </div>

              {/* floating proof badges */}
              <div className="float-y absolute -left-4 top-8 flex items-center gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)]/95 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur sm:-left-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]">
                  <ShieldCheck size={20} aria-hidden="true" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[13.5px] font-bold text-[var(--color-ink)]">{t["home.hero.badgeTitle"]}</span>
                  <span className="block text-[12px] text-[var(--color-ink-3)]">{fill(t["home.hero.badgeText"], vars)}</span>
                </span>
              </div>
              <div className="float-y-slow absolute -bottom-6 right-2 flex items-center gap-3 rounded-2xl bg-[var(--color-panel-dark)] px-4 py-3 text-[var(--color-on-panel-dark)] shadow-[var(--shadow-lift)] sm:-right-6">
                <span className="font-[family-name:var(--font-display)] text-3xl font-black text-[var(--color-yellow)]">{vars.tahun}+</span>
                <span className="whitespace-pre-line text-[12.5px] leading-tight opacity-80">{t["home.hero.yearsBadge"]}</span>
              </div>
            </div>
          </div>
        </section>
      );
    },

    stats: () => (
      <section id="sec-stats" key="stats" className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {(
            [
              [vars.tahun, "+", t["home.stats.years"]],
              [vars.kota, "", t["home.stats.cities"]],
              [settings.stats.projects, "+", t["home.stats.projects"]],
              [settings.stats.clients, "", t["home.stats.clients"]],
            ] as const
          ).map(([n, suffix, l], i) => (
            <div
              key={i}
              className={`group border-[var(--color-line)] px-5 py-7 sm:px-7 ${i % 2 !== 0 ? "border-l" : ""} ${i === 2 ? "sm:border-l" : ""} ${
                i < 2 ? "border-b border-[var(--color-line)] sm:border-b-0" : ""
              }`}
            >
              <div className="font-[family-name:var(--font-display)] text-4xl font-black text-[var(--color-teal-text)] sm:text-5xl">
                <CountUp value={n} suffix={suffix} />
              </div>
              <div className="mt-1 text-[13.5px] text-[var(--color-ink-2)]">{l}</div>
              <div className="mt-3 h-[3px] w-8 rounded-full bg-[var(--color-yellow)] transition-all duration-500 group-hover:w-16" />
            </div>
          ))}
        </div>
      </section>
    ),

    clients: () => {
      const flagship = clients.find((c) => c.flagship);
      const others = clients.filter((c) => !c.flagship);
      if (!clients.length) return null;
      return (
        <section id="sec-clients" key="clients" className="border-b border-[var(--color-line)] bg-[var(--color-band-2)] py-14">
          <div className="container-x flex flex-col items-center gap-4 text-center">
            <p className="font-data text-[11.5px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{t["home.clients.eyebrow"]}</p>
            {flagship && (
              <p className="flex flex-wrap items-center justify-center gap-3">
                {flagship.logo && (
                  <Image src={flagship.logo} alt="" width={120} height={48} className="h-10 w-auto object-contain" />
                )}
                <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[var(--color-ink)] sm:text-2xl">
                  {flagship.name}
                </span>
                {flagship.projectCount ? (
                  <span className="rounded-[4px] bg-[var(--color-yellow)] px-2.5 py-1 font-data text-[11px] font-medium uppercase tracking-wide text-[#17181a]">
                    {flagship.projectCount}+ proyek{flagship.since ? ` sejak ${flagship.since}` : ""}
                  </span>
                ) : null}
              </p>
            )}
          </div>
          {others.length > 0 && (
            <div className="marquee mt-8 overflow-hidden" data-no-reveal>
              <div className="marquee__track">
                {[0, 1].map((copy) => (
                  <ul key={copy} className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy === 1 || undefined}>
                    {others.map((c) => (
                      <li
                        key={c.id}
                        className="flex h-14 items-center gap-3 whitespace-nowrap rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] px-5 text-[13.5px] font-medium text-[var(--color-ink-2)]"
                      >
                        {c.logo && <Image src={c.logo} alt="" width={96} height={36} className="h-8 w-auto object-contain" />}
                        {c.name}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          )}
        </section>
      );
    },

    services: () => (
      <section id="sec-services" key="services" className="container-x py-20 sm:py-28">
        <SectionHeading
          eyebrow={t["home.services.eyebrow"]}
          title={t["home.services.title"]}
          action={
            <Link href="/layanan" className="link-arrow text-[14.5px]">
              {t["common.nav.layanan"]} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = iconFor(s.icon);
            return (
              <Link key={s.id} href={`/layanan#${s.id}`} className="group card card-lift flex flex-col overflow-hidden">
                {s.image && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-wf-fill)]">
                    <Image src={s.image} alt="" fill sizes="(min-width:1024px) 380px, 90vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[6px] bg-[var(--color-teal-soft)] text-[var(--color-teal-text)] transition-colors duration-300 group-hover:bg-[var(--color-teal)] group-hover:text-white">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-[17.5px] font-bold text-[var(--color-ink)]">{s.nameId}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">{s.shortId}</p>
                  <span className="link-arrow mt-auto pt-5 text-[13.5px]">
                    {t["home.services.more"]} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    ),

    why: () => {
      const items = parseList(t["home.why.items"]);
      return (
        <section id="sec-why" key="why" className="on-dark relative overflow-hidden bg-[var(--color-panel-dark)] py-20 sm:py-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_top_right,#000_20%,transparent_70%)]"
          />
          <div className="container-x relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <SectionHeading dark eyebrow={t["home.why.eyebrow"]} title={t["home.why.title"]} className="self-start lg:sticky lg:top-28" />
            <div className="grid gap-px overflow-hidden rounded-[6px] bg-white/10 sm:grid-cols-2">
              {items.map(([icon, title, text, link], i) => {
                const Icon = iconFor(icon);
                const body = (
                  <>
                    <Icon size={26} className="text-[var(--color-yellow)]" aria-hidden="true" />
                    <h3 className="mt-5 text-[17px] font-bold text-white">{title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-white/70">{fill(text ?? "", vars)}</p>
                    {link && (
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-yellow)]">
                        Lihat detail <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </span>
                    )}
                  </>
                );
                return link ? (
                  <Link key={i} href={link} className="group bg-[var(--color-panel-dark-2)] p-7 transition-colors hover:bg-[#1b3326]">
                    {body}
                  </Link>
                ) : (
                  <div key={i} className="bg-[var(--color-panel-dark-2)] p-7">
                    {body}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    },

    map: () => (
      <section id="sec-map" key="map" className="border-b border-[var(--color-line)] bg-[var(--color-band-2)] py-20 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionHeading eyebrow={t["home.map.eyebrow"]} title={t["home.map.title"]} intro={fill(t["home.map.body"], { kota: vars.kota })} />
            <Link href="/proyek" className="link-arrow mt-7 text-[15px]">
              {t["home.map.link"]} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="h-[340px] w-full overflow-hidden rounded-[6px] border border-[var(--color-line)] shadow-[var(--shadow-card)] sm:h-[440px]" data-no-reveal>
            <ProjectsMapClient projects={toMapProjects(projects)} />
          </div>
        </div>
      </section>
    ),

    featured: () => {
      const featured = projects.filter((p) => p.featured).slice(0, 7);
      if (!featured.length) return null;
      return (
        <section id="sec-featured" key="featured" className="container-x py-20 sm:py-28">
          <SectionHeading
            eyebrow={t["home.featured.eyebrow"]}
            title={t["home.featured.title"]}
            action={
              <Link href="/proyek" className="link-arrow text-[14.5px]">
                {t["home.featured.link"]}
              </Link>
            }
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <div key={p.id} className={i === 0 ? "sm:col-span-2" : ""}>
                <ProjectCard
                  project={p}
                  categoryLabel={labelOf(p)}
                  large={i === 0}
                  sizes={i === 0 ? "(min-width: 1024px) 780px, 92vw" : undefined}
                />
              </div>
            ))}
          </div>
        </section>
      );
    },

    process: () => {
      const steps = parseList(t["home.process.items"]);
      return (
        <section id="sec-process" key="process" className="border-y border-[var(--color-line)] bg-[var(--color-band)] py-20 sm:py-24">
          <div className="container-x">
            <SectionHeading eyebrow={t["home.process.eyebrow"]} title={t["home.process.title"]} />
            <ol
              className="relative mt-14 grid gap-8 md:grid-cols-2 lg:gap-6 lg:[grid-template-columns:repeat(var(--steps),minmax(0,1fr))]"
              style={{ "--steps": Math.max(steps.length, 1) } as React.CSSProperties}
            >
              <span aria-hidden="true" className="process-line absolute left-5 right-5 top-5 hidden h-px lg:block" />
              {steps.map(([title, text], i) => (
                <li key={i} className="relative lg:pr-2">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-[6px] border border-[var(--color-ink)] bg-[var(--color-surface)] font-data text-[13px] font-medium text-[var(--color-ink)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-[16.5px] font-bold text-[var(--color-ink)]">{title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      );
    },

    director: () => {
      const photo = firstMedia(media, "director.photo");
      return (
        <section id="sec-director" key="director" className="container-x py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
            {photo && (
              <div className="reg-marks mx-auto w-full max-w-[420px]">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[6px] bg-[var(--color-surface-2)]">
                  <Image src={photo.src} alt={photo.alt ?? settings.director.name} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
                </div>
              </div>
            )}
            <div>
              <p className="eyebrow">{t["home.director.eyebrow"]}</p>
              <h2 className="h-section mt-4 text-[var(--color-ink)]">{settings.director.name}</h2>
              <p className="mt-2 font-data text-[13px] uppercase tracking-[0.12em] text-[var(--color-ink-3)]">{settings.director.role}</p>
              <p className="lede mt-6 max-w-2xl whitespace-pre-line">{settings.director.bioId}</p>
              <Link href="/tentang" className="link-arrow mt-7 text-[15px]">
                {t["home.director.link"]} <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      );
    },

    cta: () => {
      const bg = firstMedia(media, "home.cta");
      return (
        <section id="sec-cta" key="cta" className="container-x pb-20 sm:pb-28">
          <div className="relative overflow-hidden rounded-[8px] bg-[var(--color-panel-dark)] px-6 py-16 sm:px-14 sm:py-20">
            {bg && (
              <Image src={bg.src} alt="" fill sizes="1200px" className="object-cover opacity-25" />
            )}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-yellow)] opacity-90" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(90deg,#000,transparent_80%)]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-panel-dark)] via-[var(--color-panel-dark)]/85 to-transparent" />
            </div>
            <div className="relative max-w-2xl">
              <h2 className="h-section text-[var(--color-on-panel-dark)]">{t["home.cta.title"]}</h2>
              <p className="mt-5 max-w-xl whitespace-pre-line text-[17px] leading-relaxed text-[var(--color-on-panel-dark)]/75">{t["home.cta.body"]}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/hubungi" className="btn btn-yellow">
                  {t["home.cta.button"]}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <a href={waLink(settings.whatsapp, settings.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
                  {t["home.cta.whatsapp"]}
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    },
  };

  return <>{visibleSections("beranda", layout).map((id) => blocks[id]?.())}</>;
}
