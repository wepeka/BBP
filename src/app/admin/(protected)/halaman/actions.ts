"use server";

import { revalidatePath } from "next/cache";
import { requireEditor } from "@/lib/auth";
import {
  getSettings,
  replaceEquipment,
  replaceJobs,
  replaceServices,
  replaceTeam,
  replaceTestimonials,
  updateLayout,
  updateMedia,
  updateSettings,
  updateTexts,
} from "@/lib/repo";
import { TEXT_FIELDS, type TextKey } from "@/lib/texts";
import { MEDIA_SLOTS } from "@/lib/media";
import { getPageDef } from "@/lib/sections";
import type { Equipment, Job, MediaItem, Service, Testimonial } from "@/lib/types";

export interface PagePayload {
  texts: Record<string, string>;
  media: Record<string, MediaItem[]>;
  layout: { order: string[]; hidden: string[] };
  services?: Omit<Service, "order">[];
  team?: { id?: string; name: string; role: string; photo?: string | null }[];
  equipment?: Equipment[];
  testimonials?: Testimonial[];
  jobs?: Job[];
  /** Optional pages only: false switches the whole page off. */
  pageVisible?: boolean;
}

export type ActionResult = { ok: true } | { ok: false, error: string };

const clean = (v: unknown) => String(v ?? "").replace(/\r\n/g, "\n").trim();

export async function savePageAction(pageId: string, payload: PagePayload): Promise<ActionResult> {
  try {
    await requireEditor();
    const page = getPageDef(pageId);
    if (!page) return { ok: false, error: "Halaman tidak dikenal." };

    const texts: Partial<Record<TextKey, string>> = {};
    for (const f of TEXT_FIELDS) {
      if (f.page !== pageId || !(f.key in payload.texts)) continue;
      // An emptied field goes back to its original text (except optional ones that default to empty).
      texts[f.key] = clean(payload.texts[f.key]) || f.default;
    }
    await updateTexts(texts);

    const media: Record<string, MediaItem[]> = {};
    for (const slot of MEDIA_SLOTS) {
      if (slot.page !== pageId || !(slot.key in payload.media)) continue;
      media[slot.key] = Array.isArray(payload.media[slot.key]) ? payload.media[slot.key] : [];
    }
    if (Object.keys(media).length) await updateMedia(media);

    if (page.sections.some((s) => !s.fixed)) await updateLayout(pageId, payload.layout);

    if (pageId === "layanan" && payload.services) {
      const list = payload.services
        .filter((s) => clean(s.nameId))
        .map((s) => ({
          ...s,
          nameId: clean(s.nameId),
          nameEn: clean(s.nameEn),
          shortId: clean(s.shortId),
          shortEn: clean(s.shortEn),
          descriptionId: clean(s.descriptionId),
          icon: s.icon || "building-2",
          image: s.image || null,
          category: s.category || null,
          points: (s.points ?? []).map(clean).filter(Boolean),
        }));
      await replaceServices(list);
    }
    if (pageId === "tentang" && payload.team) {
      await replaceTeam(payload.team.filter((m) => clean(m.name)).map((m) => ({ ...m, name: clean(m.name), role: clean(m.role) })));
    }
    if (pageId === "kapasitas" && payload.equipment) {
      await replaceEquipment(
        payload.equipment
          .filter((e) => clean(e.name))
          .map((e) => ({
            id: e.id,
            category: clean(e.category) || "Lainnya",
            name: clean(e.name),
            spec: clean(e.spec),
            qty: e.qty ? Number(e.qty) || null : null,
            image: e.image || null,
          }))
      );
    }

    if (pageId === "beranda" && payload.testimonials) {
      await replaceTestimonials(
        payload.testimonials
          .filter((t) => clean(t.quote) && clean(t.name))
          .map((t) => ({
            id: t.id,
            quote: clean(t.quote),
            name: clean(t.name),
            role: clean(t.role),
            company: clean(t.company),
            photo: t.photo || null,
            hidden: Boolean(t.hidden),
          }))
      );
    }
    if (pageId === "karier" && payload.jobs) {
      await replaceJobs(
        payload.jobs
          .filter((j) => clean(j.title))
          .map((j) => ({
            id: j.id,
            title: clean(j.title),
            location: clean(j.location),
            type: clean(j.type),
            summary: clean(j.summary),
            requirements: (j.requirements ?? []).map(clean).filter(Boolean),
            deadline: /^\d{4}-\d{2}-\d{2}$/.test(clean(j.deadline)) ? clean(j.deadline) : null,
            hidden: Boolean(j.hidden),
          }))
      );
    }
    if (page.optional && typeof payload.pageVisible === "boolean") {
      const hidden = new Set((await getSettings()).hiddenPages);
      if (payload.pageVisible) hidden.delete(pageId);
      else hidden.add(pageId);
      await updateSettings({ hiddenPages: Array.from(hidden) });
    }

    revalidatePath("/", "layout");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message || "Gagal menyimpan. Coba lagi." };
  }
}
