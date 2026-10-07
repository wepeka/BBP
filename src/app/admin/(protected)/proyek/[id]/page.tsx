import { notFound } from "next/navigation";
import { getAllClients, getAllProjects, getCategories, getProjectById } from "@/lib/repo";
import { ProjectEditor } from "@/components/admin/project-editor";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectById(id);
  return { title: project?.titleId ?? "Proyek" };
}

export default async function AdminProyekEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [project, categories, clients, projects] = await Promise.all([getProjectById(id), getCategories(), getAllClients(), getAllProjects()]);
  if (!project) notFound();
  return (
    <ProjectEditor
      key={project.id}
      project={project}
      categories={categories}
      clients={clients}
      cities={Array.from(new Set(projects.map((p) => p.city))).sort()}
      provinces={Array.from(new Set(projects.map((p) => p.province))).sort()}
    />
  );
}
