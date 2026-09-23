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
import { getSettings, getServices, getClients, getProjects, getCertificates } from "@/lib/repo";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectsMapClient } from "@/components/site/projects-map-loader";

const SERVICE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  "building-2": Building2,
  factory: Factory,
  layers: Layers,
  zap: Zap,
  map: MapIcon,
  package: Package,
};

export default async function HomePage() {
  const [settings, services, clients, projects, certificates] = await Promise.all([
    getSettings(),
    getServices(),
    getClients(),
    getProjects(),
    getCertificates(),
  ]);

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
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="font-data text-xs uppercase tracking-[0.16em] text-[var(--color-teal-text)]">
              General Contractor &amp; Supplier · Kediri, Jawa Timur
            </p>
            <h1 className="mt-4 text-[clamp(2rem,4.4vw,3.25rem)] font-extrabold leading-[1.08] text-[var(--color-teal-text)]">
              {settings.heroHeadlineId}
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--color-ink-2)]">
              {settings.heroSubheadId}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/hubungi"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--color-teal)] px-6 py-3.5 text-[15px] font-semibold text-[var(--color-on-teal)] transition-colors hover:bg-[var(--color-teal-deep)]"
              >
                Kirim Rencana Proyek Anda
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
              <Link
                href="/proyek"
                className="inline-flex items-center gap-2 rounded-md border border-[var(--color-line-2)] px-6 py-3.5 text-[15px] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-surface-2)]"
              >
                Lihat Proyek Kami
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md lg:aspect-[5/4]">
            <Image
              src={heroImage}
              alt="Rangka struktur baja proyek gudang industri BBP"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* stat strip */}
        <div className="border-t border-[var(--color-line)]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
            {[
              [`${settings.stats.yearsActive}+`, "tahun beroperasi"],
              [`${cities}`, "kota di Indonesia"],
              [`${settings.stats.projects}+`, "referensi pekerjaan"],
              [`${settings.stats.clients}`, "klien korporat"],
            ].map(([n, l], i) => (
              <div
                key={l}
                className={`px-5 py-6 sm:px-7 ${i !== 0 ? "border-l border-[var(--color-line)]" : ""} ${
                  i === 2 ? "border-l" : ""
                }`}
              >
                <div className="font-[family-name:var(--font-display)] text-3xl font-extrabold tabular-nums text-[var(--color-teal-text)] sm:text-4xl">
                  {n}
                </div>
                <div className="mt-1 text-[13.5px] text-[var(--color-ink-2)]">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Trusted by ---------- */}
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-data text-center text-xs uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
            Dipercaya berulang oleh klien industri &amp; instansi
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {flagshipClient && (
              <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[var(--color-ink)] sm:text-2xl">
                {flagshipClient.name}
                <span className="ml-2 align-middle font-data text-[11px] font-normal uppercase tracking-wide text-[var(--color-teal-text)]">
                  {flagshipClient.projectCount}+ proyek sejak {flagshipClient.since}
                </span>
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 opacity-80">
            {otherClients.map((c) => (
              <span key={c.id} className="font-data text-[12.5px] text-[var(--color-ink-2)]">
                {c.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Services ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Layanan</p>
          <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-ink)] sm:text-[2rem]">
            Satu kontraktor, dari fabrikasi sampai serah terima
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = SERVICE_ICONS[s.icon] ?? Building2;
            return (
              <Link
                key={s.id}
                href={`/layanan#${s.id}`}
                className="group rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-6 transition-colors hover:border-[var(--color-teal)]"
              >
                <Icon size={26} className="text-[var(--color-teal)]" aria-hidden="true" />
                <h3 className="mt-4 text-[16.5px] font-semibold text-[var(--color-ink)]">{s.nameId}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[var(--color-ink-2)]">{s.shortId}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- Map ---------- */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface-2)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
                Jejak Proyek Nasional
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-ink)] sm:text-[2rem]">
                Dari Kediri, mengerjakan proyek se-Indonesia
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
                Dari depo rokok di Kupang hingga gudang baja di Batam, BBP telah menyelesaikan
                pekerjaan di {cities} kota — sebagian besar untuk klien yang kembali memakai jasa
                BBP di lokasi berikutnya.
              </p>
              <Link
                href="/proyek"
                className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--color-teal-text)]"
              >
                Jelajahi semua proyek
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="h-[340px] w-full sm:h-[420px]">
              <ProjectsMapClient projects={projects} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Featured projects ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">
              Proyek Unggulan
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--color-ink)] sm:text-[2rem]">
              Sebagian pekerjaan yang telah kami selesaikan
            </h2>
          </div>
          <Link href="/proyek" className="text-[14.5px] font-semibold text-[var(--color-teal-text)]">
            Semua proyek →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* ---------- Capacity + Legal ---------- */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-surface-2)] py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-2">
          <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-7">
            <ShieldCheck size={24} className="text-[var(--color-teal)]" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[var(--color-ink)]">Kapasitas Alat &amp; Workshop</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
              Rough-terrain crane 25 ton, 4 unit excavator, workshop fabrikasi baja 2.400 m² dengan
              akses trailer 40 ft.
            </p>
            <Link
              href="/kapasitas"
              className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-teal-text)]"
            >
              Lihat detail alat <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-7">
            <Award size={24} className="text-[var(--color-teal)]" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[var(--color-ink)]">Legalitas &amp; Sertifikasi</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
              NIB terverifikasi, {sbuOk}/{sbuTotal} SBU M1 dalam status berlaku, ISO 9001, dan SMK3
              dengan skor {settings.smk3.score}%.
            </p>
            <Link
              href="/legalitas"
              className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[var(--color-teal-text)]"
            >
              Lihat &amp; unduh dokumen <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Director ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-[var(--color-surface-2)] lg:aspect-[3/4]">
            <Image
              src="/images/about/1.jpeg"
              alt="Kantor PT. Bina Bangun Perkasa di Kediri"
              fill
              sizes="(min-width: 1024px) 340px, 90vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Direktur</p>
            <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl">
              {settings.director.name}
            </h2>
            <p className="text-[14.5px] text-[var(--color-ink-3)]">{settings.director.role}</p>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-ink-2)]">
              {settings.director.bioId}
            </p>
            <Link
              href="/tentang"
              className="mt-5 inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-[var(--color-teal-text)]"
            >
              Selengkapnya tentang BBP <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="bg-[var(--color-panel-dark)] py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-extrabold text-[var(--color-on-panel-dark)] sm:text-4xl">
            Ceritakan proyek Anda
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-[var(--color-on-panel-dark)]/70">
            Struktur beton, fabrikasi baja, MEP, atau pengadaan — tim BBP membalas permintaan
            penawaran dalam 1 hari kerja.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/hubungi"
              className="rounded-md bg-[var(--color-yellow)] px-7 py-3.5 text-[15px] font-semibold text-[var(--color-yellow-ink)] transition-opacity hover:opacity-90"
            >
              Kirim Rencana Proyek Anda
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-white/30 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
