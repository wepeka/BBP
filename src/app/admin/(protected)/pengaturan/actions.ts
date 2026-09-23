"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { updateSettings } from "@/lib/repo";

export async function updateSettingsAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await updateSettings({
    companyName: String(formData.get("companyName") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    taglineLong: String(formData.get("taglineLong") ?? "").trim(),
    heroHeadlineId: String(formData.get("heroHeadlineId") ?? "").trim(),
    heroSubheadId: String(formData.get("heroSubheadId") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    fax: String(formData.get("fax") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    workingHours: String(formData.get("workingHours") ?? "").trim(),
    director: {
      name: String(formData.get("directorName") ?? "").trim(),
      role: String(formData.get("directorRole") ?? "").trim(),
      bioId: String(formData.get("directorBio") ?? "").trim(),
      bioEn: String(formData.get("directorBio") ?? "").trim(),
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/pengaturan");
}
