"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { FileText, Loader2, Pencil, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { Certificate, CertificateGroup } from "@/lib/types";
import { daysUntil, formatDate } from "@/lib/site";
import {
  deleteCertificateAction,
  reorderCertificatesAction,
  saveCertificateAction,
  type CertificateFormData,
} from "@/app/admin/(protected)/sertifikat/actions";
import { useAdmin } from "./admin-context";
import { Modal, Toggle, moveItem } from "./controls";
import { PdfField } from "./image-field";
import { Badge, FieldShell, buttonClass, inputClass } from "./ui";

const GROUPS: { id: CertificateGroup; label: string }[] = [
  { id: "legalitas", label: "Legalitas perusahaan" },
  { id: "sbu", label: "Sertifikat Badan Usaha (SBU)" },
  { id: "sistem_manajemen", label: "Sistem manajemen" },
  { id: "keanggotaan", label: "Keanggotaan" },
];

const toForm = (c?: Certificate | null, group: CertificateGroup = "legalitas"): CertificateFormData => ({
  group: c?.group ?? group,
  name: c?.name ?? "",
  number: c?.number ?? "",
  issuer: c?.issuer ?? "",
  qualification: c?.qualification ?? "",
  status: c?.status ?? "berlaku",
  expiresAt: c?.expiresAt ?? "",
  note: c?.note ?? "",
  fileUrl: c?.fileUrl ?? null,
  hidden: c?.hidden ?? false,
});

function StatusInfo({ c }: { c: Certificate }) {
  const days = daysUntil(c.expiresAt);
  if (c.status === "kedaluwarsa" || (days !== null && days < 0)) return <Badge tone="red">Kedaluwarsa</Badge>;
  if (c.status === "perlu_verifikasi") return <Badge tone="yellow">Perlu verifikasi</Badge>;
  if (days !== null && days <= 60) return <Badge tone="yellow">Habis {days} hari lagi</Badge>;
  return <Badge tone="green">Berlaku</Badge>;
}

export function CertificatesManager({ certificates }: { certificates: Certificate[] }) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const [editing, setEditing] = useState<{ id: string | null; form: CertificateFormData } | null>(null);
  const [busy, startBusy] = useTransition();

  const set = <K extends keyof CertificateFormData>(k: K, v: CertificateFormData[K]) => setEditing((e) => (e ? { ...e, form: { ...e.form, [k]: v } } : e));

  function save() {
    if (!editing) return;
    startBusy(async () => {
      const res = await saveCertificateAction(editing.id, editing.form);
      if (!res.ok) return toast(res.error, "error");
      toast(editing.id ? "Dokumen diperbarui." : "Dokumen ditambahkan.");
      setEditing(null);
      router.refresh();
    });
  }

  async function remove(c: Certificate) {
    const ok = await confirm({ title: `Hapus ${c.name}?`, body: "Dokumen ini akan hilang dari halaman Legalitas.", confirmLabel: "Hapus dokumen", danger: true });
    if (!ok) return;
    const res = await deleteCertificateAction(c.id);
    if (!res.ok) return toast(res.error, "error");
    toast("Dokumen dihapus.");
    router.refresh();
  }

  function move(group: CertificateGroup, index: number, delta: number) {
    const inGroup = certificates.filter((c) => c.group === group);
    const reordered = moveItem(inGroup, index, index + delta);
    if (reordered === inGroup) return;
    const ids = GROUPS.flatMap((g) => (g.id === group ? reordered : certificates.filter((c) => c.group === g.id)).map((c) => c.id));
    startBusy(async () => {
      const res = await reorderCertificatesAction(ids);
      if (!res.ok) return toast(res.error, "error");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {GROUPS.map((g) => {
        const list = certificates.filter((c) => c.group === g.id);
        return (
          <section key={g.id}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[15.5px] font-bold text-[var(--color-ink)]">
                {g.label} <span className="font-data text-[12px] font-normal text-[var(--color-ink-3)]">{list.length}</span>
              </h2>
              <button type="button" onClick={() => setEditing({ id: null, form: toForm(null, g.id) })} className={buttonClass("secondary", "sm")} disabled={!canEdit}>
                <Plus size={14} aria-hidden="true" /> Tambah
              </button>
            </div>
            {list.length === 0 ? (
              <p className="rounded-[8px] border border-dashed border-[var(--color-line-2)] px-4 py-6 text-center text-[13px] text-[var(--color-ink-3)]">Belum ada dokumen di kelompok ini.</p>
            ) : (
              <ul className="overflow-hidden rounded-[8px] border border-[var(--color-line)] bg-[var(--color-surface)]">
                {list.map((c, i) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-3 border-b border-[var(--color-line)] px-4 py-3 last:border-0">
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 text-[14.5px] font-semibold text-[var(--color-ink)]">
                        {c.name}
                        <StatusInfo c={c} />
                        {c.hidden && <Badge>Tersembunyi</Badge>}
                      </p>
                      <p className="mt-0.5 flex flex-wrap gap-x-3 font-data text-[12px] text-[var(--color-ink-3)]">
                        {c.number && <span>No. {c.number}</span>}
                        <span>{c.issuer}</span>
                        {c.expiresAt && <span>s/d {formatDate(c.expiresAt)}</span>}
                        <span className={c.fileUrl ? "text-[var(--color-teal-text)]" : ""}>
                          <FileText size={11} className="mr-1 inline" aria-hidden="true" />
                          {c.fileUrl ? "PDF ada" : "Belum ada PDF"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => move(g.id, i, -1)} disabled={i === 0 || busy || !canEdit} aria-label="Naikkan" className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] disabled:opacity-30">
                        <ArrowUp size={15} aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => move(g.id, i, 1)} disabled={i === list.length - 1 || busy || !canEdit} aria-label="Turunkan" className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] disabled:opacity-30">
                        <ArrowDown size={15} aria-hidden="true" />
                      </button>
                      <button type="button" onClick={() => setEditing({ id: c.id, form: toForm(c) })} className={buttonClass("secondary", "sm", "ml-1")}>
                        <Pencil size={13} aria-hidden="true" /> Ubah
                      </button>
                      <button type="button" onClick={() => remove(c)} disabled={!canEdit} aria-label={`Hapus ${c.name}`} className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)]">
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Ubah dokumen" : "Tambah dokumen"}
        footer={
          <>
            <button type="button" onClick={() => setEditing(null)} className={buttonClass("secondary")}>
              Batal
            </button>
            <button type="button" onClick={save} disabled={busy || !canEdit} className={buttonClass("primary")}>
              {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
              {editing?.id ? "Simpan dokumen" : "Tambah dokumen"}
            </button>
          </>
        }
      >
        {editing && (
          <div className="grid gap-4 sm:grid-cols-2">
            <FieldShell label="Nama dokumen *" htmlFor="ct-name" className="sm:col-span-2">
              <input id="ct-name" value={editing.form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="mis. SBU BG009 — Konstruksi Gedung Industri" />
            </FieldShell>
            <FieldShell label="Kelompok" htmlFor="ct-group">
              <select id="ct-group" value={editing.form.group} onChange={(e) => set("group", e.target.value as CertificateGroup)} className={inputClass}>
                {GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </FieldShell>
            <FieldShell label="Penerbit" htmlFor="ct-issuer">
              <input id="ct-issuer" value={editing.form.issuer} onChange={(e) => set("issuer", e.target.value)} className={inputClass} placeholder="mis. LPJK" />
            </FieldShell>
            <FieldShell label="Nomor" htmlFor="ct-number">
              <input id="ct-number" value={editing.form.number} onChange={(e) => set("number", e.target.value)} className={`${inputClass} font-data`} />
            </FieldShell>
            <FieldShell label="Kualifikasi" htmlFor="ct-qual" hint="Opsional, mis. M1">
              <input id="ct-qual" value={editing.form.qualification} onChange={(e) => set("qualification", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Status" htmlFor="ct-status">
              <select id="ct-status" value={editing.form.status} onChange={(e) => set("status", e.target.value as CertificateFormData["status"])} className={inputClass}>
                <option value="berlaku">Berlaku</option>
                <option value="perlu_verifikasi">Perlu verifikasi</option>
                <option value="kedaluwarsa">Kedaluwarsa</option>
              </select>
            </FieldShell>
            <FieldShell label="Berlaku sampai" htmlFor="ct-exp" hint="Opsional. Lewat tanggal ini, status otomatis tampil kedaluwarsa.">
              <input id="ct-exp" type="date" value={editing.form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Catatan" htmlFor="ct-note" className="sm:col-span-2" hint="Tampil di kartu dokumen di website.">
              <input id="ct-note" value={editing.form.note} onChange={(e) => set("note", e.target.value)} className={inputClass} />
            </FieldShell>
            <FieldShell label="Berkas PDF" className="sm:col-span-2" hint="Pengunjung bisa membuka & mengunduh PDF ini dari halaman Legalitas.">
              <PdfField value={editing.form.fileUrl} onChange={(url) => set("fileUrl", url)} folder="sertifikat" />
            </FieldShell>
            <div className="sm:col-span-2">
              <Toggle checked={!editing.form.hidden} onChange={(v) => set("hidden", !v)} label="Tampilkan di website" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
