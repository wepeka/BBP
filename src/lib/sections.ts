import type { LayoutMap } from "./types";

/**
 * Every public page and the sections ("compartments") it is built from, in
 * their default order. The public pages render sections in the order the
 * admin chose (see `visibleSections`), and the admin page editor is
 * generated from this same list, so the two can never drift apart.
 *
 * - `fixed`: always shown and always first (e.g. the page header).
 * - `manage`: data for this section is edited on a dedicated admin page.
 */
export interface SectionDef {
  id: string;
  label: string;
  description?: string;
  fixed?: boolean;
  manage?: { href: string; label: string };
}

export interface PageDef {
  id: string;
  label: string;
  href: string;
  /** Optional pages can be switched off entirely from the admin. */
  optional?: boolean;
  sections: SectionDef[];
}

export const PAGES: PageDef[] = [
  {
    id: "beranda",
    label: "Beranda",
    href: "/",
    sections: [
      { id: "hero", label: "Hero (paling atas)", description: "Judul besar, tombol, dan foto bergantian.", fixed: true },
      { id: "stats", label: "Angka statistik", description: "Empat angka di bawah hero." },
      { id: "clients", label: "Klien", description: "Deretan nama/logo klien yang bergerak.", manage: { href: "/admin/klien", label: "Kelola klien" } },
      { id: "services", label: "Layanan", description: "Kartu layanan.", manage: { href: "/admin/halaman?halaman=layanan#sec-list", label: "Ubah daftar layanan" } },
      { id: "why", label: "Kenapa BBP", description: "Empat alasan memilih BBP (panel hijau gelap)." },
      { id: "map", label: "Peta proyek", description: "Peta jejak proyek se-Indonesia." },
      { id: "featured", label: "Proyek unggulan", description: "Proyek bertanda bintang.", manage: { href: "/admin/proyek", label: "Pilih proyek unggulan" } },
      { id: "video", label: "Video", description: "Video YouTube/Vimeo. Tidak tampil sebelum link diisi." },
      { id: "testimonials", label: "Testimoni klien", description: "Kutipan dari klien. Tidak tampil sebelum ada testimoni." },
      { id: "process", label: "Alur kerja", description: "Langkah kerja dari survei sampai serah terima." },
      { id: "director", label: "Direktur", description: "Foto dan profil singkat direktur.", manage: { href: "/admin/pengaturan#direktur", label: "Ubah data direktur" } },
      { id: "cta", label: "Ajakan penutup", description: "Panel gelap berisi tombol penawaran & WhatsApp." },
    ],
  },
  {
    id: "tentang",
    label: "Tentang",
    href: "/tentang",
    sections: [
      { id: "intro", label: "Bagian atas", description: "Judul, profil perusahaan, dan foto.", fixed: true },
      { id: "director", label: "Direktur", manage: { href: "/admin/pengaturan#direktur", label: "Ubah data direktur" } },
      { id: "team", label: "Tim inti", description: "Nama, jabatan, dan foto tim." },
      { id: "timeline", label: "Rekam jejak", description: "Peristiwa penting per tahun." },
    ],
  },
  {
    id: "layanan",
    label: "Layanan",
    href: "/layanan",
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "list", label: "Daftar layanan", description: "Tambah, hapus, urutkan, dan beri foto tiap layanan." },
      { id: "process", label: "Alur kerja", description: "Memakai langkah yang sama dengan di Beranda." },
      { id: "cta", label: "Ajakan di bawah" },
    ],
  },
  {
    id: "proyek",
    label: "Proyek",
    href: "/proyek",
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "list", label: "Daftar & filter proyek", fixed: true, manage: { href: "/admin/proyek", label: "Kelola proyek" } },
      { id: "detail", label: "Halaman detail proyek", description: "Tulisan yang sama di setiap halaman proyek.", fixed: true },
    ],
  },
  {
    id: "kapasitas",
    label: "Kapasitas",
    href: "/kapasitas",
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "workshop", label: "Angka workshop" },
      { id: "gallery", label: "Foto workshop & alat" },
      { id: "equipment", label: "Daftar peralatan", description: "Tambah, hapus, dan urutkan alat." },
      { id: "note", label: "Catatan kapasitas angkat" },
    ],
  },
  {
    id: "legalitas",
    label: "Legalitas",
    href: "/legalitas",
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "warning", label: "Pemberitahuan kuning", description: "Hanya muncul jika ada SBU berstatus perlu verifikasi." },
      { id: "documents", label: "Daftar dokumen", manage: { href: "/admin/sertifikat", label: "Kelola sertifikat & PDF" } },
      { id: "system", label: "Kotak sistem manajemen" },
    ],
  },
  {
    id: "klien",
    label: "Klien",
    href: "/klien",
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "flagship", label: "Klien utama", manage: { href: "/admin/klien", label: "Kelola klien" } },
      { id: "testimonials", label: "Testimoni klien", description: "Memakai testimoni yang sama dengan di Beranda.", manage: { href: "/admin/halaman?halaman=beranda#editor-testimonials", label: "Ubah testimoni" } },
      { id: "others", label: "Klien lainnya", manage: { href: "/admin/klien", label: "Kelola klien" } },
    ],
  },
  {
    id: "hubungi",
    label: "Hubungi",
    href: "/hubungi",
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "form", label: "Formulir penawaran", fixed: true },
      { id: "office", label: "Kotak kantor", fixed: true, manage: { href: "/admin/pengaturan#kontak", label: "Ubah alamat & kontak" } },
    ],
  },
  {
    id: "k3",
    label: "K3 & Mutu",
    href: "/k3",
    optional: true,
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "stats", label: "Angka K3 & mutu", description: "Skor SMK3 dan sertifikasi diambil dari Info Perusahaan.", manage: { href: "/admin/pengaturan#mutu", label: "Ubah skor SMK3 & ISO" } },
      { id: "program", label: "Penerapan SMK3" },
      { id: "quality", label: "Sistem mutu ISO" },
      { id: "gallery", label: "Foto K3 di lapangan", description: "Tidak tampil sebelum ada foto." },
      { id: "cta", label: "Ajakan di bawah" },
    ],
  },
  {
    id: "karier",
    label: "Karier",
    href: "/karier",
    optional: true,
    sections: [
      { id: "intro", label: "Bagian atas", fixed: true },
      { id: "openings", label: "Lowongan", description: "Lowongan yang lewat batas tanggal otomatis disembunyikan.", fixed: true },
      { id: "how", label: "Cara melamar" },
    ],
  },
  {
    id: "umum",
    label: "Header & Footer",
    href: "/",
    sections: [
      { id: "header", label: "Header & menu", fixed: true },
      { id: "footer", label: "Footer", fixed: true },
      { id: "whatsapp", label: "Tombol WhatsApp melayang", fixed: true },
      { id: "download", label: "Unduh company profile", fixed: true, manage: { href: "/admin/pengaturan#unduhan", label: "Unggah PDF company profile" } },
      { id: "notfound", label: "Halaman tidak ditemukan (404)", fixed: true },
    ],
  },
];

export type PageId = (typeof PAGES)[number]["id"];

export function getPageDef(id: string): PageDef | undefined {
  return PAGES.find((p) => p.id === id);
}

/** Section ids of a page in display order, without the ones the admin hid. */
export function visibleSections(pageId: string, layout: LayoutMap): string[] {
  const page = getPageDef(pageId);
  if (!page) return [];
  return orderedSections(pageId, layout)
    .filter((s) => s.fixed || !layout[pageId]?.hidden?.includes(s.id))
    .map((s) => s.id);
}

/** All sections of a page in the admin's chosen order (fixed ones first). */
export function orderedSections(pageId: string, layout: LayoutMap): SectionDef[] {
  const page = getPageDef(pageId);
  if (!page) return [];
  const fixed = page.sections.filter((s) => s.fixed);
  const movable = page.sections.filter((s) => !s.fixed);
  const order = layout[pageId]?.order ?? [];
  const rank = (id: string) => {
    const i = order.indexOf(id);
    return i === -1 ? order.length + movable.findIndex((s) => s.id === id) : i;
  };
  return [...fixed, ...movable.slice().sort((a, b) => rank(a.id) - rank(b.id))];
}

export function isHidden(pageId: string, sectionId: string, layout: LayoutMap): boolean {
  return Boolean(layout[pageId]?.hidden?.includes(sectionId));
}

/** True when an optional page has been switched off in the admin. */
export function isPageHidden(pageId: string, hiddenPages: string[]): boolean {
  return Boolean(getPageDef(pageId)?.optional && hiddenPages.includes(pageId));
}
