import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProjects, getTexts } from "@/lib/repo";
import { fill } from "@/lib/texts";
import { categoryLabels } from "@/lib/categories";
import { countCities } from "@/lib/site";
import { ProjectCard } from "@/components/site/project-card";
import { ProjectsExplorer } from "@/components/site/projects-explorer";
import { PageHeader } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.proyek.title"], description: t["seo.proyek.description"], alternates: { canonical: "/proyek" } };
}

export default async function ProyekPage() {
  const [projects, categories, t] = await Promise.all([getProjects(), getCategories(), getTexts()]);
  const cities = countCities(projects);
  const labels = categoryLabels(categories);

  return (
    <>
      <PageHeader
        eyebrow={t["projects.eyebrow"]}
        title={fill(t["projects.title"], { jumlahProyek: projects.length, kota: cities })}
        intro={t["projects.intro"]}
      />
      <section id="sec-list" className="container-x pb-24">
        <Suspense
          fallback={
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} categoryLabel={labels[p.categories[0]] ?? "Proyek"} />
              ))}
            </div>
          }
        >
          <ProjectsExplorer
            projects={projects}
            categories={categories}
            texts={{ count: t["projects.count"], empty: t["projects.empty"], search: t["projects.search"] }}
          />
        </Suspense>
      </section>
    </>
  );
}
