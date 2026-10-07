import { getAllClients, getAllProjects, getCategories } from "@/lib/repo";
import { ProjectEditor } from "@/components/admin/project-editor";

export const metadata = { title: "Proyek Baru" };

export default async function AdminProyekBaruPage() {
  const [categories, clients, projects] = await Promise.all([getCategories(), getAllClients(), getAllProjects()]);
  return (
    <ProjectEditor
      categories={categories}
      clients={clients}
      cities={Array.from(new Set(projects.map((p) => p.city))).sort()}
      provinces={Array.from(new Set(projects.map((p) => p.province))).sort()}
    />
  );
}
