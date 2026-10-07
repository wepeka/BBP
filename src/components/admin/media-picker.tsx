"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, FileText, Loader2, Search } from "lucide-react";
import type { LibraryItem } from "@/lib/media-library";
import { Modal } from "./controls";
import { UploadZone } from "./upload-zone";
import { buttonClass, inputClass } from "./ui";

let cache: LibraryItem[] | null = null;

export async function fetchLibrary(force = false): Promise<LibraryItem[]> {
  if (cache && !force) return cache;
  const res = await fetch("/api/admin/media", { cache: "no-store" });
  if (!res.ok) throw new Error("Galeri gagal dimuat.");
  cache = ((await res.json()) as { items: LibraryItem[] }).items;
  return cache;
}

export function invalidateLibrary() {
  cache = null;
}

/**
 * Photo picker: upload new photos, or reuse any photo already on the site
 * (uploads and built-in project photos).
 */
export function MediaPicker({
  open,
  onClose,
  onPick,
  multiple,
  accept = "image",
  folder,
  maxSize,
  title,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (urls: string[]) => void;
  multiple?: boolean;
  accept?: "image" | "pdf";
  folder: string;
  maxSize?: number;
  title?: string;
}) {
  const [tab, setTab] = useState<"upload" | "library">("upload");
  const [items, setItems] = useState<LibraryItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const load = useCallback(async (force = false) => {
    try {
      setError(null);
      setItems(await fetchLibrary(force));
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    if (open && tab === "library" && !items) {
      // Loading the library is a side effect of opening that tab.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      load();
    }
  }, [open, tab, items, load]);

  function close() {
    setSelected([]);
    setQuery("");
    onClose();
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items ?? [])
      .filter((i) => i.kind === accept)
      .filter((i) => !q || `${i.name} ${i.usedIn.join(" ")}`.toLowerCase().includes(q));
  }, [items, query, accept]);

  function toggle(url: string) {
    if (!multiple) {
      onPick([url]);
      close();
      return;
    }
    setSelected((s) => (s.includes(url) ? s.filter((x) => x !== url) : [...s, url]));
  }

  const tabClass = (on: boolean) =>
    `rounded-[6px] px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
      on ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)]"
    }`;

  return (
    <Modal
      open={open}
      onClose={close}
      title={title ?? (accept === "pdf" ? "Pilih file PDF" : multiple ? "Tambah foto" : "Pilih foto")}
      wide
      footer={
        multiple && tab === "library" ? (
          <>
            <span className="mr-auto text-[13px] text-[var(--color-ink-2)]">{selected.length} dipilih</span>
            <button type="button" className={buttonClass("secondary")} onClick={close}>
              Batal
            </button>
            <button
              type="button"
              className={buttonClass("primary")}
              disabled={!selected.length}
              onClick={() => {
                onPick(selected);
                close();
              }}
            >
              Tambahkan {selected.length ? `${selected.length} ` : ""}
              {accept === "pdf" ? "file" : "foto"}
            </button>
          </>
        ) : undefined
      }
    >
      <div className="mb-5 flex gap-1.5">
        <button type="button" className={tabClass(tab === "upload")} onClick={() => setTab("upload")}>
          Unggah baru
        </button>
        <button type="button" className={tabClass(tab === "library")} onClick={() => setTab("library")}>
          Pilih dari galeri
        </button>
      </div>

      {tab === "upload" ? (
        <UploadZone
          folder={folder}
          accept={accept}
          multiple={multiple}
          maxSize={maxSize}
          onUploaded={(results) => {
            invalidateLibrary();
            setItems(null);
            onPick(results.map((r) => r.url));
            close();
          }}
        />
      ) : (
        <div>
          <label className="relative mb-4 block">
            <span className="sr-only">Cari</span>
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama file atau tempat dipakai (mis. Batam)"
              className={`${inputClass} pl-9`}
            />
          </label>
          {error && <p className="text-[13.5px] text-[var(--color-red)]">{error}</p>}
          {!items && !error && (
            <p className="flex items-center gap-2 py-10 text-[13.5px] text-[var(--color-ink-2)]">
              <Loader2 size={16} className="animate-spin" aria-hidden="true" /> Memuat galeri…
            </p>
          )}
          {items && !filtered.length && <p className="py-10 text-center text-[13.5px] text-[var(--color-ink-2)]">Tidak ada yang cocok.</p>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {filtered.map((item) => {
              const on = selected.includes(item.url);
              return (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => toggle(item.url)}
                  className={`group relative overflow-hidden rounded-[6px] border-2 bg-[var(--color-surface)] text-left transition-colors ${
                    on ? "border-[var(--color-teal)]" : "border-transparent hover:border-[var(--color-line-2)]"
                  }`}
                >
                  <span className="relative block aspect-[4/3] bg-[var(--color-wf-fill)]">
                    {item.kind === "pdf" ? (
                      <span className="flex h-full items-center justify-center text-[var(--color-ink-3)]">
                        <FileText size={32} aria-hidden="true" />
                      </span>
                    ) : (
                      <Image src={item.url} alt="" fill sizes="200px" className="object-cover" />
                    )}
                    {on && (
                      <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-teal)] text-white">
                        <Check size={14} aria-hidden="true" />
                      </span>
                    )}
                  </span>
                  <span className="block truncate px-2 pt-1.5 text-[11.5px] font-medium text-[var(--color-ink)]">{item.usedIn[0] ?? item.name}</span>
                  <span className="block truncate px-2 pb-2 text-[10.5px] text-[var(--color-ink-3)]">
                    {item.uploaded ? "Unggahan" : "Foto bawaan"}
                    {item.usedIn.length > 1 ? ` · dipakai ${item.usedIn.length}×` : ""}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Modal>
  );
}
