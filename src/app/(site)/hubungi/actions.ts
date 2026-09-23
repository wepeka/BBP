"use server";

import { createRfqEntry } from "@/lib/repo";
import { getServices } from "@/lib/repo";

export interface RfqFormState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitRfq(
  _prevState: RfqFormState,
  formData: FormData
): Promise<RfqFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const company = String(formData.get("company") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const serviceId = String(formData.get("serviceId") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const areaEstimate = String(formData.get("areaEstimate") ?? "").trim();
  const targetStart = String(formData.get("targetStart") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Nama wajib diisi.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Masukkan alamat email yang valid.";
  }
  if (!whatsapp || whatsapp.replace(/[^0-9]/g, "").length < 9) {
    errors.whatsapp = "Masukkan nomor WhatsApp yang valid.";
  }
  if (!location) errors.location = "Lokasi proyek wajib diisi.";

  if (Object.keys(errors).length) {
    return { ok: false, message: "Periksa kembali isian yang ditandai di bawah.", errors };
  }

  const services = await getServices();
  const validService = services.some((s) => s.id === serviceId) ? serviceId : null;

  await createRfqEntry({
    name,
    company: company || null,
    email,
    whatsapp,
    serviceId: validService,
    location,
    areaEstimate: areaEstimate || null,
    targetStart: targetStart || null,
    message: message || null,
  });

  return {
    ok: true,
    message: "Permintaan penawaran terkirim. Tim BBP akan membalas dalam 1 hari kerja.",
  };
}
