import { PageHeader, Card } from "@/components/admin/field";
import { ProjectForm } from "@/components/admin/project-form";
import { createProjectAction } from "@/app/admin/(protected)/proyek/actions";

export const metadata = { title: "Proyek Baru — Admin" };

export default function AdminProyekBaruPage() {
  return (
    <div>
      <PageHeader title="Proyek Baru" description="Isi detail proyek, lalu terbitkan." />
      <Card className="max-w-3xl">
        <ProjectForm action={createProjectAction} />
      </Card>
    </div>
  );
}
