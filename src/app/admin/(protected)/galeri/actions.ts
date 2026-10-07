"use server";

import { requireEditor } from "@/lib/auth";
import { mediaUsage } from "@/lib/media-library";
import { deleteUpload, uploadPathname } from "@/lib/store";

export type DeleteResult = { ok: true } | { ok: false; error: string; usedIn?: string[] };

export async function deleteMediaAction(url: string): Promise<DeleteResult> {
  try {
    await requireEditor();
    if (!uploadPathname(url)) return { ok: false, error: "Foto bawaan website tidak bisa dihapus dari sini." };
    const usedIn = (await mediaUsage()).get(url) ?? [];
    if (usedIn.length) {
      return { ok: false, error: "Foto ini masih dipakai. Ganti atau hapus dulu dari tempat berikut:", usedIn };
    }
    await deleteUpload(url);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
