"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { createClient, updateClient, deleteClient } from "@/lib/repo";

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
}

function readForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim(),
    province: String(formData.get("province") ?? "").trim(),
    since: formData.get("since") ? Number(formData.get("since")) : undefined,
    projectCount: formData.get("projectCount") ? Number(formData.get("projectCount")) : undefined,
    flagship: formData.get("flagship") === "on",
  };
}

export async function createClientAction(formData: FormData) {
  await requireSession();
  await createClient(readForm(formData));
  revalidatePath("/klien");
  revalidatePath("/admin/klien");
  redirect("/admin/klien");
}

export async function updateClientAction(id: string, formData: FormData) {
  await requireSession();
  await updateClient(id, readForm(formData));
  revalidatePath("/klien");
  revalidatePath("/admin/klien");
  redirect("/admin/klien");
}

export async function deleteClientAction(id: string) {
  await requireSession();
  await deleteClient(id);
  revalidatePath("/klien");
  revalidatePath("/admin/klien");
  redirect("/admin/klien");
}
