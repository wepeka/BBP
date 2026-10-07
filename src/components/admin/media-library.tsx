"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Copy, ExternalLink, FileText, Search, Trash2 } from "lucide-react";
import type { LibraryItem } from "@/lib/media-library";
import { formatBytes, formatDate } from "@/lib/site";
import { deleteMediaAction } from "@/app/admin/(protected)/galeri/actions";
import { useAdmin } from "./admin-context";
import { Modal } from "./controls";
import { invalidateLibrary } from "./media-picker";
import { UploadZone } from "./upload-zone";
import { Badge, EmptyState, buttonClass, inputClass } from "./ui";

type Filter = "semua" | "unggahan" | "bawaan" | "tidak-dipakai" | "pdf";

export function MediaLibrary({ items }: { items: LibraryItem[] }) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [detail, setDetail] = useState<LibraryItem | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (filter === "unggahan" && !i.uploaded) return false;
      if (filter === "bawaan" && i.uploaded) return false;
      if (filter === "tidak-dipakai" && i.usedIn.length) return false;
      if (filter === "pdf" && i.kind !== "pdf") return false;
      return !q || `${i.name} ${i.usedIn.join(" ")}`.toLowerCase().includes(q);
    });
  }, [items, query, filter]);

  async function remove(item: LibraryItem) {
    const ok = await confirm({ title: "Hapus file ini?", body: "File dihapus permanen dari penyimpanan.", confirmLabel: "Hapus file", danger: true });
    if (!ok) return;
    const res = await deleteMediaAction(item.url);
    if (!res.ok) {
      toast(res.usedIn?.length ? `${res.error} ${res.usedIn.join("; ")}` : res.error, "error");
      return;
    }
    toast("File dihapus.");
    invalidateLibrary();
    setDetail(null);
    router.refresh();
  }

  const filters: [Filter, string, number][] = [
    ["semua", "Semua", items.length],
    ["unggahan", "Unggahan", items.filter((i) => i.uploaded).length],
    ["bawaan", "Foto bawaan", items.filter((i) => !i.uploaded).length],
    ["tidak-dipakai", "Tidak dipakai", items.filter((i) => !i.usedIn.length).length],
    ["pdf", "PDF", items.filter((i) => i.kind === "pdf").length],
  ];

  return (
    <div>
      {canEdit && (
        <div className="mb-6">
          <UploadZone
            folder="galeri"
            onUploaded={(r) => {
              toast(`${r.length} file diunggah. Sekarang bisa dipilih dari kolom foto mana pun.`);
              invalidateLibrary();
              router.refresh();
            }}
          />
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Cari</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama file atau tempat dipakai" className={`${inputClass} pl-9`} />
        </label>
        <div className="flex flex-wrap gap-1.5">
          {filters.map(([id, label, n]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`rounded-[6px] px-3 py-1.5 text-[13px] font-semibold ${
                filter === id ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-2)]"
              }`}
            >
              {label} <span className="font-data text-[11px] opacity-70">{n}</span>
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Tidak ada file yang cocok" />
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6">
          {visible.map((item) => (
            <li key={item.url}>
              <button type="button" onClick={() => setDetail(item)} className="group block w-full overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] text-left hover:border-[var(--color-teal)]">
                <span className="relative block aspect-[4/3] bg-[var(--color-wf-fill)]">
                  {item.kind === "pdf" ? (
                    <span className="flex h-full items-center justify-center text-[var(--color-red)]">
                      <FileText size={30} aria-hidden="true" />
                    </span>
                  ) : (
                    <Image src={item.url} alt="" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  {!item.usedIn.length && <Badge className="absolute left-1.5 top-1.5" tone="yellow">Tidak dipakai</Badge>}
                </span>
                <span className="block truncate px-2.5 pt-2 text-[12px] font-semibold text-[var(--color-ink)]">{item.usedIn[0] ?? item.name}</span>
                <span className="block truncate px-2.5 pb-2.5 text-[11px] text-[var(--color-ink-3)]">
                  {item.uploaded ? `Unggahan${item.size ? ` · ${formatBytes(item.size)}` : ""}` : "Foto bawaan"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={detail !== null} onClose={() => setDetail(null)} title="Detail file" wide>
        {detail && (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[6px] bg-[var(--color-wf-fill)]">
              {detail.kind === "pdf" ? (
                <span className="flex h-full items-center justify-center text-[var(--color-red)]">
                  <FileText size={48} aria-hidden="true" />
                </span>
              ) : (
                <Image src={detail.url} alt="" fill sizes="600px" className="object-contain" />
              )}
            </div>
            <div className="space-y-4 text-[13.5px]">
              <div>
                <p className="font-data text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">Nama file</p>
                <p className="mt-1 break-all font-medium text-[var(--color-ink)]">{detail.name}</p>
              </div>
              {detail.uploadedAt && (
                <div>
                  <p className="font-data text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">Diunggah</p>
                  <p className="mt-1 text-[var(--color-ink)]">
                    {formatDate(detail.uploadedAt, { day: "numeric", month: "long", year: "numeric" })}
                    {detail.size ? ` · ${formatBytes(detail.size)}` : ""}
                  </p>
                </div>
              )}
              <div>
                <p className="font-data text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-3)]">Dipakai di</p>
                {detail.usedIn.length ? (
                  <ul className="mt-1 space-y-1 text-[var(--color-ink)]">
                    {detail.usedIn.map((u, i) => (
                      <li key={i}>• {u}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-[var(--color-ink-2)]">Belum dipakai di mana pun.</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  className={buttonClass("secondary", "sm")}
                  onClick={async () => {
                    await navigator.clipboard.writeText(new URL(detail.url, window.location.origin).toString());
                    toast("Link disalin.");
                  }}
                >
                  <Copy size={13} aria-hidden="true" /> Salin link
                </button>
                <a href={detail.url} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                  <ExternalLink size={13} aria-hidden="true" /> Buka
                </a>
                {detail.uploaded && canEdit && (
                  <button type="button" onClick={() => remove(detail)} className={buttonClass("danger", "sm")}>
                    <Trash2 size={13} aria-hidden="true" /> Hapus
                  </button>
                )}
              </div>
              {!detail.uploaded && <p className="text-[12px] text-[var(--color-ink-3)]">Foto bawaan ikut terpasang bersama website, jadi tidak bisa dihapus dari sini — cukup ganti di tempat ia dipakai.</p>}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
