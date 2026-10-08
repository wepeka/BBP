"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/auth";
import { getSettings, replaceCategories, updateMedia, updateSettings } from "@/lib/repo";
import { notifyRecipients, sendEmail } from "@/lib/notify";
import type { MediaItem, Settings } from "@/lib/types";

export type SimpleResult = { ok: true } | { ok: false; error: string };

export interface SettingsPayload {
  settings: Settings;
  directorPhoto: MediaItem[];
  categories: { id: string; label: string }[];
}

const t = (v: unknown) => String(v ?? "").replace(/\r\n/g, "\n").trim();
const n = (v: unknown, fallback: number) => (Number.isFinite(Number(v)) && String(v).trim() !== "" ? Number(v) : fallback);

export async function saveSettingsAction(p: SettingsPayload): Promise<SimpleResult> {
  try {
    await requireEditor();
    const s = p.settings;
    if (!t(s.companyName)) return { ok: false, error: "Isi nama perusahaan." };
    if (s.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t(s.email))) return { ok: false, error: "Format email belum benar." };
    const wa = t(s.whatsapp).replace(/[^0-9]/g, "").replace(/^0/, "62");
    if (wa && wa.length < 10) return { ok: false, error: "Nomor WhatsApp terlalu pendek." };

    await updateSettings({
      companyName: t(s.companyName),
      shortName: t(s.shortName) || "BBP",
      tagline: t(s.tagline),
      taglineLong: t(s.taglineLong),
      established: t(s.established),
      akta: t(s.akta),
      address: t(s.address),
      city: t(s.city),
      province: t(s.province),
      phone: t(s.phone),
      fax: t(s.fax),
      email: t(s.email),
      whatsapp: wa,
      whatsappMessage: t(s.whatsappMessage),
      workingHours: t(s.workingHours),
      mapEmbedQuery: t(s.mapEmbedQuery),
      officeLat: n(s.officeLat, 0),
      officeLng: n(s.officeLng, 0),
      legal: { nib: t(s.legal.nib), npwp: t(s.legal.npwp), siup: t(s.legal.siup), tdp: t(s.legal.tdp) },
      director: { name: t(s.director.name), role: t(s.director.role), bioId: t(s.director.bioId), bioEn: t(s.director.bioEn) },
      stats: {
        yearsActive: n(s.stats.yearsActive, 0),
        cities: n(s.stats.cities, 0),
        projects: n(s.stats.projects, 0),
        clients: n(s.stats.clients, 0),
      },
      gapensiMember: Boolean(s.gapensiMember),
      iso9001: { standard: t(s.iso9001.standard), issuer: t(s.iso9001.issuer), scopeId: t(s.iso9001.scopeId) },
      smk3: {
        regulation: t(s.smk3.regulation),
        score: n(s.smk3.score, 0),
        criteriaMet: n(s.smk3.criteriaMet, 0),
        criteriaTotal: n(s.smk3.criteriaTotal, 0),
        category: t(s.smk3.category),
        level: t(s.smk3.level),
      },
      notifyEmail: t(s.notifyEmail),
      companyProfilePdf: s.companyProfilePdf || null,
      analyticsId: t(s.analyticsId).toUpperCase(),
      googleVerification: t(s.googleVerification).match(/content="([^"]+)"/)?.[1] ?? t(s.googleVerification),
      social: {
        instagram: t(s.social.instagram),
        facebook: t(s.social.facebook),
        linkedin: t(s.social.linkedin),
        youtube: t(s.social.youtube),
        tiktok: t(s.social.tiktok),
      },
    });
    await updateMedia({ "director.photo": p.directorPhoto });
    if (p.categories.length) await replaceCategories(p.categories);

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Sends a sample notification to the saved recipients. */
export async function sendTestEmailAction(): Promise<SimpleResult> {
  try {
    await requireEditor();
    const settings = await getSettings();
    const to = notifyRecipients(settings);
    const res = await sendEmail({
      to,
      subject: `Uji notifikasi website ${settings.shortName}`,
      html: `<p style="font-family:Arial,sans-serif">Notifikasi email website ${settings.companyName} sudah aktif. Permintaan penawaran baru akan dikirim ke alamat ini.</p>`,
      text: `Notifikasi email website ${settings.companyName} sudah aktif.`,
    });
    return res.ok ? { ok: true } : { ok: false, error: res.error ?? "Gagal mengirim." };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
