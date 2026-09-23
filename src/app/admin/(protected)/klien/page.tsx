import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import { getClients } from "@/lib/repo";
import { PageHeader } from "@/components/admin/field";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteClientAction } from "@/app/admin/(protected)/klien/actions";

export const metadata = { title: "Klien — Admin" };

export default async function AdminKlienPage() {
  const clients = await getClients();

  return (
    <div>
      <PageHeader
        title="Klien"
        description={`${clients.length} klien terdaftar`}
        action={
          <Link
            href="/admin/klien/baru"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-teal)] px-4 py-2.5 text-[13.5px] font-semibold text-[var(--color-on-teal)]"
          >
            <Plus size={15} aria-hidden="true" /> Tambah Klien
          </Link>
        }
      />
      <div className="overflow-x-auto rounded-md border border-[var(--color-line)] bg-[var(--color-surface)]">
        <table className="w-full min-w-[560px] border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-surface-2)] text-left font-data text-[11px] uppercase tracking-wide text-[var(--color-ink-3)]">
              <th className="px-4 py-3">Nama</th>
              <th className="px-4 py-3">Kota</th>
              <th className="px-4 py-3">Sejak</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id} className="border-b border-[var(--color-line)] last:border-0">
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]">
                    {c.flagship && <Star size={13} className="fill-[var(--color-yellow)] text-[var(--color-yellow)]" aria-hidden="true" />}
                    {c.name}
                  </span>
                  {c.note && <span className="block text-[12px] text-[var(--color-ink-3)]">{c.note}</span>}
                </td>
                <td className="px-4 py-3 text-[var(--color-ink-2)]">{c.city}</td>
                <td className="px-4 py-3 font-data text-[var(--color-ink-2)]">{c.since ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/klien/${c.id}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[var(--color-line-2)] px-3 py-1.5 text-[12.5px] font-medium text-[var(--color-ink)]"
                    >
                      <Pencil size={13} aria-hidden="true" /> Edit
                    </Link>
                    <DeleteButton
                      action={deleteClientAction.bind(null, c.id)}
                      confirmText={`Hapus klien "${c.name}"?`}
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
