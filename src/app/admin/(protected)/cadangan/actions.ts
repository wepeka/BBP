"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { importAll } from "@/lib/repo";

export type RestoreResult = { ok: true; restored: string[] } | { ok: false; error: string };

export async function restoreBackupAction(json: string): Promise<RestoreResult> {
  try {
    await requireAdmin();
    let parsed: unknown;
    try {
      parsed = JSON.parse(json);
    } catch {
      return { ok: false, error: "File bukan cadangan yang valid (format JSON rusak)." };
    }
    const file = parsed as { format?: string; data?: Record<string, unknown> };
    if (file?.format !== "bbp-backup" || !file.data || typeof file.data !== "object") {
      return { ok: false, error: "File ini bukan cadangan website BBP." };
    }
    const restored = await importAll(file.data);
    revalidatePath("/", "layout");
    return { ok: true, restored };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
