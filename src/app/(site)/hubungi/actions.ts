"use server";

import { createRfqEntry, getServices, getTexts } from "@/lib/repo";

export interface RfqFormState {
  ok: boolean;
  message: string;
  errors?: Record<string, string>;
  /** What the visitor typed, so a form with errors keeps their input. */
  values?: Record<string, string>;
}

const limit = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function submitRfq(_prevState: RfqFormState, formData: FormData): Promise<RfqFormState> {
  // Spam traps: a field humans never see, and a minimum time on the form.
  const startedAt = Number(formData.get("startedAt") ?? 0);
  if (String(formData.get("website") ?? "") !== "" || (startedAt && Date.now() - startedAt < 2500)) {
    return { ok: true, message: (await getTexts())["contact.form.success"] };
  }

  const name = limit(formData.get("name"), 120);
  const company = limit(formData.get("company"), 160);
  const email = limit(formData.get("email"), 160);
  const whatsapp = limit(formData.get("whatsapp"), 40);
  const serviceId = limit(formData.get("serviceId"), 80);
  const location = limit(formData.get("location"), 160);
  const areaEstimate = limit(formData.get("areaEstimate"), 40);
  const targetStart = limit(formData.get("targetStart"), 60);
  const message = limit(formData.get("message"), 4000);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Tulis nama Anda.";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Tulis alamat email yang valid, mis. nama@perusahaan.co.id.";
  if (whatsapp.replace(/[^0-9]/g, "").length < 9) errors.whatsapp = "Tulis nomor WhatsApp yang aktif, minimal 9 angka.";
  if (!location) errors.location = "Tulis kota atau kabupaten lokasi proyek.";

  if (Object.keys(errors).length) {
    return {
      ok: false,
      message: "Ada isian yang perlu dilengkapi.",
      errors,
      values: { name, company, email, whatsapp, serviceId, location, areaEstimate, targetStart, message },
    };
  }

  const [services, t] = await Promise.all([getServices(), getTexts()]);
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

  return { ok: true, message: t["contact.form.success"] };
}
