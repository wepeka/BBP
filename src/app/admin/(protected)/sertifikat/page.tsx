import { Download } from "lucide-react";
import { getCertificates } from "@/lib/repo";
import { PageHeader, Card } from "@/components/admin/field";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateCertificateAction } from "@/app/admin/(protected)/sertifikat/actions";
import type { Certificate } from "@/lib/types";

export const metadata = { title: "Sertifikat — Admin" };

const GROUP_LABELS: Record<Certificate["group"], string> = {
  legalitas: "Legalitas Perusahaan",
  sbu: "Sertifikat Badan Usaha (SBU)",
  sistem_manajemen: "Sistem Manajemen",
  keanggotaan: "Keanggotaan",
};

export default async function AdminSertifikatPage() {
  const certificates = await getCertificates();
  const groups = Array.from(new Set(certificates.map((c) => c.group)));

  return (
    <div>
      <PageHeader
        title="Sertifikat & Legalitas"
        description="Perbarui status masa berlaku dan unggah berkas PDF. Perubahan langsung tampil di halaman Legalitas."
      />
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group}>
            <h2 className="font-data text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-3)]">
              {GROUP_LABELS[group]}
            </h2>
            <div className="mt-3 space-y-3">
              {certificates
                .filter((c) => c.group === group)
                .map((c) => (
                  <Card key={c.id}>
                    <form action={updateCertificateAction.bind(null, c.id)} className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-end">
                      <div>
                        <p className="font-semibold text-[var(--color-ink)]">{c.name}</p>
                        <p className="font-data text-[12.5px] text-[var(--color-ink-3)]">
                          {c.number ? `No. ${c.number} · ` : ""}
                          {c.issuer}
                        </p>
                        {c.fileUrl && (
                          <a
                            href={c.fileUrl}
                            className="mt-1 inline-flex items-center gap-1 text-[12px] text-[var(--color-teal-text)]"
                          >
                            <Download size={11} aria-hidden="true" /> Berkas saat ini
                          </a>
                        )}
                      </div>
                      <div>
                        <label htmlFor={`status-${c.id}`} className="text-[12.5px] font-medium text-[var(--color-ink)]">
                          Status
                        </label>
                        <select
                          id={`status-${c.id}`}
                          name="status"
                          defaultValue={c.status}
                          className="mt-1 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3 py-2 text-[13.5px] text-[var(--color-ink)]"
                        >
                          <option value="berlaku">Berlaku</option>
                          <option value="perlu_verifikasi">Perlu Verifikasi</option>
                          <option value="kedaluwarsa">Kedaluwarsa</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`note-${c.id}`} className="text-[12.5px] font-medium text-[var(--color-ink)]">
                          Catatan
                        </label>
                        <input
                          id={`note-${c.id}`}
                          name="note"
                          defaultValue={c.note ?? ""}
                          className="mt-1 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3 py-2 text-[13.5px] text-[var(--color-ink)]"
                        />
                        <label htmlFor={`file-${c.id}`} className="mt-2 block text-[11.5px] text-[var(--color-ink-3)]">
                          Unggah PDF baru
                        </label>
                        <input
                          id={`file-${c.id}`}
                          name="file"
                          type="file"
                          accept="application/pdf"
                          className="mt-1 block w-full text-[12px] text-[var(--color-ink-2)] file:mr-2 file:rounded file:border-0 file:bg-[var(--color-teal-soft)] file:px-2 file:py-1 file:text-[11.5px] file:font-medium file:text-[var(--color-teal-text)]"
                        />
                      </div>
                      <SubmitButton className="h-fit">Simpan</SubmitButton>
                    </form>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
