import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, AlertTriangle, Download, ShieldCheck, Clock3 } from "lucide-react";
import { getCertificates, getLayout, getSettings, getTexts } from "@/lib/repo";
import { fill, type Texts } from "@/lib/texts";
import { visibleSections } from "@/lib/sections";
import { formatDate, formatNumber } from "@/lib/site";
import type { Certificate, CertificateGroup } from "@/lib/types";
import { PageHeader } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.legalitas.title"], description: t["seo.legalitas.description"], alternates: { canonical: "/legalitas" } };
}

const GROUP_ORDER: CertificateGroup[] = ["legalitas", "sbu", "sistem_manajemen", "keanggotaan"];

function StatusBadge({ status, t }: { status: Certificate["status"]; t: Texts }) {
  const map = {
    berlaku: { cls: "bg-[var(--color-teal-soft)] text-[var(--color-teal-text)]", Icon: FileCheck2 },
    perlu_verifikasi: { cls: "bg-[var(--color-yellow)] text-[#17181a]", Icon: Clock3 },
    kedaluwarsa: { cls: "bg-[var(--color-red)]/12 text-[var(--color-red)]", Icon: AlertTriangle },
  } as const;
  const { cls, Icon } = map[status];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-[4px] px-2 py-1 font-data text-[10.5px] font-medium uppercase tracking-wider ${cls}`}>
      <Icon size={12} aria-hidden="true" /> {t[`legal.status.${status}`]}
    </span>
  );
}

export default async function LegalitasPage() {
  const [certificates, settings, t, layout] = await Promise.all([getCertificates(), getSettings(), getTexts(), getLayout()]);
  const groups = GROUP_ORDER.filter((g) => certificates.some((c) => c.group === g));
  const needsVerification = certificates.some((c) => c.status === "perlu_verifikasi");

  const blocks: Record<string, () => React.ReactNode> = {
    intro: () => (
      <PageHeader key="intro" eyebrow={t["legal.eyebrow"]} title={t["legal.title"]}>
        <dl className="mt-9 grid max-w-3xl overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] sm:grid-cols-3">
          {(
            [
              ["NIB", settings.legal.nib],
              ["NPWP", settings.legal.npwp],
              ["SIUP", settings.legal.siup],
            ] as const
          ).map(([k, v], i) => (
            <div key={k} className={`px-5 py-4 ${i > 0 ? "border-t border-[var(--color-line)] sm:border-l sm:border-t-0" : ""}`}>
              <dt className="font-data text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{k}</dt>
              <dd className="mt-1 font-data text-[14.5px] font-medium text-[var(--color-ink)]">{v}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>
    ),

    warning: () =>
      needsVerification ? (
        <div id="sec-warning" key="warning" className="border-b border-[var(--color-line)] bg-[var(--color-yellow)]/20">
          <div className="container-x flex items-start gap-3 py-4">
            <Clock3 size={18} className="mt-0.5 shrink-0 text-[var(--color-yellow-ink)]" aria-hidden="true" />
            <p className="whitespace-pre-line text-[14px] leading-relaxed text-[var(--color-ink)]">{t["legal.warning"]}</p>
          </div>
        </div>
      ) : null,

    documents: () => (
      <section id="sec-documents" key="documents" className="container-x py-16 sm:py-20">
        <div className="space-y-14">
          {groups.map((group) => (
            <div key={group}>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[var(--color-ink)] sm:text-2xl">
                {t[`legal.group.${group}`]}
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {certificates
                  .filter((c) => c.group === group)
                  .map((c) => (
                    <article key={c.id} className="card flex flex-col p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-[16px] font-semibold leading-snug text-[var(--color-ink)]">{c.name}</h3>
                        <StatusBadge status={c.status} t={t} />
                      </div>
                      <dl className="mt-3 space-y-1 font-data text-[12.5px] text-[var(--color-ink-2)]">
                        {c.number && (
                          <div>
                            <dt className="inline text-[var(--color-ink-3)]">No. </dt>
                            <dd className="inline">
                              {c.number}
                              {c.qualification ? ` · Kualifikasi ${c.qualification}` : ""}
                            </dd>
                          </div>
                        )}
                        <div>
                          <dt className="inline text-[var(--color-ink-3)]">Penerbit </dt>
                          <dd className="inline">{c.issuer}</dd>
                        </div>
                        {c.expiresAt && (
                          <div>
                            <dt className="inline text-[var(--color-ink-3)]">Berlaku s/d </dt>
                            <dd className="inline">{formatDate(c.expiresAt, { day: "numeric", month: "long", year: "numeric" })}</dd>
                          </div>
                        )}
                      </dl>
                      {c.note && <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--color-ink-2)]">{c.note}</p>}
                      <div className="mt-auto pt-4">
                        {c.fileUrl ? (
                          <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="link-arrow text-[13.5px]">
                            <Download size={14} aria-hidden="true" /> {t["legal.download"]}
                          </a>
                        ) : (
                          <Link href="/hubungi" className="text-[13px] text-[var(--color-ink-3)] underline-offset-4 hover:text-[var(--color-teal-text)] hover:underline">
                            {t["legal.onRequest"]}
                          </Link>
                        )}
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    ),

    system: () => (
      <section id="sec-system" key="system" className="container-x pb-20">
        <div className="flex items-start gap-5 rounded-[8px] bg-[var(--color-panel-dark)] p-7 sm:p-9">
          <ShieldCheck size={28} className="mt-0.5 shrink-0 text-[var(--color-yellow)]" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-bold text-[var(--color-on-panel-dark)] sm:text-xl">{t["legal.system.title"]}</h2>
            <p className="mt-2 max-w-3xl whitespace-pre-line text-[15px] leading-relaxed text-[var(--color-on-panel-dark)]/75">
              {fill(t["legal.system.body"], {
                iso: settings.iso9001.standard,
                penerbitIso: settings.iso9001.issuer,
                regulasiSmk3: settings.smk3.regulation,
                skorSmk3: formatNumber(settings.smk3.score),
                kriteriaTerpenuhi: settings.smk3.criteriaMet,
                kriteriaTotal: settings.smk3.criteriaTotal,
                kategoriSmk3: settings.smk3.category,
                tingkatSmk3: settings.smk3.level,
              })}
            </p>
          </div>
        </div>
      </section>
    ),
  };

  return <>{visibleSections("legalitas", layout).map((id) => blocks[id]?.())}</>;
}
