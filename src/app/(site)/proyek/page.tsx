import type { Metadata } from "next";
import { Suspense } from "react";
import { getProjects, getTexts } from "@/lib/repo";
import { fill } from "@/lib/texts";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectFilters } from "@/components/site/project-filters";
import { ProjectsMapClient } from "@/components/site/projects-map-loader";

export const metadata: Metadata = { title: "Referensi Proyek" };

export default async function ProyekPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; kota?: string; status?: string }>;
}) {
  const params = await searchParams;
  const [allProjects, t] = await Promise.all([getProjects(), getTexts()]);

  const categories = (params.kategori ?? "").split(",").filter(Boolean);
  const city = params.kota ?? "";
  const status = params.status ?? "";

  const filtered = allProjects.filter((p) => {
    if (categories.length && !categories.some((c) => p.categories.includes(c))) return false;
    if (city && p.city !== city) return false;
    if (status && p.status !== status) return false;
    return true;
  });

  const cities = Array.from(new Set(allProjects.map((p) => p.city))).sort();

  return (
    <>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["projects.eyebrow"]}</p>
          <h1 className="mt-2 max-w-2xl text-[clamp(1.8rem,3.4vw,2.5rem)] font-extrabold text-[var(--color-ink)]">
            {fill(t["projects.title"], { jumlahProyek: allProjects.length, kota: cities.length })}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <Suspense fallback={<div className="h-[220px] rounded-md border border-[var(--color-line)] bg-[var(--color-surface)]" />}>
            <ProjectFilters cities={cities} />
          </Suspense>
          <div className="h-[300px] w-full sm:h-[340px]">
            <ProjectsMapClient projects={allProjects} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="mb-5 text-[14px] text-[var(--color-ink-2)]">
          {fill(t["projects.count"], { jumlah: filtered.length })}
        </p>
        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-[var(--color-line-2)] p-12 text-center text-[15px] text-[var(--color-ink-2)]">
            {t["projects.empty"]}
          </div>
        )}
      </section>
    </>
  );
}
