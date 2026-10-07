"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/auth";
import { deleteRfqEntry, updateRfqEntry } from "@/lib/repo";
import type { RfqStatus } from "@/lib/types";

export type SimpleResult = { ok: true } | { ok: false; error: string };
const STATUSES: RfqStatus[] = ["baru", "dihubungi", "penawaran", "menang", "kalah"];

export async function updateRfqAction(id: string, patch: { status?: RfqStatus; internalNote?: string }): Promise<SimpleResult> {
  try {
    await requireEditor();
    const clean: { status?: RfqStatus; internalNote?: string | null } = {};
    if (patch.status && STATUSES.includes(patch.status)) clean.status = patch.status;
    if (typeof patch.internalNote === "string") clean.internalNote = patch.internalNote.trim() || null;
    await updateRfqEntry(id, clean);
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteRfqAction(id: string): Promise<SimpleResult> {
  try {
    await requireEditor();
    await deleteRfqEntry(id);
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
