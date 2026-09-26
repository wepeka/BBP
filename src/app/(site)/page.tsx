import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Factory,
  Layers,
  Zap,
  Map as MapIcon,
  Package,
  ShieldCheck,
  Award,
} from "lucide-react";
import { getSettings, getServices, getClients, getProjects, getCertificates, getTexts } from "@/lib/repo";
import { fill } from "@/lib/texts";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectsMapClient } from "@/components/site/projects-map-loader";
import { CountUp } from "@/components/site/count-up";

const SERVICE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "building-2": Building2,
  factory: Factory,
  layers: Layers,
  zap: Zap,
  map: MapIcon,
  package: Package,
};

export default async function HomePage() {
  const [settings, services, clients, projects, certificates, t] = await Promise.all([
    getSettings(),
    getServices(),
    getClients(),
    getProjects(),
    getCertificates(),
    getTexts(),
  ]);

  // Split "Dibangun di 17 kota. Dipercaya lagi selama 13 tahun." so the
  // second sentence gets the highlighter sweep.
  const dot = t["home.hero.title"].indexOf(". ");
  const headlineA = dot === -1 ? t["home.hero.title"] : t["home.hero.title"].slice(0, dot + 1);
  const headlineB = dot === -1 ? "" : t["home.hero.title"].slice(dot + 2);

  const featured = projects.filter((p) => p.featured).slice(0, 6);
  const heroImage = "/images/hero/1.jpeg";
  const flagshipClient = clients.find((c) => c.flagship);
  const otherClients = clients.filter((c) => !c.flagship);
  const cities = new Set(projects.map((p) => p.city)).size;
  const sbuOk = certificates.filter((c) => c.group === "sbu" && c.status === "berlaku").length;
  const sbuTotal = certificates.filter((c) => c.group === "sbu").length;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-[var(--color-line)]">
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
              <Link
                href="/hubungi"
                className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold"
              >
                {t["home.hero.ctaPrimary"]}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/proyek"
                className="btn-ghost inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold"
              >
                {t["home.hero.ctaSecondary"]}
              </Link>
            </div>
          </div>

          <div data-no-reveal className="hero-in relative mx-auto w-full max-w-[520px]" style={{ "--d": "200ms" } as React.CSSProperties}>
            {/* yellow sun from the logo, turning slowly behind the photo */}
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-10 h-[78%] w-[78%] rounded-full bg-[var(--color-yellow)] opacity-90"
            />
            <div
              aria-hidden="true"
              className="spin-slow absolute -right-16 -top-16 h-[92%] w-[92%] rounded-full border-2 border-dashed border-[var(--color-teal)]/40"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[var(--shadow-lift)] ring-1 ring-black/5 sm:aspect-[5/5]">
              <Image
                src={heroImage}
                alt="Rangka struktur baja proyek gudang industri BBP"
                fill
                priority
                sizes="(min-width: 1024px) 520px, 100vw"
                className="ken-burns object-cover"
              />
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
                <span className="block text-[12px] text-[var(--color-ink-3)]">{fill(t["home.hero.badgeText"], { skorSmk3: settings.smk3.score })}</span>
              </span>
            </div>
            <div className="float-y-slow absolute -bottom-6 right-2 flex items-center gap-3 rounded-2xl bg-[var(--color-panel-dark)] px-4 py-3 text-[var(--color-on-panel-dark)] shadow-[var(--shadow-lift)] sm:-right-6">
              <span className="font-[family-name:var(--font-display)] text-3xl font-black text-[var(--color-yellow)]">
                {settings.stats.yearsActive}+
              </span>
              <span className="whitespace-pre-line text-[12.5px] leading-tight opacity-80">{t["home.hero.yearsBadge"]}</span>
            </div>
          </div>
        </div>

        {/* stat strip */}
        <div className="border-t border-[var(--color-line)] bg-[var(--color-band)]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
            {(
              [
                [settings.stats.yearsActive, "+", t["home.stats.years"]],
                [cities, "", t["home.stats.cities"]],
                [settings.stats.projects, "+", t["home.stats.projects"]],
                [settings.stats.clients, "", t["home.stats.clients"]],
              ] as const
            ).map(([n, suffix, l], i) => (
              <div
                key={l}
                className={`group border-[var(--color-line)] px-5 py-7 sm:px-7 ${i % 2 !== 0 ? "border-l" : ""} ${
                  i === 2 ? "sm:border-l" : ""
                } ${i < 2 ? "border-b border-[var(--color-line)] sm:border-b-0" : ""}`}
              >
                <div className="font-[family-name:var(--font-display)] text-4xl font-black text-[var(--color-teal-text)] sm:text-5xl">
                  <CountUp value={n} suffix={suffix} />
                </div>
                <div className="mt-1 text-[13.5px] text-[var(--color-ink-2)]">{l}</div>
                <div className="mt-3 h-[3px] w-8 rounded-full bg-[var(--color-yellow)] transition-all duration-500 group-hover:w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Trusted by ---------- */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-band-2)] py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-data text-center text-xs uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
            {t["home.clients.eyebrow"]}
          </p>
          {flagshipClient && (
            <p className="mt-5 text-center">
              <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[var(--color-ink)] sm:text-2xl">
                {flagshipClient.name}
              </span>
              <span className="ml-2 inline-block rounded-full bg-[var(--color-yellow)] px-2.5 py-0.5 align-middle font-data text-[11px] uppercase tracking-wide text-[var(--color-yellow-ink)]">
                {flagshipClient.projectCount}+ proyek sejak {flagshipClient.since}
              </span>
            </p>
          )}
        </div>
        <div className="marquee mt-7 overflow-hidden" data-no-reveal>
          <div className="marquee__track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={copy === 1 || undefined}>
                {otherClients.map((c) => (
                  <li
                    key={c.id}
                    className="whitespace-nowrap rounded-full border border-[var(--color-line)] bg-[var(--color-surface)] px-5 py-2.5 font-data text-[12.5px] text-[var(--color-ink-2)]"
                  >
                    {c.name}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["home.services.eyebrow"]}</p>
          <h2 className="mt-3 text-3xl font-extrabold text-[var(--color-ink)] sm:text-[2.4rem]">
            {t["home.services.title"]}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon] ?? Building2;
            return (
              <Link
                key={s.id}
                href={`/layanan#${s.id}`}
                className="group card-lift relative overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--color-yellow)] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-40"
                />
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-teal-soft)] text-[var(--color-teal-text)] transition-all duration-500 group-hover:rotate-[-6deg] group-hover:bg-[var(--color-teal)] group-hover:text-white">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <span className="font-data text-xs text-[var(--color-ink-3)]">0{i + 1}</span>
                </div>
                <h3 className="mt-5 text-[17px] font-bold text-[var(--color-ink)]">{s.nameId}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{s.shortId}</p>
                <span className="link-arrow mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--color-teal-text)]">
                  {t["home.services.more"]} <ArrowRight size={14} aria-hidden="true" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- Map ---------- */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
                {t["home.map.eyebrow"]}
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-ink)] sm:text-[2rem]">
                {t["home.map.title"]}
              </h2>
              <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-ink-2)]">
                {fill(t["home.map.body"], { kota: cities })}
              </p>
              <Link
                href="/proyek"
                className="mt-6 link-arrow inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-teal-text)]"
              >
                {t["home.map.link"]}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="h-[340px] w-full overflow-hidden rounded-2xl border border-[var(--color-line)] shadow-[var(--shadow-card)] sm:h-[420px]" data-no-reveal>
              <ProjectsMapClient projects={projects} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Featured projects ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
              {t["home.featured.eyebrow"]}
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-ink)] sm:text-[2rem]">
              {t["home.featured.title"]}
            </h2>
          </div>
          <Link href="/proyek" className="text-[14.5px] font-semibold text-[var(--color-teal-text)]">
            {t["home.featured.link"]}
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* ---------- Capacity + Legal ---------- */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2">
          <div className="card-lift rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7">
            <ShieldCheck size={24} className="text-[var(--color-teal)]" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[var(--color-ink)]">{t["home.capacity.title"]}</h3>
            <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
              {t["home.capacity.body"]}
            </p>
            <Link
              href="/kapasitas"
              className="mt-4 link-arrow inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-teal-text)]"
            >
              {t["home.capacity.link"]} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="card-lift rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7">
            <Award size={24} className="text-[var(--color-teal)]" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[var(--color-ink)]">{t["home.legal.title"]}</h3>
            <p className="mt-2 whitespace-pre-line text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
              {fill(t["home.legal.body"], { sbuBerlaku: sbuOk, sbuTotal, skorSmk3: settings.smk3.score })}
            </p>
            <Link
              href="/legalitas"
              className="mt-4 link-arrow inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-teal-text)]"
            >
              {t["home.legal.link"]} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Director ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-[var(--color-surface-2)] shadow-[var(--shadow-lift)] lg:aspect-[3/4]">
            <Image
              src="/images/about/1.jpeg"
              alt="Kantor PT. Bina Bangun Perkasa di Kediri"
              fill
              sizes="(min-width: 1024px) 340px, 90vw"
              className="object-cover transition-transform duration-[1.2s] hover:scale-105"
            />
          </div>
          <div>
            <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["home.director.eyebrow"]}</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl">
              {settings.director.name}
            </h2>
            <p className="text-[14.5px] text-[var(--color-ink-3)]">{settings.director.role}</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-2)]">
              {settings.director.bioId}
            </p>
            <Link
              href="/tentang"
              className="mt-5 link-arrow inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[var(--color-teal-text)]"
            >
              {t["home.director.link"]} <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[var(--color-panel-dark)] px-6 py-16 text-center sm:px-12 sm:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="spin-slow absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,240,0,0.14)_0deg_5deg,transparent_5deg_15deg)] [mask-image:radial-gradient(closest-side,#000,transparent)]" />
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--color-yellow)] opacity-90 blur-[2px]" />
            <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-[var(--color-teal)] opacity-40 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-black text-[var(--color-on-panel-dark)] sm:text-5xl">{t["home.cta.title"]}</h2>
            <p className="mx-auto mt-5 max-w-xl whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-on-panel-dark)]/75">
              {t["home.cta.body"]}
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                href="/hubungi"
                className="btn-yellow inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-bold"
              >
                {t["home.cta.button"]}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 px-7 py-3.5 text-[15px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
              >
                {t["home.cta.whatsapp"]}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
