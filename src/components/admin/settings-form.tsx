"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import type { Category, MediaItem, Settings } from "@/lib/types";
import { saveSettingsAction, sendTestEmailAction } from "@/app/admin/(protected)/pengaturan/actions";
import { useAdmin } from "./admin-context";
import { AutoTextarea, RowControls, SaveBar, Toggle, moveItem, useEditorGuards } from "./controls";
import { ImageField, PdfField } from "./image-field";
import { MapPicker } from "./map-picker";
import { Badge, Card, FieldShell, SectionTitle, buttonClass, inputClass } from "./ui";

const SECTIONS = [
  ["identitas", "Identitas"],
  ["kontak", "Kontak & lokasi"],
  ["sosial", "Media sosial"],
  ["notifikasi", "Notifikasi email"],
  ["unduhan", "Company profile PDF"],
  ["google", "Google"],
  ["direktur", "Direktur"],
  ["legal", "Nomor legal"],
  ["mutu", "ISO & SMK3"],
  ["angka", "Angka statistik"],
  ["kategori", "Kategori proyek"],
] as const;

interface Draft {
  settings: Settings;
  directorPhoto: MediaItem[];
  categories: { id: string; label: string }[];
}

export function SettingsForm({
  settings,
  directorPhoto,
  categories,
  categoryUsage,
  computed,
  emailConfigured,
}: {
  settings: Settings;
  directorPhoto: MediaItem[];
  categories: Category[];
  categoryUsage: Record<string, number>;
  computed: { years: number; cities: number };
  emailConfigured: boolean;
}) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const [saved, setSaved] = useState<Draft>({ settings, directorPhoto, categories });
  const [draft, setDraft] = useState<Draft>(saved);
  const [saving, startSaving] = useTransition();
  const [testing, startTesting] = useTransition();
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);
  const s = draft.settings;

  function patch(p: Partial<Settings>) {
    setDraft((d) => ({ ...d, settings: { ...d.settings, ...p } }));
  }
  function nested<K extends "legal" | "director" | "stats" | "iso9001" | "smk3" | "social">(key: K, p: Partial<Settings[K]>) {
    setDraft((d) => ({ ...d, settings: { ...d.settings, [key]: { ...d.settings[key], ...p } } }));
  }

  function save() {
    if (!dirty || saving || !canEdit) return;
    startSaving(async () => {
      const res = await saveSettingsAction(draft);
      if (!res.ok) return toast(res.error, "error");
      setSaved(draft);
      toast("Info perusahaan tersimpan dan sudah tampil di website.");
      router.refresh();
    });
  }
  useEditorGuards(dirty, save);

  const text = (label: string, value: string, onChange: (v: string) => void, opts: { hint?: string; placeholder?: string; mono?: boolean; className?: string; type?: string } = {}) => {
    const id = `s-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    return (
      <FieldShell label={label} htmlFor={id} hint={opts.hint} className={opts.className}>
        <input id={id} type={opts.type ?? "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={opts.placeholder} className={`${inputClass} ${opts.mono ? "font-data" : ""}`} />
      </FieldShell>
    );
  };

  async function removeCategory(i: number) {
    const c = draft.categories[i];
    const used = categoryUsage[c.id] ?? 0;
    if (used) {
      const ok = await confirm({
        title: `Hapus kategori “${c.label}”?`,
        body: `${used} proyek memakai kategori ini. Proyek tetap ada, hanya label kategorinya yang hilang.`,
        confirmLabel: "Hapus kategori",
        danger: true,
      });
      if (!ok) return;
    }
    setDraft((d) => ({ ...d, categories: d.categories.filter((_, k) => k !== i) }));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
      <nav className="hidden lg:block" aria-label="Bagian pengaturan">
        <ul className="sticky top-6 space-y-0.5">
          {SECTIONS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="block rounded-[6px] px-3 py-2 text-[13.5px] font-medium text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)]">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="min-w-0 space-y-5">
        <Card>
          <section id="identitas" className="scroll-mt-6">
            <SectionTitle>Identitas</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("Nama perusahaan", s.companyName, (v) => patch({ companyName: v }), { className: "sm:col-span-2" })}
              {text("Nama singkat", s.shortName, (v) => patch({ shortName: v }), { hint: "Dipakai di judul tab browser, mis. “Proyek — BBP”." })}
              {text("Tagline", s.tagline, (v) => patch({ tagline: v }))}
              {text("Tagline panjang", s.taglineLong, (v) => patch({ taglineLong: v }), { className: "sm:col-span-2" })}
              {text("Tanggal berdiri", s.established, (v) => patch({ established: v }), { hint: "Format: 28 November 2012. Lama beroperasi dihitung otomatis dari sini." })}
              {text("Akta pendirian", s.akta, (v) => patch({ akta: v }))}
            </div>
          </section>
        </Card>

        <Card>
          <section id="kontak" className="scroll-mt-6">
            <SectionTitle>Kontak & lokasi kantor</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("Alamat", s.address, (v) => patch({ address: v }), { className: "sm:col-span-2" })}
              {text("Kota", s.city, (v) => patch({ city: v }))}
              {text("Provinsi", s.province, (v) => patch({ province: v }))}
              {text("Telepon", s.phone, (v) => patch({ phone: v }), { mono: true })}
              {text("Fax", s.fax, (v) => patch({ fax: v }), { mono: true, hint: "Kosongkan jika tidak ada." })}
              {text("Email", s.email, (v) => patch({ email: v }), { type: "email" })}
              {text("Nomor WhatsApp", s.whatsapp, (v) => patch({ whatsapp: v }), { mono: true, hint: "Boleh ditulis 0858… atau 62858… — otomatis diubah ke format internasional." })}
              {text("Jam kerja", s.workingHours, (v) => patch({ workingHours: v }), { className: "sm:col-span-2" })}
              <FieldShell label="Pesan awal WhatsApp" htmlFor="s-wa-msg" hint="Teks yang sudah terisi saat pengunjung menekan tombol WhatsApp." className="sm:col-span-2">
                <AutoTextarea id="s-wa-msg" value={s.whatsappMessage} onChange={(v) => patch({ whatsappMessage: v })} />
              </FieldShell>
              {text("Kata kunci Google Maps", s.mapEmbedQuery, (v) => patch({ mapEmbedQuery: v }), { className: "sm:col-span-2", hint: "Dipakai tombol “Buka di Google Maps”. Bisa alamat atau nama tempat di Google Maps." })}
              <FieldShell label="Titik kantor di peta" className="sm:col-span-2">
                <MapPicker lat={s.officeLat} lng={s.officeLng} onChange={(lat, lng) => patch({ officeLat: lat, officeLng: lng })} />
              </FieldShell>
            </div>
          </section>
        </Card>

        <Card>
          <section id="sosial" className="scroll-mt-6">
            <SectionTitle description="Ikon muncul di footer hanya untuk akun yang diisi.">Media sosial</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("Instagram", s.social.instagram, (v) => nested("social", { instagram: v }), { placeholder: "https://instagram.com/…" })}
              {text("Facebook", s.social.facebook, (v) => nested("social", { facebook: v }), { placeholder: "https://facebook.com/…" })}
              {text("LinkedIn", s.social.linkedin, (v) => nested("social", { linkedin: v }), { placeholder: "https://linkedin.com/company/…" })}
              {text("YouTube", s.social.youtube, (v) => nested("social", { youtube: v }), { placeholder: "https://youtube.com/@…" })}
              {text("TikTok", s.social.tiktok, (v) => nested("social", { tiktok: v }), { placeholder: "https://tiktok.com/@…" })}
            </div>
          </section>
        </Card>

        <Card>
          <section id="notifikasi" className="scroll-mt-6">
            <SectionTitle description="Setiap ada permintaan penawaran atau unduhan company profile, email ringkasan dikirim ke alamat ini.">
              Notifikasi email
            </SectionTitle>
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[13px]">
              Status pengiriman:
              {emailConfigured ? <Badge tone="green">Aktif</Badge> : <Badge tone="yellow">Belum disambungkan</Badge>}
            </div>
            {!emailConfigured && (
              <p className="mb-4 rounded-[6px] bg-[var(--color-bg)] p-3.5 text-[12.5px] leading-relaxed text-[var(--color-ink-2)]">
                Pengiriman email memakai layanan Resend (gratis hingga 3.000 email/bulan). Daftar di resend.com, buat API key, lalu pasang sebagai
                <code className="mx-1 rounded bg-[var(--color-surface-2)] px-1 font-data">RESEND_API_KEY</code>
                di Vercel → Project → Settings → Environment Variables, lalu deploy ulang. Selama belum disambungkan, permintaan tetap aman tersimpan di Inbox Penawaran.
              </p>
            )}
            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              {text("Kirim notifikasi ke", s.notifyEmail, (v) => patch({ notifyEmail: v }), {
                placeholder: s.email,
                hint: "Pisahkan dengan koma untuk beberapa alamat. Kosongkan untuk memakai email kantor.",
              })}
              <button
                type="button"
                disabled={!emailConfigured || testing || dirty}
                title={dirty ? "Simpan dulu perubahan" : undefined}
                onClick={() =>
                  startTesting(async () => {
                    const res = await sendTestEmailAction();
                    toast(res.ok ? "Email uji terkirim. Cek kotak masuk (dan folder spam)." : res.error, res.ok ? "success" : "error");
                  })
                }
                className={buttonClass("secondary", "md", "sm:mb-[22px]")}
              >
                Kirim email uji
              </button>
            </div>
          </section>
        </Card>

        <Card>
          <section id="unduhan" className="scroll-mt-6">
            <SectionTitle description="Jika diisi, tombol “Unduh Company Profile” muncul di Beranda, Tentang, dan footer. Pengunjung mengisi nama & email dulu — datanya masuk Inbox Penawaran.">
              Company profile PDF
            </SectionTitle>
            <PdfField value={s.companyProfilePdf} onChange={(url) => patch({ companyProfilePdf: url })} folder="company-profile" />
          </section>
        </Card>

        <Card>
          <section id="google" className="scroll-mt-6">
            <SectionTitle description="Opsional. Untuk melihat jumlah pengunjung dan performa di pencarian Google.">Google</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("Google Analytics 4 — Measurement ID", s.analyticsId, (v) => patch({ analyticsId: v }), {
                mono: true,
                placeholder: "G-XXXXXXXXXX",
                hint: "analytics.google.com → Admin → Data streams → Web.",
              })}
              {text("Google Search Console — kode verifikasi", s.googleVerification, (v) => patch({ googleVerification: v }), {
                mono: true,
                hint: "Pilih metode “Tag HTML”, lalu tempel kodenya (boleh seluruh tag <meta>).",
              })}
            </div>
          </section>
        </Card>

        <Card>
          <section id="direktur" className="scroll-mt-6">
            <SectionTitle description="Tampil di Beranda dan halaman Tentang.">Direktur</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell label="Foto" className="sm:col-span-2" hint="Foto potret (tegak) paling cocok.">
                <ImageField value={draft.directorPhoto} onChange={(v) => setDraft((d) => ({ ...d, directorPhoto: v }))} folder="direktur" aspect="4:5" />
              </FieldShell>
              {text("Nama", s.director.name, (v) => nested("director", { name: v }))}
              {text("Jabatan", s.director.role, (v) => nested("director", { role: v }))}
              <FieldShell label="Profil singkat" htmlFor="s-bio" className="sm:col-span-2">
                <AutoTextarea id="s-bio" value={s.director.bioId} onChange={(v) => nested("director", { bioId: v, bioEn: v })} minRows={4} />
              </FieldShell>
            </div>
          </section>
        </Card>

        <Card>
          <section id="legal" className="scroll-mt-6">
            <SectionTitle description="Tampil di footer dan halaman Legalitas. Dokumen & PDF dikelola di menu Sertifikat & Legalitas.">Nomor legal</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("NIB", s.legal.nib, (v) => nested("legal", { nib: v }), { mono: true })}
              {text("NPWP", s.legal.npwp, (v) => nested("legal", { npwp: v }), { mono: true })}
              {text("SIUP", s.legal.siup, (v) => nested("legal", { siup: v }), { mono: true })}
              {text("TDP", s.legal.tdp, (v) => nested("legal", { tdp: v }), { mono: true })}
              <div className="sm:col-span-2">
                <Toggle checked={s.gapensiMember} onChange={(v) => patch({ gapensiMember: v })} label="Anggota GAPENSI" />
              </div>
            </div>
          </section>
        </Card>

        <Card>
          <section id="mutu" className="scroll-mt-6">
            <SectionTitle description="Angka ini otomatis dipakai di tulisan yang memuat {iso} atau {skorSmk3}.">ISO 9001 & SMK3</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-3">
              {text("Standar ISO", s.iso9001.standard, (v) => nested("iso9001", { standard: v }))}
              {text("Penerbit ISO", s.iso9001.issuer, (v) => nested("iso9001", { issuer: v }))}
              {text("Regulasi SMK3", s.smk3.regulation, (v) => nested("smk3", { regulation: v }))}
              <FieldShell label="Ruang lingkup ISO" htmlFor="s-iso-scope" className="sm:col-span-3">
                <AutoTextarea id="s-iso-scope" value={s.iso9001.scopeId} onChange={(v) => nested("iso9001", { scopeId: v })} />
              </FieldShell>
              {text("Skor SMK3 (%)", String(s.smk3.score), (v) => nested("smk3", { score: Number(v) || 0 }), { mono: true, type: "number", hint: "Pakai titik untuk desimal, mis. 85.94" })}
              {text("Kriteria terpenuhi", String(s.smk3.criteriaMet), (v) => nested("smk3", { criteriaMet: Number(v) || 0 }), { mono: true, type: "number" })}
              {text("Total kriteria", String(s.smk3.criteriaTotal), (v) => nested("smk3", { criteriaTotal: Number(v) || 0 }), { mono: true, type: "number" })}
              {text("Kategori SMK3", s.smk3.category, (v) => nested("smk3", { category: v }))}
              {text("Tingkat SMK3", s.smk3.level, (v) => nested("smk3", { level: v }))}
            </div>
          </section>
        </Card>

        <Card>
          <section id="angka" className="scroll-mt-6">
            <SectionTitle description="Empat angka di bawah hero Beranda.">Angka statistik</SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FieldShell label="Tahun beroperasi" hint="Otomatis dari tanggal berdiri.">
                <p className="flex h-[42px] items-center rounded-[6px] bg-[var(--color-surface-2)] px-3 font-data text-[14px] text-[var(--color-ink)]">{computed.years}+</p>
              </FieldShell>
              <FieldShell label="Kota" hint="Otomatis dari daftar proyek.">
                <p className="flex h-[42px] items-center rounded-[6px] bg-[var(--color-surface-2)] px-3 font-data text-[14px] text-[var(--color-ink)]">{computed.cities}</p>
              </FieldShell>
              {text("Referensi pekerjaan", String(s.stats.projects), (v) => nested("stats", { projects: Number(v) || 0 }), { mono: true, type: "number", hint: "Ditampilkan dengan tanda +." })}
              {text("Klien korporat", String(s.stats.clients), (v) => nested("stats", { clients: Number(v) || 0 }), { mono: true, type: "number" })}
            </div>
          </section>
        </Card>

        <Card>
          <section id="kategori" className="scroll-mt-6">
            <SectionTitle description="Dipakai untuk filter di halaman Proyek. Ganti nama kapan saja — proyek tetap terhubung.">Kategori proyek</SectionTitle>
            <ul className="space-y-2">
              {draft.categories.map((c, i) => (
                <li key={c.id || `new-${i}`} className="flex items-center gap-2">
                  <input
                    value={c.label}
                    onChange={(e) => setDraft((d) => ({ ...d, categories: d.categories.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)) }))}
                    className={inputClass}
                    aria-label={`Nama kategori ${i + 1}`}
                  />
                  <span className="w-20 shrink-0 text-right font-data text-[11.5px] text-[var(--color-ink-3)]">{categoryUsage[c.id] ?? 0} proyek</span>
                  <RowControls
                    index={i}
                    count={draft.categories.length}
                    onMove={(to) => setDraft((d) => ({ ...d, categories: moveItem(d.categories, i, to) }))}
                    onRemove={() => removeCategory(i)}
                    removeLabel="Hapus kategori"
                  />
                </li>
              ))}
            </ul>
            <button type="button" className={buttonClass("secondary", "sm", "mt-3")} onClick={() => setDraft((d) => ({ ...d, categories: [...d.categories, { id: "", label: "" }] }))}>
              <Plus size={14} aria-hidden="true" /> Tambah kategori
            </button>
          </section>
        </Card>

        <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={() => setDraft(saved)} disabled={!canEdit} saveLabel="Simpan info perusahaan" />
      </div>
    </div>
  );
}
