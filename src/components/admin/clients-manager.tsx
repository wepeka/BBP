"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { Client } from "@/lib/types";
import { deleteClientAction, reorderClientsAction, saveClientAction, type ClientFormData } from "@/app/admin/(protected)/klien/actions";
import { useAdmin } from "./admin-context";
import { Modal, RowControls, Toggle, moveItem, useSortable } from "./controls";
import { SingleImage } from "./image-field";
import { Badge, EmptyState, FieldShell, buttonClass, inputClass } from "./ui";

const toForm = (c?: Client | null): ClientFormData => ({
  name: c?.name ?? "",
  note: c?.note ?? "",
  city: c?.city ?? "",
  province: c?.province ?? "",
  since: c?.since ? String(c.since) : "",
  projectCount: c?.projectCount ? String(c.projectCount) : "",
  flagship: c?.flagship ?? false,
  logo: c?.logo ?? null,
  website: c?.website ?? "",
  hidden: c?.hidden ?? false,
});

export function ClientsManager({ clients: initial, projectCounts }: { clients: Client[]; projectCounts: Record<string, number> }) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const [clients, setClients] = useState(initial);
  const [editing, setEditing] = useState<{ id: string | null; form: ClientFormData } | null>(null);
  const [saving, startSaving] = useTransition();
  const { rowProps } = useSortable(clients, setClients);

  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setClients(initial);
  }
  const orderChanged = clients.map((c) => c.id).join() !== initial.map((c) => c.id).join();

  function save() {
    if (!editing) return;
    startSaving(async () => {
      const res = await saveClientAction(editing.id, editing.form);
      if (!res.ok) return toast(res.error, "error");
      toast(editing.id ? "Klien diperbarui." : "Klien ditambahkan.");
      setEditing(null);
      router.refresh();
    });
  }

  async function remove(c: Client) {
    const ok = await confirm({ title: `Hapus ${c.name}?`, body: "Klien akan hilang dari Beranda dan halaman Klien. Proyeknya tidak ikut terhapus.", confirmLabel: "Hapus klien", danger: true });
    if (!ok) return;
    const res = await deleteClientAction(c.id);
    if (!res.ok) return toast(res.error, "error");
    toast("Klien dihapus.");
    router.refresh();
  }

  function saveOrder() {
    startSaving(async () => {
      const res = await reorderClientsAction(clients.map((c) => c.id));
      if (!res.ok) return toast(res.error, "error");
      toast("Urutan klien disimpan.");
      router.refresh();
    });
  }

  const set = <K extends keyof ClientFormData>(k: K, v: ClientFormData[K]) => setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button type="button" onClick={() => setEditing({ id: null, form: toForm() })} className={buttonClass("primary")} disabled={!canEdit}>
          <Plus size={15} aria-hidden="true" /> Tambah klien
        </button>
      </div>

      {clients.length === 0 ? (
        <EmptyState title="Belum ada klien" body="Tambahkan klien beserta logonya agar tampil di website." />
      ) : (
        <ul className="overflow-hidden rounded-[8px] border border-[var(--color-line)] bg-[var(--color-surface)]">
          {clients.map((c, i) => (
            <li key={c.id} {...rowProps(i)} className="flex items-center gap-3 border-b border-[var(--color-line)] px-3 py-2.5 last:border-0 data-[dragging]:opacity-40 data-[over]:bg-[var(--color-teal-soft)] sm:px-4">
              <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-[var(--color-line)] bg-white">
                {c.logo ? (
                  <Image src={c.logo} alt="" fill sizes="64px" className="object-contain p-1" />
                ) : (
                  <span className="text-[10px] font-medium text-[var(--color-ink-3)]">Tanpa logo</span>
                )}
              </span>
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => setEditing({ id: c.id, form: toForm(c) })} className="block max-w-full truncate text-left text-[14.5px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-teal-text)]">
                  {c.name}
                </button>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[var(--color-ink-3)]">
                  <span>{[c.city, c.province].filter(Boolean).join(", ") || "Lokasi belum diisi"}</span>
                  {projectCounts[c.id] > 0 && <span>· {projectCounts[c.id]} proyek</span>}
                  {c.flagship && (
                    <Badge tone="yellow">
                      <Star size={10} aria-hidden="true" /> Klien utama
                    </Badge>
                  )}
                  {c.hidden && <Badge>Tersembunyi</Badge>}
                </p>
              </div>
              <RowControls index={i} count={clients.length} onMove={(to) => setClients(moveItem(clients, i, to))} />
              <button type="button" onClick={() => setEditing({ id: c.id, form: toForm(c) })} className={buttonClass("secondary", "sm")}>
                <Pencil size={13} aria-hidden="true" /> Ubah
              </button>
              <button type="button" onClick={() => remove(c)} className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)]" aria-label={`Hapus ${c.name}`} disabled={!canEdit}>
                <Trash2 size={15} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {orderChanged && (
        <div className="sticky bottom-3 z-30 mt-5 flex flex-wrap items-center gap-3 rounded-[8px] border border-[var(--color-yellow)] bg-[var(--color-dirty-bg)] px-4 py-3 shadow-lg">
          <button type="button" onClick={saveOrder} disabled={saving} className={buttonClass("primary")}>
            {saving && <Loader2 size={15} className="animate-spin" aria-hidden="true" />} Simpan urutan
          </button>
          <button type="button" onClick={() => setClients(initial)} className={buttonClass("ghost")}>
            Batalkan
          </button>
        </div>
      )}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Ubah klien" : "Tambah klien"}
        footer={
          <>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("secondary")}>
              Batal
            </button>
            <button type="button" onClick={save} disabled={saving || !canEdit} className={buttonClass("primary")}>
              {saving && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
              {editing?.id ? "Simpan klien" : "Tambah klien"}
            </button>
          </>
        }
      >
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldShell label="Logo" className="sm:col-span-2" hint="PNG/WebP dengan latar transparan paling bagus. Tanpa logo, nama klien yang tampil.">
              <SingleImage value={editing.form.logo} onChange={(url) => set("logo", url)} folder="klien" aspect="16:9" maxSize={800} contain emptyLabel="Tambah logo" />
            </FieldShell>
            <FieldShell label="Nama perusahaan / instansi *" htmlFor="c-name" className="sm:col-span-2">
              <input id="c-name" value={editing.form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} autoFocus />
            </FieldShell>
            <FieldShell label="Kota" htmlFor="c-city">
              <input id="c-city" value={editing.form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Provinsi" htmlFor="c-prov">
              <input id="c-prov" value={editing.form.province} onChange={(e) => set("province", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Catatan" htmlFor="c-note" hint="Opsional, mis. Member of Panbil Group">
              <input id="c-note" value={editing.form.note} onChange={(e) => set("note", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Situs web" htmlFor="c-web" hint="Opsional, mis. gudanggaramtbk.com">
              <input id="c-web" value={editing.form.website} onChange={(e) => set("website", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Klien sejak (tahun)" htmlFor="c-since">
              <input id="c-since" type="number" inputMode="numeric" value={editing.form.since} onChange={(e) => set("since", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Jumlah proyek" htmlFor="c-count" hint="Ditampilkan sebagai “N+ proyek”.">
              <input id="c-count" type="number" inputMode="numeric" value={editing.form.projectCount} onChange={(e) => set("projectCount", e.target.value)} className={inputClass} />
            </FieldShell>
            <div className="space-y-4 sm:col-span-2">
              <Toggle checked={editing.form.flagship} onChange={(v) => set("flagship", v)} label="Klien utama" description="Ditonjolkan di Beranda dan bagian atas halaman Klien." />
              <Toggle checked={!editing.form.hidden} onChange={(v) => set("hidden", !v)} label="Tampilkan di website" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
