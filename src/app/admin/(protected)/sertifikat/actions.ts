"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/auth";
import { deleteCertificate, reorderCertificates, saveCertificate } from "@/lib/repo";
import type { Certificate, CertificateGroup, CertificateStatus } from "@/lib/types";

export type SimpleResult = { ok: true } | { ok: false; error: string };

export interface CertificateFormData {
  group: CertificateGroup;
  name: string;
  number: string;
  issuer: string;
  qualification: string;
  status: CertificateStatus;
  expiresAt: string;
  note: string;
  fileUrl: string | null;
  hidden: boolean;
}

const t = (v: unknown) => String(v ?? "").trim();
const GROUPS: CertificateGroup[] = ["legalitas", "sbu", "sistem_manajemen", "keanggotaan"];
const STATUSES: CertificateStatus[] = ["berlaku", "perlu_verifikasi", "kedaluwarsa"];

export async function saveCertificateAction(id: string | null, d: CertificateFormData): Promise<SimpleResult> {
  try {
    await requireEditor();
    if (!t(d.name)) return { ok: false, error: "Isi nama dokumen." };
    const data: Omit<Certificate, "id"> = {
      group: GROUPS.includes(d.group) ? d.group : "legalitas",
      name: t(d.name),
      number: t(d.number) || null,
      issuer: t(d.issuer),
      qualification: t(d.qualification) || undefined,
      status: STATUSES.includes(d.status) ? d.status : "berlaku",
      expiresAt: /^\d{4}-\d{2}-\d{2}$/.test(t(d.expiresAt)) ? t(d.expiresAt) : null,
      note: t(d.note) || null,
      fileUrl: d.fileUrl || null,
      hidden: Boolean(d.hidden),
    };
    await saveCertificate(data, id ?? undefined);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteCertificateAction(id: string): Promise<SimpleResult> {
  try {
    await requireEditor();
    await deleteCertificate(id);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function reorderCertificatesAction(ids: string[]): Promise<SimpleResult> {
  try {
    await requireEditor();
    await reorderCertificates(ids);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
