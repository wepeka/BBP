import "server-only";
import { readCollection, writeCollection, newId } from "./store";
import type {
  Project,
  Client,
  Service,
  Equipment,
  TeamMember,
  Certificate,
  Settings,
  RfqEntry,
} from "./types";

/* ---------- Projects ---------- */

export async function getProjects(): Promise<Project[]> {
  const items = await readCollection<Project[]>("projects", []);
  return items.slice().sort((a, b) => a.order - b.order);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const items = await getProjects();
  return items.find((p) => p.slug === slug) ?? null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const items = await getProjects();
  return items.find((p) => p.id === id) ?? null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProject(
  input: Omit<Project, "id" | "slug" | "order"> & { slug?: string }
): Promise<Project> {
  const items = await readCollection<Project[]>("projects", []);
  const baseSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.titleId);
  let slug = baseSlug || newId("proyek");
  let n = 2;
  while (items.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${n++}`;
  }
  const project: Project = {
    ...input,
    id: newId("p"),
    slug,
    order: items.length ? Math.max(...items.map((p) => p.order)) + 1 : 1,
  };
  items.push(project);
  await writeCollection("projects", items);
  return project;
}

export async function updateProject(
  id: string,
  patch: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  const items = await readCollection<Project[]>("projects", []);
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  if (patch.slug) patch.slug = slugify(patch.slug);
  items[idx] = { ...items[idx], ...patch };
  await writeCollection("projects", items);
  return items[idx];
}

export async function deleteProject(id: string): Promise<boolean> {
  const items = await readCollection<Project[]>("projects", []);
  const next = items.filter((p) => p.id !== id);
  if (next.length === items.length) return false;
  await writeCollection("projects", next);
  return true;
}

/* ---------- Clients ---------- */

export async function getClients(): Promise<Client[]> {
  return readCollection<Client[]>("clients", []);
}

export async function createClient(input: Omit<Client, "id">): Promise<Client> {
  const items = await getClients();
  const client: Client = { ...input, id: newId("c") };
  items.push(client);
  await writeCollection("clients", items);
  return client;
}

export async function updateClient(id: string, patch: Partial<Omit<Client, "id">>): Promise<Client | null> {
  const items = await getClients();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeCollection("clients", items);
  return items[idx];
}

export async function deleteClient(id: string): Promise<boolean> {
  const items = await getClients();
  const next = items.filter((c) => c.id !== id);
  if (next.length === items.length) return false;
  await writeCollection("clients", next);
  return true;
}

/* ---------- Services ---------- */

export async function getServices(): Promise<Service[]> {
  const items = await readCollection<Service[]>("services", []);
  return items.slice().sort((a, b) => a.order - b.order);
}

/* ---------- Equipment ---------- */

export async function getEquipment(): Promise<Equipment[]> {
  return readCollection<Equipment[]>("equipment", []);
}

/* ---------- Team ---------- */

export async function getTeam(): Promise<TeamMember[]> {
  const items = await readCollection<TeamMember[]>("team", []);
  return items.slice().sort((a, b) => a.order - b.order);
}

/* ---------- Certificates ---------- */

export async function getCertificates(): Promise<Certificate[]> {
  return readCollection<Certificate[]>("certificates", []);
}

export async function updateCertificate(
  id: string,
  patch: Partial<Omit<Certificate, "id">>
): Promise<Certificate | null> {
  const items = await getCertificates();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeCollection("certificates", items);
  return items[idx];
}

/* ---------- Settings ---------- */

export async function getSettings(): Promise<Settings> {
  return readCollection<Settings>("settings", {} as Settings);
}

export async function updateSettings(patch: Partial<Settings>): Promise<Settings> {
  const current = await getSettings();
  const next = { ...current, ...patch };
  await writeCollection("settings", next);
  return next;
}

/* ---------- RFQ inbox ---------- */

export async function getRfqEntries(): Promise<RfqEntry[]> {
  const items = await readCollection<RfqEntry[]>("rfq", []);
  return items
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createRfqEntry(
  input: Omit<RfqEntry, "id" | "createdAt" | "status" | "internalNote">
): Promise<RfqEntry> {
  const items = await readCollection<RfqEntry[]>("rfq", []);
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
  const items = await readCollection<RfqEntry[]>("rfq", []);
  const idx = items.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeCollection("rfq", items);
  return items[idx];
}
