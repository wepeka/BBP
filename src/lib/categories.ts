export const CATEGORY_LABELS: Record<string, string> = {
  "struktur-baja": "Struktur Baja",
  gudang: "Gudang & Depo",
  industri: "Industri",
  renovasi: "Renovasi",
  sipil: "Sipil",
  mep: "MEP",
  hunian: "Hunian",
  "fasilitas-umum": "Fasilitas Umum",
  kesehatan: "Kesehatan",
  agro: "Agro",
  pengadaan: "Pengadaan",
};

export function categoryLabel(id: string): string {
  return CATEGORY_LABELS[id] ?? id;
}

export const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(([id, label]) => ({
  id,
  label,
}));
