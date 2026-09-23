import type { Metadata } from "next";
import Image from "next/image";
import { Truck, Wrench, Warehouse, Gauge } from "lucide-react";
import { getEquipment } from "@/lib/repo";

export const metadata: Metadata = { title: "Kapasitas & Alat" };

const WORKSHOP = [
  { label: "Luas area fabrikasi", value: "2.400 m²" },
  { label: "Akses kendaraan maksimum", value: "Trailer 40 ft" },
  { label: "Penanganan material", value: "3 unit forklift (1×3,5 t + 2×2,5 t)" },
  { label: "Daya listrik", value: "33 kVA" },
];

export default async function KapasitasPage() {
  const equipment = await getEquipment();
  const categories = Array.from(new Set(equipment.map((e) => e.category)));

  return (
    <>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Kapasitas &amp; Alat</p>
          <h1 className="mt-2 max-w-2xl text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold text-[var(--color-ink)]">
            Alat berat &amp; workshop milik sendiri
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[var(--color-ink-2)]">
            BBP mengoperasikan armada dan workshop fabrikasi sendiri, bukan menyewa — mempercepat
            jadwal dan menjaga mutu fabrikasi baja tetap terkontrol.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKSHOP.map((w) => (
            <div key={w.label} className="rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-5">
              <Warehouse size={20} className="text-[var(--color-teal)]" aria-hidden="true" />
              <p className="mt-3 font-[family-name:var(--font-display)] text-xl font-extrabold tabular-nums text-[var(--color-ink)]">
                {w.value}
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-ink-2)]">{w.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {["/images/workshop/1.jpeg", "/images/workshop/2.jpeg", "/images/workshop/3.jpeg"].map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--color-surface-2)]">
              <Image src={src} alt="Workshop fabrikasi baja BBP" fill sizes="(min-width:1024px) 33vw, 90vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--color-line)] bg-[var(--color-surface-2)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex items-center gap-3">
            <Truck size={22} className="text-[var(--color-teal)]" aria-hidden="true" />
            <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">Daftar Peralatan</h2>
          </div>
          <div className="space-y-8">
            {categories.map((cat) => (
              <div key={cat}>
                <h3 className="flex items-center gap-2 font-data text-[13px] font-medium uppercase tracking-[0.1em] text-[var(--color-ink-3)]">
                  <Wrench size={14} aria-hidden="true" /> {cat}
                </h3>
                <div className="mt-3 overflow-x-auto rounded-md border border-[var(--color-line)] bg-[var(--color-surface)]">
                  <table className="w-full min-w-[480px] border-collapse text-[14px]">
                    <tbody>
                      {equipment
                        .filter((e) => e.category === cat)
                        .map((e) => (
                          <tr key={e.id} className="border-b border-[var(--color-line)] last:border-0">
                            <td className="px-4 py-3 font-medium text-[var(--color-ink)]">{e.name}</td>
                            <td className="px-4 py-3 text-[var(--color-ink-2)]">{e.spec}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-right font-data tabular-nums text-[var(--color-ink-2)]">
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

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex items-start gap-4 rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-6">
          <Gauge size={22} className="mt-0.5 shrink-0 text-[var(--color-teal)]" aria-hidden="true" />
          <p className="text-[14.5px] leading-relaxed text-[var(--color-ink-2)]">
            Kapasitas angkat terbesar BBP adalah rough-terrain crane <b className="text-[var(--color-ink)]">25 ton</b>,
            didukung knuckle boom crane 3 ton untuk pekerjaan yang lebih ringkas. Kombinasi ini
            digunakan pada erection struktur baja bentang lebar seperti gudang dan depo.
          </p>
        </div>
      </section>
    </>
  );
}
