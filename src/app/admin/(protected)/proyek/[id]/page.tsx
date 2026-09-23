import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { getProjectById } from "@/lib/repo";
import { PageHeader, Card } from "@/components/admin/field";
import { ProjectForm } from "@/components/admin/project-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { updateProjectAction, deleteProjectAction } from "@/app/admin/(protected)/proyek/actions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  return { title: project?.titleId ?? "Proyek" };
}

export default async function AdminProyekEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  const boundUpdate = updateProjectAction.bind(null, project.id);

  return (
    <div>
      <PageHeader
        title={project.titleId}
        description={`/proyek/${project.slug}`}
        action={
          <div className="flex items-center gap-2">
            <Link
              href={`/proyek/${project.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-line-2)] px-3 py-2 text-[13px] font-medium text-[var(--color-ink)]"
            >
              <ExternalLink size={14} aria-hidden="true" /> Lihat halaman
            </Link>
            <DeleteButton
              action={deleteProjectAction.bind(null, project.id)}
              confirmText={`Hapus proyek "${project.titleId}"? Tindakan ini tidak bisa dibatalkan.`}
              label="Hapus Proyek"
            />
          </div>
        }
      />
      <Card className="max-w-3xl">
        <ProjectForm action={boundUpdate} project={project} />
      </Card>
    </div>
  );
}
