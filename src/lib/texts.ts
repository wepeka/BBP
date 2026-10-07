/**
 * Every editable piece of copy on the public site, with its default.
 *
 * Pages read text through getTexts() (lib/repo.ts); the admin page editor is
 * generated from this list, grouped by the page/section ids in
 * lib/sections.ts. Only changed values are stored (the "texts" collection),
 * so a default edited here still applies to any text the admin hasn't
 * touched.
 *
 * - `multiline`: rendered with line breaks kept (blank line = new paragraph).
 * - `vars`: placeholders filled in at render time, e.g. {kota}.
 * - `columns`: a list (one row per item). Stored as JSON once edited in the
 *   admin; defaults are written one row per line, columns split by "|".
 */
export type ListColumnKind = "text" | "textarea" | "icon" | "link";

export interface ListColumn {
  key: string;
  label: string;
  kind?: ListColumnKind;
  placeholder?: string;
}

export interface TextField {
  key: string;
  page: string;
  section: string;
  label: string;
  default: string;
  multiline?: boolean;
  vars?: readonly string[];
  columns?: readonly ListColumn[];
  hint?: string;
}

const STAT_VARS = ["tahun", "kota", "jumlahProyek", "jumlahKlien", "iso", "skorSmk3"] as const;

export const TEXT_FIELDS = [
  /* ---------------- Beranda ---------------- */
  { key: "home.hero.badge", page: "beranda", section: "hero", label: "Label kecil di atas judul", default: "General Contractor & Supplier · Kediri" },
  { key: "home.hero.title", page: "beranda", section: "hero", label: "Judul besar", default: "Kontraktor andalan industri. Terbukti di 17 kota sejak 2012.", multiline: true, hint: "Kalimat sesudah titik pertama otomatis diberi stabilo kuning." },
  { key: "home.hero.subtitle", page: "beranda", section: "hero", label: "Paragraf di bawah judul", default: "General contractor & supplier asal Kediri untuk struktur beton, fabrikasi baja, atap, MEP, sipil, dan pengadaan — dipercaya PT Gudang Garam Tbk sejak 2012.", multiline: true },
  { key: "home.hero.ctaPrimary", page: "beranda", section: "hero", label: "Tombol utama", default: "Kirim Rencana Proyek Anda" },
  { key: "home.hero.ctaSecondary", page: "beranda", section: "hero", label: "Tombol kedua", default: "Lihat Proyek Kami" },
  { key: "home.hero.imageCaption", page: "beranda", section: "hero", label: "Keterangan di foto", default: "Struktur baja · Gudang industri" },
  { key: "home.hero.badgeTitle", page: "beranda", section: "hero", label: "Badge melayang — judul", default: "ISO 9001 & SMK3" },
  { key: "home.hero.badgeText", page: "beranda", section: "hero", label: "Badge melayang — keterangan", default: "Skor SMK3 {skorSmk3}%", vars: ["skorSmk3"] },
  { key: "home.hero.yearsBadge", page: "beranda", section: "hero", label: "Badge tahun (di bawah angka)", default: "tahun\ndipercaya", multiline: true },

  { key: "home.stats.years", page: "beranda", section: "stats", label: "Keterangan angka 1 (tahun)", default: "tahun beroperasi" },
  { key: "home.stats.cities", page: "beranda", section: "stats", label: "Keterangan angka 2 (kota)", default: "kota di Indonesia" },
  { key: "home.stats.projects", page: "beranda", section: "stats", label: "Keterangan angka 3 (pekerjaan)", default: "referensi pekerjaan" },
  { key: "home.stats.clients", page: "beranda", section: "stats", label: "Keterangan angka 4 (klien)", default: "klien korporat" },

  { key: "home.clients.eyebrow", page: "beranda", section: "clients", label: "Judul kecil", default: "Dipercaya berulang oleh klien industri & instansi" },

  { key: "home.services.eyebrow", page: "beranda", section: "services", label: "Label kecil", default: "Layanan" },
  { key: "home.services.title", page: "beranda", section: "services", label: "Judul", default: "Satu kontraktor, dari fabrikasi sampai serah terima" },
  { key: "home.services.more", page: "beranda", section: "services", label: "Teks tautan di kartu", default: "Selengkapnya" },

  { key: "home.why.eyebrow", page: "beranda", section: "why", label: "Label kecil", default: "Kenapa BBP" },
  { key: "home.why.title", page: "beranda", section: "why", label: "Judul", default: "Dikerjakan dengan workshop, alat, dan tim sendiri" },
  { key: "home.why.items", page: "beranda", section: "why", label: "Daftar alasan", vars: STAT_VARS, columns: [
    { key: "icon", label: "Ikon", kind: "icon" },
    { key: "title", label: "Judul" },
    { key: "text", label: "Penjelasan", kind: "textarea" },
    { key: "link", label: "Tautan", kind: "link" },
  ], default: [
    "factory | Workshop fabrikasi sendiri | Rangka baja difabrikasi di workshop 2.400 m² milik BBP di Kediri dengan akses trailer 40 ft, sehingga mutu las dan dimensi dikontrol sebelum dikirim ke lokasi. | /kapasitas",
    "truck | Alat berat milik sendiri | Rough-terrain crane 25 ton, knuckle boom crane 3 ton, dan 4 unit excavator. Jadwal erection tidak bergantung pada ketersediaan alat sewa. | /kapasitas",
    "shield-check | Legal & sistem mutu lengkap | NIB terverifikasi, SBU kualifikasi M1, {iso}, dan SMK3 dengan skor {skorSmk3}%. Dokumen tersedia untuk keperluan vendor registration. | /legalitas",
    "repeat | Klien yang kembali | PT Gudang Garam Tbk memakai jasa BBP sejak 2012 untuk lebih dari 20 proyek di berbagai kota. | /klien",
  ].join("\n") },

  { key: "home.map.eyebrow", page: "beranda", section: "map", label: "Label kecil", default: "Jejak Proyek Nasional" },
  { key: "home.map.title", page: "beranda", section: "map", label: "Judul", default: "Dari Kediri, mengerjakan proyek se-Indonesia" },
  { key: "home.map.body", page: "beranda", section: "map", label: "Paragraf", default: "Dari depo rokok di Kupang hingga gudang baja di Batam, BBP telah menyelesaikan pekerjaan di {kota} kota — sebagian besar untuk klien yang kembali memakai jasa BBP di lokasi berikutnya.", multiline: true, vars: ["kota"] },
  { key: "home.map.link", page: "beranda", section: "map", label: "Teks tautan", default: "Jelajahi semua proyek" },

  { key: "home.featured.eyebrow", page: "beranda", section: "featured", label: "Label kecil", default: "Proyek Unggulan" },
  { key: "home.featured.title", page: "beranda", section: "featured", label: "Judul", default: "Sebagian pekerjaan yang telah kami selesaikan" },
  { key: "home.featured.link", page: "beranda", section: "featured", label: "Teks tautan", default: "Semua proyek →" },

  { key: "home.process.eyebrow", page: "beranda", section: "process", label: "Label kecil", default: "Alur Kerja" },
  { key: "home.process.title", page: "beranda", section: "process", label: "Judul", default: "Dari survei lokasi sampai serah terima" },
  { key: "home.process.items", page: "beranda", section: "process", label: "Langkah kerja (berurutan)", columns: [
    { key: "title", label: "Langkah" },
    { key: "text", label: "Penjelasan", kind: "textarea" },
  ], default: [
    "Survei & konsultasi | Tim BBP meninjau lokasi, kebutuhan, dan gambar kerja bersama Anda.",
    "Penawaran & jadwal | Lingkup pekerjaan, RAB, dan jadwal pelaksanaan disusun sebagai dasar kontrak.",
    "Fabrikasi & persiapan | Komponen baja difabrikasi di workshop sementara lahan dan material disiapkan.",
    "Konstruksi & erection | Struktur, atap, MEP, dan sipil dikerjakan dengan pengawasan mutu dan K3.",
    "Serah terima | Pemeriksaan akhir bersama klien sebelum bangunan diserahkan dan siap dipakai.",
  ].join("\n") },

  { key: "home.director.eyebrow", page: "beranda", section: "director", label: "Label kecil", default: "Direktur" },
  { key: "home.director.link", page: "beranda", section: "director", label: "Teks tautan", default: "Selengkapnya tentang BBP" },

  { key: "home.cta.title", page: "beranda", section: "cta", label: "Judul", default: "Ceritakan proyek Anda" },
  { key: "home.cta.body", page: "beranda", section: "cta", label: "Paragraf", default: "Struktur beton, fabrikasi baja, MEP, atau pengadaan — tim BBP membalas permintaan penawaran dalam 1 hari kerja.", multiline: true },
  { key: "home.cta.button", page: "beranda", section: "cta", label: "Tombol utama", default: "Kirim Rencana Proyek Anda" },
  { key: "home.cta.whatsapp", page: "beranda", section: "cta", label: "Tombol WhatsApp", default: "Chat WhatsApp" },

  /* ---------------- Tentang ---------------- */
  { key: "about.eyebrow", page: "tentang", section: "intro", label: "Label kecil", default: "Tentang Kami" },
  { key: "about.title", page: "tentang", section: "intro", label: "Judul", default: "Kontraktor keluarga yang tumbuh jadi mitra industri nasional" },
  { key: "about.body", page: "tentang", section: "intro", label: "Paragraf profil", multiline: true, vars: ["tanggalBerdiri", "akta"], default: "PT. Bina Bangun Perkasa (BBP) didirikan pada {tanggalBerdiri} berdasarkan {akta}. Tujuan BBP didirikan untuk melakukan pekerjaan di bidang konstruksi sipil, baja, mekanikal-elektrikal (M/E), maupun pekerjaan lain seperti pemipaan, cut and fill lahan, pemetaan dengan alat total station, serta pengadaan barang atau jasa yang menunjang pekerjaan konstruksi.\n\nSebagai perusahaan berbadan hukum, BBP secara organisasi memiliki kemampuan dan pengalaman panjang di bidang konstruksi, pengadaan barang, maupun rekayasa teknik. Keberadaan BBP tidak terlepas dari dukungan beberapa perusahaan terkait secara manajemen dan kepemilikan, termasuk PT. Graha Insan Kreatif dan PT. Graha Intan Kreatif yang lebih dulu berdiri di Kediri." },
  { key: "about.director.eyebrow", page: "tentang", section: "director", label: "Label kecil", default: "Direktur" },
  { key: "about.team.eyebrow", page: "tentang", section: "team", label: "Label kecil", default: "Struktur Organisasi" },
  { key: "about.team.title", page: "tentang", section: "team", label: "Judul", default: "Tim inti BBP" },
  { key: "about.timeline.eyebrow", page: "tentang", section: "timeline", label: "Label kecil", default: "Rekam Jejak" },
  { key: "about.timeline.title", page: "tentang", section: "timeline", label: "Judul", default: "2012 – sekarang" },
  { key: "about.timeline.items", page: "tentang", section: "timeline", label: "Daftar peristiwa", columns: [
    { key: "year", label: "Tahun", placeholder: "mis. 2024" },
    { key: "text", label: "Keterangan", kind: "textarea" },
  ], default: [
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
  { key: "services.eyebrow", page: "layanan", section: "intro", label: "Label kecil", default: "Layanan" },
  { key: "services.title", page: "layanan", section: "intro", label: "Judul", default: "Enam lini kerja, satu penanggung jawab" },
  { key: "services.intro", page: "layanan", section: "intro", label: "Paragraf", multiline: true, default: "BBP mengerjakan proyek dari fabrikasi hingga serah terima tanpa berpindah kontraktor — struktur, baja, atap, MEP, sipil, sampai pengadaan barang." },
  { key: "services.scopeLabel", page: "layanan", section: "list", label: "Judul kecil daftar lingkup", default: "Lingkup pekerjaan" },
  { key: "services.projectsLink", page: "layanan", section: "list", label: "Tautan ke proyek terkait", default: "Lihat proyek terkait" },
  { key: "services.cta.text", page: "layanan", section: "cta", label: "Kalimat", default: "Butuh salah satu layanan di atas, atau kombinasinya?" },
  { key: "services.cta.button", page: "layanan", section: "cta", label: "Tombol", default: "Kirim Rencana Proyek Anda" },

  /* ---------------- Proyek ---------------- */
  { key: "projects.eyebrow", page: "proyek", section: "intro", label: "Label kecil", default: "Referensi Proyek" },
  { key: "projects.title", page: "proyek", section: "intro", label: "Judul", default: "{jumlahProyek}+ pekerjaan di {kota} kota sejak 2012", vars: ["jumlahProyek", "kota"] },
  { key: "projects.intro", page: "proyek", section: "intro", label: "Paragraf", multiline: true, default: "Gudang baja, depo, fasilitas produksi, renovasi gedung, sampai hunian — sebagian besar untuk klien yang kembali memakai jasa BBP." },
  { key: "projects.count", page: "proyek", section: "list", label: "Keterangan jumlah", default: "Menampilkan {jumlah} proyek", vars: ["jumlah"] },
  { key: "projects.search", page: "proyek", section: "list", label: "Isi kotak pencarian", default: "Cari nama proyek, klien, atau kota" },
  { key: "projects.empty", page: "proyek", section: "list", label: "Pesan jika filter kosong", default: "Tidak ada proyek yang cocok dengan filter ini. Coba ubah kategori atau kota." },
  { key: "project.sheet", page: "proyek", section: "detail", label: "Judul lembar data", default: "Lembar Data Proyek" },
  { key: "project.cta.title", page: "proyek", section: "detail", label: "Ajakan di bawah deskripsi", default: "Butuh pekerjaan {kategori} seperti ini?", vars: ["kategori"] },
  { key: "project.cta.button", page: "proyek", section: "detail", label: "Tombol ajakan", default: "Kirim Rencana Proyek Anda" },
  { key: "project.related", page: "proyek", section: "detail", label: "Judul proyek serupa", default: "Proyek serupa" },

  /* ---------------- Kapasitas ---------------- */
  { key: "capacity.eyebrow", page: "kapasitas", section: "intro", label: "Label kecil", default: "Kapasitas & Alat" },
  { key: "capacity.title", page: "kapasitas", section: "intro", label: "Judul", default: "Alat berat & workshop milik sendiri" },
  { key: "capacity.intro", page: "kapasitas", section: "intro", label: "Paragraf", multiline: true, default: "BBP mengoperasikan armada dan workshop fabrikasi sendiri, bukan menyewa — mempercepat jadwal dan menjaga mutu fabrikasi baja tetap terkontrol." },
  { key: "capacity.workshop", page: "kapasitas", section: "workshop", label: "Kotak angka workshop", columns: [
    { key: "value", label: "Nilai", placeholder: "mis. 2.400 m²" },
    { key: "label", label: "Keterangan" },
  ], default: [
    "2.400 m² | Luas area fabrikasi",
    "Trailer 40 ft | Akses kendaraan maksimum",
    "3 unit forklift (1×3,5 t + 2×2,5 t) | Penanganan material",
    "33 kVA | Daya listrik",
  ].join("\n") },
  { key: "capacity.gallery.title", page: "kapasitas", section: "gallery", label: "Judul", default: "Workshop fabrikasi di Kediri" },
  { key: "capacity.equipment.title", page: "kapasitas", section: "equipment", label: "Judul", default: "Daftar Peralatan" },
  { key: "capacity.note", page: "kapasitas", section: "note", label: "Paragraf", multiline: true, default: "Kapasitas angkat terbesar BBP adalah rough-terrain crane 25 ton, didukung knuckle boom crane 3 ton untuk pekerjaan yang lebih ringkas. Kombinasi ini digunakan pada erection struktur baja bentang lebar seperti gudang dan depo." },

  /* ---------------- Legalitas ---------------- */
  { key: "legal.eyebrow", page: "legalitas", section: "intro", label: "Label kecil", default: "Legalitas & Sertifikasi" },
  { key: "legal.title", page: "legalitas", section: "intro", label: "Judul", default: "Semua dokumen dapat diverifikasi" },
  { key: "legal.warning", page: "legalitas", section: "warning", label: "Isi pemberitahuan", multiline: true, default: "Beberapa Sertifikat Badan Usaha (SBU) berstatus perlu verifikasi masa berlaku melalui SIKaP/LPJK. Nomor sertifikat di bawah tetap sah; tanggal berlaku terbaru akan diperbarui admin setelah dikonfirmasi." },
  { key: "legal.group.legalitas", page: "legalitas", section: "documents", label: "Judul kelompok: Legalitas", default: "Legalitas Perusahaan" },
  { key: "legal.group.sbu", page: "legalitas", section: "documents", label: "Judul kelompok: SBU", default: "Sertifikat Badan Usaha (SBU) — Kualifikasi M1" },
  { key: "legal.group.sistem_manajemen", page: "legalitas", section: "documents", label: "Judul kelompok: Sistem manajemen", default: "Sistem Manajemen" },
  { key: "legal.group.keanggotaan", page: "legalitas", section: "documents", label: "Judul kelompok: Keanggotaan", default: "Keanggotaan" },
  { key: "legal.status.berlaku", page: "legalitas", section: "documents", label: "Label status: berlaku", default: "Berlaku" },
  { key: "legal.status.perlu_verifikasi", page: "legalitas", section: "documents", label: "Label status: perlu verifikasi", default: "Dalam verifikasi" },
  { key: "legal.status.kedaluwarsa", page: "legalitas", section: "documents", label: "Label status: kedaluwarsa", default: "Kedaluwarsa" },
  { key: "legal.download", page: "legalitas", section: "documents", label: "Tautan unduh", default: "Unduh PDF" },
  { key: "legal.onRequest", page: "legalitas", section: "documents", label: "Teks jika PDF belum ada", default: "Salinan tersedia atas permintaan" },
  { key: "legal.system.title", page: "legalitas", section: "system", label: "Judul", default: "Sistem Manajemen Mutu & K3" },
  { key: "legal.system.body", page: "legalitas", section: "system", label: "Isi", multiline: true, vars: ["iso", "penerbitIso", "regulasiSmk3", "skorSmk3", "kriteriaTerpenuhi", "kriteriaTotal", "kategoriSmk3", "tingkatSmk3"], default: "Bersertifikat {iso} dari {penerbitIso}, dan menerapkan SMK3 sesuai {regulasiSmk3} dengan pencapaian {skorSmk3}% ({kriteriaTerpenuhi} dari {kriteriaTotal} kriteria), kategori {kategoriSmk3}, tingkat {tingkatSmk3}. Anggota GAPENSI." },

  /* ---------------- Klien ---------------- */
  { key: "clients.eyebrow", page: "klien", section: "intro", label: "Label kecil", default: "Klien Kami" },
  { key: "clients.title", page: "klien", section: "intro", label: "Judul", default: "Klien yang kembali memakai jasa BBP" },
  { key: "clients.intro", page: "klien", section: "intro", label: "Paragraf", multiline: true, default: "Klien korporat besar jarang mengulang kontraktor yang mengecewakan. Sebagian besar klien BBP kembali untuk proyek berikutnya, di kota yang berbeda." },
  { key: "clients.flagship.label", page: "klien", section: "flagship", label: "Label kecil", default: "Klien utama · sejak {tahun}", vars: ["tahun"] },
  { key: "clients.flagship.link", page: "klien", section: "flagship", label: "Tautan ke proyek", default: "Lihat proyek untuk {klien}", vars: ["klien"] },
  { key: "clients.others", page: "klien", section: "others", label: "Judul kelompok", default: "Klien Lainnya" },

  /* ---------------- Hubungi ---------------- */
  { key: "contact.eyebrow", page: "hubungi", section: "intro", label: "Label kecil", default: "Hubungi Kami" },
  { key: "contact.title", page: "hubungi", section: "intro", label: "Judul", default: "Minta penawaran untuk proyek Anda" },
  { key: "contact.intro", page: "hubungi", section: "intro", label: "Paragraf", multiline: true, default: "Ceritakan lokasi, jenis pekerjaan, dan perkiraan jadwal. Tim BBP membalas dalam 1 hari kerja lewat email atau WhatsApp." },
  { key: "contact.form.title", page: "hubungi", section: "form", label: "Judul formulir", default: "Kirim rencana proyek" },
  { key: "contact.form.submit", page: "hubungi", section: "form", label: "Tombol kirim", default: "Kirim Permintaan" },
  { key: "contact.form.success", page: "hubungi", section: "form", label: "Pesan setelah terkirim", default: "Permintaan penawaran terkirim. Tim BBP akan membalas dalam 1 hari kerja." },
  { key: "contact.form.note", page: "hubungi", section: "form", label: "Catatan di bawah tombol", default: "Data Anda hanya dipakai untuk menyiapkan penawaran." },
  { key: "contact.office", page: "hubungi", section: "office", label: "Judul kotak", default: "Kantor Kediri" },
  { key: "contact.whatsapp", page: "hubungi", section: "office", label: "Tombol WhatsApp", default: "Chat via WhatsApp" },
  { key: "contact.maps", page: "hubungi", section: "office", label: "Tautan peta", default: "Buka di Google Maps" },
  { key: "contact.legalNote", page: "hubungi", section: "office", label: "Kalimat sebelum tautan legalitas", default: "Untuk vendor registration atau permintaan dokumen legal, lihat halaman" },

  /* ---------------- Header & footer ---------------- */
  { key: "common.headerCta", page: "umum", section: "header", label: "Tombol di header", default: "Minta Penawaran" },
  { key: "common.nav.tentang", page: "umum", section: "header", label: "Menu: Tentang", default: "Tentang" },
  { key: "common.nav.layanan", page: "umum", section: "header", label: "Menu: Layanan", default: "Layanan" },
  { key: "common.nav.proyek", page: "umum", section: "header", label: "Menu: Proyek", default: "Proyek" },
  { key: "common.nav.kapasitas", page: "umum", section: "header", label: "Menu: Kapasitas", default: "Kapasitas" },
  { key: "common.nav.legalitas", page: "umum", section: "header", label: "Menu: Legalitas", default: "Legalitas" },
  { key: "common.nav.klien", page: "umum", section: "header", label: "Menu: Klien", default: "Klien" },
  { key: "common.footer.about", page: "umum", section: "footer", label: "Paragraf di bawah logo", multiline: true, vars: ["taglinePanjang", "tanggalBerdiri"], default: "{taglinePanjang}. Berdiri sejak {tanggalBerdiri}, mengerjakan struktur beton, fabrikasi baja, MEP, dan sipil di seluruh Indonesia." },
  { key: "common.footer.memberships", page: "umum", section: "footer", label: "Keanggotaan & sertifikasi", default: "Anggota GAPENSI · Bersertifikat ISO 9001 & SMK3" },
  { key: "common.footer.copyright", page: "umum", section: "footer", label: "Hak cipta", default: "© {tahun} {namaPerusahaan}. Seluruh hak cipta dilindungi.", vars: ["tahun", "namaPerusahaan"] },
  { key: "common.wa.label", page: "umum", section: "whatsapp", label: "Teks tombol (muncul saat diarahkan)", default: "Chat dengan BBP" },
  { key: "common.notfound.title", page: "umum", section: "notfound", label: "Judul", default: "Halaman tidak ditemukan" },
  { key: "common.notfound.body", page: "umum", section: "notfound", label: "Paragraf", multiline: true, default: "Tautan yang Anda buka mungkin sudah dipindah atau salah ketik. Coba mulai dari beranda atau lihat daftar proyek kami." },

  /* ---------------- SEO (judul tab & deskripsi Google) ---------------- */
  { key: "seo.beranda.title", page: "beranda", section: "seo", label: "Judul di Google & tab browser", default: "", hint: "Kosongkan untuk memakai \"Nama Perusahaan — Tagline\"." },
  { key: "seo.beranda.description", page: "beranda", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "General contractor & supplier di Kediri, Jawa Timur: struktur beton, fabrikasi & erection baja, atap, MEP, sipil, dan pengadaan. Dipercaya PT Gudang Garam Tbk sejak 2012." },
  { key: "seo.tentang.title", page: "tentang", section: "seo", label: "Judul di Google & tab browser", default: "Tentang Kami" },
  { key: "seo.tentang.description", page: "tentang", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "Profil PT. Bina Bangun Perkasa: berdiri di Kediri sejak 2012, direktur, tim inti, dan rekam jejak proyek." },
  { key: "seo.layanan.title", page: "layanan", section: "seo", label: "Judul di Google & tab browser", default: "Layanan" },
  { key: "seo.layanan.description", page: "layanan", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "Layanan konstruksi BBP: struktur beton & arsitektur, fabrikasi & erection baja, atap & insulasi, MEP, sipil & infrastruktur, serta pengadaan barang & jasa." },
  { key: "seo.proyek.title", page: "proyek", section: "seo", label: "Judul di Google & tab browser", default: "Referensi Proyek" },
  { key: "seo.proyek.description", page: "proyek", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "Referensi proyek PT. Bina Bangun Perkasa di berbagai kota di Indonesia: gudang baja, depo, fasilitas industri, renovasi, dan hunian." },
  { key: "seo.kapasitas.title", page: "kapasitas", section: "seo", label: "Judul di Google & tab browser", default: "Kapasitas & Alat" },
  { key: "seo.kapasitas.description", page: "kapasitas", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "Workshop fabrikasi baja 2.400 m² dan alat berat milik sendiri: rough-terrain crane 25 ton, knuckle boom crane, excavator, dan peralatan pendukung." },
  { key: "seo.legalitas.title", page: "legalitas", section: "seo", label: "Judul di Google & tab browser", default: "Legalitas & Sertifikasi" },
  { key: "seo.legalitas.description", page: "legalitas", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "NIB, NPWP, SBU kualifikasi M1, ISO 9001:2015, dan SMK3 PT. Bina Bangun Perkasa untuk keperluan vendor registration." },
  { key: "seo.klien.title", page: "klien", section: "seo", label: "Judul di Google & tab browser", default: "Klien Kami" },
  { key: "seo.klien.description", page: "klien", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "Klien PT. Bina Bangun Perkasa, termasuk PT Gudang Garam Tbk sejak 2012, instansi pemerintah, dan perusahaan industri dari Jawa hingga Batam." },
  { key: "seo.hubungi.title", page: "hubungi", section: "seo", label: "Judul di Google & tab browser", default: "Hubungi Kami" },
  { key: "seo.hubungi.description", page: "hubungi", section: "seo", label: "Deskripsi di hasil Google", multiline: true, default: "Kirim rencana proyek atau minta penawaran ke PT. Bina Bangun Perkasa, Kediri. Tim membalas dalam 1 hari kerja." },
] as const satisfies readonly TextField[];

export type TextKey = (typeof TEXT_FIELDS)[number]["key"];
export type Texts = Record<TextKey, string>;

export const TEXT_DEFAULTS = Object.fromEntries(TEXT_FIELDS.map((f) => [f.key, f.default])) as Texts;

export function getTextField(key: string): TextField | undefined {
  return (TEXT_FIELDS as readonly TextField[]).find((f) => f.key === key);
}

/** Replaces {placeholders} with values; unknown placeholders are left as-is. */
export function fill(text: string, vars: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (m, name: string) => (name in vars ? String(vars[name]) : m));
}

/**
 * Parses a list field into rows of cells. Admin-edited lists are stored as
 * JSON; defaults (and lists saved before the editor existed) are plain text,
 * one row per line with columns split on "|".
 */
export function parseList(text: string): string[][] {
  const trimmed = text.trim();
  if (trimmed.startsWith("[")) {
    try {
      const rows = JSON.parse(trimmed);
      if (Array.isArray(rows)) {
        return rows
          .filter(Array.isArray)
          .map((r: unknown[]) => r.map((c) => String(c ?? "").trim()))
          .filter((r) => r.some(Boolean));
      }
    } catch {
      // fall through to the line format
    }
  }
  return trimmed
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split("|").map((c) => c.trim()));
}

export function serializeList(rows: string[][]): string {
  return JSON.stringify(rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some(Boolean)));
}

/** True when two list values hold the same rows, whatever format they're stored in. */
export function sameList(a: string, b: string): boolean {
  return JSON.stringify(parseList(a)) === JSON.stringify(parseList(b));
}
