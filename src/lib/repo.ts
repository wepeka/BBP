import "server-only";
import { readCollection, readCollectionFresh, writeCollection, newId } from "./store";
import type {
  AdminUser,
  Category,
  Certificate,
  Client,
  Equipment,
  LayoutMap,
  MediaItem,
  MediaMap,
  PageLayout,
  Project,
  RfqEntry,
  Service,
  Settings,
  SocialLinks,
  TeamMember,
} from "./types";
import { TEXT_DEFAULTS, getTextField, parseList, sameList, type TextKey, type Texts } from "./texts";
import { DEFAULT_CATEGORIES, slugify } from "./categories";
import { getMediaSlot } from "./media";
import { getPageDef } from "./sections";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

/* ---------- Settings ---------- */

const DEFAULT_SOCIAL: SocialLinks = { instagram: "", facebook: "", linkedin: "", youtube: "", tiktok: "" };
const DEFAULT_WA_MESSAGE = "Halo BBP, saya ingin menanyakan tentang layanan konstruksi Anda.";

function withSettingsDefaults(stored: Partial<Settings>): Settings {
  return {
    ...(stored as Settings),
    social: { ...DEFAULT_SOCIAL, ...(stored.social ?? {}) },
    whatsappMessage: stored.whatsappMessage ?? DEFAULT_WA_MESSAGE,
  };
}

export async function getSettings(): Promise<Settings> {
  return withSettingsDefaults(await readCollection<Partial<Settings>>("settings", {}));
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = withSettingsDefaults(await readCollectionFresh<Partial<Settings>>("settings", {}));
  const next: Settings = {
    ...current,
    ...patch,
    legal: { ...current.legal, ...patch.legal },
    director: { ...current.director, ...patch.director },
    stats: { ...current.stats, ...patch.stats },
    iso9001: { ...current.iso9001, ...patch.iso9001 },
    smk3: { ...current.smk3, ...patch.smk3 },
    social: { ...current.social, ...patch.social },
  };
  await writeCollection("settings", next);
  return next;
}

/* ---------- Projects ---------- */

/** Every project, including hidden drafts (admin). */
export async function getAllProjects(): Promise<Project[]> {
  const items = await readCollection<Project[]>("projects", []);
  return items.slice().sort(byOrder);
}

/** Projects visible on the public site. */
export async function getProjects(): Promise<Project[]> {
  return (await getAllProjects()).filter((p) => !p.hidden);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return (await getProjects()).find((p) => p.slug === slug) ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  return (await getAllProjects()).find((p) => p.id === id) ?? null;
}

export type ProjectInput = Omit<Project, "id" | "slug" | "order"> & { slug?: string };

function uniqueSlug(base: string, taken: Set<string>): string {
  const root = base || "proyek";
  let slug = root;
  let n = 2;
  while (taken.has(slug)) slug = `${root}-${n++}`;
  return slug;
}

export async function createProject(input: ProjectInput): Promise<Project> {
  const items = await readCollectionFresh<Project[]>("projects", []);
  const slug = uniqueSlug(
    slugify(input.slug?.trim() || `${input.titleId} ${input.city} ${input.year}`.trim()),
    new Set(items.map((p) => p.slug))
  );
  const project: Project = {
    ...input,
    id: newId("p"),
    slug,
    // New projects go to the top of the list.
    order: items.length ? Math.min(...items.map((p) => p.order)) - 1 : 1,
  };
  items.push(project);
  await writeCollection("projects", items);
  return project;
}

export async function updateProject(id: string, patch: Partial<ProjectInput>): Promise<Project | null> {
  const items = await readCollectionFresh<Project[]>("projects", []);
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const next = { ...items[idx], ...patch } as Project;
  if (patch.slug !== undefined) {
    const taken = new Set(items.filter((p) => p.id !== id).map((p) => p.slug));
    next.slug = uniqueSlug(slugify(patch.slug) || items[idx].slug, taken);
  }
  items[idx] = next;
  await writeCollection("projects", items);
  return next;
}

export async function deleteProject(id: string): Promise<boolean> {
  const items = await readCollectionFresh<Project[]>("projects", []);
  const next = items.filter((p) => p.id !== id);
  if (next.length === items.length) return false;
  await writeCollection("projects", next);
  return true;
}

/** Saves a new display order: `ids` first-to-last. Unknown ids are ignored. */
export async function reorderProjects(ids: string[]): Promise<void> {
  const items = await readCollectionFresh<Project[]>("projects", []);
  const rank = new Map(ids.map((id, i) => [id, i]));
  const sorted = items
    .slice()
    .sort(byOrder)
    .sort((a, b) => (rank.get(a.id) ?? ids.length) - (rank.get(b.id) ?? ids.length));
  await writeCollection(
    "projects",
    sorted.map((p, i) => ({ ...p, order: i + 1 }))
  );
}

/* ---------- Categories ---------- */

export async function getCategories(): Promise<Category[]> {
  const items = await readCollection<Category[] | null>("categories", null);
  return items?.length ? items : DEFAULT_CATEGORIES;
}

export async function replaceCategories(list: { id?: string; label: string }[]): Promise<Category[]> {
  const taken = new Set<string>();
  const next = list
    .filter((c) => c.label.trim())
    .map((c) => {
      const id = uniqueSlug(c.id?.trim() || slugify(c.label), taken);
      taken.add(id);
      return { id, label: c.label.trim() };
    });
  await writeCollection("categories", next);
  return next;
}

/* ---------- Clients ---------- */

export async function getAllClients(): Promise<Client[]> {
  return readCollection<Client[]>("clients", []);
}

export async function getClients(): Promise<Client[]> {
  return (await getAllClients()).filter((c) => !c.hidden);
}

export async function createClient(input: Omit<Client, "id">): Promise<Client> {
  const items = await readCollectionFresh<Client[]>("clients", []);
  const client: Client = { ...input, id: newId("c") };
  items.push(client);
  await writeCollection("clients", items);
  return client;
}

export async function updateClient(id: string, patch: Partial<Omit<Client, "id">>): Promise<Client | null> {
  const items = await readCollectionFresh<Client[]>("clients", []);
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeCollection("clients", items);
  return items[idx];
}

export async function deleteClient(id: string): Promise<boolean> {
  const items = await readCollectionFresh<Client[]>("clients", []);
  const next = items.filter((c) => c.id !== id);
  if (next.length === items.length) return false;
  await writeCollection("clients", next);
  return true;
}

export async function reorderClients(ids: string[]): Promise<void> {
  const items = await readCollectionFresh<Client[]>("clients", []);
  const rank = new Map(ids.map((id, i) => [id, i]));
  await writeCollection(
    "clients",
    items.slice().sort((a, b) => (rank.get(a.id) ?? ids.length) - (rank.get(b.id) ?? ids.length))
  );
}

/* ---------- Services ---------- */

export async function getServices(): Promise<Service[]> {
  const items = await readCollection<Service[]>("services", []);
  return items.slice().sort(byOrder);
}

export async function replaceServices(list: Omit<Service, "order">[]): Promise<void> {
  const taken = new Set<string>();
  const next: Service[] = list.map((s, i) => {
    const id = uniqueSlug(s.id?.trim() || slugify(s.nameId), taken);
    taken.add(id);
    return { ...s, id, order: i + 1 };
  });
  await writeCollection("services", next);
}

/* ---------- Equipment ---------- */

export async function getEquipment(): Promise<Equipment[]> {
  return readCollection<Equipment[]>("equipment", []);
}

export async function replaceEquipment(list: Equipment[]): Promise<void> {
  await writeCollection(
    "equipment",
    list.map((e) => ({ ...e, id: e.id || newId("e") }))
  );
}

/* ---------- Team ---------- */

export async function getTeam(): Promise<TeamMember[]> {
  const items = await readCollection<TeamMember[]>("team", []);
  return items.slice().sort(byOrder);
}

/** Replaces the whole team list (the admin edits it as one ordered list). */
export async function replaceTeam(members: { id?: string; name: string; role: string; photo?: string | null }[]): Promise<void> {
  const next: TeamMember[] = members.map((m, i) => ({
    id: m.id || newId("t"),
    name: m.name,
    role: m.role,
    photo: m.photo ?? null,
    order: i + 1,
  }));
  await writeCollection("team", next);
}

/* ---------- Certificates ---------- */

export async function getAllCertificates(): Promise<Certificate[]> {
  return readCollection<Certificate[]>("certificates", []);
}

/**
 * Public certificates. A certificate whose expiry date has passed is shown as
 * expired even if nobody updated its status yet.
 */
export async function getCertificates(): Promise<Certificate[]> {
  const today = new Date().toISOString().slice(0, 10);
  return (await getAllCertificates())
    .filter((c) => !c.hidden)
    .map((c) => (c.expiresAt && c.expiresAt < today && c.status === "berlaku" ? { ...c, status: "kedaluwarsa" } : c));
}

export async function saveCertificate(input: Omit<Certificate, "id">, id?: string): Promise<Certificate> {
  const items = await readCollectionFresh<Certificate[]>("certificates", []);
  if (id) {
    const idx = items.findIndex((c) => c.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...input, id };
      await writeCollection("certificates", items);
      return items[idx];
    }
  }
  const cert: Certificate = { ...input, id: newId("cert") };
  items.push(cert);
  await writeCollection("certificates", items);
  return cert;
}

export async function deleteCertificate(id: string): Promise<void> {
  const items = await readCollectionFresh<Certificate[]>("certificates", []);
  await writeCollection(
    "certificates",
    items.filter((c) => c.id !== id)
  );
}

export async function reorderCertificates(ids: string[]): Promise<void> {
  const items = await readCollectionFresh<Certificate[]>("certificates", []);
  const rank = new Map(ids.map((id, i) => [id, i]));
  await writeCollection(
    "certificates",
    items.slice().sort((a, b) => (rank.get(a.id) ?? ids.length) - (rank.get(b.id) ?? ids.length))
  );
}

/* ---------- RFQ inbox ---------- */

export async function getRfqEntries(): Promise<RfqEntry[]> {
  const items = await readCollection<RfqEntry[]>("rfq", []);
  return items.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createRfqEntry(
  input: Omit<RfqEntry, "id" | "createdAt" | "status" | "internalNote">
): Promise<RfqEntry> {
  const items = await readCollectionFresh<RfqEntry[]>("rfq", []);
  const entry: RfqEntry = {
    ...input,
    id: newId("rfq"),
    createdAt: new Date().toISOString(),
    status: "baru",
    internalNote: null,
  };
  items.push(entry);
  await writeCollection("rfq", items);
  return entry;
}

export async function updateRfqEntry(
  id: string,
  patch: Partial<Pick<RfqEntry, "status" | "internalNote">>
): Promise<RfqEntry | null> {
  const items = await readCollectionFresh<RfqEntry[]>("rfq", []);
  const idx = items.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeCollection("rfq", items);
  return items[idx];
}

export async function deleteRfqEntry(id: string): Promise<void> {
  const items = await readCollectionFresh<RfqEntry[]>("rfq", []);
  await writeCollection(
    "rfq",
    items.filter((r) => r.id !== id)
  );
}

/* ---------- Page texts ---------- */

/** Only texts the admin changed are stored; everything else uses TEXT_DEFAULTS. */
export async function getTextOverrides(): Promise<Partial<Texts>> {
  return readCollection<Partial<Texts>>("texts", {});
}

/** Defaults, plus the hero copy that used to live in settings (kept until edited). */
function textBase(settings: Partial<Settings>): Texts {
  const base = { ...TEXT_DEFAULTS };
  if (settings.heroHeadlineId) base["home.hero.title"] = settings.heroHeadlineId;
  if (settings.heroSubheadId) base["home.hero.subtitle"] = settings.heroSubheadId;
  return base;
}

export async function getTexts(): Promise<Texts> {
  const [settings, overrides] = await Promise.all([getSettings(), getTextOverrides()]);
  return { ...textBase(settings), ...overrides };
}

/** Saves the given texts; a value equal to its default removes the override. */
export async function updateTexts(values: Partial<Record<TextKey, string>>): Promise<void> {
  const [settings, overrides] = await Promise.all([
    readCollectionFresh<Partial<Settings>>("settings", {}),
    readCollectionFresh<Partial<Texts>>("texts", {}),
  ]);
  const base = textBase(settings);
  for (const [key, value] of Object.entries(values) as [TextKey, string][]) {
    if (!(key in TEXT_DEFAULTS)) continue;
    const isList = Boolean(getTextField(key)?.columns);
    const same = isList ? sameList(value, base[key]) : value === base[key];
    if (same) delete overrides[key];
    else overrides[key] = value;
  }
  await writeCollection("texts", overrides);
}

/* ---------- Media slots ---------- */

export async function getMedia(): Promise<MediaMap> {
  return readCollection<MediaMap>("media", {});
}

function cleanMedia(items: MediaItem[]): MediaItem[] {
  return items
    .filter((m) => m && typeof m.src === "string" && m.src.trim())
    .map((m) => ({
      src: m.src.trim(),
      ...(m.alt?.trim() ? { alt: m.alt.trim() } : {}),
      ...(m.projectId ? { projectId: m.projectId } : {}),
    }));
}

/** Saves photo slots; a slot equal to its default removes the override. */
export async function updateMedia(values: MediaMap): Promise<void> {
  const current = await readCollectionFresh<MediaMap>("media", {});
  for (const [key, items] of Object.entries(values)) {
    const slot = getMediaSlot(key);
    if (!slot) continue;
    const next = cleanMedia(items).slice(0, slot.multiple ? 24 : 1);
    if (JSON.stringify(next) === JSON.stringify(cleanMedia(slot.default))) delete current[key];
    else current[key] = next;
  }
  await writeCollection("media", current);
}

/* ---------- Section layout ---------- */

export async function getLayout(): Promise<LayoutMap> {
  return readCollection<LayoutMap>("layout", {});
}

export async function updateLayout(pageId: string, layout: PageLayout): Promise<void> {
  const page = getPageDef(pageId);
  if (!page) return;
  const ids = new Set(page.sections.filter((s) => !s.fixed).map((s) => s.id));
  const current = await readCollectionFresh<LayoutMap>("layout", {});
  current[pageId] = {
    order: (layout.order ?? []).filter((id) => ids.has(id)),
    hidden: (layout.hidden ?? []).filter((id) => ids.has(id)),
  };
  await writeCollection("layout", current);
}

/* ---------- Admin users ---------- */

export async function getAdminUsers(): Promise<AdminUser[]> {
  return readCollectionFresh<AdminUser[]>("admin-users", []);
}

export async function saveAdminUsers(users: AdminUser[]): Promise<void> {
  await writeCollection("admin-users", users);
}

/* ---------- Backup ---------- */

/** Collections included in a backup (admin accounts are left out on purpose). */
export const BACKUP_COLLECTIONS = [
  "settings",
  "texts",
  "media",
  "layout",
  "projects",
  "categories",
  "clients",
  "services",
  "equipment",
  "team",
  "certificates",
  "rfq",
] as const;

export async function exportAll(): Promise<Record<string, unknown>> {
  const entries = await Promise.all(
    BACKUP_COLLECTIONS.map(async (name) => [name, await readCollectionFresh<unknown>(name, null)] as const)
  );
  return Object.fromEntries(entries.filter(([, v]) => v !== null));
}

export async function importAll(data: Record<string, unknown>): Promise<string[]> {
  const restored: string[] = [];
  for (const name of BACKUP_COLLECTIONS) {
    const value = data[name];
    if (value === undefined || value === null) continue;
    const expectArray = !["settings", "texts", "media", "layout"].includes(name);
    if (expectArray !== Array.isArray(value)) continue;
    await writeCollection(name, value);
    restored.push(name);
  }
  return restored;
}

/** Every list column default parsed, for callers that need rows. */
export function listRows(texts: Texts, key: TextKey): string[][] {
  return parseList(texts[key]);
}
