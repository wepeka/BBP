import type { MediaItem, MediaMap } from "./types";

/**
 * Every photo slot on the public site that isn't owned by a record (projects,
 * clients, team members and services carry their own photos). The admin page
 * editor shows these next to the texts of the same section, and only slots
 * the admin changed are stored (the "media" collection).
 *
 * - `multiple`: an ordered list (e.g. hero slideshow, gallery).
 * - `projectLink`: each picture can point at a project, whose details are
 *   then shown with it (hero "title block").
 * - `aspect`: crop the site uses, shown in the admin as a hint.
 */
export interface MediaSlot {
  key: string;
  page: string;
  section: string;
  label: string;
  hint?: string;
  multiple?: boolean;
  projectLink?: boolean;
  aspect?: string;
  default: MediaItem[];
}

export const MEDIA_SLOTS: MediaSlot[] = [
  {
    key: "home.hero",
    page: "beranda",
    section: "hero",
    label: "Foto hero",
    hint: "Foto di samping judul besar. Tambahkan lebih dari satu foto agar tampil bergantian di bingkai yang sama.",
    multiple: true,
    aspect: "4:5",
    default: [{ src: "/images/hero/1.jpeg", alt: "Rangka struktur baja proyek gudang industri BBP" }],
  },
  {
    key: "director.photo",
    page: "beranda",
    section: "director",
    label: "Foto di samping profil direktur",
    hint: "Dipakai di Beranda dan halaman Tentang. Foto potret direktur paling cocok.",
    aspect: "4:5",
    default: [{ src: "/images/about/1.jpeg", alt: "Kantor PT. Bina Bangun Perkasa di Kediri" }],
  },
  {
    key: "home.cta",
    page: "beranda",
    section: "cta",
    label: "Foto latar panel penutup (opsional)",
    hint: "Ditampilkan samar di belakang panel hijau gelap. Kosongkan untuk panel polos.",
    aspect: "16:9",
    default: [],
  },
  {
    key: "about.main",
    page: "tentang",
    section: "intro",
    label: "Foto utama",
    aspect: "4:3",
    default: [{ src: "/images/about/1.jpeg", alt: "Kantor PT. Bina Bangun Perkasa, Jl. Urip Sumoharjo, Kediri" }],
  },
  {
    key: "capacity.gallery",
    page: "kapasitas",
    section: "gallery",
    label: "Foto workshop & alat",
    multiple: true,
    aspect: "4:3",
    default: [
      { src: "/images/workshop/1.jpeg", alt: "Workshop fabrikasi baja BBP" },
      { src: "/images/workshop/2.jpeg", alt: "Excavator CAT milik BBP di lokasi proyek" },
      { src: "/images/workshop/3.jpeg", alt: "Area kerja workshop BBP" },
    ],
  },
  {
    key: "home.video.poster",
    page: "beranda",
    section: "video",
    label: "Gambar sampul video (opsional)",
    hint: "Tampil sebelum video diputar. Kosongkan untuk memakai gambar dari YouTube.",
    aspect: "16:9",
    default: [],
  },
  {
    key: "k3.gallery",
    page: "k3",
    section: "gallery",
    label: "Foto K3 di lapangan",
    hint: "mis. pekerja dengan APD, safety briefing, rambu proyek.",
    multiple: true,
    aspect: "4:3",
    default: [],
  },
  {
    key: "contact.office",
    page: "hubungi",
    section: "office",
    label: "Foto kantor (opsional)",
    aspect: "16:9",
    default: [],
  },
  {
    key: "brand.logo",
    page: "umum",
    section: "header",
    label: "Logo",
    hint: "PNG/WebP dengan latar transparan. Dipakai di header, footer, dan admin.",
    default: [{ src: "/images/brand/logo-bbp.png", alt: "Logo PT. Bina Bangun Perkasa" }],
  },
];

export function getMediaSlot(key: string): MediaSlot | undefined {
  return MEDIA_SLOTS.find((s) => s.key === key);
}

/** Stored pictures for a slot, or its defaults if the admin never changed it. */
export function mediaFor(media: MediaMap, key: string): MediaItem[] {
  const stored = media[key];
  if (Array.isArray(stored)) return stored.filter((m) => m && typeof m.src === "string" && m.src);
  return getMediaSlot(key)?.default ?? [];
}

export function firstMedia(media: MediaMap, key: string): MediaItem | null {
  return mediaFor(media, key)[0] ?? null;
}
