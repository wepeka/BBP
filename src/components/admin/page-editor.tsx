"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useImperativeHandle, useMemo, useRef, useState, useTransition } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  Monitor,
  RotateCcw,
  RefreshCw,
  Smartphone,
  Lock,
  Search,
  ArrowUpRight,
} from "lucide-react";
import type { Category, Equipment, Job, MediaItem, Testimonial } from "@/lib/types";
import type { SectionDef } from "@/lib/sections";
import { parseList, serializeList, sameList, type ListColumn } from "@/lib/texts";
import { savePageAction, type PagePayload } from "@/app/admin/(protected)/halaman/actions";
import { useAdmin } from "./admin-context";
import { AutoTextarea, SaveBar, Toggle, useEditorGuards } from "./controls";
import { ImageField, type ProjectOption } from "./image-field";
import { ListEditor } from "./list-editor";
import {
  EquipmentEditor,
  JobsEditor,
  ServicesEditor,
  TeamEditor,
  TestimonialsEditor,
  type ServiceDraft,
  type TeamDraft,
} from "./collection-editors";
import { Badge, FieldShell, buttonClass, inputClass } from "./ui";

export interface EditorField {
  key: string;
  label: string;
  section: string;
  default: string;
  multiline?: boolean;
  vars?: readonly string[];
  columns?: readonly ListColumn[];
  hint?: string;
}

export interface EditorSlot {
  key: string;
  label: string;
  section: string;
  hint?: string;
  multiple?: boolean;
  projectLink?: boolean;
  aspect?: string;
  default: MediaItem[];
}

export interface EditorDraft {
  texts: Record<string, string>;
  media: Record<string, MediaItem[]>;
  layout: { order: string[]; hidden: string[] };
  services?: ServiceDraft[];
  team?: TeamDraft[];
  equipment?: Equipment[];
  testimonials?: Testimonial[];
  jobs?: Job[];
  pageVisible?: boolean;
}

const COLLECTION_FOR: Record<string, "services" | "team" | "equipment" | "testimonials" | "jobs"> = {
  "layanan.list": "services",
  "tentang.team": "team",
  "kapasitas.equipment": "equipment",
  "beranda.testimonials": "testimonials",
  "karier.openings": "jobs",
};

const SEO_SECTION: SectionDef = { id: "seo", label: "SEO — tampilan di Google", description: "Judul tab browser dan deskripsi di hasil pencarian.", fixed: true };

export function PageEditor({
  pageId,
  pageLabel,
  href,
  pages,
  sections,
  fields,
  slots,
  initial,
  projects,
  categories,
}: {
  pageId: string;
  pageLabel: string;
  href: string;
  pages: { id: string; label: string }[];
  sections: SectionDef[];
  fields: EditorField[];
  slots: EditorSlot[];
  initial: EditorDraft;
  projects: ProjectOption[];
  categories: Category[];
}) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const [saved, setSaved] = useState(initial);
  const [draft, setDraft] = useState(initial);
  const [saving, startSaving] = useTransition();
  const [open, setOpen] = useState<Set<string>>(() => new Set([sections[0]?.id]));
  const [query, setQuery] = useState("");
  const previewRef = useRef<PreviewHandle>(null);

  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  // Sections in the order being edited (fixed ones first), plus the SEO card.
  const ordered = useMemo(() => {
    const fixed = sections.filter((s) => s.fixed);
    const movable = draft.layout.order
      .map((id) => sections.find((s) => s.id === id && !s.fixed))
      .filter(Boolean) as SectionDef[];
    const rest = sections.filter((s) => !s.fixed && !draft.layout.order.includes(s.id));
    const list = [...fixed, ...movable, ...rest];
    return fields.some((f) => f.section === "seo") ? [...list, SEO_SECTION] : list;
  }, [sections, draft.layout.order, fields]);
  const movableIds = ordered.filter((s) => !s.fixed).map((s) => s.id);

  function save() {
    if (!dirty || saving || !canEdit) return;
    startSaving(async () => {
      const payload: PagePayload = {
        texts: draft.texts,
        media: draft.media,
        layout: { order: movableIds, hidden: draft.layout.hidden },
        services: draft.services,
        team: draft.team,
        equipment: draft.equipment,
        testimonials: draft.testimonials,
        jobs: draft.jobs,
        pageVisible: draft.pageVisible,
      };
      const res = await savePageAction(pageId, payload);
      if (!res.ok) {
        toast(res.error, "error");
        return;
      }
      setSaved(draft);
      toast(`Tersimpan. Halaman ${pageLabel} sudah diperbarui.`);
      router.refresh();
      previewRef.current?.reload();
    });
  }

  useEditorGuards(dirty, save);

  const setText = (key: string, value: string) => setDraft((d) => ({ ...d, texts: { ...d.texts, [key]: value } }));
  const setMedia = (key: string, value: MediaItem[]) => setDraft((d) => ({ ...d, media: { ...d.media, [key]: value } }));

  function moveSection(id: string, delta: number) {
    const ids = movableIds.slice();
    const i = ids.indexOf(id);
    const j = i + delta;
    if (i < 0 || j < 0 || j >= ids.length) return;
    [ids[i], ids[j]] = [ids[j], ids[i]];
    setDraft((d) => ({ ...d, layout: { ...d.layout, order: ids } }));
  }

  function toggleHidden(id: string) {
    setDraft((d) => {
      const hidden = d.layout.hidden.includes(id) ? d.layout.hidden.filter((h) => h !== id) : [...d.layout.hidden, id];
      return { ...d, layout: { ...d.layout, hidden } };
    });
  }

  function toggleOpen(id: string) {
    const opening = !open.has(id);
    setOpen((s) => {
      const next = new Set(s);
      if (opening) next.add(id);
      else next.delete(id);
      return next;
    });
    if (opening) previewRef.current?.scrollTo(id);
  }

  async function goToPage(e: React.MouseEvent, id: string) {
    if (!dirty) return;
    e.preventDefault();
    const ok = await confirm({
      title: "Tinggalkan tanpa menyimpan?",
      body: `Perubahan di halaman ${pageLabel} belum disimpan dan akan hilang.`,
      confirmLabel: "Tinggalkan",
      danger: true,
    });
    if (ok) router.push(`/admin/halaman?halaman=${id}`);
  }

  const q = query.trim().toLowerCase();
  const matches = (s: SectionDef) => {
    if (!q) return true;
    const inFields = fields.some((f) => f.section === s.id && `${f.label} ${draft.texts[f.key] ?? ""}`.toLowerCase().includes(q));
    const inSlots = slots.some((m) => m.section === s.id && m.label.toLowerCase().includes(q));
    return inFields || inSlots || s.label.toLowerCase().includes(q);
  };

  return (
    <div>
      <nav className="-mx-1 mb-5 flex gap-1.5 overflow-x-auto px-1 pb-1" aria-label="Pilih halaman">
        {pages.map((p) => (
          <Link
            key={p.id}
            href={`/admin/halaman?halaman=${p.id}`}
            onClick={(e) => p.id !== pageId && goToPage(e, p.id)}
            aria-current={p.id === pageId ? "page" : undefined}
            className={`shrink-0 rounded-[6px] px-3.5 py-2 text-[13.5px] font-semibold transition-colors ${
              p.id === pageId
                ? "bg-[var(--color-ink)] text-[var(--color-bg)]"
                : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] xl:items-start">
        <div className="min-w-0">
          {typeof draft.pageVisible === "boolean" && (
            <div
              className={`mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[8px] border px-4 py-3 ${
                draft.pageVisible ? "border-[var(--color-line)] bg-[var(--color-surface)]" : "border-dashed border-[var(--color-line-2)] bg-[var(--color-surface-2)]"
              }`}
            >
              <Toggle
                checked={draft.pageVisible}
                onChange={(v) => setDraft((d) => ({ ...d, pageVisible: v }))}
                label={`Halaman ${pageLabel} tampil di website`}
                description={draft.pageVisible ? `Bisa dibuka di ${href} dan tertaut di footer.` : "Halaman disembunyikan: tidak ada di footer dan tidak bisa dibuka."}
              />
            </div>
          )}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <label className="relative min-w-[200px] flex-1">
              <span className="sr-only">Cari tulisan</span>
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" aria-hidden="true" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari tulisan di halaman ini…" className={`${inputClass} pl-9`} />
            </label>
            <button type="button" className={buttonClass("ghost", "sm")} onClick={() => setOpen(new Set(ordered.map((s) => s.id)))}>
              Buka semua
            </button>
            <button type="button" className={buttonClass("ghost", "sm")} onClick={() => setOpen(new Set())}>
              Tutup semua
            </button>
          </div>

          <div className="space-y-3">
            {ordered.filter(matches).map((section) => {
              const sFields = fields.filter((f) => f.section === section.id);
              const sSlots = slots.filter((m) => m.section === section.id);
              const collection = COLLECTION_FOR[`${pageId}.${section.id}`];
              const isOpen = open.has(section.id) || Boolean(q);
              const hidden = draft.layout.hidden.includes(section.id);
              const changed =
                sFields.some((f) => (f.columns ? !sameList(draft.texts[f.key] ?? "", f.default) : (draft.texts[f.key] ?? "") !== f.default)) ||
                sSlots.some((m) => JSON.stringify(draft.media[m.key] ?? []) !== JSON.stringify(m.default));
              const idx = movableIds.indexOf(section.id);
              // The video link matters more than its poster, so it comes first there.
              const textEditors = sFields.map((f) => (
                <TextFieldEditor key={f.key} field={f} value={draft.texts[f.key] ?? ""} onChange={(v) => setText(f.key, v)} />
              ));
              const counts = [
                sFields.length ? `${sFields.length} tulisan` : "",
                sSlots.length ? `${sSlots.length} foto` : "",
                collection ? "daftar" : "",
              ]
                .filter(Boolean)
                .join(" · ");

              return (
                <section
                  key={section.id}
                  id={`editor-${section.id}`}
                  className={`overflow-hidden rounded-[8px] border bg-[var(--color-surface)] transition-colors ${
                    hidden ? "border-dashed border-[var(--color-line-2)] opacity-75" : "border-[var(--color-line)]"
                  }`}
                >
                  <header className="flex items-center gap-2 px-3 py-2.5 sm:px-4">
                    <button
                      type="button"
                      onClick={() => toggleOpen(section.id)}
                      aria-expanded={isOpen}
                      className="flex min-w-0 flex-1 items-center gap-3 rounded-[6px] py-1 text-left"
                    >
                      <ChevronDown size={18} className={`shrink-0 text-[var(--color-ink-3)] transition-transform ${isOpen ? "" : "-rotate-90"}`} aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[15px] font-bold text-[var(--color-ink)]">{section.label}</span>
                          {hidden && <Badge tone="neutral">Disembunyikan</Badge>}
                          {changed && <Badge tone="green">Diubah</Badge>}
                        </span>
                        <span className="mt-0.5 block truncate text-[12.5px] text-[var(--color-ink-3)]">
                          {section.description ?? counts}
                        </span>
                      </span>
                    </button>
                    {section.id !== "seo" && (
                      <div className="flex shrink-0 items-center gap-0.5">
                        {section.fixed ? (
                          <span className="hidden items-center gap-1 px-2 text-[11.5px] text-[var(--color-ink-3)] sm:inline-flex" title="Bagian ini selalu tampil di posisinya">
                            <Lock size={12} aria-hidden="true" /> Tetap
                          </span>
                        ) : (
                          <>
                            <button type="button" onClick={() => moveSection(section.id, -1)} disabled={idx <= 0} aria-label="Naikkan bagian" title="Naikkan" className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] disabled:opacity-30">
                              <ArrowUp size={15} aria-hidden="true" />
                            </button>
                            <button type="button" onClick={() => moveSection(section.id, 1)} disabled={idx === movableIds.length - 1} aria-label="Turunkan bagian" title="Turunkan" className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-ink)] disabled:opacity-30">
                              <ArrowDown size={15} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleHidden(section.id)}
                              aria-pressed={!hidden}
                              title={hidden ? "Tampilkan bagian ini" : "Sembunyikan bagian ini"}
                              className={`ml-1 inline-flex h-8 items-center gap-1.5 rounded-[6px] border px-2.5 text-[12px] font-semibold ${
                                hidden
                                  ? "border-[var(--color-line-2)] text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
                                  : "border-[var(--color-teal)]/40 bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]"
                              }`}
                            >
                              {hidden ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
                              {hidden ? "Tersembunyi" : "Tampil"}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </header>

                  {isOpen && (
                    <div className="space-y-5 border-t border-[var(--color-line)] px-4 py-5 sm:px-5">
                      {section.manage && (
                        <Link href={section.manage.href} className="flex items-center justify-between gap-3 rounded-[6px] border border-[var(--color-line)] bg-[var(--color-bg)] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--color-teal-text)] hover:border-[var(--color-teal)]">
                          {section.manage.label}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </Link>
                      )}

                      {section.id === "video" && textEditors}

                      {sSlots.map((slot) => (
                        <FieldShell
                          key={slot.key}
                          label={slot.label}
                          hint={slot.hint}
                          badge={JSON.stringify(draft.media[slot.key] ?? []) !== JSON.stringify(slot.default) ? <Badge tone="green">Diubah</Badge> : undefined}
                          action={
                            JSON.stringify(draft.media[slot.key] ?? []) !== JSON.stringify(slot.default) ? (
                              <button type="button" onClick={() => setMedia(slot.key, slot.default)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]">
                                <RotateCcw size={12} aria-hidden="true" /> Kembalikan bawaan
                              </button>
                            ) : undefined
                          }
                        >
                          <ImageField
                            value={draft.media[slot.key] ?? []}
                            onChange={(v) => setMedia(slot.key, v)}
                            multiple={slot.multiple}
                            folder={pageId}
                            aspect={slot.aspect}
                            projects={slot.projectLink ? projects : undefined}
                            contain={slot.key === "brand.logo"}
                            maxSize={slot.key === "brand.logo" ? 1000 : undefined}
                          />
                        </FieldShell>
                      ))}

                      {section.id !== "video" && textEditors}

                      {collection === "services" && draft.services && (
                        <FieldShell label="Daftar layanan" hint="Urutan di sini = urutan di Beranda dan halaman Layanan. Klik nama untuk mengubah.">
                          <ServicesEditor value={draft.services} onChange={(v) => setDraft((d) => ({ ...d, services: v }))} categories={categories} />
                        </FieldShell>
                      )}
                      {collection === "team" && draft.team && (
                        <FieldShell label="Anggota tim" hint="Foto opsional — tanpa foto, inisial nama yang tampil.">
                          <TeamEditor value={draft.team} onChange={(v) => setDraft((d) => ({ ...d, team: v }))} />
                        </FieldShell>
                      )}
                      {collection === "testimonials" && draft.testimonials && (
                        <FieldShell label="Testimoni" hint="Tampil di Beranda dan halaman Klien. Pastikan klien sudah mengizinkan kutipannya dipublikasikan.">
                          <TestimonialsEditor value={draft.testimonials} onChange={(v) => setDraft((d) => ({ ...d, testimonials: v }))} />
                        </FieldShell>
                      )}
                      {collection === "jobs" && draft.jobs && (
                        <FieldShell label="Lowongan" hint="Lamaran dikirim pelamar ke email kantor (Info Perusahaan).">
                          <JobsEditor value={draft.jobs} onChange={(v) => setDraft((d) => ({ ...d, jobs: v }))} />
                        </FieldShell>
                      )}
                      {collection === "equipment" && draft.equipment && (
                        <FieldShell label="Peralatan" hint="Alat dikelompokkan otomatis berdasarkan kolom Kelompok.">
                          <EquipmentEditor value={draft.equipment} onChange={(v) => setDraft((d) => ({ ...d, equipment: v }))} />
                        </FieldShell>
                      )}

                      {!sFields.length && !sSlots.length && !collection && !section.manage && (
                        <p className="text-[13px] text-[var(--color-ink-3)]">Bagian ini tidak punya tulisan yang bisa diubah.</p>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <SaveBar
            dirty={dirty}
            saving={saving}
            onSave={save}
            onReset={() => setDraft(saved)}
            disabled={!canEdit}
            saveLabel={`Simpan halaman ${pageLabel}`}
            note={
              <>
                Perubahan langsung tampil di website setelah disimpan.{" "}
                <a href={href} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--color-teal-text)] hover:underline">
                  Buka halaman
                </a>
              </>
            }
          />
        </div>

        <Preview ref={previewRef} href={href} />
      </div>
    </div>
  );
}

/* ---------- Text field ---------- */

function TextFieldEditor({ field, value, onChange }: { field: EditorField; value: string; onChange: (v: string) => void }) {
  const id = `f-${field.key}`;
  const isList = Boolean(field.columns);
  const changed = isList ? !sameList(value, field.default) : value !== field.default;
  const hint = [
    field.hint,
    field.vars?.length ? `Bisa memakai ${field.vars.map((v) => `{${v}}`).join(" ")} — terisi otomatis.` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FieldShell
      label={field.label}
      htmlFor={isList ? undefined : id}
      hint={hint || undefined}
      badge={changed ? <Badge tone="green">Diubah</Badge> : undefined}
      action={
        changed && field.default !== "" ? (
          <button type="button" onClick={() => onChange(field.default)} className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]" title={`Teks awal: ${field.default.slice(0, 200)}`}>
            <RotateCcw size={12} aria-hidden="true" /> Kembalikan
          </button>
        ) : undefined
      }
    >
      {isList ? (
        <ListEditor
          columns={field.columns!}
          rows={parseList(value)}
          onChange={(rows) => onChange(serializeList(rows))}
          numbered={field.key.endsWith("process.items")}
          addLabel={field.key.endsWith("timeline.items") ? "Tambah peristiwa" : field.key.endsWith("process.items") ? "Tambah langkah" : "Tambah baris"}
        />
      ) : field.multiline || value.length > 80 || field.default.length > 80 ? (
        <AutoTextarea id={id} value={value} onChange={onChange} minRows={field.multiline ? 3 : 2} placeholder={field.default} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={field.default} className={inputClass} />
      )}
    </FieldShell>
  );
}

/* ---------- Live preview ---------- */

interface PreviewHandle {
  reload: () => void;
  scrollTo: (sectionId: string) => void;
}

function Preview({ href, ref }: { href: string; ref: React.Ref<PreviewHandle> }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [scale, setScale] = useState(0.4);
  const [loading, setLoading] = useState(true);
  const width = device === "desktop" ? 1280 : 390;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(Math.min(1, entry.contentRect.width / width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const handle = useMemo<PreviewHandle>(
    () => ({
      reload: () => {
        setLoading(true);
        window.setTimeout(() => frame.current?.contentWindow?.location.reload(), 300);
      },
      scrollTo: (id: string) => {
        const doc = frame.current?.contentDocument;
        const target = doc?.getElementById(`sec-${id}`);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
    }),
    []
  );

  useImperativeHandle(ref, () => handle, [handle]);

  return (
    <aside className="hidden xl:sticky xl:top-20 xl:block">
      <div className="overflow-hidden rounded-[8px] border border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="flex items-center justify-between gap-2 border-b border-[var(--color-line)] px-3 py-2">
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[var(--color-ink-2)]">
            <span className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-[var(--color-yellow)]" : "bg-[var(--color-teal)]"}`} />
            Pratinjau langsung
          </span>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setDevice("desktop")} aria-pressed={device === "desktop"} title="Tampilan komputer" className={`flex h-8 w-8 items-center justify-center rounded-[6px] ${device === "desktop" ? "bg-[var(--color-surface-2)] text-[var(--color-ink)]" : "text-[var(--color-ink-3)]"}`}>
              <Monitor size={15} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setDevice("mobile")} aria-pressed={device === "mobile"} title="Tampilan HP" className={`flex h-8 w-8 items-center justify-center rounded-[6px] ${device === "mobile" ? "bg-[var(--color-surface-2)] text-[var(--color-ink)]" : "text-[var(--color-ink-3)]"}`}>
              <Smartphone size={15} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => handle.reload()} title="Muat ulang" className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:text-[var(--color-ink)]">
              <RefreshCw size={14} aria-hidden="true" />
            </button>
            <a href={href} target="_blank" rel="noopener noreferrer" title="Buka di tab baru" className="flex h-8 w-8 items-center justify-center rounded-[6px] text-[var(--color-ink-3)] hover:text-[var(--color-ink)]">
              <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div ref={box} className="relative h-[calc(100dvh-170px)] overflow-hidden bg-[var(--color-surface-2)]">
          <iframe
            ref={frame}
            src={href}
            title="Pratinjau halaman"
            onLoad={() => setLoading(false)}
            style={{
              width,
              height: `${100 / scale}%`,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              position: "absolute",
              left: device === "mobile" ? `calc(50% - ${(width * scale) / 2}px)` : 0,
              top: 0,
              border: 0,
              background: "white",
            }}
          />
        </div>
      </div>
      <p className="mt-2 text-[12px] text-[var(--color-ink-3)]">Pratinjau menampilkan versi yang sudah disimpan. Klik judul bagian untuk melompat ke posisinya.</p>
    </aside>
  );
}
