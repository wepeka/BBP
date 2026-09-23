"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
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
    const dir = path.join(process.cwd(), "public", "documents", "certificates");
    await fs.mkdir(dir, { recursive: true });
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${id}-${Date.now()}.${ext || "pdf"}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);
    fileUrl = `/documents/certificates/${filename}`;
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
