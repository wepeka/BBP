import { getAllProjects, getCategories } from "@/lib/repo";
import { categoryLabels } from "@/lib/categories";
import { ProjectsTable } from "@/components/admin/projects-table";
import { PageHeader } from "@/components/admin/ui";

export const metadata = { title: "Proyek" };

export default async function AdminProyekPage() {
  const [projects, categories] = await Promise.all([getAllProjects(), getCategories()]);
  return (
    <div>
      <PageHeader
        eyebrow="Konten"
        title="Proyek"
        description={`${projects.length} proyek · ${projects.filter((p) => !p.hidden).length} tampil di website. Klik bintang untuk menjadikan unggulan, ikon mata untuk menampilkan/menyembunyikan.`}
      />
      <ProjectsTable projects={projects} labels={categoryLabels(categories)} />
    </div>
  );
}
