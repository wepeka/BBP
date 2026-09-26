"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { saveUpload } from "@/lib/store";
import { updateCertificate, getCertificates } from "@/lib/repo";
import type { CertificateStatus } from "@/lib/types";

export async function updateCertificateAction(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const status = String(formData.get("status") ?? "berlaku") as CertificateStatus;
  const note = String(formData.get("note") ?? "").trim() || null;
  const file = formData.get("file");

  let fileUrl: string | undefined;
  if (file instanceof File && file.size > 0) {
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${id}-${Date.now()}.${ext || "pdf"}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fileUrl = await saveUpload(`documents/certificates/${filename}`, buffer, file.type || "application/pdf");
  }

  const current = (await getCertificates()).find((c) => c.id === id);

  await updateCertificate(id, {
    status,
    note,
    fileUrl: fileUrl ?? current?.fileUrl ?? null,
  });

  revalidatePath("/legalitas");
  revalidatePath("/admin/sertifikat");
  revalidatePath("/admin");
}
