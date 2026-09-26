import type { Metadata } from "next";
import { FileCheck2, AlertTriangle, Download, ShieldCheck } from "lucide-react";
import { getCertificates, getSettings, getTexts } from "@/lib/repo";
import { fill } from "@/lib/texts";
import type { Certificate } from "@/lib/types";

export const metadata: Metadata = { title: "Legalitas & Sertifikasi" };


function StatusBadge({ status }: { status: Certificate["status"] }) {
  if (status === "berlaku") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-teal-soft)] px-2.5 py-1 font-data text-[11px] uppercase tracking-wide text-[var(--color-teal-text)]">
        <FileCheck2 size={12} aria-hidden="true" /> Berlaku
      </span>
    );
  }
  if (status === "perlu_verifikasi") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-yellow)] px-2.5 py-1 font-data text-[11px] uppercase tracking-wide text-[var(--color-yellow-ink)]">
        <AlertTriangle size={12} aria-hidden="true" /> Perlu Verifikasi
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-red)]/15 px-2.5 py-1 font-data text-[11px] uppercase tracking-wide text-[var(--color-red)]">
      <AlertTriangle size={12} aria-hidden="true" /> Kedaluwarsa
    </span>
  );
}

export default async function LegalitasPage() {
  const [certificates, settings, t] = await Promise.all([getCertificates(), getSettings(), getTexts()]);
  const groups = Array.from(new Set(certificates.map((c) => c.group)));
  const needsVerification = certificates.some((c) => c.status === "perlu_verifikasi");

  return (
    <>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">{t["legal.eyebrow"]}</p>
          <h1 className="mt-2 max-w-2xl text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold text-[var(--color-ink)]">
            {t["legal.title"]}
          </h1>
          <div className="mt-6 flex flex-wrap gap-4 font-data text-[13.5px] text-[var(--color-ink-2)]">
            <span>NIB {settings.legal.nib}</span>
            <span>·</span>
            <span>NPWP {settings.legal.npwp}</span>
            <span>·</span>
            <span>SIUP {settings.legal.siup}</span>
          </div>
        </div>
      </section>

      {needsVerification && (
        <div className="border-b border-[var(--color-line)] bg-[var(--color-yellow)]/25">
          <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-4 sm:px-6">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[var(--color-yellow-ink)]" aria-hidden="true" />
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-[var(--color-ink)]">
              {t["legal.warning"]}
            </p>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="space-y-10">
          {groups.map((group) => (
            <div key={group}>
              <h2 className="font-data text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-3)]">
                {t[`legal.group.${group}`]}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {certificates
                  .filter((c) => c.group === group)
                  .map((c) => (
                    <div key={c.id} className="card-lift rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold leading-snug text-[var(--color-ink)]">{c.name}</p>
                        <StatusBadge status={c.status} />
                      </div>
                      {c.number && (
                        <p className="mt-2 font-data text-[13px] text-[var(--color-ink-2)]">
                          No. {c.number}
                          {c.qualification ? ` · Kualifikasi ${c.qualification}` : ""}
                        </p>
                      )}
                      <p className="mt-1 text-[13px] text-[var(--color-ink-3)]">Penerbit: {c.issuer}</p>
                      {c.note && <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-2)]">{c.note}</p>}
                      <div className="mt-3">
                        {c.fileUrl ? (
                          <a
                            href={c.fileUrl}
                            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-teal-text)]"
                          >
                            <Download size={13} aria-hidden="true" /> Unduh dokumen
                          </a>
                        ) : (
                          <span className="text-[12.5px] text-[var(--color-ink-3)]">
                            Berkas PDF belum diunggah admin
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex items-start gap-4 rounded-md bg-[var(--color-surface-2)] p-6">
          <ShieldCheck size={22} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
          <div>
            <p className="text-[14.5px] font-semibold text-[var(--color-ink)]">
              {t["legal.system.title"]}
            </p>
            <p className="mt-1 whitespace-pre-line text-[14px] leading-relaxed text-[var(--color-ink-2)]">
              {fill(t["legal.system.body"], {
                iso: settings.iso9001.standard,
                penerbitIso: settings.iso9001.issuer,
                regulasiSmk3: settings.smk3.regulation,
                skorSmk3: settings.smk3.score,
                kriteriaTerpenuhi: settings.smk3.criteriaMet,
                kriteriaTotal: settings.smk3.criteriaTotal,
                kategoriSmk3: settings.smk3.category,
                tingkatSmk3: settings.smk3.level,
              })}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
