"use client";

import { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import type { Category, Equipment, Service } from "@/lib/types";
import { AutoTextarea, IconSelect, RowControls, moveItem, useSortable } from "./controls";
import { SingleImage } from "./image-field";
import { FieldShell, buttonClass, inputClass } from "./ui";

export type ServiceDraft = Omit<Service, "order">;
export interface TeamDraft {
  id?: string;
  name: string;
  role: string;
  photo?: string | null;
}

/* ---------- Services ---------- */

export function ServicesEditor({
  value,
  onChange,
  categories,
}: {
  value: ServiceDraft[];
  onChange: (next: ServiceDraft[]) => void;
  categories: Category[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { rowProps } = useSortable(value, onChange);
  const set = (i: number, patch: Partial<ServiceDraft>) => onChange(value.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  return (
    <div className="space-y-2.5">
      {value.map((s, i) => {
        const key = s.id || `new-${i}`;
        const open = openId === key;
        return (
          <div
            key={key}
            {...rowProps(i)}
            className="rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] data-[dragging]:opacity-40 data-[over]:border-[var(--color-teal)]"
          >
            <div className="flex items-center gap-2 p-2.5">
              <button type="button" onClick={() => setOpenId(open ? null : key)} className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] p-1 text-left hover:bg-[var(--color-surface-2)]">
                <ChevronDown size={16} className={`shrink-0 text-[var(--color-ink-3)] transition-transform ${open ? "" : "-rotate-90"}`} aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-semibold text-[var(--color-ink)]">{s.nameId || "Layanan baru"}</span>
                  <span className="block truncate text-[12px] text-[var(--color-ink-3)]">{s.shortId || "Belum ada ringkasan"}</span>
                </span>
              </button>
              <RowControls
                index={i}
                count={value.length}
                onMove={(to) => onChange(moveItem(value, i, to))}
                onRemove={() => onChange(value.filter((_, k) => k !== i))}
                removeLabel="Hapus layanan"
              />
            </div>
            {open && (
              <div className="grid gap-4 border-t border-[var(--color-line)] p-4 lg:grid-cols-2">
                <FieldShell label="Nama layanan" htmlFor={`svc-name-${i}`}>
                  <input id={`svc-name-${i}`} value={s.nameId} onChange={(e) => set(i, { nameId: e.target.value })} className={inputClass} />
                </FieldShell>
                <FieldShell label="Nama dalam bahasa Inggris" htmlFor={`svc-en-${i}`} hint="Tampil kecil di bawah nama. Boleh dikosongkan.">
                  <input id={`svc-en-${i}`} value={s.nameEn} onChange={(e) => set(i, { nameEn: e.target.value })} className={inputClass} />
                </FieldShell>
                <FieldShell label="Ikon" htmlFor={`svc-icon-${i}`}>
                  <IconSelect id={`svc-icon-${i}`} value={s.icon} onChange={(v) => set(i, { icon: v })} />
                </FieldShell>
                <FieldShell label="Proyek terkait" htmlFor={`svc-cat-${i}`} hint="Tautan “Lihat proyek terkait” membuka daftar proyek kategori ini.">
                  <select id={`svc-cat-${i}`} value={s.category ?? ""} onChange={(e) => set(i, { category: e.target.value || null })} className={inputClass}>
                    <option value="">Tanpa tautan</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </FieldShell>
                <FieldShell label="Ringkasan (kartu di Beranda)" htmlFor={`svc-short-${i}`} className="lg:col-span-2">
                  <AutoTextarea id={`svc-short-${i}`} value={s.shortId} onChange={(v) => set(i, { shortId: v })} />
                </FieldShell>
                <FieldShell label="Deskripsi lengkap (halaman Layanan)" htmlFor={`svc-desc-${i}`} className="lg:col-span-2">
                  <AutoTextarea id={`svc-desc-${i}`} value={s.descriptionId} onChange={(v) => set(i, { descriptionId: v })} minRows={3} />
                </FieldShell>
                <FieldShell label="Lingkup pekerjaan" htmlFor={`svc-points-${i}`} hint="Satu poin per baris. Tampil sebagai daftar centang." className="lg:col-span-2">
                  <AutoTextarea
                    id={`svc-points-${i}`}
                    value={(s.points ?? []).join("\n")}
                    onChange={(v) => set(i, { points: v.split("\n") })}
                    placeholder={"mis. Pondasi & pile cap\nKolom, balok, dan pelat\nFinishing dinding & lantai"}
                    minRows={3}
                  />
                </FieldShell>
                <FieldShell label="Foto layanan (opsional)" className="lg:col-span-2">
                  <SingleImage value={s.image} onChange={(url) => set(i, { image: url })} folder="layanan" aspect="16:9" />
                </FieldShell>
              </div>
            )}
          </div>
        );
      })}
      <button
        type="button"
        className={buttonClass("secondary", "sm")}
        onClick={() => {
          const draft: ServiceDraft = { id: "", nameId: "", nameEn: "", shortId: "", shortEn: "", descriptionId: "", icon: "building-2", image: null, points: [], category: null };
          onChange([...value, draft]);
          setOpenId(`new-${value.length}`);
        }}
      >
        <Plus size={14} aria-hidden="true" /> Tambah layanan
      </button>
    </div>
  );
}

/* ---------- Team ---------- */

export function TeamEditor({ value, onChange }: { value: TeamDraft[]; onChange: (next: TeamDraft[]) => void }) {
  const { rowProps } = useSortable(value, onChange);
  const set = (i: number, patch: Partial<TeamDraft>) => onChange(value.map((m, k) => (k === i ? { ...m, ...patch } : m)));
  return (
    <div className="space-y-2.5">
      {value.map((m, i) => (
        <div
          key={m.id || `new-${i}`}
          {...rowProps(i)}
          className="grid gap-3 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] p-3 data-[dragging]:opacity-40 data-[over]:border-[var(--color-teal)] sm:grid-cols-[120px_1fr_auto] sm:items-start"
        >
          <SingleImage value={m.photo} onChange={(url) => set(i, { photo: url })} folder="tim" aspect="1:1" maxSize={900} emptyLabel="Foto" />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <FieldShell label="Nama" htmlFor={`tm-name-${i}`}>
              <input id={`tm-name-${i}`} value={m.name} onChange={(e) => set(i, { name: e.target.value })} className={inputClass} />
            </FieldShell>
            <FieldShell label="Jabatan" htmlFor={`tm-role-${i}`}>
              <input id={`tm-role-${i}`} value={m.role} onChange={(e) => set(i, { role: e.target.value })} className={inputClass} />
            </FieldShell>
          </div>
          <RowControls index={i} count={value.length} onMove={(to) => onChange(moveItem(value, i, to))} onRemove={() => onChange(value.filter((_, k) => k !== i))} removeLabel="Hapus anggota" />
        </div>
      ))}
      <button type="button" className={buttonClass("secondary", "sm")} onClick={() => onChange([...value, { name: "", role: "", photo: null }])}>
        <Plus size={14} aria-hidden="true" /> Tambah anggota tim
      </button>
    </div>
  );
}

/* ---------- Equipment ---------- */

export function EquipmentEditor({ value, onChange }: { value: Equipment[]; onChange: (next: Equipment[]) => void }) {
  const { rowProps } = useSortable(value, onChange);
  const set = (i: number, patch: Partial<Equipment>) => onChange(value.map((e, k) => (k === i ? { ...e, ...patch } : e)));
  const categories = Array.from(new Set(value.map((e) => e.category).filter(Boolean)));
  return (
    <div className="space-y-2.5">
      <datalist id="equipment-categories">
        {categories.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {value.map((e, i) => (
        <div
          key={e.id || `new-${i}`}
          {...rowProps(i)}
          className="grid gap-3 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] p-3 data-[dragging]:opacity-40 data-[over]:border-[var(--color-teal)] sm:grid-cols-[120px_1fr_auto] sm:items-start"
        >
          <SingleImage value={e.image} onChange={(url) => set(i, { image: url })} folder="alat" aspect="4:3" emptyLabel="Foto" />
          <div className="grid gap-2.5 sm:grid-cols-2">
            <FieldShell label="Nama alat" htmlFor={`eq-name-${i}`}>
              <input id={`eq-name-${i}`} value={e.name} onChange={(ev) => set(i, { name: ev.target.value })} className={inputClass} />
            </FieldShell>
            <FieldShell label="Kelompok" htmlFor={`eq-cat-${i}`} hint="Ketik kelompok baru atau pilih yang ada.">
              <input id={`eq-cat-${i}`} list="equipment-categories" value={e.category} onChange={(ev) => set(i, { category: ev.target.value })} className={inputClass} />
            </FieldShell>
            <FieldShell label="Spesifikasi" htmlFor={`eq-spec-${i}`}>
              <input id={`eq-spec-${i}`} value={e.spec} onChange={(ev) => set(i, { spec: ev.target.value })} className={inputClass} />
            </FieldShell>
            <FieldShell label="Jumlah unit" htmlFor={`eq-qty-${i}`}>
              <input
                id={`eq-qty-${i}`}
                type="number"
                min={0}
                value={e.qty ?? ""}
                onChange={(ev) => set(i, { qty: ev.target.value === "" ? null : Number(ev.target.value) })}
                className={inputClass}
              />
            </FieldShell>
          </div>
          <RowControls index={i} count={value.length} onMove={(to) => onChange(moveItem(value, i, to))} onRemove={() => onChange(value.filter((_, k) => k !== i))} removeLabel="Hapus alat" />
        </div>
      ))}
      <button
        type="button"
        className={buttonClass("secondary", "sm")}
        onClick={() => onChange([...value, { id: "", category: categories[0] ?? "", name: "", spec: "", qty: 1, image: null }])}
      >
        <Plus size={14} aria-hidden="true" /> Tambah alat
      </button>
    </div>
  );
}
