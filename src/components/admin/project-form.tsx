"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CATEGORY_OPTIONS } from "@/lib/categories";
import { Field, TextAreaField, SelectField } from "@/components/admin/field";
import { SubmitButton } from "@/components/admin/submit-button";
import type { Project } from "@/lib/types";

export function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => void | Promise<void>;
  project?: Project;
}) {
  const [keptImages, setKeptImages] = useState<string[]>(project?.images ?? []);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(project?.categories ?? [])
  );

  function toggleCategory(id: string) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeImage(src: string) {
    setKeptImages((prev) => prev.filter((i) => i !== src));
  }

  return (
    <form action={action} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Judul (Indonesia)" name="titleId" required defaultValue={project?.titleId} />
        <Field label="Judul (English)" name="titleEn" defaultValue={project?.titleEn} hint="Kosongkan untuk menyalin judul Indonesia." />
      </div>

      {project && (
        <Field label="Slug URL" name="slug" defaultValue={project.slug} hint="Mengubah slug akan mengubah tautan halaman proyek ini." />
      )}
      {!project && <Field label="Slug URL (opsional)" name="slug" placeholder="dibuat otomatis dari judul" />}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Klien" name="client" defaultValue={project?.client ?? ""} hint="Kosongkan jika klien tidak dipublikasikan." />
        <Field label="Catatan Klien" name="clientNote" defaultValue={project?.clientNote ?? ""} placeholder="mis. Member of Panbil Group" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Kota" name="city" required defaultValue={project?.city} />
        <Field label="Provinsi" name="province" required defaultValue={project?.province} />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Tahun / Periode" name="year" required defaultValue={project?.year} placeholder="mis. 2023–2024" />
        <SelectField
          label="Status"
          name="status"
          defaultValue={project?.status ?? "selesai"}
          options={[
            { value: "selesai", label: "Selesai" },
            { value: "berjalan", label: "Berjalan" },
          ]}
        />
        <label className="flex items-center gap-2 pt-7 text-[13.5px] font-medium text-[var(--color-ink)]">
          <input type="checkbox" name="featured" defaultChecked={project?.featured} className="h-4 w-4 rounded border-[var(--color-line-2)]" />
          Tampilkan sebagai proyek unggulan
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Koordinat — Lintang (lat)" name="lat" type="number" defaultValue={project?.lat} hint="mis. -7.8480" />
        <Field label="Koordinat — Bujur (lng)" name="lng" type="number" defaultValue={project?.lng} hint="mis. 112.0178" />
      </div>

      <div>
        <p className="text-[13.5px] font-medium text-[var(--color-ink)]">Kategori</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((c) => {
            const active = selectedCategories.has(c.id);
            return (
              <label
                key={c.id}
                className={`cursor-pointer rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${
                  active
                    ? "border-[var(--color-teal)] bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]"
                    : "border-[var(--color-line-2)] text-[var(--color-ink-2)]"
                }`}
              >
                <input
                  type="checkbox"
                  name="categories"
                  value={c.id}
                  checked={active}
                  onChange={() => toggleCategory(c.id)}
                  className="sr-only"
                />
                {c.label}
              </label>
            );
          })}
        </div>
      </div>

      <Field label="Lingkup Pekerjaan (ringkas)" name="scope" required defaultValue={project?.scope} />
      <TextAreaField
        label="Deskripsi Lengkap"
        name="descriptionId"
        required
        rows={8}
        defaultValue={project?.descriptionId}
        hint="Pisahkan paragraf dengan baris kosong. Awali baris dengan • untuk daftar berpoin."
      />

      <div>
        <p className="text-[13.5px] font-medium text-[var(--color-ink)]">Galeri Foto</p>
        {keptImages.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {keptImages.map((src) => (
              <div key={src} className="group relative aspect-square overflow-hidden rounded-md border border-[var(--color-line)]">
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                <input type="hidden" name="keepImages" value={src} />
                <button
                  type="button"
                  onClick={() => removeImage(src)}
                  aria-label="Hapus foto ini"
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}
        <label htmlFor="newImages" className="mt-3 block text-[13px] font-medium text-[var(--color-ink)]">
          Tambah foto baru
        </label>
        <input
          id="newImages"
          name="newImages"
          type="file"
          accept="image/*"
          multiple
          className="mt-1.5 block w-full text-[13.5px] text-[var(--color-ink-2)] file:mr-3 file:rounded-md file:border-0 file:bg-[var(--color-teal-soft)] file:px-3 file:py-2 file:text-[13px] file:font-medium file:text-[var(--color-teal-text)]"
        />
      </div>

      <div className="flex items-center gap-3 border-t border-[var(--color-line)] pt-6">
        <SubmitButton>{project ? "Simpan Perubahan" : "Buat Proyek"}</SubmitButton>
      </div>
    </form>
  );
}
