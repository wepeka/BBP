import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, Calendar, Building, ArrowRight } from "lucide-react";
import { getProjects, getProjectBySlug, getSettings } from "@/lib/repo";
import { categoryLabel } from "@/lib/categories";
import { distanceKm } from "@/lib/geo";
import { ProjectGallery } from "@/components/site/project-gallery";
import { ProjectCard } from "@/components/site/project-card";
import { LocationMapClient } from "@/components/site/location-map-loader";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Proyek tidak ditemukan" };
  return {
    title: project.titleId,
    description: project.scope,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects, settings] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getSettings(),
  ]);

  if (!project) notFound();

  const related = allProjects
    .filter(
      (p) =>
        p.id !== project.id &&
        (p.categories.some((c) => project.categories.includes(c)) || p.client === project.client)
    )
    .slice(0, 3);

  const distance = Math.round(distanceKm(settings.officeLat, settings.officeLng, project.lat, project.lng));
  const paragraphs = project.descriptionId.split("\n\n");

  return (
    <>
      <div className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[var(--color-ink-3)]">
            <Link href="/" className="hover:text-[var(--color-ink)]">
              Beranda
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <Link href="/proyek" className="hover:text-[var(--color-ink)]">
              Proyek
            </Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span className="truncate text-[var(--color-ink-2)]">{project.titleId}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-wrap items-center gap-2">
          {project.categories.map((c) => (
            <span
              key={c}
              className="rounded-full bg-[var(--color-teal-soft)] px-3 py-1 font-data text-[11px] uppercase tracking-wide text-[var(--color-teal-text)]"
            >
              {categoryLabel(c)}
            </span>
          ))}
          {project.status === "berjalan" && (
            <span className="rounded-full bg-[var(--color-yellow)] px-3 py-1 font-data text-[11px] uppercase tracking-wide text-[var(--color-yellow-ink)]">
              Sedang Berjalan
            </span>
          )}
        </div>
        <h1 className="mt-4 max-w-3xl text-[clamp(1.6rem,3.2vw,2.4rem)] font-extrabold leading-tight text-[var(--color-ink)]">
          {project.titleId}
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <ProjectGallery images={project.images} alt={project.titleId} />

          <aside className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
            <h2 className="font-data text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink-3)]">
              Lembar Data
            </h2>
            <dl className="mt-4 space-y-4 font-data text-[13.5px]">
              {project.client && (
                <div>
                  <dt className="flex items-center gap-1.5 text-[var(--color-ink-3)]">
                    <Building size={14} aria-hidden="true" /> Klien
                  </dt>
                  <dd className="mt-0.5 text-[var(--color-ink)]">
                    {project.client}
                    {project.clientNote && (
                      <span className="block text-[12px] text-[var(--color-ink-3)]">{project.clientNote}</span>
                    )}
                  </dd>
                </div>
              )}
              <div>
                <dt className="flex items-center gap-1.5 text-[var(--color-ink-3)]">
                  <MapPin size={14} aria-hidden="true" /> Lokasi
                </dt>
                <dd className="mt-0.5 text-[var(--color-ink)]">
                  {project.city}, {project.province}
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-[var(--color-ink-3)]">
                  <Calendar size={14} aria-hidden="true" /> Periode
                </dt>
                <dd className="mt-0.5 text-[var(--color-ink)]">{project.year}</dd>
              </div>
              <div>
                <dt className="text-[var(--color-ink-3)]">Lingkup</dt>
                <dd className="mt-0.5 leading-relaxed text-[var(--color-ink)]">{project.scope}</dd>
              </div>
            </dl>

            <div className="mt-5 h-[160px] w-full">
              <LocationMapClient lat={project.lat} lng={project.lng} />
            </div>
            <p className="mt-2 font-data text-[12px] text-[var(--color-ink-3)]">
              ≈ {distance} km dari kantor pusat BBP, Kediri
            </p>
          </aside>
        </div>

        <div className="mt-10 max-w-3xl space-y-4 text-[15.5px] leading-relaxed text-[var(--color-ink-2)]">
          {paragraphs.map((para, i) =>
            para.trim().startsWith("•") ? (
              <ul key={i} className="list-disc space-y-1.5 pl-5">
                {para
                  .split("\n")
                  .filter(Boolean)
                  .map((line, j) => (
                    <li key={j}>{line.replace(/^•\s*/, "")}</li>
                  ))}
              </ul>
            ) : (
              <p key={i}>{para}</p>
            )
          )}
        </div>

        <div className="mt-10 rounded-md bg-[var(--color-panel-dark)] p-7 sm:p-8">
          <p className="text-lg font-bold text-[var(--color-on-panel-dark)]">
            Butuh pekerjaan {categoryLabel(project.categories[0]).toLowerCase()} seperti ini?
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/hubungi"
              className="inline-flex items-center gap-2 rounded-md bg-[var(--color-yellow)] px-5 py-3 text-[14.5px] font-semibold text-[var(--color-yellow-ink)]"
            >
              Kirim Rencana Proyek Anda <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-[14.5px] font-semibold text-white"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-[var(--color-line)] bg-[var(--color-surface-2)] py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="text-xl font-bold text-[var(--color-ink)]">Proyek serupa</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
