import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Briefcase, CalendarClock, Check, Mail, MapPin, MessageCircle } from "lucide-react";
import { getJobs, getLayout, getSettings, getTexts } from "@/lib/repo";
import { fill } from "@/lib/texts";
import { isPageHidden, visibleSections } from "@/lib/sections";
import { formatDate, waLink } from "@/lib/site";
import { PageHeader } from "@/components/site/section-heading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.karier.title"], description: t["seo.karier.description"], alternates: { canonical: "/karier" } };
}

export default async function KarierPage() {
  const [settings, jobs, t, layout] = await Promise.all([getSettings(), getJobs(), getTexts(), getLayout()]);
  if (isPageHidden("karier", settings.hiddenPages)) notFound();

  const blocks: Record<string, () => React.ReactNode> = {
    intro: () => <PageHeader key="intro" eyebrow={t["careers.eyebrow"]} title={t["careers.title"]} intro={t["careers.intro"]} />,

    openings: () => (
      <section id="sec-openings" key="openings" className="container-x py-16 sm:py-20">
        {jobs.length === 0 ? (
          <div className="card flex flex-col items-start gap-5 p-8 sm:p-10">
            <Briefcase size={28} className="text-[var(--color-teal)]" aria-hidden="true" />
            <p className="max-w-2xl whitespace-pre-line text-[17px] leading-relaxed text-[var(--color-ink-2)]">{t["careers.empty"]}</p>
            <a href={`mailto:${settings.email}?subject=${encodeURIComponent("Lamaran kerja")}`} className="btn btn-primary">
              <Mail size={16} aria-hidden="true" /> {settings.email}
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const subject = `Lamaran: ${job.title}`;
              return (
                <article key={job.id} className="card grid gap-6 p-7 sm:p-9 lg:grid-cols-[1.4fr_1fr]">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {job.type && <span className="rounded-[4px] bg-[var(--color-teal-soft)] px-2.5 py-1 font-data text-[11px] uppercase tracking-wider text-[var(--color-teal-text)]">{job.type}</span>}
                      {job.location && (
                        <span className="inline-flex items-center gap-1 rounded-[4px] bg-[var(--color-surface-2)] px-2.5 py-1 text-[12.5px] text-[var(--color-ink-2)]">
                          <MapPin size={13} aria-hidden="true" /> {job.location}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-4 text-2xl font-extrabold text-[var(--color-ink)]">{job.title}</h2>
                    {job.summary && <p className="mt-3 whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-ink-2)]">{job.summary}</p>}
                    {job.requirements.length > 0 && (
                      <div className="mt-5">
                        <p className="font-data text-[11px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{t["careers.requirements"]}</p>
                        <ul className="mt-3 space-y-2">
                          {job.requirements.map((r, i) => (
                            <li key={i} className="flex gap-2 text-[15px] text-[var(--color-ink-2)]">
                              <Check size={16} className="mt-1 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 lg:items-stretch lg:justify-end">
                    {job.deadline && (
                      <p className="inline-flex items-center gap-2 text-[14px] text-[var(--color-ink-2)]">
                        <CalendarClock size={16} className="text-[var(--color-teal)]" aria-hidden="true" />
                        {t["careers.deadline"]}: <b className="text-[var(--color-ink)]">{formatDate(job.deadline, { day: "numeric", month: "long", year: "numeric" })}</b>
                      </p>
                    )}
                    <a href={`mailto:${settings.email}?subject=${encodeURIComponent(subject)}`} className="btn btn-primary">
                      <Mail size={16} aria-hidden="true" /> {t["careers.apply.email"]}
                    </a>
                    <a href={waLink(settings.whatsapp, `Halo BBP, saya ingin bertanya tentang lowongan ${job.title}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                      <MessageCircle size={16} aria-hidden="true" /> {t["careers.apply.whatsapp"]}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    ),

    how: () => (
      <section id="sec-how" key="how" className="container-x pb-20">
        <div className="rounded-[8px] bg-[var(--color-panel-dark)] p-7 sm:p-10">
          <h2 className="text-xl font-extrabold text-[var(--color-on-panel-dark)] sm:text-2xl">{t["careers.how.title"]}</h2>
          <p className="mt-3 max-w-3xl whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-on-panel-dark)]/75">{fill(t["careers.how.body"], { email: settings.email })}</p>
        </div>
      </section>
    ),
  };

  return <>{visibleSections("karier", layout).map((id) => blocks[id]?.())}</>;
}
