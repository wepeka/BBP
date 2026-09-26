/**
 * Every editable piece of copy on the public site, with its default.
 *
 * Pages read text through getTexts() (lib/repo.ts); the admin "Teks Website"
 * page is generated from this list. Only changed values are stored (the
 * "texts" collection), so a default edited here still applies to any text
 * the admin hasn't touched.
 *
 * - `multiline`: rendered with line breaks kept (blank line = new paragraph).
 * - `vars`: placeholders filled in at render time, e.g. {kota}.
 * - `list`: one item per line, columns separated by "|".
 */
export interface TextField {
  key: string;
  page: string;
  section: string;
  label: string;
  default: string;
  multiline?: boolean;
  vars?: string[];
  list?: string;
}

export const TEXT_PAGES = [
  { id: "beranda", label: "Beranda", href: "/" },
  { id: "tentang", label: "Tentang", href: "/tentang" },
  { id: "layanan", label: "Layanan", href: "/layanan" },
  { id: "proyek", label: "Proyek", href: "/proyek" },
  { id: "kapasitas", label: "Kapasitas", href: "/kapasitas" },
  { id: "legalitas", label: "Legalitas", href: "/legalitas" },
  { id: "klien", label: "Klien", href: "/klien" },
  { id: "hubungi", label: "Hubungi", href: "/hubungi" },
  { id: "umum", label: "Header & Footer", href: "/" },
] as const;

export const TEXT_FIELDS = [
  /* ---------------- Beranda ---------------- */
  { key: "home.hero.badge", page: "beranda", section: "Hero (bagian paling atas)", label: "Label kecil di atas judul", default: "General Contractor & Supplier · Kediri" },
  { key: "home.hero.title", page: "beranda", section: "Hero (bagian paling atas)", label: "Judul besar", default: "Kontraktor andalan industri. Terbukti di 17 kota sejak 2012.", multiline: true },
  { key: "home.hero.subtitle", page: "beranda", section: "Hero (bagian paling atas)", label: "Paragraf di bawah judul", default: "General contractor & supplier asal Kediri untuk struktur beton, fabrikasi baja, atap, MEP, sipil, dan pengadaan — dipercaya PT Gudang Garam Tbk sejak 2012.", multiline: true },
  { key: "home.hero.ctaPrimary", page: "beranda", section: "Hero (bagian paling atas)", label: "Tombol utama", default: "Kirim Rencana Proyek Anda" },
  { key: "home.hero.ctaSecondary", page: "beranda", section: "Hero (bagian paling atas)", label: "Tombol kedua", default: "Lihat Proyek Kami" },
  { key: "home.hero.imageCaption", page: "beranda", section: "Hero (bagian paling atas)", label: "Keterangan di foto", default: "Struktur baja · Gudang industri" },
  { key: "home.hero.badgeTitle", page: "beranda", section: "Hero (bagian paling atas)", label: "Badge melayang — judul", default: "ISO 9001 & SMK3" },
  { key: "home.hero.badgeText", page: "beranda", section: "Hero (bagian paling atas)", label: "Badge melayang — keterangan", default: "Skor SMK3 {skorSmk3}%", vars: ["skorSmk3"] },
  { key: "home.hero.yearsBadge", page: "beranda", section: "Hero (bagian paling atas)", label: "Badge tahun (di bawah angka)", default: "tahun\ndipercaya", multiline: true },

  { key: "home.stats.years", page: "beranda", section: "Angka statistik", label: "Keterangan angka 1", default: "tahun beroperasi" },
  { key: "home.stats.cities", page: "beranda", section: "Angka statistik", label: "Keterangan angka 2", default: "kota di Indonesia" },
  { key: "home.stats.projects", page: "beranda", section: "Angka statistik", label: "Keterangan angka 3", default: "referensi pekerjaan" },
  { key: "home.stats.clients", page: "beranda", section: "Angka statistik", label: "Keterangan angka 4", default: "klien korporat" },

  { key: "home.clients.eyebrow", page: "beranda", section: "Klien", label: "Judul kecil", default: "Dipercaya berulang oleh klien industri & instansi" },

  { key: "home.services.eyebrow", page: "beranda", section: "Layanan", label: "Label kecil", default: "Layanan" },
  { key: "home.services.title", page: "beranda", section: "Layanan", label: "Judul", default: "Satu kontraktor, dari fabrikasi sampai serah terima" },
  { key: "home.services.more", page: "beranda", section: "Layanan", label: "Teks tautan di kartu", default: "Selengkapnya" },

  { key: "home.map.eyebrow", page: "beranda", section: "Peta proyek", label: "Label kecil", default: "Jejak Proyek Nasional" },
  { key: "home.map.title", page: "beranda", section: "Peta proyek", label: "Judul", default: "Dari Kediri, mengerjakan proyek se-Indonesia" },
  { key: "home.map.body", page: "beranda", section: "Peta proyek", label: "Paragraf", default: "Dari depo rokok di Kupang hingga gudang baja di Batam, BBP telah menyelesaikan pekerjaan di {kota} kota — sebagian besar untuk klien yang kembali memakai jasa BBP di lokasi berikutnya.", multiline: true, vars: ["kota"] },
  { key: "home.map.link", page: "beranda", section: "Peta proyek", label: "Teks tautan", default: "Jelajahi semua proyek" },

  { key: "home.featured.eyebrow", page: "beranda", section: "Proyek unggulan", label: "Label kecil", default: "Proyek Unggulan" },
  { key: "home.featured.title", page: "beranda", section: "Proyek unggulan", label: "Judul", default: "Sebagian pekerjaan yang telah kami selesaikan" },
  { key: "home.featured.link", page: "beranda", section: "Proyek unggulan", label: "Teks tautan", default: "Semua proyek →" },

  { key: "home.capacity.title", page: "beranda", section: "Kapasitas & legalitas", label: "Kartu kapasitas — judul", default: "Kapasitas Alat & Workshop" },
  { key: "home.capacity.body", page: "beranda", section: "Kapasitas & legalitas", label: "Kartu kapasitas — isi", default: "Rough-terrain crane 25 ton, 4 unit excavator, workshop fabrikasi baja 2.400 m² dengan akses trailer 40 ft.", multiline: true },
  { key: "home.capacity.link", page: "beranda", section: "Kapasitas & legalitas", label: "Kartu kapasitas — tautan", default: "Lihat detail alat" },
  { key: "home.legal.title", page: "beranda", section: "Kapasitas & legalitas", label: "Kartu legalitas — judul", default: "Legalitas & Sertifikasi" },
  { key: "home.legal.body", page: "beranda", section: "Kapasitas & legalitas", label: "Kartu legalitas — isi", default: "NIB terverifikasi, {sbuBerlaku}/{sbuTotal} SBU M1 dalam status berlaku, ISO 9001, dan SMK3 dengan skor {skorSmk3}%.", multiline: true, vars: ["sbuBerlaku", "sbuTotal", "skorSmk3"] },
  { key: "home.legal.link", page: "beranda", section: "Kapasitas & legalitas", label: "Kartu legalitas — tautan", default: "Lihat & unduh dokumen" },

  { key: "home.director.eyebrow", page: "beranda", section: "Direktur", label: "Label kecil", default: "Direktur" },
  { key: "home.director.link", page: "beranda", section: "Direktur", label: "Teks tautan", default: "Selengkapnya tentang BBP" },

  { key: "home.cta.title", page: "beranda", section: "Ajakan penutup (panel gelap)", label: "Judul", default: "Ceritakan proyek Anda" },
  { key: "home.cta.body", page: "beranda", section: "Ajakan penutup (panel gelap)", label: "Paragraf", default: "Struktur beton, fabrikasi baja, MEP, atau pengadaan — tim BBP membalas permintaan penawaran dalam 1 hari kerja.", multiline: true },
  { key: "home.cta.button", page: "beranda", section: "Ajakan penutup (panel gelap)", label: "Tombol utama", default: "Kirim Rencana Proyek Anda" },
  { key: "home.cta.whatsapp", page: "beranda", section: "Ajakan penutup (panel gelap)", label: "Tombol WhatsApp", default: "Chat WhatsApp" },

  /* ---------------- Tentang ---------------- */
  { key: "about.eyebrow", page: "tentang", section: "Bagian atas", label: "Label kecil", default: "Tentang Kami" },
  { key: "about.title", page: "tentang", section: "Bagian atas", label: "Judul", default: "Kontraktor keluarga yang tumbuh jadi mitra industri nasional" },
  { key: "about.body", page: "tentang", section: "Bagian atas", label: "Paragraf profil", multiline: true, vars: ["tanggalBerdiri", "akta"], default: "PT. Bina Bangun Perkasa (BBP) didirikan pada {tanggalBerdiri} berdasarkan {akta}. Tujuan BBP didirikan untuk melakukan pekerjaan di bidang konstruksi sipil, baja, mekanikal-elektrikal (M/E), maupun pekerjaan lain seperti pemipaan, cut and fill lahan, pemetaan dengan alat total station, serta pengadaan barang atau jasa yang menunjang pekerjaan konstruksi.\n\nSebagai perusahaan berbadan hukum, BBP secara organisasi memiliki kemampuan dan pengalaman panjang di bidang konstruksi, pengadaan barang, maupun rekayasa teknik. Keberadaan BBP tidak terlepas dari dukungan beberapa perusahaan terkait secara manajemen dan kepemilikan, termasuk PT. Graha Insan Kreatif dan PT. Graha Intan Kreatif yang lebih dulu berdiri di Kediri." },
  { key: "about.director.eyebrow", page: "tentang", section: "Direktur", label: "Label kecil", default: "Direktur" },
  { key: "about.team.eyebrow", page: "tentang", section: "Tim", label: "Label kecil", default: "Struktur Organisasi" },
  { key: "about.team.title", page: "tentang", section: "Tim", label: "Judul", default: "Tim inti BBP" },
  { key: "about.timeline.eyebrow", page: "tentang", section: "Rekam jejak", label: "Label kecil", default: "Rekam Jejak" },
  { key: "about.timeline.title", page: "tentang", section: "Rekam jejak", label: "Judul", default: "2012 – sekarang" },
  { key: "about.timeline.items", page: "tentang", section: "Rekam jejak", label: "Daftar peristiwa", multiline: true, list: "Tahun | Keterangan", default: [
    "2012 | PT. Bina Bangun Perkasa didirikan di Kediri berdasarkan Akta Notaris Paulus Bingadiputra, S.H., No. 280.",
    "2014 | Proyek pertama di luar Pulau Jawa: pembangunan depo rokok PT. Gudang Garam Tbk. di Kupang, NTT.",
    "2015–2018 | Ekspansi jaringan depo rokok Gudang Garam ke Banyuwangi, Pati, Subang, dan Medan.",
    "2019 | Memasok tail sealant untuk proyek Kereta Cepat Jakarta–Bandung bersama PT. Kereta Cepat Indonesia China.",
    "2020 | Rangkaian proyek besar untuk Gudang Garam di Demak, Cirebon, Jember, dan Bandar Lampung, berjalan pararel.",
    "2021 | Kepercayaan dari sektor pertahanan: pembangunan rumah dinas TNI AD YONZIKON 13 di Jakarta.",
    "2022–2023 | Proyek berlanjut di Kediri, Manado, dan Jakarta bersama klien lama maupun baru.",
    "2025 | Ekspansi ke Batam — 4 unit gudang baja untuk PT. Harapan Jaya Sentosa di Panbil Industrial Estate.",
  ].join("\n") },

  /* ---------------- Layanan ---------------- */
  { key: "services.eyebrow", page: "layanan", section: "Bagian atas", label: "Label kecil", default: "Layanan" },
  { key: "services.title", page: "layanan", section: "Bagian atas", label: "Judul", default: "Enam lini kerja, satu penanggung jawab" },
  { key: "services.intro", page: "layanan", section: "Bagian atas", label: "Paragraf", multiline: true, default: "BBP mengerjakan proyek dari fabrikasi hingga serah terima tanpa berpindah kontraktor — struktur, baja, atap, MEP, sipil, sampai pengadaan barang." },
  { key: "services.cta.text", page: "layanan", section: "Ajakan di bawah", label: "Kalimat", default: "Butuh salah satu layanan di atas, atau kombinasinya?" },
  { key: "services.cta.button", page: "layanan", section: "Ajakan di bawah", label: "Tombol", default: "Kirim Rencana Proyek Anda" },

  /* ---------------- Proyek ---------------- */
  { key: "projects.eyebrow", page: "proyek", section: "Bagian atas", label: "Label kecil", default: "Referensi Proyek" },
  { key: "projects.title", page: "proyek", section: "Bagian atas", label: "Judul", default: "{jumlahProyek}+ pekerjaan di {kota} kota sejak 2012", vars: ["jumlahProyek", "kota"] },
  { key: "projects.count", page: "proyek", section: "Daftar proyek", label: "Keterangan jumlah", default: "Menampilkan {jumlah} proyek", vars: ["jumlah"] },
  { key: "projects.empty", page: "proyek", section: "Daftar proyek", label: "Pesan jika filter kosong", default: "Tidak ada proyek yang cocok dengan filter ini. Coba ubah kategori atau kota." },

  /* ---------------- Kapasitas ---------------- */
  { key: "capacity.eyebrow", page: "kapasitas", section: "Bagian atas", label: "Label kecil", default: "Kapasitas & Alat" },
  { key: "capacity.title", page: "kapasitas", section: "Bagian atas", label: "Judul", default: "Alat berat & workshop milik sendiri" },
  { key: "capacity.intro", page: "kapasitas", section: "Bagian atas", label: "Paragraf", multiline: true, default: "BBP mengoperasikan armada dan workshop fabrikasi sendiri, bukan menyewa — mempercepat jadwal dan menjaga mutu fabrikasi baja tetap terkontrol." },
  { key: "capacity.workshop", page: "kapasitas", section: "Workshop", label: "Kotak angka workshop", multiline: true, list: "Nilai | Keterangan", default: [
    "2.400 m² | Luas area fabrikasi",
    "Trailer 40 ft | Akses kendaraan maksimum",
    "3 unit forklift (1×3,5 t + 2×2,5 t) | Penanganan material",
    "33 kVA | Daya listrik",
  ].join("\n") },
  { key: "capacity.equipment.title", page: "kapasitas", section: "Daftar peralatan", label: "Judul", default: "Daftar Peralatan" },
  { key: "capacity.note", page: "kapasitas", section: "Catatan kapasitas angkat", label: "Paragraf", multiline: true, default: "Kapasitas angkat terbesar BBP adalah rough-terrain crane 25 ton, didukung knuckle boom crane 3 ton untuk pekerjaan yang lebih ringkas. Kombinasi ini digunakan pada erection struktur baja bentang lebar seperti gudang dan depo." },

  /* ---------------- Legalitas ---------------- */
  { key: "legal.eyebrow", page: "legalitas", section: "Bagian atas", label: "Label kecil", default: "Legalitas & Sertifikasi" },
  { key: "legal.title", page: "legalitas", section: "Bagian atas", label: "Judul", default: "Semua dokumen dapat diverifikasi" },
  { key: "legal.warning", page: "legalitas", section: "Peringatan kuning", label: "Isi (tampil jika ada SBU perlu verifikasi)", multiline: true, default: "Beberapa Sertifikat Badan Usaha (SBU) berstatus perlu verifikasi masa berlaku melalui SIKaP/LPJK. Nomor sertifikat di bawah tetap sah; tanggal berlaku terbaru akan diperbarui admin setelah dikonfirmasi." },
  { key: "legal.group.legalitas", page: "legalitas", section: "Judul kelompok dokumen", label: "Legalitas", default: "Legalitas Perusahaan" },
  { key: "legal.group.sbu", page: "legalitas", section: "Judul kelompok dokumen", label: "SBU", default: "Sertifikat Badan Usaha (SBU) — Kualifikasi M1" },
  { key: "legal.group.sistem_manajemen", page: "legalitas", section: "Judul kelompok dokumen", label: "Sistem manajemen", default: "Sistem Manajemen" },
  { key: "legal.group.keanggotaan", page: "legalitas", section: "Judul kelompok dokumen", label: "Keanggotaan", default: "Keanggotaan" },
  { key: "legal.system.title", page: "legalitas", section: "Kotak sistem manajemen", label: "Judul", default: "Sistem Manajemen Mutu & K3" },
  { key: "legal.system.body", page: "legalitas", section: "Kotak sistem manajemen", label: "Isi", multiline: true, vars: ["iso", "penerbitIso", "regulasiSmk3", "skorSmk3", "kriteriaTerpenuhi", "kriteriaTotal", "kategoriSmk3", "tingkatSmk3"], default: "Bersertifikat {iso} dari {penerbitIso}, dan menerapkan SMK3 sesuai {regulasiSmk3} dengan pencapaian {skorSmk3}% ({kriteriaTerpenuhi} dari {kriteriaTotal} kriteria), kategori {kategoriSmk3}, tingkat {tingkatSmk3}. Anggota GAPENSI." },

  /* ---------------- Klien ---------------- */
  { key: "clients.eyebrow", page: "klien", section: "Bagian atas", label: "Label kecil", default: "Klien Kami" },
  { key: "clients.title", page: "klien", section: "Bagian atas", label: "Judul", default: "Klien yang kembali memakai jasa BBP" },
  { key: "clients.intro", page: "klien", section: "Bagian atas", label: "Paragraf", multiline: true, default: "Klien korporat besar jarang mengulang kontraktor yang mengecewakan. Sebagian besar klien BBP kembali untuk proyek berikutnya, di kota yang berbeda." },
  { key: "clients.others", page: "klien", section: "Klien lainnya", label: "Judul kelompok", default: "Klien Lainnya" },

  /* ---------------- Hubungi ---------------- */
  { key: "contact.eyebrow", page: "hubungi", section: "Bagian atas", label: "Label kecil", default: "Hubungi Kami" },
  { key: "contact.title", page: "hubungi", section: "Bagian atas", label: "Judul", default: "Minta penawaran untuk proyek Anda" },
  { key: "contact.office", page: "hubungi", section: "Kotak kantor", label: "Judul kotak", default: "Kantor Kediri" },
  { key: "contact.whatsapp", page: "hubungi", section: "Kotak kantor", label: "Tombol WhatsApp", default: "Chat via WhatsApp" },
  { key: "contact.legalNote", page: "hubungi", section: "Catatan bawah", label: "Kalimat sebelum tautan legalitas", default: "Untuk vendor registration atau permintaan dokumen legal, lihat halaman" },

  /* ---------------- Header & footer ---------------- */
  { key: "common.headerCta", page: "umum", section: "Header", label: "Tombol di header", default: "Minta Penawaran" },
  { key: "common.footer.about", page: "umum", section: "Footer", label: "Paragraf di bawah logo", multiline: true, vars: ["taglinePanjang", "tanggalBerdiri"], default: "{taglinePanjang}. Berdiri sejak {tanggalBerdiri}, mengerjakan struktur beton, fabrikasi baja, MEP, dan sipil di seluruh Indonesia." },
  { key: "common.footer.memberships", page: "umum", section: "Footer", label: "Keanggotaan & sertifikasi", default: "Anggota GAPENSI · Bersertifikat ISO 9001 & SMK3" },
  { key: "common.footer.copyright", page: "umum", section: "Footer", label: "Hak cipta", default: "© {tahun} {namaPerusahaan}. Seluruh hak cipta dilindungi.", vars: ["tahun", "namaPerusahaan"] },
] as const satisfies readonly TextField[];

export type TextKey = (typeof TEXT_FIELDS)[number]["key"];
export type Texts = Record<TextKey, string>;

export const TEXT_DEFAULTS = Object.fromEntries(TEXT_FIELDS.map((f) => [f.key, f.default])) as Texts;

/** Replaces {placeholders} with values; unknown placeholders are left as-is. */
export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}

/** Parses a `list` field: one row per line, columns split on "|". */
export function parseList(text: string): string[][] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((c) => c.trim()));
}
