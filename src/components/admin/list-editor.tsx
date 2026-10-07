"use client";

import { Plus } from "lucide-react";
import type { ListColumn } from "@/lib/texts";
import { AutoTextarea, IconSelect, RowControls, moveItem, useSortable } from "./controls";
import { buttonClass, inputClass } from "./ui";

export const LINK_OPTIONS = [
  { value: "", label: "Tanpa tautan" },
  { value: "/tentang", label: "Halaman Tentang" },
  { value: "/layanan", label: "Halaman Layanan" },
  { value: "/proyek", label: "Halaman Proyek" },
  { value: "/kapasitas", label: "Halaman Kapasitas" },
  { value: "/legalitas", label: "Halaman Legalitas" },
  { value: "/klien", label: "Halaman Klien" },
  { value: "/hubungi", label: "Halaman Hubungi" },
];

/** Editable table of rows for list-type texts (timeline, reasons, steps…). */
export function ListEditor({
  columns,
  rows,
  onChange,
  addLabel = "Tambah baris",
  numbered,
}: {
  columns: readonly ListColumn[];
  rows: string[][];
  onChange: (rows: string[][]) => void;
  addLabel?: string;
  numbered?: boolean;
}) {
  const { rowProps } = useSortable(rows, onChange);
  const setCell = (r: number, c: number, v: string) =>
    onChange(rows.map((row, i) => (i === r ? columns.map((_, k) => (k === c ? v : row[k] ?? "")) : row)));
  const wide = columns.length > 2;

  return (
    <div className="space-y-2">
      {rows.map((row, r) => (
        <div
          key={r}
          {...rowProps(r)}
          className="group rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] p-3 data-[dragging]:opacity-40 data-[over]:border-[var(--color-teal)] data-[over]:ring-2 data-[over]:ring-[var(--color-teal)]/20"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-data text-[11px] font-medium text-[var(--color-ink-3)]">{numbered ? `Langkah ${r + 1}` : `#${r + 1}`}</span>
            <RowControls index={r} count={rows.length} onMove={(to) => onChange(moveItem(rows, r, to))} onRemove={() => onChange(rows.filter((_, i) => i !== r))} />
          </div>
          <div className={`grid gap-2.5 ${wide ? "sm:grid-cols-2" : columns.length === 2 ? "sm:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)]" : ""}`}>
            {columns.map((col, c) => {
              const value = row[c] ?? "";
              const id = `cell-${r}-${c}`;
              const full = wide && col.kind === "textarea";
              return (
                <div key={col.key} className={full ? "sm:col-span-2" : ""}>
                  <label htmlFor={id} className="mb-1 block text-[11.5px] font-semibold text-[var(--color-ink-2)]">
                    {col.label}
                  </label>
                  {col.kind === "icon" ? (
                    <IconSelect id={id} value={value} onChange={(v) => setCell(r, c, v)} />
                  ) : col.kind === "link" ? (
                    <select id={id} value={value} onChange={(e) => setCell(r, c, e.target.value)} className={inputClass}>
                      {!LINK_OPTIONS.some((o) => o.value === value) && <option value={value}>{value}</option>}
                      {LINK_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : col.kind === "textarea" ? (
                    <AutoTextarea id={id} value={value} onChange={(v) => setCell(r, c, v)} placeholder={col.placeholder} minRows={2} />
                  ) : (
                    <input id={id} value={value} onChange={(e) => setCell(r, c, e.target.value)} placeholder={col.placeholder} className={inputClass} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, columns.map((c) => (c.kind === "icon" ? "building-2" : ""))])}
        className={buttonClass("secondary", "sm")}
      >
        <Plus size={14} aria-hidden="true" /> {addLabel}
      </button>
    </div>
  );
}
