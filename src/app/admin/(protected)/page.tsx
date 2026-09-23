import Link from "next/link";
import { AlertTriangle, Inbox, Building2, ShieldCheck, Plus, ArrowRight } from "lucide-react";
import { getProjects, getRfqEntries, getCertificates } from "@/lib/repo";
import { Card } from "@/components/admin/field";

export const metadata = { title: "Dashboard — Admin" };

const RFQ_STATUS_LABEL: Record<string, string> = {
  baru: "Baru",
  dihubungi: "Dihubungi",
  penawaran: "Penawaran",
  menang: "Menang",
  kalah: "Kalah",
};

export default async function AdminDashboardPage() {
  const [projects, rfq, certificates] = await Promise.all([
    getProjects(),
    getRfqEntries(),
    getCertificates(),
  ]);

  const newRfq = rfq.filter((r) => r.status === "baru").length;
  const ongoing = projects.filter((p) => p.status === "berjalan").length;
  const certsToVerify = certificates.filter((c) => c.status !== "berlaku");
  const projectsWithoutPhotos = projects.filter((p) => p.images.length === 0);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">Dashboard</h1>
      <p className="mt-1 text-[14px] text-[var(--color-ink-2)]">Ringkasan situs BBP hari ini.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <Inbox size={18} className="text-[var(--color-teal)]" aria-hidden="true" />
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tabular-nums text-[var(--color-ink)]">
            {newRfq}
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">RFQ baru</p>
        </Card>
        <Card>
          <Building2 size={18} className="text-[var(--color-teal)]" aria-hidden="true" />
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tabular-nums text-[var(--color-ink)]">
            {projects.length}
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">Proyek terbit</p>
        </Card>
        <Card>
          <Building2 size={18} className="text-[var(--color-yellow-ink)]" aria-hidden="true" />
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tabular-nums text-[var(--color-ink)]">
            {ongoing}
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">Proyek berjalan</p>
        </Card>
        <Card className={certsToVerify.length ? "border-[var(--color-yellow)]" : ""}>
          <ShieldCheck size={18} className="text-[var(--color-yellow-ink)]" aria-hidden="true" />
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-extrabold tabular-nums text-[var(--color-ink)]">
            {certsToVerify.length}
          </p>
          <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">Sertifikat perlu verifikasi</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[var(--color-ink)]">RFQ Terbaru</h2>
            <Link href="/admin/rfq" className="text-[13px] font-medium text-[var(--color-teal-text)]">
              Lihat semua
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {rfq.slice(0, 5).map((r) => (
              <div key={r.id} className="border-b border-[var(--color-line)] pb-3 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-data text-[13px] font-medium text-[var(--color-ink)]">
                    {r.company || r.name}
                  </p>
                  <span className="shrink-0 rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 font-data text-[10.5px] uppercase text-[var(--color-ink-2)]">
                    {RFQ_STATUS_LABEL[r.status]}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] text-[var(--color-ink-2)]">
                  {r.location} · {new Date(r.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>
            ))}
            {rfq.length === 0 && (
              <p className="text-[13.5px] text-[var(--color-ink-3)]">Belum ada permintaan penawaran.</p>
            )}
          </div>
        </Card>

        <Card className={certsToVerify.length || projectsWithoutPhotos.length ? "border-[var(--color-yellow)]" : ""}>
          <div className="flex items-center gap-2">
            <AlertTriangle size={17} className="text-[var(--color-yellow-ink)]" aria-hidden="true" />
            <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Perlu Perhatian</h2>
          </div>
          <div className="mt-4 space-y-2.5 text-[13.5px]">
            {certsToVerify.map((c) => (
              <Link
                key={c.id}
                href="/admin/sertifikat"
                className="block text-[var(--color-ink-2)] hover:text-[var(--color-teal-text)]"
              >
                Sertifikat <b>{c.name}</b> perlu verifikasi masa berlaku
              </Link>
            ))}
            {projectsWithoutPhotos.map((p) => (
              <Link
                key={p.id}
                href={`/admin/proyek/${p.id}`}
                className="block text-[var(--color-ink-2)] hover:text-[var(--color-teal-text)]"
              >
                Proyek <b>{p.titleId}</b> belum ada foto
              </Link>
            ))}
            {!certsToVerify.length && !projectsWithoutPhotos.length && (
              <p className="text-[var(--color-ink-3)]">Semua data lengkap. Tidak ada yang perlu ditindaklanjuti.</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-[15px] font-bold text-[var(--color-ink)]">Aksi Cepat</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/proyek/baru"
            className="inline-flex items-center gap-2 rounded-md bg-[var(--color-teal)] px-4 py-2.5 text-[13.5px] font-semibold text-[var(--color-on-teal)]"
          >
            <Plus size={15} aria-hidden="true" /> Proyek Baru
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-md border border-[var(--color-line-2)] px-4 py-2.5 text-[13.5px] font-semibold text-[var(--color-ink)]"
          >
            Lihat Situs <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </Card>
    </div>
  );
}
