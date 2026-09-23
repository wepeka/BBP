import { Field } from "@/components/admin/field";
import { SubmitButton } from "@/components/admin/submit-button";
import type { Client } from "@/lib/types";

export function ClientForm({
  action,
  client,
}: {
  action: (formData: FormData) => void | Promise<void>;
  client?: Client;
}) {
  return (
    <form action={action} className="space-y-5">
      <Field label="Nama Perusahaan" name="name" required defaultValue={client?.name} />
      <Field label="Catatan" name="note" defaultValue={client?.note ?? ""} placeholder="mis. Member of Panbil Group" />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Kota" name="city" required defaultValue={client?.city} />
        <Field label="Provinsi" name="province" required defaultValue={client?.province} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Klien sejak (tahun)" name="since" type="number" defaultValue={client?.since} />
        <Field label="Jumlah proyek" name="projectCount" type="number" defaultValue={client?.projectCount} />
      </div>
      <label className="flex items-center gap-2 text-[13.5px] font-medium text-[var(--color-ink)]">
        <input type="checkbox" name="flagship" defaultChecked={client?.flagship} className="h-4 w-4 rounded border-[var(--color-line-2)]" />
        Tampilkan sebagai klien utama (flagship)
      </label>
      <div className="border-t border-[var(--color-line)] pt-5">
        <SubmitButton>{client ? "Simpan Perubahan" : "Tambah Klien"}</SubmitButton>
      </div>
    </form>
  );
}
