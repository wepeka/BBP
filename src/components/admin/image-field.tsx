"use client";

import Image from "next/image";
import { useState } from "react";
import { ImagePlus, RefreshCw, Trash2, Star, ArrowLeft, ArrowRight, FileText, ExternalLink } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { MediaPicker } from "./media-picker";
import { moveItem } from "./controls";
import { buttonClass, inputClass } from "./ui";

const ASPECTS: Record<string, string> = {
  "4:3": "aspect-[4/3]",
  "16:9": "aspect-[16/9]",
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "3:2": "aspect-[3/2]",
};

export interface ProjectOption {
  id: string;
  title: string;
}

/**
 * Photo slot editor. Single mode shows one large preview with Ganti/Hapus;
 * multiple mode is an ordered grid (first = shown first), each picture with
 * an optional caption and project link.
 */
export function ImageField({
  value,
  onChange,
  multiple,
  folder,
  aspect = "4:3",
  projects,
  captions = true,
  maxSize,
  emptyLabel,
  contain,
}: {
  value: MediaItem[];
  onChange: (next: MediaItem[]) => void;
  multiple?: boolean;
  folder: string;
  aspect?: string;
  projects?: ProjectOption[];
  captions?: boolean;
  maxSize?: number;
  emptyLabel?: string;
  /** Show the whole picture (logos) instead of cropping to fill. */
  contain?: boolean;
}) {
  const [picker, setPicker] = useState<null | { mode: "add" } | { mode: "replace"; index: number }>(null);
  const aspectClass = ASPECTS[aspect] ?? "aspect-[4/3]";
  const update = (i: number, patch: Partial<MediaItem>) => onChange(value.map((m, k) => (k === i ? { ...m, ...patch } : m)));

  function onPick(urls: string[]) {
    if (!picker) return;
    if (picker.mode === "replace") {
      onChange(value.map((m, k) => (k === picker.index ? { ...m, src: urls[0] } : m)));
    } else if (multiple) {
      onChange([...value, ...urls.map((src) => ({ src }))]);
    } else {
      onChange([{ ...(value[0] ?? {}), src: urls[0] }]);
    }
  }

  const pickerEl = (
    <MediaPicker
      open={picker !== null}
      onClose={() => setPicker(null)}
      onPick={onPick}
      multiple={multiple && picker?.mode === "add"}
      folder={folder}
      maxSize={maxSize}
    />
  );

  if (!multiple) {
    const item = value[0];
    return (
      <div>
        {item ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className={`relative w-full overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-wf-fill)] sm:w-60 ${aspectClass}`}>
              <Image src={item.src} alt="" fill sizes="240px" className={contain ? "object-contain p-3" : "object-cover"} />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <button type="button" className={buttonClass("secondary", "sm")} onClick={() => setPicker({ mode: "add" })}>
                  <RefreshCw size={14} aria-hidden="true" /> Ganti foto
                </button>
                <button type="button" className={buttonClass("ghost", "sm")} onClick={() => onChange([])}>
                  <Trash2 size={14} aria-hidden="true" /> Hapus
                </button>
              </div>
              {captions && (
                <input
                  value={item.alt ?? ""}
                  onChange={(e) => update(0, { alt: e.target.value })}
                  placeholder="Keterangan foto (untuk Google & pembaca layar)"
                  className={`${inputClass} text-[13px]`}
                />
              )}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setPicker({ mode: "add" })}
            className={`flex w-full flex-col items-center justify-center gap-1.5 rounded-[6px] border-2 border-dashed border-[var(--color-line-2)] bg-[var(--color-surface)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-text)] sm:w-60 ${aspectClass}`}
          >
            <ImagePlus size={24} aria-hidden="true" />
            <span className="text-[13px] font-semibold">{emptyLabel ?? "Tambah foto"}</span>
          </button>
        )}
        {pickerEl}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-3">
        {value.map((item, i) => (
          <div key={`${item.src}-${i}`} className="overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)]">
            <div className={`group relative bg-[var(--color-wf-fill)] ${aspectClass}`}>
              <Image src={item.src} alt="" fill sizes="220px" className="object-cover" />
              <span className="absolute left-1.5 top-1.5 rounded-[4px] bg-black/60 px-1.5 py-0.5 font-data text-[10.5px] text-white">
                {i === 0 ? "Pertama" : i + 1}
              </span>
              <button
                type="button"
                onClick={() => setPicker({ mode: "replace", index: i })}
                className="absolute inset-0 flex items-center justify-center bg-black/45 text-[12.5px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <RefreshCw size={14} className="mr-1.5" aria-hidden="true" /> Ganti
              </button>
            </div>
            <div className="flex items-center justify-between gap-1 border-t border-[var(--color-line)] px-1.5 py-1">
              <div className="flex">
                <button type="button" onClick={() => onChange(moveItem(value, i, i - 1))} disabled={i === 0} aria-label="Geser ke kiri" className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] disabled:opacity-30">
                  <ArrowLeft size={14} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => onChange(moveItem(value, i, i + 1))} disabled={i === value.length - 1} aria-label="Geser ke kanan" className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] disabled:opacity-30">
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Hapus foto" className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--color-ink-3)] hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)]">
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
            {(captions || projects) && (
              <div className="space-y-1.5 border-t border-[var(--color-line)] p-1.5">
                {projects && (
                  <select
                    value={item.projectId ?? ""}
                    onChange={(e) => update(i, { projectId: e.target.value || null })}
                    className={`${inputClass} !py-1.5 text-[12px]`}
                    aria-label="Tautkan ke proyek"
                  >
                    <option value="">Tanpa tautan proyek</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                )}
                {captions && (
                  <input
                    value={item.alt ?? ""}
                    onChange={(e) => update(i, { alt: e.target.value })}
                    placeholder="Keterangan foto"
                    className={`${inputClass} !py-1.5 text-[12px]`}
                  />
                )}
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPicker({ mode: "add" })}
          className={`flex flex-col items-center justify-center gap-1.5 rounded-[6px] border-2 border-dashed border-[var(--color-line-2)] bg-[var(--color-surface)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-text)] ${aspectClass}`}
        >
          <ImagePlus size={22} aria-hidden="true" />
          <span className="text-[12.5px] font-semibold">Tambah foto</span>
        </button>
      </div>
      {pickerEl}
    </div>
  );
}

/** A single picture stored as a plain URL (logos, team photos, service images). */
export function SingleImage({
  value,
  onChange,
  folder,
  aspect = "4:3",
  maxSize,
  contain,
  emptyLabel,
}: {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  folder: string;
  aspect?: string;
  maxSize?: number;
  contain?: boolean;
  emptyLabel?: string;
}) {
  return (
    <ImageField
      value={value ? [{ src: value }] : []}
      onChange={(items) => onChange(items[0]?.src ?? null)}
      folder={folder}
      aspect={aspect}
      captions={false}
      maxSize={maxSize}
      contain={contain}
      emptyLabel={emptyLabel}
    />
  );
}

/** Ordered photo list stored as plain URLs (project galleries); first = cover. */
export function PhotoListField({
  value,
  onChange,
  folder,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  folder: string;
}) {
  const [adding, setAdding] = useState(false);
  return (
    <div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-3">
        {value.map((src, i) => (
          <div key={`${src}-${i}`} className="overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)]">
            <div className="relative aspect-[3/2] bg-[var(--color-wf-fill)]">
              <Image src={src} alt="" fill sizes="220px" className="object-cover" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-[4px] bg-[var(--color-yellow)] px-1.5 py-0.5 font-data text-[10.5px] font-medium text-[#17181a]">
                  <Star size={11} aria-hidden="true" /> Sampul
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 border-t border-[var(--color-line)] px-1.5 py-1">
              <div className="flex">
                <button type="button" onClick={() => onChange(moveItem(value, i, i - 1))} disabled={i === 0} aria-label="Geser ke kiri" className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] disabled:opacity-30">
                  <ArrowLeft size={14} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => onChange(moveItem(value, i, i + 1))} disabled={i === value.length - 1} aria-label="Geser ke kanan" className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] disabled:opacity-30">
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
                {i > 0 && (
                  <button type="button" onClick={() => onChange(moveItem(value, i, 0))} className="rounded-[4px] px-1.5 text-[11px] font-semibold text-[var(--color-teal-text)] hover:bg-[var(--color-teal-soft)]">
                    Jadikan sampul
                  </button>
                )}
              </div>
              <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Hapus foto" className="flex h-7 w-7 items-center justify-center rounded-[4px] text-[var(--color-ink-3)] hover:bg-[var(--color-red)]/10 hover:text-[var(--color-red)]">
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex aspect-[3/2] flex-col items-center justify-center gap-1.5 rounded-[6px] border-2 border-dashed border-[var(--color-line-2)] bg-[var(--color-surface)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-teal)] hover:text-[var(--color-teal-text)]"
        >
          <ImagePlus size={22} aria-hidden="true" />
          <span className="text-[12.5px] font-semibold">Tambah foto</span>
        </button>
      </div>
      <MediaPicker open={adding} onClose={() => setAdding(false)} onPick={(urls) => onChange([...value, ...urls])} multiple folder={folder} />
    </div>
  );
}

/** A PDF document field (certificates). */
export function PdfField({ value, onChange, folder }: { value: string | null; onChange: (url: string | null) => void; folder: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {value ? (
        <>
          <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] px-3 py-2 text-[13px] font-medium text-[var(--color-ink)] hover:border-[var(--color-teal)]">
            <FileText size={16} className="text-[var(--color-red)]" aria-hidden="true" />
            {decodeURIComponent(value.split("/").pop() ?? "Dokumen")}
            <ExternalLink size={13} className="text-[var(--color-ink-3)]" aria-hidden="true" />
          </a>
          <button type="button" className={buttonClass("secondary", "sm")} onClick={() => setOpen(true)}>
            Ganti PDF
          </button>
          <button type="button" className={buttonClass("ghost", "sm")} onClick={() => onChange(null)}>
            Hapus
          </button>
        </>
      ) : (
        <button type="button" className={buttonClass("secondary", "sm")} onClick={() => setOpen(true)}>
          <FileText size={14} aria-hidden="true" /> Unggah PDF
        </button>
      )}
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(urls) => onChange(urls[0] ?? null)} accept="pdf" folder={folder} />
    </div>
  );
}
