import type { Metadata } from "next";
import Image from "next/image";
import { getSettings, getTeam } from "@/lib/repo";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Tentang Kami" };
}

const TIMELINE = [
  { year: "2012", text: "PT. Bina Bangun Perkasa didirikan di Kediri berdasarkan Akta Notaris Paulus Bingadiputra, S.H., No. 280." },
  { year: "2014", text: "Proyek pertama di luar Pulau Jawa: pembangunan depo rokok PT. Gudang Garam Tbk. di Kupang, NTT." },
  { year: "2015–2018", text: "Ekspansi jaringan depo rokok Gudang Garam ke Banyuwangi, Pati, Subang, dan Medan." },
  { year: "2019", text: "Memasok tail sealant untuk proyek Kereta Cepat Jakarta–Bandung bersama PT. Kereta Cepat Indonesia China." },
  { year: "2020", text: "Rangkaian proyek besar untuk Gudang Garam di Demak, Cirebon, Jember, dan Bandar Lampung, berjalan pararel." },
  { year: "2021", text: "Kepercayaan dari sektor pertahanan: pembangunan rumah dinas TNI AD YONZIKON 13 di Jakarta." },
  { year: "2022–2023", text: "Proyek berlanjut di Kediri, Manado, dan Jakarta bersama klien lama maupun baru." },
  { year: "2025", text: "Ekspansi ke Batam — 4 unit gudang baja untuk PT. Harapan Jaya Sentosa di Panbil Industrial Estate." },
];

export default async function TentangPage() {
  const [settings, team] = await Promise.all([getSettings(), getTeam()]);

  return (
    <>
      <section className="border-b border-[var(--color-line)] bg-[var(--color-band)]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Tentang Kami</p>
          <h1 className="mt-2 max-w-3xl text-[clamp(1.9rem,3.6vw,2.75rem)] font-extrabold text-[var(--color-ink)]">
            Kontraktor keluarga yang tumbuh jadi mitra industri nasional
          </h1>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <p className="text-[16px] leading-relaxed text-[var(--color-ink-2)]">
              PT. Bina Bangun Perkasa (BBP) didirikan pada {settings.established} berdasarkan{" "}
              {settings.akta}. Tujuan BBP didirikan untuk melakukan pekerjaan di bidang konstruksi
              sipil, baja, mekanikal-elektrikal (M/E), maupun pekerjaan lain seperti pemipaan, cut
              and fill lahan, pemetaan dengan alat total station, serta pengadaan barang atau jasa
              yang menunjang pekerjaan konstruksi.
              <br />
              <br />
              Sebagai perusahaan berbadan hukum, BBP secara organisasi memiliki kemampuan dan
              pengalaman panjang di bidang konstruksi, pengadaan barang, maupun rekayasa teknik.
              Keberadaan BBP tidak terlepas dari dukungan beberapa perusahaan terkait secara
              manajemen dan kepemilikan, termasuk PT. Graha Insan Kreatif dan PT. Graha Intan
              Kreatif yang lebih dulu berdiri di Kediri.
            </p>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--color-surface-2)]">
              <Image
                src="/images/about/1.jpeg"
                alt="Kantor PT. Bina Bangun Perkasa, Jl. Urip Sumoharjo, Kediri"
                fill
                sizes="(min-width: 1024px) 420px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Director */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Direktur</p>
        <div className="mt-3 rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-7 sm:p-9">
          <h2 className="text-2xl font-extrabold text-[var(--color-ink)]">{settings.director.name}</h2>
          <p className="text-[14.5px] text-[var(--color-ink-3)]">{settings.director.role}</p>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-[var(--color-ink-2)]">
            {settings.director.bioId}
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="border-y border-[var(--color-line)] bg-[var(--color-band-2)] py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Struktur Organisasi</p>
          <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl">Tim inti BBP</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((m) => (
              <div
                key={m.id}
                className="card-lift rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5"
              >
                <p className="font-semibold text-[var(--color-ink)]">{m.name}</p>
                <p className="mt-0.5 text-[13.5px] text-[var(--color-ink-2)]">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow font-data text-xs uppercase tracking-[0.14em] text-[var(--color-teal-text)]">Rekam Jejak</p>
        <h2 className="mt-2 text-2xl font-extrabold text-[var(--color-ink)] sm:text-3xl">2012 – sekarang</h2>
        <ol className="mt-8 border-l-2 border-[var(--color-line)] pl-6">
          {TIMELINE.map((t) => (
            <li key={t.year} className="relative pb-9 last:pb-0">
              <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-teal)]" />
              <p className="font-data text-[13px] font-medium uppercase tracking-wide text-[var(--color-teal-text)]">
                {t.year}
              </p>
              <p className="mt-1 text-[15px] leading-relaxed text-[var(--color-ink-2)]">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
