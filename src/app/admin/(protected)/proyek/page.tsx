import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { getProjects } from "@/lib/repo";
import { PageHeader } from "@/components/admin/field";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProjectAction } from "@/app/admin/(protected)/proyek/actions";

export const metadata = { title: "Proyek — Admin" };

export default async function AdminProyekPage() {
  const projects = await getProjects();

  return (
    <div>
      <PageHeader
        title="Proyek"
        description={`${projects.length} proyek terdaftar`}
        action={
          <Link
            href="/admin/proyek/baru"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-teal)] px-4 py-2.5 text-[13.5px] font-semibold text-[var(--color-on-teal)]"
          >
            <Plus size={15} aria-hidden="true" /> Proyek Baru
          </Link>
        }
      />

      <div className="overflow-x-auto rounded-md border border-[var(--color-line)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[720px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] text-left font-data text-[11px] uppercase tracking-wide text-[var(--color-ink-3)]">
              <th className="px-4 py-3">Proyek</th>
              <th className="px-4 py-3">Kota</th>
              <th className="px-4 py-3">Tahun</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Foto</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-[var(--color-line)] last:border-0">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]">
                    {p.featured && <Star size={13} className="fill-[var(--color-yellow)] text-[var(--color-yellow)]" aria-hidden="true" />}
                    {p.titleId}
                  </span>
                  {p.client && <span className="block text-[12px] text-[var(--color-ink-3)]">{p.client}</span>}
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-2)]">{p.city}</td>
                <td className="px-4 py-3 font-data text-[var(--color-ink-2)]">{p.year}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 font-data text-[10.5px] uppercase ${
                      p.status === "berjalan"
                        ? "bg-[var(--color-yellow)] text-[var(--color-yellow-ink)]"
                        : "bg-[var(--color-surface-2)] text-[var(--color-ink-2)]"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-2)]">
                  {p.images.length === 0 ? (
                    <span className="text-[var(--color-yellow-ink)]">Belum ada</span>
                  ) : (
                    `${p.images.length} foto`
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/proyek/${p.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-line-2)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)]"
                    >
                      <Pencil size={13} aria-hidden="true" /> Edit
                    </Link>
                    <DeleteButton
                      action={deleteProjectAction.bind(null, p.id)}
                      confirmText={`Hapus proyek "${p.titleId}"? Tindakan ini tidak bisa dibatalkan.`}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
