"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { getServices, replaceTeam, updateService, updateTexts } from "@/lib/repo";
import { TEXT_DEFAULTS, TEXT_FIELDS, parseList, type TextKey } from "@/lib/texts";

function clean(value: FormDataEntryValue | null): string {
  // Normalise Windows line endings from textareas and trim each edge.
  return String(value ?? "").replace(/\r\n/g, "\n").trim();
}

export async function saveTextsAction(pageId: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const values: Partial<Record<TextKey, string>> = {};
  for (const field of TEXT_FIELDS) {
    if (field.page !== pageId || !formData.has(field.key)) continue;
    // An emptied field goes back to the original text.
    values[field.key] = clean(formData.get(field.key)) || TEXT_DEFAULTS[field.key];
  }
  await updateTexts(values);

  if (pageId === "layanan") {
    for (const s of await getServices()) {
      if (!formData.has(`svc.${s.id}.nameId`)) continue;
      await updateService(s.id, {
        nameId: clean(formData.get(`svc.${s.id}.nameId`)) || s.nameId,
        nameEn: clean(formData.get(`svc.${s.id}.nameEn`)),
        shortId: clean(formData.get(`svc.${s.id}.shortId`)) || s.shortId,
        descriptionId: clean(formData.get(`svc.${s.id}.descriptionId`)) || s.descriptionId,
      });
    }
  }

  if (pageId === "tentang" && formData.has("team")) {
    const rows = parseList(clean(formData.get("team")));
    await replaceTeam(rows.map(([name, role]) => ({ name, role: role ?? "" })));
  }

  revalidatePath("/", "layout");
  redirect(`/admin/teks?halaman=${pageId}&tersimpan=1`);
}
