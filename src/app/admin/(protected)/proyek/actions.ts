"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/auth";
import {
  createProject,
  deleteProject,
  getProjectById,
  reorderProjects,
  updateProject,
  type ProjectInput,
} from "@/lib/repo";
import type { Project, ProjectStatus } from "@/lib/types";

export type ProjectResult = { ok: true; id: string; slug: string } | { ok: false; error: string };
export type SimpleResult = { ok: true } | { ok: false; error: string };

export interface ProjectFormData {
  titleId: string;
  titleEn: string;
  slug: string;
  client: string;
  clientNote: string;
  city: string;
  province: string;
  year: string;
  status: ProjectStatus;
  categories: string[];
  lat: number;
  lng: number;
  scope: string;
  descriptionId: string;
  images: string[];
  featured: boolean;
  hidden: boolean;
  area: string;
  duration: string;
  facts: { label: string; value: string }[];
  videoUrl: string;
}

const t = (v: unknown) => String(v ?? "").replace(/\r\n/g, "\n").trim();

function refresh(slug?: string) {
  revalidatePath("/", "layout");
  if (slug) revalidatePath(`/proyek/${slug}`);
}

function validate(d: ProjectFormData): string | null {
  if (!t(d.titleId)) return "Isi judul proyek.";
  if (!t(d.city)) return "Isi kota lokasi proyek.";
  if (!t(d.province)) return "Isi provinsi lokasi proyek.";
  if (!t(d.year)) return "Isi tahun atau periode pengerjaan.";
  return null;
}

function toInput(d: ProjectFormData): ProjectInput {
  return {
    titleId: t(d.titleId),
    titleEn: t(d.titleEn) || t(d.titleId),
    client: t(d.client) || null,
    clientNote: t(d.clientNote) || null,
    city: t(d.city),
    province: t(d.province),
    year: t(d.year),
    status: d.status === "berjalan" ? "berjalan" : "selesai",
    categories: Array.from(new Set(d.categories.filter(Boolean))),
    lat: Number(d.lat) || 0,
    lng: Number(d.lng) || 0,
    scope: t(d.scope),
    descriptionId: t(d.descriptionId),
    images: d.images.filter(Boolean),
    featured: Boolean(d.featured),
    hidden: Boolean(d.hidden),
    area: t(d.area) || null,
    duration: t(d.duration) || null,
    facts: (d.facts ?? []).map((f) => ({ label: t(f.label), value: t(f.value) })).filter((f) => f.label && f.value),
    videoUrl: t(d.videoUrl) || null,
    slug: t(d.slug),
  };
}

export async function saveProjectAction(id: string | null, data: ProjectFormData): Promise<ProjectResult> {
  try {
    await requireEditor();
    const error = validate(data);
    if (error) return { ok: false, error };
    const input = toInput(data);
    if (!id) {
      const created = await createProject(input);
      refresh(created.slug);
      return { ok: true, id: created.id, slug: created.slug };
    }
    const before = await getProjectById(id);
    if (!before) return { ok: false, error: "Proyek tidak ditemukan. Mungkin sudah dihapus." };
    const { slug, ...rest } = input;
    const updated = await updateProject(id, slug && slug !== before.slug ? { ...rest, slug } : rest);
    if (!updated) return { ok: false, error: "Proyek tidak ditemukan." };
    refresh(before.slug);
    refresh(updated.slug);
    return { ok: true, id: updated.id, slug: updated.slug };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "Gagal menyimpan proyek." };
  }
}

export async function deleteProjectAction(id: string): Promise<SimpleResult> {
  try {
    await requireEditor();
    const before = await getProjectById(id);
    await deleteProject(id);
    refresh(before?.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function duplicateProjectAction(id: string): Promise<ProjectResult> {
  try {
    await requireEditor();
    const p = await getProjectById(id);
    if (!p) return { ok: false, error: "Proyek tidak ditemukan." };
    const { id: _id, slug: _slug, order: _order, ...rest } = p;
    void _id;
    void _slug;
    void _order;
    const copy = await createProject({ ...rest, titleId: `${p.titleId} (salinan)`, hidden: true, featured: false });
    refresh();
    return { ok: true, id: copy.id, slug: copy.slug };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function reorderProjectsAction(ids: string[]): Promise<SimpleResult> {
  try {
    await requireEditor();
    await reorderProjects(ids);
    refresh();
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function setProjectFlagsAction(
  id: string,
  patch: Partial<Pick<Project, "featured" | "hidden" | "status">>
): Promise<SimpleResult> {
  try {
    await requireEditor();
    const clean: Partial<Pick<Project, "featured" | "hidden" | "status">> = {};
    if (typeof patch.featured === "boolean") clean.featured = patch.featured;
    if (typeof patch.hidden === "boolean") clean.hidden = patch.hidden;
    if (patch.status === "selesai" || patch.status === "berjalan") clean.status = patch.status;
    const p = await updateProject(id, clean);
    refresh(p?.slug);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
