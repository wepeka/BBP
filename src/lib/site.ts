import type { Settings } from "./types";

export const SITE_URL = "https://binabangunperkasa.co.id";

export function waLink(number: string, text?: string): string {
  const digits = number.replace(/[^0-9]/g, "").replace(/^0/, "62");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

export function mapsLink(settings: Pick<Settings, "officeLat" | "officeLng" | "mapEmbedQuery" | "address">): string {
  const q = settings.mapEmbedQuery || settings.address || `${settings.officeLat},${settings.officeLng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

/** Years since the founding date ("28 November 2012"), or the stored number if it can't be parsed. */
export function yearsSince(established: string, fallback: number): number {
  const year = Number(established.match(/(19|20)\d{2}/)?.[0]);
  if (!year) return fallback;
  const months = ["januari", "februari", "maret", "april", "mei", "juni", "juli", "agustus", "september", "oktober", "november", "desember"];
  const lower = established.toLowerCase();
  const month = Math.max(0, months.findIndex((m) => lower.includes(m)));
  const day = Number(lower.match(/^\s*(\d{1,2})\s/)?.[1] ?? 1);
  const now = new Date();
  let years = now.getFullYear() - year;
  if (now.getMonth() < month || (now.getMonth() === month && now.getDate() < day)) years -= 1;
  return Math.max(years, 0);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("id-ID", opts);
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/** Days until an ISO date (negative when already past), or null without a date. */
export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return Math.ceil((d.getTime() - Date.now()) / 86_400_000);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
}

/**
 * Counts distinct cities, treating "Jakarta Selatan", "Jakarta – Bandung" and
 * "Kediri (Grogol)" as the cities they belong to.
 */
export function countCities(projects: { city: string }[]): number {
  const key = (city: string) =>
    city
      .replace(/\(.*?\)/g, "")
      .split(/[–—-]/)[0]
      .replace(/\b(selatan|utara|timur|barat|pusat|kota|kab\.?|kabupaten)\b/gi, "")
      .trim()
      .toLowerCase();
  return new Set(projects.map((p) => key(p.city)).filter(Boolean)).size;
}

/** Values the admin can drop into texts as {placeholders}. */
export function statVars(settings: Settings, projects: { city: string }[]) {
  const years = yearsSince(settings.established, settings.stats.yearsActive);
  return {
    tahun: years,
    kota: countCities(projects) || settings.stats.cities,
    jumlahProyek: settings.stats.projects,
    jumlahKlien: settings.stats.clients,
    iso: settings.iso9001.standard,
    skorSmk3: formatNumber(settings.smk3.score),
  };
}

/** True when a project's client field refers to the given client record (names may be abbreviated). */
export function sameClient(projectClient: string | null | undefined, clientName: string): boolean {
  if (!projectClient) return false;
  const a = projectClient.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const b = clientName.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return a === b || a.startsWith(b) || b.startsWith(a);
}
