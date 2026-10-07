"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ChevronDown, Download, Mail, MessageCircle, Search, Trash2, MapPin, Ruler, CalendarClock, Briefcase } from "lucide-react";
import type { RfqEntry, RfqStatus } from "@/lib/types";
import { formatDate, waLink } from "@/lib/site";
import { deleteRfqAction, updateRfqAction } from "@/app/admin/(protected)/rfq/actions";
import { useAdmin } from "./admin-context";
import { AutoTextarea } from "./controls";
import { Badge, EmptyState, buttonClass, inputClass } from "./ui";

const STATUS: { id: RfqStatus; label: string; tone: "yellow" | "neutral" | "green" | "red" }[] = [
  { id: "baru", label: "Baru", tone: "yellow" },
  { id: "dihubungi", label: "Sudah dihubungi", tone: "neutral" },
  { id: "penawaran", label: "Penawaran dikirim", tone: "neutral" },
  { id: "menang", label: "Deal / menang", tone: "green" },
  { id: "kalah", label: "Tidak lanjut", tone: "red" },
];
const statusOf = (s: RfqStatus) => STATUS.find((x) => x.id === s) ?? STATUS[0];

function csv(rows: (string | null | undefined)[][]) {
  return rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function RfqInbox({ entries, services, companyShort }: { entries: RfqEntry[]; services: { id: string; name: string }[]; companyShort: string }) {
  const router = useRouter();
  const { toast, confirm, canEdit } = useAdmin();
  const [tab, setTab] = useState<RfqStatus | "semua">("semua");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(entries.find((e) => e.status === "baru")?.id ?? null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [, startBusy] = useTransition();
  const serviceName = (id: string | null) => services.find((s) => s.id === id)?.name ?? "Belum dipilih";

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (tab === "semua" || e.status === tab) &&
        (!q || `${e.name} ${e.company ?? ""} ${e.location} ${e.email} ${e.whatsapp} ${e.message ?? ""}`.toLowerCase().includes(q))
    );
  }, [entries, tab, query]);

  function update(e: RfqEntry, patch: { status?: RfqStatus; internalNote?: string }, message: string) {
    startBusy(async () => {
      const res = await updateRfqAction(e.id, patch);
      if (!res.ok) return toast(res.error, "error");
      toast(message);
      router.refresh();
    });
  }

  async function remove(e: RfqEntry) {
    const ok = await confirm({ title: "Hapus permintaan ini?", body: `Permintaan dari ${e.company || e.name} dihapus permanen.`, confirmLabel: "Hapus", danger: true });
    if (!ok) return;
    const res = await deleteRfqAction(e.id);
    if (!res.ok) return toast(res.error, "error");
    toast("Permintaan dihapus.");
    router.refresh();
  }

  function exportCsv() {
    const header = ["Tanggal", "Nama", "Perusahaan", "Email", "WhatsApp", "Jenis pekerjaan", "Lokasi", "Luas (m2)", "Target mulai", "Pesan", "Status", "Catatan internal"];
    const rows = entries.map((e) => [
      formatDate(e.createdAt, { day: "2-digit", month: "2-digit", year: "numeric" }),
      e.name,
      e.company,
      e.email,
      e.whatsapp,
      serviceName(e.serviceId),
      e.location,
      e.areaEstimate,
      e.targetStart,
      e.message,
      statusOf(e.status).label,
      e.internalNote,
    ]);
    const blob = new Blob(["﻿" + csv([header, ...rows])], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `penawaran-${companyShort.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <label className="relative min-w-[220px] flex-1">
          <span className="sr-only">Cari</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari nama, perusahaan, lokasi, atau isi pesan" className={`${inputClass} pl-9`} />
        </label>
        <button type="button" onClick={exportCsv} disabled={!entries.length} className={buttonClass("secondary")}>
          <Download size={15} aria-hidden="true" /> Unduh Excel (CSV)
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {[{ id: "semua" as const, label: "Semua" }, ...STATUS].map((s) => {
          const n = s.id === "semua" ? entries.length : entries.filter((e) => e.status === s.id).length;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setTab(s.id)}
              aria-pressed={tab === s.id}
              className={`rounded-[6px] px-3 py-1.5 text-[13px] font-semibold ${
                tab === s.id ? "bg-[var(--color-ink)] text-[var(--color-bg)]" : "border border-[var(--color-line)] bg-[var(--color-surface)] text-[var(--color-ink-2)]"
              }`}
            >
              {s.label} <span className="font-data text-[11px] opacity-70">{n}</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title={entries.length ? "Tidak ada yang cocok" : "Belum ada permintaan penawaran"}
          body={entries.length ? "Ubah pencarian atau tab status." : "Permintaan dari formulir di halaman Hubungi Kami akan muncul di sini."}
        />
      ) : (
        <ul className="space-y-2.5">
          {visible.map((e) => {
            const open = openId === e.id;
            const st = statusOf(e.status);
            const greeting = `Halo ${e.name}, terima kasih sudah menghubungi ${companyShort}. Kami sudah menerima permintaan penawaran Anda untuk proyek di ${e.location}.`;
            return (
              <li key={e.id} className={`overflow-hidden rounded-[8px] border bg-[var(--color-surface)] ${e.status === "baru" ? "border-[var(--color-yellow)]" : "border-[var(--color-line)]"}`}>
                <button type="button" onClick={() => setOpenId(open ? null : e.id)} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2 text-[14.5px] font-semibold text-[var(--color-ink)]">
                      {e.company || e.name}
                      {e.company && <span className="font-normal text-[var(--color-ink-3)]">{e.name}</span>}
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </p>
                    <p className="mt-0.5 truncate text-[12.5px] text-[var(--color-ink-3)]">
                      {formatDate(e.createdAt, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} · {e.location} · {serviceName(e.serviceId)}
                    </p>
                  </div>
                  <ChevronDown size={18} className={`shrink-0 text-[var(--color-ink-3)] transition-transform ${open ? "" : "-rotate-90"}`} aria-hidden="true" />
                </button>
                {open && (
                  <div className="grid gap-5 border-t border-[var(--color-line)] p-4 lg:grid-cols-[1.2fr_1fr]">
                    <div className="space-y-4">
                      <dl className="grid gap-3 text-[13.5px] sm:grid-cols-2">
                        <div className="flex gap-2">
                          <Briefcase size={15} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                          <div>
                            <dt className="text-[11.5px] text-[var(--color-ink-3)]">Jenis pekerjaan</dt>
                            <dd className="text-[var(--color-ink)]">{serviceName(e.serviceId)}</dd>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <MapPin size={15} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                          <div>
                            <dt className="text-[11.5px] text-[var(--color-ink-3)]">Lokasi</dt>
                            <dd className="text-[var(--color-ink)]">{e.location}</dd>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Ruler size={15} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                          <div>
                            <dt className="text-[11.5px] text-[var(--color-ink-3)]">Perkiraan luas</dt>
                            <dd className="text-[var(--color-ink)]">{e.areaEstimate ? `${e.areaEstimate} m²` : "—"}</dd>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <CalendarClock size={15} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                          <div>
                            <dt className="text-[11.5px] text-[var(--color-ink-3)]">Target mulai</dt>
                            <dd className="text-[var(--color-ink)]">{e.targetStart ?? "—"}</dd>
                          </div>
                        </div>
                      </dl>
                      {e.message && (
                        <blockquote className="whitespace-pre-line rounded-[6px] border-l-4 border-[var(--color-teal)] bg-[var(--color-bg)] px-4 py-3 text-[14px] leading-relaxed text-[var(--color-ink)]">
                          {e.message}
                        </blockquote>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <a href={waLink(e.whatsapp, greeting)} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "sm", "!bg-[#25D366] hover:!bg-[#1fb958]")}>
                          <MessageCircle size={14} aria-hidden="true" /> Balas WhatsApp · {e.whatsapp}
                        </a>
                        <a
                          href={`mailto:${e.email}?subject=${encodeURIComponent(`Penawaran ${companyShort} — proyek di ${e.location}`)}&body=${encodeURIComponent(greeting)}`}
                          className={buttonClass("secondary", "sm")}
                        >
                          <Mail size={14} aria-hidden="true" /> Balas email
                        </a>
                      </div>
                    </div>
                    <div className="space-y-3 rounded-[6px] bg-[var(--color-bg)] p-4">
                      <label className="block">
                        <span className="mb-1.5 block text-[12.5px] font-semibold text-[var(--color-ink)]">Status tindak lanjut</span>
                        <select
                          value={e.status}
                          disabled={!canEdit}
                          onChange={(ev) => update(e, { status: ev.target.value as RfqStatus }, "Status diperbarui.")}
                          className={inputClass}
                        >
                          {STATUS.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[12.5px] font-semibold text-[var(--color-ink)]">Catatan internal</span>
                        <AutoTextarea
                          value={notes[e.id] ?? e.internalNote ?? ""}
                          onChange={(v) => setNotes((n) => ({ ...n, [e.id]: v }))}
                          placeholder="mis. Sudah survei 12 Okt, kirim RAB minggu depan"
                          disabled={!canEdit}
                        />
                      </label>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <button
                          type="button"
                          disabled={!canEdit || (notes[e.id] ?? e.internalNote ?? "") === (e.internalNote ?? "")}
                          onClick={() => update(e, { internalNote: notes[e.id] ?? "" }, "Catatan disimpan.")}
                          className={buttonClass("secondary", "sm")}
                        >
                          Simpan catatan
                        </button>
                        <button type="button" onClick={() => remove(e)} disabled={!canEdit} className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--color-ink-3)] hover:text-[var(--color-red)]">
                          <Trash2 size={13} aria-hidden="true" /> Hapus permintaan
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
