import type { Metadata } from "next";
import Image from "next/image";
import { Gauge } from "lucide-react";
import { getEquipment, getLayout, getMedia, getTexts } from "@/lib/repo";
import { parseList } from "@/lib/texts";
import { mediaFor } from "@/lib/media";
import { visibleSections } from "@/lib/sections";
import { PageHeader, SectionHeading } from "@/components/site/section-heading";
import { PhotoGrid } from "@/components/site/photo-grid";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTexts();
  return { title: t["seo.kapasitas.title"], description: t["seo.kapasitas.description"], alternates: { canonical: "/kapasitas" } };
}

export default async function KapasitasPage() {
  const [equipment, t, media, layout] = await Promise.all([getEquipment(), getTexts(), getMedia(), getLayout()]);
  const categories = Array.from(new Set(equipment.map((e) => e.category)));

  const blocks: Record<string, () => React.ReactNode> = {
    intro: () => <PageHeader key="intro" eyebrow={t["capacity.eyebrow"]} title={t["capacity.title"]} intro={t["capacity.intro"]} />,

    workshop: () => {
      const rows = parseList(t["capacity.workshop"]);
      if (!rows.length) return null;
      return (
        <section id="sec-workshop" key="workshop" className="container-x pt-16 sm:pt-20">
          <dl className="grid overflow-hidden rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)] sm:grid-cols-2 lg:grid-cols-4">
            {rows.map(([value, label], i) => (
              <div
                key={i}
                className="border-b border-[var(--color-line)] p-6 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <dt className="font-data text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-3)]">{label ?? ""}</dt>
                <dd className="mt-2 font-[family-name:var(--font-display)] text-[1.35rem] font-extrabold leading-tight text-[var(--color-ink)]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
    },

    gallery: () => {
      const photos = mediaFor(media, "capacity.gallery");
      if (!photos.length) return null;
      return (
        <section id="sec-gallery" key="gallery" className="container-x py-16 sm:py-20">
          <SectionHeading title={t["capacity.gallery.title"]} />
          <PhotoGrid photos={photos.map((p) => ({ src: p.src, alt: p.alt ?? t["capacity.gallery.title"] }))} className="mt-8" />
        </section>
      );
    },

    equipment: () =>
      equipment.length ? (
        <section id="sec-equipment" key="equipment" className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-20 sm:py-24">
          <div className="container-x">
            <SectionHeading title={t["capacity.equipment.title"]} />
            <div className="mt-10 space-y-10">
              {categories.map((cat) => (
                <div key={cat}>
                  <h3 className="font-data text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--color-teal-text)]">{cat}</h3>
                  <div className="mt-3 overflow-x-auto rounded-[6px] border border-[var(--color-line)] bg-[var(--color-surface)]">
                    <table className="w-full min-w-[520px] border-collapse text-[14.5px]">
                      <thead className="sr-only">
                        <tr>
                          <th>Nama alat</th>
                          <th>Spesifikasi</th>
                          <th>Jumlah</th>
                        </tr>
                      </thead>
                      <tbody>
                        {equipment
                          .filter((e) => e.category === cat)
                          .map((e) => (
                            <tr key={e.id} className="border-b border-[var(--color-line)] last:border-0">
                              <td className="px-5 py-3.5 font-medium text-[var(--color-ink)]">
                                <span className="flex items-center gap-3">
                                  {e.image && (
                                    <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-[4px] bg-[var(--color-wf-fill)]">
                                      <Image src={e.image} alt="" fill sizes="56px" className="object-cover" />
                                    </span>
                                  )}
                                  {e.name}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-[var(--color-ink-2)]">{e.spec}</td>
                              <td className="whitespace-nowrap px-5 py-3.5 text-right font-data tabular-nums text-[var(--color-ink-2)]">
                                {e.qty ? `${e.qty} unit` : ""}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null,

    note: () => (
      <section id="sec-note" key="note" className="container-x py-16">
        <div className="card flex items-start gap-5 p-7">
          <Gauge size={24} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
          <p className="whitespace-pre-line text-[16px] leading-relaxed text-[var(--color-ink-2)]">{t["capacity.note"]}</p>
        </div>
      </section>
    ),
  };

  return <>{visibleSections("kapasitas", layout).map((id) => blocks[id]?.())}</>;
}
