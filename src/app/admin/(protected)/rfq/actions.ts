"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { updateRfqEntry } from "@/lib/repo";
import type { RfqStatus } from "@/lib/types";

export async function updateRfqStatusAction(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const status = String(formData.get("status") ?? "baru") as RfqStatus;
  await updateRfqEntry(id, { status });
  revalidatePath("/admin/rfq");
  revalidatePath("/admin");
}

export async function updateRfqNoteAction(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const internalNote = String(formData.get("internalNote") ?? "").trim() || null;
  await updateRfqEntry(id, { internalNote });
  revalidatePath("/admin/rfq");
}
