"use server";

import { promises as fs } from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import {
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from "@/lib/repo";
import type { ProjectStatus } from "@/lib/types";

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

async function saveUploads(files: File[], slug: string): Promise<string[]> {
  const valid = files.filter((f) => f && f.size > 0);
  if (!valid.length) return [];

  const dir = path.join(process.cwd(), "public", "images", "uploads", slug);
  await fs.mkdir(dir, { recursive: true });

  const saved: string[] = [];
  for (const file of valid) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext || "jpg"}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);
    saved.push(`/images/uploads/${slug}/${filename}`);
  }
  return saved;
}

function readForm(formData: FormData) {
  const categories = formData.getAll("categories").map(String).filter(Boolean);
  const keepImages = formData.getAll("keepImages").map(String);
  const newFiles = formData.getAll("newImages").filter((v): v is File => v instanceof File);

  return {
    titleId: String(formData.get("titleId") ?? "").trim(),
    titleEn: String(formData.get("titleEn") ?? "").trim() || String(formData.get("titleId") ?? "").trim(),
    client: String(formData.get("client") ?? "").trim() || null,
    clientNote: String(formData.get("clientNote") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim(),
    province: String(formData.get("province") ?? "").trim(),
    year: String(formData.get("year") ?? "").trim(),
    status: (String(formData.get("status") ?? "selesai") as ProjectStatus),
    categories,
    lat: Number(formData.get("lat") ?? 0) || 0,
    lng: Number(formData.get("lng") ?? 0) || 0,
    scope: String(formData.get("scope") ?? "").trim(),
    descriptionId: String(formData.get("descriptionId") ?? "").trim(),
    featured: formData.get("featured") === "on",
    keepImages,
    newFiles,
    slug: String(formData.get("slug") ?? "").trim(),
  };
}

export async function createProjectAction(formData: FormData) {
  await requireSession();
  const data = readForm(formData);

  const project = await createProject({
    titleId: data.titleId,
    titleEn: data.titleEn,
    client: data.client,
    clientNote: data.clientNote,
    city: data.city,
    province: data.province,
    year: data.year,
    status: data.status,
    categories: data.categories,
    lat: data.lat,
    lng: data.lng,
    scope: data.scope,
    descriptionId: data.descriptionId,
    images: [],
    featured: data.featured,
    slug: data.slug,
  });

  const uploaded = await saveUploads(data.newFiles, project.slug);
  if (uploaded.length) {
    await updateProject(project.id, { images: uploaded });
  }

  revalidatePath("/proyek");
  revalidatePath("/admin/proyek");
  redirect(`/admin/proyek/${project.id}`);
}

export async function updateProjectAction(id: string, formData: FormData) {
  await requireSession();
  const existing = await getProjectById(id);
  if (!existing) throw new Error("Proyek tidak ditemukan");

  const data = readForm(formData);
  const uploaded = await saveUploads(data.newFiles, existing.slug);
  const images = [...data.keepImages, ...uploaded];

  await updateProject(id, {
    titleId: data.titleId,
    titleEn: data.titleEn,
    client: data.client,
    clientNote: data.clientNote,
    city: data.city,
    province: data.province,
    year: data.year,
    status: data.status,
    categories: data.categories,
    lat: data.lat,
    lng: data.lng,
    scope: data.scope,
    descriptionId: data.descriptionId,
    featured: data.featured,
    images,
  });

  revalidatePath("/proyek");
  revalidatePath(`/proyek/${existing.slug}`);
  revalidatePath("/admin/proyek");
  redirect(`/admin/proyek/${id}`);
}

export async function deleteProjectAction(id: string) {
  await requireSession();
  await deleteProject(id);
  revalidatePath("/proyek");
  revalidatePath("/admin/proyek");
  redirect("/admin/proyek");
}
