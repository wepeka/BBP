"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Eye, EyeOff, Pencil, Plus, Search, Star, ImageOff, ArrowUpDown, Loader2 } from "lucide-react";
import type { Project } from "@/lib/types";
import { reorderProjectsAction, setProjectFlagsAction } from "@/app/admin/(protected)/proyek/actions";
import { useAdmin } from "./admin-context";
import { RowControls, moveItem, useSortable } from "./controls";
import { Badge, EmptyState, buttonClass, inputClass } from "./ui";

type Filter = "semua" | "unggulan" | "berjalan" | "tersembunyi" | "tanpa-foto";

export function ProjectsTable({ projects: initial, labels }: { projects: Project[]; labels: Record<string, string> }) {
  const router = useRouter();
  const { toast, canEdit } = useAdmin();
  const [projects, setProjects] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("semua");
  const [sorting, setSorting] = useState(false);
  const [busy, startBusy] = useTransition();
  const { rowProps } = useSortable(projects, setProjects);

  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) {
    setPrevInitial(initial);
    setProjects(initial);
  }

  const orderChanged = projects.map((p) => p.id).join() !== initial.map((p) => p.id).join();

  const counts: Record<Filter, number> = {
    semua: projects.length,
    unggulan: projects.filter((p) => p.featured).length,
    berjalan: projects.filter((p) => p.status === "berjalan").length,
    tersembunyi: projects.filter((p) => p.hidden).length,
    "tanpa-foto": projects.filter((p) => !p.images.length).length,
  };

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (filter === "unggulan" && !p.featured) return false;
      if (filter === "berjalan" && p.status !== "berjalan") return false;
      if (filter === "tersembunyi" && !p.hidden) return false;
      if (filter === "tanpa-foto" && p.images.length) return false;
      return !q || `${p.titleId} ${p.client ?? ""} ${p.city} ${p.year}`.toLowerCase().includes(q);
    });
  }, [projects, query, filter]);

  function flag(p: Project, patch: Partial<Pick<Project, "featured" | "hidden">>) {
    if (!canEdit) return;
    setProjects((all) => all.map((x) => (x.id === p.id ? { ...x, ...patch } : x)));
    startBusy(async () => {
      const res = await setProjectFlagsAction(p.id, patch);
      if (!res.ok) {
        toast(res.error, "error");
        setProjects((all) => all.map((x) => (x.id === p.id ? p : x)));
        return;
      }
      toast(
        "featured" in patch
          ? patch.featured
            ? "Ditandai sebagai proyek unggulan."
            : "Dihapus dari proyek unggulan."
          : patch.hidden
            ? "Proyek disembunyikan dari website."
            : "Proyek ditampilkan di website."
      );
      router.refresh();
    });
  }

  function saveOrder() {
    startBusy(async () => {
      const res = await reorderProjectsAction(projects.map((p) => p.id));
      if (!res.ok) return toast(res.error, "error");
      toast("Urutan proyek disimpan.");
      setSorting(false);
      router.refresh();
    });
  }

  const filters: [Filter, string][] = [
    ["semua", "Semua"],
    ["unggulan", "Unggulan"],
    ["berjalan", "Berjalan"],
    ["tersembunyi", "Tersembunyi"],
    ["tanpa-foto", "Belum ada foto"],
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Cari proyek</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari judul, klien, kota, atau tahun" className={`${inputClass} pl-9`} disabled={sorting} />
        </label>
        <button
          type="button"
          onClick={() => {
            if (sorting && orderChanged) setProjects(initial);
            setSorting((v) => !v);
            setQuery("");
            setFilter("semua");
          }}
          className={buttonClass(sorting ? "ghost" : "secondary")}
          disabled={!canEdit}
        >
          <ArrowUpDown size={15} aria-hidden="true" /> {sorting ? "Batal atur urutan" : "Atur urutan"}
        </button>
        <Link href="/admin/proyek/baru" className={buttonClass("primary")}>
          <Plus size={15} aria-hidden="true" /> Proyek baru
        </Link>
      </div>

      {sorting ? (
        <p className="mb-4 rounded-[6px] border border-[var(--color-yellow)] bg-[var(--color-dirty-bg)] px-4 py-3 text-[13.5px] text-[var(--color-ink)]">
          Seret baris atau pakai tombol panah. Urutan ini dipakai di halaman Proyek dan Proyek Unggulan.
        </p>
      ) : (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {filters.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              aria-pressed={filter === id}
              className={`rounded-[6px] px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                filter === id ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
              }`}
            >
              {label} <span className="font-data text-[11px] opacity-70">{counts[id]}</span>
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState title="Tidak ada proyek yang cocok" body="Ubah pencarian atau filter, atau tambah proyek baru." />
      ) : (
        <ul className="overflow-hidden rounded-[8px] border border-[var(--color-line)] bg-[var(--color-surface)]">
          {(sorting ? projects : visible).map((p, i) => (
            <li
              key={p.id}
              {...(sorting ? rowProps(i) : {})}
              className="flex items-center gap-3 border-b border-[var(--color-line)] px-3 py-2.5 last:border-0 data-[dragging]:opacity-40 data-[over]:bg-[var(--color-teal-soft)] sm:gap-4 sm:px-4"
            >
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-[4px] bg-[var(--color-wf-fill)]">
                {p.images[0] ? (
                  <Image src={p.images[0]} alt="" fill sizes="80px" className={`object-cover ${p.hidden ? "opacity-50 grayscale" : ""}`} />
                ) : (
                  <span className="flex h-full items-center justify-center text-[var(--color-ink-3)]">
                    <ImageOff size={18} aria-hidden="true" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link href={`/admin/proyek/${p.id}`} className="block truncate text-[14.5px] font-semibold text-[var(--color-ink)] hover:text-[var(--color-teal-text)]">
                  {p.titleId}
                </Link>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[var(--color-ink-3)]">
                  <span>{p.city}</span>
                  <span>·</span>
                  <span className="font-data">{p.year}</span>
                  {p.categories[0] && (
                    <>
                      <span>·</span>
                      <span>{labels[p.categories[0]] ?? p.categories[0]}</span>
                    </>
                  )}
                  {p.status === "berjalan" && <Badge tone="yellow">Berjalan</Badge>}
                  {p.hidden && <Badge>Tersembunyi</Badge>}
                  {!p.images.length && <Badge tone="red">Belum ada foto</Badge>}
                </p>
              </div>
              {sorting ? (
                <RowControls index={i} count={projects.length} onMove={(to) => setProjects(moveItem(projects, i, to))} />
              ) : (
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => flag(p, { featured: !p.featured })}
                    title={p.featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                    aria-label={p.featured ? "Hapus dari unggulan" : "Jadikan unggulan"}
                    aria-pressed={p.featured}
                    className="flex h-9 w-9 items-center justify-center rounded-[6px] hover:bg-[var(--color-surface-2)]"
                  >
                    <Star size={17} className={p.featured ? "fill-[var(--color-yellow)] text-[#c9b800]" : "text-[var(--color-ink-3)]"} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => flag(p, { hidden: !p.hidden })}
                    title={p.hidden ? "Tampilkan di website" : "Sembunyikan dari website"}
                    aria-label={p.hidden ? "Tampilkan di website" : "Sembunyikan dari website"}
                    className="flex h-9 w-9 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]"
                  >
                    {p.hidden ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}
                  </button>
                  <Link href={`/admin/proyek/${p.id}`} className={buttonClass("secondary", "sm", "ml-1")}>
                    <Pencil size={13} aria-hidden="true" /> Ubah
                  </Link>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {sorting && (
        <div className="sticky bottom-3 z-30 mt-5 flex items-center gap-3 rounded-[8px] border border-[var(--color-yellow)] bg-[var(--color-dirty-bg)] px-4 py-3 shadow-lg">
          <button type="button" onClick={saveOrder} disabled={!orderChanged || busy} className={buttonClass("primary")}>
            {busy && <Loader2 size={15} className="animate-spin" aria-hidden="true" />} Simpan urutan
          </button>
          <span className="text-[12.5px] text-[var(--color-ink-2)]">{orderChanged ? "Urutan berubah, belum disimpan." : "Belum ada perubahan urutan."}</span>
        </div>
      )}
    </div>
  );
}
