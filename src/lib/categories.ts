import type { Category } from "./types";

/** Built-in project categories; the admin can rename, add, or remove them. */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: "struktur-baja", label: "Struktur Baja" },
  { id: "gudang", label: "Gudang & Depo" },
  { id: "industri", label: "Industri" },
  { id: "renovasi", label: "Renovasi" },
  { id: "sipil", label: "Sipil" },
  { id: "mep", label: "MEP" },
  { id: "hunian", label: "Hunian" },
  { id: "fasilitas-umum", label: "Fasilitas Umum" },
  { id: "kesehatan", label: "Kesehatan" },
  { id: "agro", label: "Agro" },
  { id: "pengadaan", label: "Pengadaan" },
];

export type CategoryLabels = Record<string, string>;

export function categoryLabels(categories: Category[]): CategoryLabels {
  return Object.fromEntries(categories.map((c) => [c.id, c.label]));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
