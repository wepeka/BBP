import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";
import { getCategories, getProjects, getProjectBySlug, getSettings, getTexts } from "@/lib/repo";
import { categoryLabels } from "@/lib/categories";
import { distanceKm } from "@/lib/geo";
import { fill } from "@/lib/texts";
import { waLink } from "@/lib/site";
import { ProjectGallery } from "@/components/site/project-gallery";
import { ProjectCard } from "@/components/site/project-card";
import { LocationMapClient } from "@/components/site/location-map-loader";
import { VideoEmbed } from "@/components/site/video-embed";
import { parseVideoUrl } from "@/lib/video";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyek tidak ditemukan" };
  const description = `${project.scope} ${project.city}, ${project.province} · ${project.year}.`.trim();
  return {
    title: project.titleId,
    description,
    alternates: { canonical: `/proyek/${project.slug}` },
    openGraph: {
      title: project.titleId,
      description,
      type: "article",
      ...(project.images[0] ? { images: [{ url: project.images[0], alt: project.titleId }] } : {}),
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, allProjects, settings, categories, t] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getSettings(),
    getCategories(),
    getTexts(),
  ]);
  if (!project) notFound();

  const labels = categoryLabels(categories);
  const labelOf = (id: string | undefined) => (id ? labels[id] ?? id : "Proyek");

  const related = allProjects
    .filter((p) => p.id !== project.id && (p.categories.some((c) => project.categories.includes(c)) || (project.client && p.client === project.client)))
    .slice(0, 3);
  const idx = allProjects.findIndex((p) => p.id === project.id);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  const video = parseVideoUrl(project.videoUrl);
  const hasCoords = Boolean(project.lat || project.lng);
  const distance = hasCoords ? Math.round(distanceKm(settings.officeLat, settings.officeLng, project.lat, project.lng)) : null;
  const paragraphs = project.descriptionId.split(/\n\s*\n/).filter((p) => p.trim());

  type Cell = { label: string; value: React.ReactNode };
  const rows: Cell[][] = [];
  if (project.client) {
    rows.push([
      {
        label: "Klien",
        value: (
          <>
            {project.client}
            {project.clientNote && <span className="block text-[12px] font-normal text-[var(--color-ink-3)]">{project.clientNote}</span>}
          </>
        ),
      },
    ]);
  }
  rows.push([
    { label: "Lokasi", value: `${project.city}, ${project.province}` },
    { label: "Periode", value: project.year },
  ]);
  rows.push([
    { label: "Status", value: project.status === "berjalan" ? "Sedang berjalan" : "Selesai" },
    { label: "Kategori", value: project.categories.map((c) => labelOf(c)).join(", ") },
  ]);
  const extra = [
    project.area ? { label: "Luas / volume", value: project.area } : null,
    project.duration ? { label: "Durasi", value: project.duration } : null,
  ].filter(Boolean) as Cell[];
  if (extra.length) rows.push(extra);
  const facts = (project.facts ?? []).filter((f) => f.label.trim() && f.value.trim());
  for (let i = 0; i < facts.length; i += 2) rows.push(facts.slice(i, i + 2).map((f) => ({ label: f.label, value: f.value })));
  if (project.scope) rows.push([{ label: "Lingkup", value: project.scope }]);

  return (
    <>
      <div className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="container-x py-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-3)]">
            <Link href="/" className="hover:text-[var(--color-ink)]">Beranda</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href="/proyek" className="hover:text-[var(--color-ink)]">{t["common.nav.proyek"]}</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="truncate text-[var(--color-ink-2)]">{project.titleId}</span>
          </nav>
        </div>
      </div>

      <section className="container-x py-10 sm:py-14">
        <div className="hero-in flex flex-wrap items-center gap-2" data-no-reveal>
          {project.categories.map((c) => (
            <Link
              key={c}
              href={`/proyek?kategori=${c}`}
              className="rounded-[4px] bg-[var(--color-teal-soft)] px-2.5 py-1 font-data text-[11px] uppercase tracking-wider text-[var(--color-teal-text)] hover:bg-[var(--color-teal)] hover:text-white"
            >
              {labelOf(c)}
            </Link>
          ))}
          {project.status === "berjalan" && (
            <span className="rounded-[4px] bg-[var(--color-yellow)] px-2.5 py-1 font-data text-[11px] uppercase tracking-wider text-[#17181a]">Sedang berjalan</span>
          )}
        </div>
        <h1 className="h-page hero-in mt-5 max-w-4xl text-[var(--color-ink)]" style={{ "--d": "60ms" } as React.CSSProperties} data-no-reveal>
          {project.titleId}
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div data-no-reveal className="space-y-6">
            <ProjectGallery images={project.images} alt={project.titleId} />
            {video && (
              <div>
                <p className="mb-3 font-data text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{t["project.video"]}</p>
                <VideoEmbed video={video} title={project.titleId} />
              </div>
            )}
          </div>

          <aside data-no-reveal className="lg:sticky lg:top-24">
            <p className="font-data text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{t["project.sheet"]}</p>
            <div className="tblock mt-3 rounded-[6px]" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {rows.flatMap((row, r) =>
                row.map((cell, c) => {
                  const last = r === rows.length - 1;
                  const cls = [row.length === 1 ? "tb-full" : c === row.length - 1 ? "tb-end" : "", last ? "tb-last" : ""].join(" ");
                  return (
                    <div key={`${r}-${c}`} className={cls}>
                      <span className="tb-label">{cell.label}</span>
                      <span className="tb-value">{cell.value}</span>
                    </div>
                  );
                })
              )}
            </div>
            {hasCoords && (
              <>
                <div className="mt-4 h-[170px] w-full overflow-hidden rounded-[6px] border border-[var(--color-line)]">
                  <LocationMapClient lat={project.lat} lng={project.lng} />
                </div>
                {distance !== null && distance > 1 && (
                  <p className="mt-2 font-data text-[12px] text-[var(--color-ink-3)]">≈ {distance.toLocaleString("id-ID")} km dari kantor pusat BBP, {settings.city}</p>
                )}
              </>
            )}
          </aside>
        </div>

        <div className="mt-12 max-w-3xl space-y-4 text-[16.5px] leading-relaxed text-[var(--color-ink-2)]">
          {paragraphs.map((para, i) =>
            para.trim().startsWith("•") ? (
              <ul key={i} className="space-y-2">
                {para
                  .split("\n")
                  .filter(Boolean)
                  .map((line, j) => (
                    <li key={j} className="flex gap-2.5">
                      <span className="mt-[11px] h-1.5 w-1.5 shrink-0 bg-[var(--color-teal)]" aria-hidden="true" />
                      {line.replace(/^•\s*/, "")}
                    </li>
                  ))}
              </ul>
            ) : (
              <p key={i} className="whitespace-pre-line">{para}</p>
            )
          )}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-[8px] bg-[var(--color-panel-dark)] p-7 sm:flex-row sm:items-center sm:p-9">
          <p className="max-w-xl font-[family-name:var(--font-display)] text-xl font-bold text-[var(--color-on-panel-dark)]">
            {fill(t["project.cta.title"], { kategori: labelOf(project.categories[0]).toLowerCase() })}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/hubungi" className="btn btn-yellow">
              {t["project.cta.button"]} <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={waLink(settings.whatsapp, `Halo BBP, saya tertarik dengan proyek "${project.titleId}".`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-light"
            >
              {t["home.cta.whatsapp"]}
            </a>
          </div>
        </div>

        {(prev || next) && (
          <nav aria-label="Proyek lain" className="mt-10 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/proyek/${prev.slug}`} className="card group p-5 hover:border-[var(--color-teal)]">
                <span className="inline-flex items-center gap-1.5 font-data text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
                  <ArrowLeft size={13} aria-hidden="true" /> Sebelumnya
                </span>
                <span className="mt-1.5 block font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal-text)]">{prev.titleId}</span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link href={`/proyek/${next.slug}`} className="card group p-5 text-right hover:border-[var(--color-teal)]">
                <span className="inline-flex items-center gap-1.5 font-data text-[11px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">
                  Berikutnya <ArrowRight size={13} aria-hidden="true" />
                </span>
                <span className="mt-1.5 block font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-teal-text)]">{next.titleId}</span>
              </Link>
            )}
          </nav>
        )}
      </section>

      {related.length > 0 && (
        <section className="border-t border-[var(--color-line)] bg-[var(--color-band-2)] py-16">
          <div className="container-x">
            <h2 className="h-section text-[var(--color-ink)]">{t["project.related"]}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} categoryLabel={labelOf(p.categories[0])} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
