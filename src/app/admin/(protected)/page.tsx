import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  ExternalLink,
  Images,
  Inbox,
  MapPin,
  PanelsTopLeft,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { getSession } from "@/lib/auth";
import { getAllCertificates, getAllClients, getAllProjects, getRfqEntries, getServices } from "@/lib/repo";
import { PAGES } from "@/lib/sections";
import { daysUntil, formatDate } from "@/lib/site";
import { Card, LinkButton } from "@/components/admin/ui";

export const metadata = { title: "Ringkasan" };

const RFQ_LABEL: Record<string, string> = { baru: "Baru", dihubungi: "Dihubungi", penawaran: "Penawaran", menang: "Deal", kalah: "Tidak lanjut" };

export default async function AdminDashboardPage() {
  const [session, projects, rfq, certificates, clients, services] = await Promise.all([
    getSession(),
    getAllProjects(),
    getRfqEntries(),
    getAllCertificates(),
    getAllClients(),
    getServices(),
  ]);

  const visible = projects.filter((p) => !p.hidden);
  const newRfq = rfq.filter((r) => r.status === "baru");
  const certIssues = certificates
    .filter((c) => !c.hidden)
    .map((c) => {
      const days = daysUntil(c.expiresAt);
      if (c.status === "kedaluwarsa" || (days !== null && days < 0)) return { c, text: "sudah kedaluwarsa", level: "red" as const };
      if (c.status === "perlu_verifikasi") return { c, text: "perlu verifikasi masa berlaku", level: "yellow" as const };
      if (days !== null && days <= 60) return { c, text: `habis ${days} hari lagi`, level: "yellow" as const };
      return null;
    })
    .filter(Boolean) as { c: (typeof certificates)[number]; text: string; level: "red" | "yellow" }[];
  const noPhotos = visible.filter((p) => p.images.length === 0);
  const noLocation = visible.filter((p) => !p.lat && !p.lng);
  const noLogo = clients.filter((c) => !c.hidden && !c.logo);
  const drafts = projects.filter((p) => p.hidden);
  const hour = Number(new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Jakarta" }));
  const greeting = hour < 11 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 19 ? "Selamat sore" : "Selamat malam";

  const tasks = [
    ...certIssues.map(({ c, text, level }) => ({ href: "/admin/sertifikat", icon: ShieldCheck, level, text: <>Sertifikat <b>{c.name}</b> {text}</> })),
    ...noPhotos.map((p) => ({ href: `/admin/proyek/${p.id}`, icon: Images, level: "yellow" as const, text: <>Proyek <b>{p.titleId}</b> belum ada foto</> })),
    ...noLocation.map((p) => ({ href: `/admin/proyek/${p.id}`, icon: MapPin, level: "yellow" as const, text: <>Proyek <b>{p.titleId}</b> belum ada titik di peta</> })),
  ];

  const stats = [
    { label: "Penawaran baru", value: newRfq.length, href: "/admin/rfq", icon: Inbox, highlight: newRfq.length > 0 },
    { label: "Proyek tampil", value: `${visible.length}`, sub: drafts.length ? `${drafts.length} draf` : undefined, href: "/admin/proyek", icon: Building2 },
    { label: "Klien", value: clients.filter((c) => !c.hidden).length, sub: noLogo.length ? `${noLogo.length} belum ada logo` : undefined, href: "/admin/klien", icon: Users },
    { label: "Layanan", value: services.length, href: "/admin/halaman?halaman=layanan#editor-list", icon: PanelsTopLeft },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-data text-[11px] uppercase tracking-[0.16em] text-[var(--color-teal-text)]">{formatDate(new Date().toISOString(), { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          <h1 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--color-ink)]">
            {greeting}, {session?.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-[14px] text-[var(--color-ink-2)]">Semua isi website bisa diubah dari menu di kiri. Perubahan langsung tampil setelah disimpan.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/" target="_blank" variant="secondary">
            <ExternalLink size={15} aria-hidden="true" /> Lihat website
          </LinkButton>
          <LinkButton href="/admin/proyek/baru" variant="primary">
            <Plus size={15} aria-hidden="true" /> Proyek baru
          </LinkButton>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group rounded-[8px] border p-5 transition-colors ${
              s.highlight ? "border-[var(--color-yellow)] bg-[var(--color-dirty-bg)]" : "border-[var(--color-line)] bg-[var(--color-surface)] hover:border-[var(--color-teal)]"
            }`}
          >
            <div className="flex items-center justify-between">
              <s.icon size={18} className="text-[var(--color-teal)]" aria-hidden="true" />
              <ArrowRight size={15} className="text-[var(--color-ink-3)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </div>
            <p className="mt-3 font-[family-name:var(--font-display)] text-[32px] font-extrabold leading-none tabular-nums text-[var(--color-ink)]">{s.value}</p>
            <p className="mt-1.5 text-[13px] text-[var(--color-ink-2)]">
              {s.label}
              {s.sub && <span className="text-[var(--color-ink-3)]"> · {s.sub}</span>}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle size={17} className="text-[var(--color-yellow-ink)]" aria-hidden="true" />
            <h2 className="text-[15.5px] font-bold text-[var(--color-ink)]">Perlu perhatian</h2>
            <span className="font-data text-[12px] text-[var(--color-ink-3)]">{tasks.length}</span>
          </div>
          {tasks.length ? (
            <ul className="divide-y divide-[var(--color-line)]">
              {tasks.slice(0, 10).map((task, i) => (
                <li key={i}>
                  <Link href={task.href} className="flex items-start gap-3 py-2.5 text-[13.5px] text-[var(--color-ink-2)] hover:text-[var(--color-ink)]">
                    <task.icon size={16} className={`mt-0.5 shrink-0 ${task.level === "red" ? "text-[var(--color-red)]" : "text-[var(--color-yellow-ink)]"}`} aria-hidden="true" />
                    <span className="flex-1">{task.text}</span>
                    <ArrowRight size={14} className="mt-1 shrink-0 text-[var(--color-ink-3)]" aria-hidden="true" />
                  </Link>
                </li>
              ))}
              {tasks.length > 10 && <li className="pt-2.5 text-[12.5px] text-[var(--color-ink-3)]">+{tasks.length - 10} lainnya</li>}
            </ul>
          ) : (
            <p className="flex items-center gap-2 text-[13.5px] text-[var(--color-ink-2)]">
              <CheckCircle2 size={16} className="text-[var(--color-teal)]" aria-hidden="true" /> Semua data lengkap. Tidak ada yang perlu ditindaklanjuti.
            </p>
          )}
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15.5px] font-bold text-[var(--color-ink)]">Penawaran terbaru</h2>
            <Link href="/admin/rfq" className="text-[13px] font-semibold text-[var(--color-teal-text)] hover:underline">
              Buka inbox
            </Link>
          </div>
          {rfq.length ? (
            <ul className="divide-y divide-[var(--color-line)]">
              {rfq.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-semibold text-[var(--color-ink)]">{r.company || r.name}</p>
                    <p className="text-[12px] text-[var(--color-ink-3)]">
                      {r.location} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-[4px] px-1.5 py-0.5 font-data text-[10.5px] font-medium uppercase ${
                      r.status === "baru" ? "bg-[var(--color-yellow)] text-[#17181a]" : "bg-[var(--color-surface-2)] text-[var(--color-ink-2)]"
                    }`}
                  >
                    {RFQ_LABEL[r.status]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13.5px] text-[var(--color-ink-2)]">Belum ada permintaan penawaran. Permintaan dari formulir Hubungi Kami akan muncul di sini.</p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="text-[15.5px] font-bold text-[var(--color-ink)]">Ubah halaman website</h2>
        <p className="mt-1 text-[13px] text-[var(--color-ink-3)]">Pilih halaman, lalu ubah tulisan, foto, dan susunan bagiannya.</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {PAGES.map((p) => (
            <Link
              key={p.id}
              href={`/admin/halaman?halaman=${p.id}`}
              className="group flex items-center justify-between rounded-[6px] border border-[var(--color-line)] px-3.5 py-3 text-[14px] font-semibold text-[var(--color-ink)] hover:border-[var(--color-teal)] hover:bg-[var(--color-teal-soft)]/50"
            >
              <span>
                {p.label}
                <span className="block text-[11.5px] font-normal text-[var(--color-ink-3)]">{p.sections.length} bagian</span>
              </span>
              <ArrowRight size={15} className="text-[var(--color-ink-3)] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </Card>

      <Card className="bg-[var(--color-band)]">
        <h2 className="text-[15.5px] font-bold text-[var(--color-ink)]">Panduan singkat</h2>
        <ol className="mt-3 grid gap-4 text-[13.5px] leading-relaxed text-[var(--color-ink-2)] md:grid-cols-2 xl:grid-cols-4">
          <li>
            <b className="text-[var(--color-ink)]">Ganti foto hero:</b> Halaman Website → Beranda → Hero → Tambah foto. Tautkan ke proyek agar nama & lokasinya tampil.
          </li>
          <li>
            <b className="text-[var(--color-ink)]">Tambah proyek:</b> Proyek → Proyek baru. Unggah foto langsung dari HP, foto pertama jadi sampul.
          </li>
          <li>
            <b className="text-[var(--color-ink)]">Sembunyikan bagian:</b> di Halaman Website, klik tombol “Tampil” pada bagian mana pun untuk menyembunyikannya.
          </li>
          <li>
            <b className="text-[var(--color-ink)]">Salah ubah?</b> Klik “Kembalikan” di samping kolom untuk kembali ke tulisan awal, atau pulihkan dari Cadangan Data.
          </li>
        </ol>
      </Card>
    </div>
  );
}
