"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/auth";
import { createClient, deleteClient, reorderClients, updateClient } from "@/lib/repo";
import type { Client } from "@/lib/types";

export type ClientResult = { ok: true; client: Client } | { ok: false; error: string };
export type SimpleResult = { ok: true } | { ok: false; error: string };

export interface ClientFormData {
  name: string;
  note: string;
  city: string;
  province: string;
  since: string;
  projectCount: string;
  flagship: boolean;
  logo: string | null;
  website: string;
  hidden: boolean;
}

const t = (v: unknown) => String(v ?? "").trim();

export async function saveClientAction(id: string | null, d: ClientFormData): Promise<ClientResult> {
  try {
    await requireEditor();
    if (!t(d.name)) return { ok: false, error: "Isi nama klien." };
    const data: Omit<Client, "id"> = {
      name: t(d.name),
      note: t(d.note) || null,
      city: t(d.city),
      province: t(d.province),
      since: Number(d.since) || undefined,
      projectCount: Number(d.projectCount) || undefined,
      flagship: Boolean(d.flagship),
      logo: d.logo || null,
      website: t(d.website) || null,
      hidden: Boolean(d.hidden),
    };
    const client = id ? await updateClient(id, data) : await createClient(data);
    if (!client) return { ok: false, error: "Klien tidak ditemukan." };
    revalidatePath("/", "layout");
    return { ok: true, client };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteClientAction(id: string): Promise<SimpleResult> {
  try {
    await requireEditor();
    await deleteClient(id);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function reorderClientsAction(ids: string[]): Promise<SimpleResult> {
  try {
    await requireEditor();
    await reorderClients(ids);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
