"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X, Map as MapIcon, LayoutGrid } from "lucide-react";
import type { Project, Category } from "@/lib/types";
import { fill } from "@/lib/texts";
import { toMapProjects } from "@/lib/map";
import { sameClient } from "@/lib/site";
import { ProjectCard } from "./project-card";
import { ProjectsMapClient } from "./projects-map-loader";

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/**
 * Filters the project list entirely in the browser (the page itself stays
 * static and fast), keeping the filters in the URL so a filtered view can be
 * shared or linked to, e.g. /proyek?kategori=struktur-baja.
 */
export function ProjectsExplorer({
  projects,
  categories,
  texts,
}: {
  projects: Project[];
  categories: Category[];
  texts: { count: string; empty: string; search: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [showMap, setShowMap] = useState(false);

  const active = new Set((params.get("kategori") ?? "").split(",").filter(Boolean));
  const city = params.get("kota") ?? "";
  const status = params.get("status") ?? "";
  const client = params.get("klien") ?? "";
  const [query, setQuery] = useState(params.get("q") ?? "");

  const labels = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.label])), [categories]);
  const usedCategories = categories.filter((c) => projects.some((p) => p.categories.includes(c.id)));
  const cities = useMemo(() => Array.from(new Set(projects.map((p) => p.city))).sort((a, b) => a.localeCompare(b, "id")), [projects]);

  function update(patch: Record<string, string>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function toggleCategory(id: string) {
    const set = new Set(active);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    update({ kategori: Array.from(set).join(",") });
  }

  const q = norm(query.trim());
  const filtered = projects.filter((p) => {
    if (active.size && !p.categories.some((c) => active.has(c))) return false;
    if (city && p.city !== city) return false;
    if (status && p.status !== status) return false;
    if (client && !sameClient(p.client, client)) return false;
    if (q && !norm(`${p.titleId} ${p.client ?? ""} ${p.city} ${p.province} ${p.scope}`).includes(q)) return false;
    return true;
  });

  const hasFilters = active.size > 0 || city || status || client || q;
  const selectClass =
    "h-11 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] px-3 text-[14px] text-[var(--color-ink)] focus:border-[var(--color-teal)] focus:outline-none";

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-5 border-y border-[var(--color-line)] bg-[var(--color-bg)]/92 px-5 py-4 backdrop-blur-lg sm:-mx-8 sm:px-8" data-no-reveal>
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1">
            <span className="sr-only">{texts.search}</span>
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => update({ q: query.trim() })}
              placeholder={texts.search}
              className="h-11 w-full rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] pl-9 pr-3 text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-3)] focus:border-[var(--color-teal)] focus:outline-none"
            />
          </label>
          <select aria-label="Kota" value={city} onChange={(e) => update({ kota: e.target.value })} className={selectClass}>
            <option value="">Semua kota</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select aria-label="Status" value={status} onChange={(e) => update({ status: e.target.value })} className={selectClass}>
            <option value="">Semua status</option>
            <option value="selesai">Selesai</option>
            <option value="berjalan">Sedang berjalan</option>
          </select>
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            aria-pressed={showMap}
            className="inline-flex h-11 items-center gap-2 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] px-3.5 text-[14px] font-medium text-[var(--color-ink)] hover:border-[var(--color-line-2)]"
          >
            {showMap ? <LayoutGrid size={16} aria-hidden="true" /> : <MapIcon size={16} aria-hidden="true" />}
            {showMap ? "Sembunyikan peta" : "Tampilkan peta"}
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {usedCategories.map((c) => {
            const on = active.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.id)}
                aria-pressed={on}
                className={`shrink-0 rounded-[4px] border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  on
                    ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white"
                    : "border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:border-[var(--color-teal)]"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {showMap && (
        <div className="mt-6 h-[360px] overflow-hidden rounded-[6px] border border-[var(--color-line)] sm:h-[440px]">
          <ProjectsMapClient projects={toMapProjects(filtered)} />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-[var(--color-ink-2)]" aria-live="polite">
          {fill(texts.count, { jumlah: filtered.length })}
          {client && <span className="ml-1 font-semibold text-[var(--color-ink)]">· {client}</span>}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              router.replace(pathname, { scroll: false });
            }}
            className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--color-teal-text)] hover:underline"
          >
            <X size={14} aria-hidden="true" /> Hapus filter
          </button>
        )}
      </div>

      {filtered.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} categoryLabel={labels[p.categories[0]] ?? p.categories[0] ?? "Proyek"} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-[6px] border border-dashed border-[var(--color-line-2)] p-12 text-center text-[15px] text-[var(--color-ink-2)]">
          {texts.empty}
        </div>
      )}
    </div>
  );
}
