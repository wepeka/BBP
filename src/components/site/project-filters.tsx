"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORY_OPTIONS } from "@/lib/categories";

export function ProjectFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategories = new Set((searchParams.get("kategori") ?? "").split(",").filter(Boolean));
  const activeCity = searchParams.get("kota") ?? "";
  const activeStatus = searchParams.get("status") ?? "";

  function pushParams(next: URLSearchParams) {
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function toggleCategory(id: string) {
    const next = new URLSearchParams(searchParams.toString());
    const set = new Set(activeCategories);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    if (set.size) next.set("kategori", Array.from(set).join(","));
    else next.delete("kategori");
    pushParams(next);
  }

  function setCity(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set("kota", value);
    else next.delete("kota");
    pushParams(next);
  }

  function setStatus(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set("status", value);
    else next.delete("status");
    pushParams(next);
  }

  const hasFilters = activeCategories.size > 0 || activeCity || activeStatus;

  return (
    <div className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-data text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-ink-3)]">
          Filter
        </h2>
        {hasFilters && (
          <button
            type="button"
            onClick={() => router.push(pathname)}
            className="text-[12.5px] font-medium text-[var(--color-teal-text)] hover:underline"
          >
            Hapus filter
          </button>
        )}
      </div>

      <fieldset className="mt-4">
        <legend className="text-[13.5px] font-semibold text-[var(--color-ink)]">Kategori</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => {
            const active = activeCategories.has(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCategory(c.id)}
                aria-pressed={active}
                className={`rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  active
                    ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]"
                    : "border-[var(--color-line-2)] text-[var(--color-ink-2)] hover:border-[var(--color-teal)]"
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="filter-kota" className="text-[13.5px] font-semibold text-[var(--color-ink)]">
            Kota / Provinsi
          </label>
          <select
            id="filter-kota"
            value={activeCity}
            onChange={(e) => setCity(e.target.value)}
            className="mt-2 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3 py-2.5 text-[14px] text-[var(--color-ink)]"
          >
            <option value="">Semua kota</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-status" className="text-[13.5px] font-semibold text-[var(--color-ink)]">
            Status
          </label>
          <select
            id="filter-status"
            value={activeStatus}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3 py-2.5 text-[14px] text-[var(--color-ink)]"
          >
            <option value="">Semua status</option>
            <option value="selesai">Selesai</option>
            <option value="berjalan">Berjalan</option>
          </select>
        </div>
      </div>
    </div>
  );
}
