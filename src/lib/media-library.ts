import "server-only";
import {
  getAllCertificates,
  getAllClients,
  getAllProjects,
  getEquipment,
  getMedia,
  getServices,
  getTeam,
} from "./repo";
import { listUploads, uploadPathname } from "./store";
import { MEDIA_SLOTS, mediaFor } from "./media";

export interface LibraryItem {
  url: string;
  name: string;
  kind: "image" | "pdf";
  size: number | null;
  uploadedAt: string | null;
  /** Uploaded through the admin (can be deleted) vs. shipped with the site. */
  uploaded: boolean;
  usedIn: string[];
}

/** Where each picture/PDF is used, keyed by URL, with human-readable labels. */
export async function mediaUsage(): Promise<Map<string, string[]>> {
  const [projects, clients, services, team, equipment, certificates, media] = await Promise.all([
    getAllProjects(),
    getAllClients(),
    getServices(),
    getTeam(),
    getEquipment(),
    getAllCertificates(),
    getMedia(),
  ]);
  const usage = new Map<string, string[]>();
  const add = (url: string | null | undefined, label: string) => {
    if (!url) return;
    usage.set(url, [...(usage.get(url) ?? []), label]);
  };
  for (const p of projects) p.images.forEach((src) => add(src, `Proyek: ${p.titleId}`));
  for (const c of clients) add(c.logo, `Logo klien: ${c.name}`);
  for (const s of services) add(s.image, `Layanan: ${s.nameId}`);
  for (const m of team) add(m.photo, `Tim: ${m.name}`);
  for (const e of equipment) add(e.image, `Alat: ${e.name}`);
  for (const c of certificates) add(c.fileUrl, `Sertifikat: ${c.name}`);
  for (const slot of MEDIA_SLOTS) mediaFor(media, slot.key).forEach((m) => add(m.src, slot.label));
  return usage;
}

function nameOf(url: string): string {
  const file = decodeURIComponent(url.split("/").pop() ?? url);
  const folder = url.split("/").slice(-2, -1)[0] ?? "";
  return `${folder ? `${folder}/` : ""}${file}`;
}

/** Every picture the admin can pick: uploads first (newest first), then built-in photos. */
export async function libraryItems(): Promise<LibraryItem[]> {
  const [usage, images, documents] = await Promise.all([
    mediaUsage(),
    listUploads("images/uploads/"),
    listUploads("documents/"),
  ]);
  const seen = new Set<string>();
  const items: LibraryItem[] = [];
  for (const u of [...images, ...documents]) {
    seen.add(u.url);
    items.push({
      url: u.url,
      name: nameOf(u.url),
      kind: u.pathname.endsWith(".pdf") ? "pdf" : "image",
      size: u.size,
      uploadedAt: u.uploadedAt,
      uploaded: true,
      usedIn: usage.get(u.url) ?? [],
    });
  }
  for (const [url, usedIn] of usage) {
    if (seen.has(url) || uploadPathname(url)) continue;
    seen.add(url);
    items.push({
      url,
      name: nameOf(url),
      kind: url.endsWith(".pdf") ? "pdf" : "image",
      size: null,
      uploadedAt: null,
      uploaded: false,
      usedIn,
    });
  }
  return items;
}
