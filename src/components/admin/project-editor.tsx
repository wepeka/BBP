"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, Copy, ExternalLink, Trash2, ChevronDown, Plus } from "lucide-react";
import { parseVideoUrl } from "@/lib/video";
import type { Category, Client, Project } from "@/lib/types";
import {
  deleteProjectAction,
  duplicateProjectAction,
  saveProjectAction,
  type ProjectFormData,
} from "@/app/admin/(protected)/proyek/actions";
import { slugify } from "@/lib/categories";
import { useAdmin } from "./admin-context";
import { AutoTextarea, RowControls, SaveBar, Toggle, moveItem, useEditorGuards } from "./controls";
import { PhotoListField } from "./image-field";
import { MapPicker } from "./map-picker";
import { Badge, Card, FieldShell, SectionTitle, buttonClass, inputClass } from "./ui";

function toForm(p?: Project | null): ProjectFormData {
  return {
    titleId: p?.titleId ?? "",
    titleEn: p?.titleEn && p.titleEn !== p.titleId ? p.titleEn : "",
    slug: p?.slug ?? "",
    client: p?.client ?? "",
    clientNote: p?.clientNote ?? "",
    city: p?.city ?? "",
    province: p?.province ?? "",
    year: p?.year ?? String(new Date().getFullYear()),
    status: p?.status ?? "selesai",
    categories: p?.categories ?? [],
    lat: p?.lat ?? 0,
    lng: p?.lng ?? 0,
    scope: p?.scope ?? "",
    descriptionId: p?.descriptionId ?? "",
    images: p?.images ?? [],
    featured: p?.featured ?? false,
    hidden: p?.hidden ?? false,
    area: p?.area ?? "",
    duration: p?.duration ?? "",
    facts: p?.facts ?? [],
    videoUrl: p?.videoUrl ?? "",
  };
}

export function ProjectEditor({
  project,
  categories,
  clients,
  cities,
  provinces,
}: {
  project?: Project | null;
  categories: Category[];
  clients: Client[];
  cities: string[];
  provinces: string[];
}) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const [saved, setSaved] = useState(() => toForm(project));
  const [form, setForm] = useState(saved);
  const [saving, startSaving] = useTransition();
  const [advanced, setAdvanced] = useState(false);
  const isNew = !project;
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(saved), [form, saved]);
  const set = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => setForm((f) => ({ ...f, [key]: value }));

  const missing = [
    !form.titleId.trim() && "judul",
    !form.city.trim() && "kota",
    !form.province.trim() && "provinsi",
    !form.year.trim() && "tahun",
  ].filter(Boolean) as string[];

  function save() {
    if (!canEdit || saving || (!dirty && !isNew)) return;
    if (missing.length) {
      toast(`Lengkapi dulu: ${missing.join(", ")}.`, "error");
      return;
    }
    startSaving(async () => {
      const res = await saveProjectAction(project?.id ?? null, form);
      if (!res.ok) {
        toast(res.error, "error");
        return;
      }
      const next = { ...form, slug: res.slug };
      setSaved(next);
      setForm(next);
      toast(isNew ? "Proyek dibuat dan tampil di website." : form.hidden ? "Tersimpan (proyek disembunyikan dari website)." : "Tersimpan. Halaman proyek sudah diperbarui.");
      if (isNew) router.replace(`/admin/proyek/${res.id}`);
      else router.refresh();
    });
  }

  useEditorGuards(dirty, save);

  async function remove() {
    if (!project) return;
    const ok = await confirm({
      title: "Hapus proyek ini?",
      body: `“${project.titleId}” akan hilang dari website. Foto-fotonya tetap ada di Galeri Foto. Tindakan ini tidak bisa dibatalkan.`,
      confirmLabel: "Hapus proyek",
      danger: true,
    });
    if (!ok) return;
    const res = await deleteProjectAction(project.id);
    if (!res.ok) return toast(res.error, "error");
    setSaved(form);
    toast("Proyek dihapus.");
    router.replace("/admin/proyek");
  }

  async function duplicate() {
    if (!project) return;
    const res = await duplicateProjectAction(project.id);
    if (!res.ok) return toast(res.error, "error");
    toast("Salinan dibuat (disembunyikan). Silakan ubah lalu tampilkan.");
    router.push(`/admin/proyek/${res.id}`);
  }

  const clientNames = clients.map((c) => c.name);
  const folder = `proyek/${form.slug || slugify(form.titleId) || "baru"}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link href="/admin/proyek" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]">
            <ArrowLeft size={14} aria-hidden="true" /> Semua proyek
          </Link>
          <h1 className="mt-1.5 flex flex-wrap items-center gap-2 text-[24px] font-extrabold tracking-tight text-[var(--color-ink)]">
            <span className="min-w-0 truncate">{isNew ? "Proyek baru" : saved.titleId || "Proyek"}</span>
            {!isNew && saved.hidden && <Badge>Disembunyikan</Badge>}
            {!isNew && saved.featured && <Badge tone="yellow">Unggulan</Badge>}
          </h1>
        </div>
        {!isNew && (
          <div className="flex flex-wrap gap-2">
            {!saved.hidden && (
              <a href={`/proyek/${saved.slug}`} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "sm")}>
                <ExternalLink size={14} aria-hidden="true" /> Lihat di website
              </a>
            )}
            <button type="button" onClick={duplicate} className={buttonClass("secondary", "sm")} disabled={!canEdit}>
              <Copy size={14} aria-hidden="true" /> Duplikat
            </button>
            <button type="button" onClick={remove} className={buttonClass("danger", "sm")} disabled={!canEdit}>
              <Trash2 size={14} aria-hidden="true" /> Hapus
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <div className="space-y-5">
          <Card>
            <SectionTitle>Informasi proyek</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell label="Judul proyek *" htmlFor="titleId" className="sm:col-span-2">
                <input id="titleId" value={form.titleId} onChange={(e) => set("titleId", e.target.value)} className={inputClass} placeholder="mis. Pembangunan Gudang Baja 2 Lantai" />
              </FieldShell>
              <FieldShell label="Klien" htmlFor="client" hint="Pilih dari daftar klien atau ketik nama baru. Kosongkan jika klien tidak boleh dipublikasikan.">
                <input id="client" list="client-list" value={form.client} onChange={(e) => set("client", e.target.value)} className={inputClass} />
                <datalist id="client-list">
                  {clientNames.map((n) => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
              </FieldShell>
              <FieldShell label="Catatan klien" htmlFor="clientNote" hint="Opsional, mis. Member of Panbil Group.">
                <input id="clientNote" value={form.clientNote} onChange={(e) => set("clientNote", e.target.value)} className={inputClass} />
              </FieldShell>
              <FieldShell label="Kota *" htmlFor="city">
                <input id="city" list="city-list" value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
                <datalist id="city-list">
                  {cities.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </FieldShell>
              <FieldShell label="Provinsi *" htmlFor="province">
                <input id="province" list="province-list" value={form.province} onChange={(e) => set("province", e.target.value)} className={inputClass} />
                <datalist id="province-list">
                  {provinces.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </FieldShell>
              <FieldShell label="Tahun / periode *" htmlFor="year" hint="mis. 2024, atau 2023–2024, atau 2025 – berjalan">
                <input id="year" value={form.year} onChange={(e) => set("year", e.target.value)} className={inputClass} />
              </FieldShell>
              <FieldShell label="Status pekerjaan" htmlFor="status">
                <select id="status" value={form.status} onChange={(e) => set("status", e.target.value as ProjectFormData["status"])} className={inputClass}>
                  <option value="selesai">Selesai</option>
                  <option value="berjalan">Sedang berjalan</option>
                </select>
              </FieldShell>
              <FieldShell label="Lingkup pekerjaan (ringkas)" htmlFor="scope" className="sm:col-span-2" hint="Satu kalimat. Tampil di lembar data dan hasil pencarian Google.">
                <AutoTextarea id="scope" value={form.scope} onChange={(v) => set("scope", v)} minRows={2} />
              </FieldShell>
              <FieldShell label="Luas / volume" htmlFor="area" hint="Opsional, mis. 4 × 1.800 m²">
                <input id="area" value={form.area} onChange={(e) => set("area", e.target.value)} className={inputClass} />
              </FieldShell>
              <FieldShell label="Durasi pengerjaan" htmlFor="duration" hint="Opsional, mis. 8 bulan">
                <input id="duration" value={form.duration} onChange={(e) => set("duration", e.target.value)} className={inputClass} />
              </FieldShell>
            </div>
          </Card>

          <Card>
            <SectionTitle description="Foto pertama dipakai sebagai sampul di kartu proyek. Foto dari HP langsung dikompres otomatis.">Foto proyek</SectionTitle>
            <PhotoListField value={form.images} onChange={(v) => set("images", v)} folder={folder} />
          </Card>

          <Card>
            <SectionTitle description="Angka konkret membuat proyek lebih meyakinkan. Tampil di lembar data proyek.">Fakta tambahan & video</SectionTitle>
            <div className="space-y-2">
              {form.facts.map((f, i) => (
                <div key={i} className="grid items-center gap-2 sm:grid-cols-[0.8fr_1fr_auto]">
                  <input
                    value={f.label}
                    onChange={(e) => set("facts", form.facts.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))}
                    placeholder="mis. Tonase baja"
                    aria-label={`Nama fakta ${i + 1}`}
                    className={inputClass}
                  />
                  <input
                    value={f.value}
                    onChange={(e) => set("facts", form.facts.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)))}
                    placeholder="mis. 320 ton"
                    aria-label={`Nilai fakta ${i + 1}`}
                    className={inputClass}
                  />
                  <RowControls
                    index={i}
                    count={form.facts.length}
                    onMove={(to) => set("facts", moveItem(form.facts, i, to))}
                    onRemove={() => set("facts", form.facts.filter((_, k) => k !== i))}
                    removeLabel="Hapus fakta"
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-2">
                <button type="button" className={buttonClass("secondary", "sm")} onClick={() => set("facts", [...form.facts, { label: "", value: "" }])}>
                  <Plus size={14} aria-hidden="true" /> Tambah fakta
                </button>
                {["Tonase baja", "Jam kerja tanpa kecelakaan", "Nilai kontrak", "Jumlah tenaga kerja"]
                  .filter((l) => !form.facts.some((f) => f.label === l))
                  .map((l) => (
                    <button key={l} type="button" onClick={() => set("facts", [...form.facts, { label: l, value: "" }])} className="rounded-[4px] border border-dashed border-[var(--color-line-2)] px-2 py-1 text-[12px] text-[var(--color-ink-2)] hover:border-[var(--color-teal)] hover:text-[var(--color-teal-text)]">
                      + {l}
                    </button>
                  ))}
              </div>
            </div>
            <FieldShell
              label="Video proyek (YouTube / Vimeo)"
              htmlFor="videoUrl"
              className="mt-5"
              error={form.videoUrl.trim() && !parseVideoUrl(form.videoUrl) ? "Link belum dikenali. Pakai link YouTube atau Vimeo." : undefined}
              hint="Opsional, mis. timelapse erection atau video drone. Tampil di bawah galeri foto."
            >
              <input id="videoUrl" value={form.videoUrl} onChange={(e) => set("videoUrl", e.target.value)} placeholder="https://youtu.be/…" className={inputClass} />
            </FieldShell>
          </Card>

          <Card>
            <SectionTitle>Cerita proyek</SectionTitle>
            <FieldShell label="Deskripsi lengkap" htmlFor="descriptionId" hint="Pisahkan paragraf dengan baris kosong. Awali baris dengan • untuk daftar berpoin.">
              <AutoTextarea id="descriptionId" value={form.descriptionId} onChange={(v) => set("descriptionId", v)} minRows={6} />
            </FieldShell>
          </Card>

          <Card padded={false}>
            <button type="button" onClick={() => setAdvanced((v) => !v)} className="flex w-full items-center justify-between px-5 py-4 text-left sm:px-6">
              <span className="text-[14.5px] font-bold text-[var(--color-ink)]">Pengaturan lanjutan</span>
              <ChevronDown size={18} className={`text-[var(--color-ink-3)] transition-transform ${advanced ? "" : "-rotate-90"}`} aria-hidden="true" />
            </button>
            {advanced && (
              <div className="grid gap-4 border-t border-[var(--color-line)] p-5 sm:grid-cols-2 sm:p-6">
                <FieldShell label="Judul bahasa Inggris" htmlFor="titleEn" hint="Opsional. Kosongkan untuk menyalin judul Indonesia.">
                  <input id="titleEn" value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} className={inputClass} />
                </FieldShell>
                <FieldShell label="Alamat halaman (slug)" htmlFor="slug" hint={isNew ? "Dibuat otomatis dari judul jika dikosongkan." : "Mengubah slug akan mengubah link halaman proyek."}>
                  <div className="flex items-center rounded-[6px] border border-[var(--color-line-2)] bg-[var(--color-surface)] focus-within:border-[var(--color-teal)]">
                    <span className="pl-3 font-data text-[12px] text-[var(--color-ink-3)]">/proyek/</span>
                    <input id="slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} className="w-full bg-transparent px-1 py-2.5 font-data text-[13px] text-[var(--color-ink)] focus:outline-none" />
                  </div>
                </FieldShell>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-5 xl:sticky xl:top-6">
          <Card>
            <SectionTitle>Tampil di website</SectionTitle>
            <div className="space-y-4">
              <Toggle checked={!form.hidden} onChange={(v) => set("hidden", !v)} label="Tampilkan proyek" description="Matikan untuk menyimpan sebagai draf." />
              <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Proyek unggulan" description="Muncul di bagian Proyek Unggulan di Beranda." />
            </div>
          </Card>

          <Card>
            <SectionTitle>Kategori</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const on = form.categories.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => set("categories", on ? form.categories.filter((x) => x !== c.id) : [...form.categories, c.id])}
                    className={`rounded-[4px] border px-2.5 py-1.5 text-[12.5px] font-medium transition-colors ${
                      on ? "border-[var(--color-teal)] bg-[var(--color-teal)] text-white" : "border-[var(--color-line-2)] text-[var(--color-ink-2)] hover:border-[var(--color-teal)]"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[12px] text-[var(--color-ink-3)]">
              Kategori pertama yang dipilih tampil di kartu proyek.{" "}
              <Link href="/admin/pengaturan#kategori" className="font-semibold text-[var(--color-teal-text)] hover:underline">
                Ubah daftar kategori
              </Link>
            </p>
          </Card>

          <Card>
            <SectionTitle>Lokasi di peta</SectionTitle>
            <MapPicker
              lat={form.lat}
              lng={form.lng}
              onChange={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))}
              suggestion={form.city ? `${form.city}${form.province ? `, ${form.province}` : ""}` : undefined}
            />
          </Card>
        </div>
      </div>

      <SaveBar
        dirty={dirty || isNew}
        saving={saving}
        onSave={save}
        onReset={isNew ? undefined : () => setForm(saved)}
        disabled={!canEdit}
        saveLabel={isNew ? "Buat proyek" : "Simpan proyek"}
      />
    </div>
  );
}
