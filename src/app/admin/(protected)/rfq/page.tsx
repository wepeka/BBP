import { Mail, MessageCircle } from "lucide-react";
import { getRfqEntries, getServices } from "@/lib/repo";
import { PageHeader, Card } from "@/components/admin/field";
import { SubmitButton } from "@/components/admin/submit-button";
import { RfqStatusSelect } from "@/components/admin/rfq-status-select";
import { updateRfqStatusAction, updateRfqNoteAction } from "@/app/admin/(protected)/rfq/actions";

export const metadata = { title: "Inbox RFQ — Admin" };

export default async function AdminRfqPage() {
  const [entries, services] = await Promise.all([getRfqEntries(), getServices()]);
  const serviceName = (id: string | null) => services.find((s) => s.id === id)?.nameId ?? "—";

  return (
    <div>
      <PageHeader title="Inbox RFQ" description={`${entries.length} permintaan penawaran`} />

      {entries.length === 0 ? (
        <Card>
          <p className="text-[14px] text-[var(--color-ink-2)]">Belum ada permintaan penawaran masuk.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((r) => (
            <Card key={r.id}>
              <details>
                <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--color-ink)]">
                      {r.company || r.name}
                      {r.company && <span className="ml-2 font-normal text-[var(--color-ink-3)]">{r.name}</span>}
                    </p>
                    <p className="mt-0.5 text-[13px] text-[var(--color-ink-2)]">
                      {r.location} · {serviceName(r.serviceId)} ·{" "}
                      {new Date(r.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <RfqStatusSelect action={updateRfqStatusAction.bind(null, r.id)} defaultValue={r.status} />
                </summary>

                <div className="mt-4 grid gap-4 border-t border-[var(--color-line)] pt-4 sm:grid-cols-2">
                  <div className="space-y-2 font-data text-[13px] text-[var(--color-ink-2)]">
                    <p>
                      <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 text-[var(--color-teal-text)]">
                        <Mail size={13} aria-hidden="true" /> {r.email}
                      </a>
                    </p>
                    <p>
                      <a
                        href={`https://wa.me/${r.whatsapp.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[var(--color-teal-text)]"
                      >
                        <MessageCircle size={13} aria-hidden="true" /> {r.whatsapp}
                      </a>
                    </p>
                    {r.areaEstimate && <p>Perkiraan luas: {r.areaEstimate} m²</p>}
                    {r.targetStart && <p>Target mulai: {r.targetStart}</p>}
                  </div>
                  {r.message && (
                    <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">{r.message}</p>
                  )}
                </div>

                <form action={updateRfqNoteAction.bind(null, r.id)} className="mt-4 flex flex-wrap items-end gap-3 border-t border-[var(--color-line)] pt-4">
                  <div className="min-w-[220px] flex-1">
                    <label htmlFor={`note-${r.id}`} className="text-[12.5px] font-medium text-[var(--color-ink)]">
                      Catatan internal
                    </label>
                    <input
                      id={`note-${r.id}`}
                      name="internalNote"
                      defaultValue={r.internalNote ?? ""}
                      placeholder="Tidak terlihat oleh pengunjung"
                      className="mt-1 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3 py-2 text-[13.5px] text-[var(--color-ink)]"
                    />
                  </div>
                  <SubmitButton>Simpan Catatan</SubmitButton>
                </form>
              </details>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
