# Website PT. Bina Bangun Perkasa (BBP)

Company profile & portfolio website untuk PT. Bina Bangun Perkasa (BBP), kontraktor umum di Kediri, Jawa Timur. Dibangun dengan Next.js 16 (App Router), TypeScript, dan Tailwind CSS v4, lengkap dengan admin panel untuk mengelola konten tanpa menyentuh kode.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk situs publik.

## Identitas Visual

Warna, tipografi, dan aturan logo mengikuti *Brand Guidelines* resmi PT. Bina Bangun Perkasa (Wepeka Brandlab, 2026):

- **Warna** — Utama `#009049`, Sekunder `#FFF000`, Aksen `#F6F4F2`, Latar `#D8D8D8`, Teks `#A8A8A8`. Token lengkap ada di [globals.css](src/app/globals.css). Catatan: swatch "Teks" resmi (`#A8A8A8`) hanya kontras 2,2:1 di atas latar situs — terlalu terang untuk teks baca (standar WCAG AA butuh minimal 4,5:1) — sehingga di situs dipakai khusus untuk border/pembatas, sementara teks isi memakai abu-abu yang lebih gelap namun senada.
- **Tipografi** — Body memakai **Inter** sesuai panduan. Judul memakai **Poppins** (Bold–Black) sebagai pengganti **Nexa Heavy** yang diminta panduan; Nexa adalah font komersial tanpa lisensi web gratis, jadi dipilih padanan geometris terdekat yang bisa disematkan sah lewat Google Fonts. Jika perusahaan membeli lisensi Nexa, tinggal ganti di [layout.tsx](src/app/layout.tsx).
- **CTA standar** — Tombol ajakan utama memakai frasa resmi "Kirim Rencana Proyek Anda" sesuai panduan; label navigasi yang ringkas (menu, footer) tetap "Minta Penawaran" agar muat di ruang sempit.
- **Radius** — 4–6px untuk kartu, tombol, dan input, mengikuti arahan "Berani" pada panduan.
- **Logo** — PNG transparan dari BBP ([logo.tsx](src/components/logo.tsx)); bisa diganti dari admin (Halaman Website → Header & Footer).
- **Ciri khas visual** — "title block" ala gambar kerja (label PROYEK / LOKASI / TAHUN / LEMBAR) di bawah foto hero dan di lembar data proyek.
- **Hijau dan kuning brand tidak berubah antar tema.** `#009049` dan `#FFF000` sama persis di mode terang maupun gelap ([globals.css](src/app/globals.css)) — hanya latar, permukaan, dan warna teks netral yang menyesuaikan; satu pengecualian adalah `--color-teal-text`, dipakai khusus untuk teks hijau kecil (label, angka statistik) yang butuh sedikit dicerahkan di mode gelap supaya tetap terbaca.

## Mode Terang / Gelap

Situs mengikuti preferensi sistem perangkat secara default, dan pengunjung bisa menggantinya lewat tombol matahari/bulan di header (situs publik) atau pojok kanan atas (admin panel). Pilihan tersimpan di `localStorage` browser masing-masing pengunjung, jadi tidak perlu login untuk diingat, dan langsung diterapkan sebelum halaman tampil (tanpa kedipan warna) lewat script kecil di [layout.tsx](src/app/layout.tsx).

## Admin Panel

URL: `/admin` (otomatis diarahkan ke `/admin/login` jika belum masuk). Kata sandi tidak dicatat di repo ini — tanyakan ke pengelola situs, dan ganti sendiri lewat menu **Akun Admin**.

Semua isi website bisa diubah tanpa menyentuh kode:

| Menu | Isi |
|---|---|
| **Ringkasan** | Angka penting, daftar "perlu perhatian" (sertifikat hampir habis, proyek tanpa foto/titik peta), penawaran terbaru, panduan singkat |
| **Halaman Website** | Editor per halaman (Beranda, Tentang, Layanan, Proyek, Kapasitas, Legalitas, Klien, Hubungi, Header & Footer). Tiap bagian (*section*) bisa diubah tulisan & fotonya, disembunyikan, atau diurutkan ulang; daftar (rekam jejak, alasan, alur kerja, layanan, tim, peralatan) diedit per baris. SEO per halaman. Pratinjau langsung desktop/HP di kanan |
| **Proyek** | Cari/filter, tandai unggulan & sembunyikan sekali klik, atur urutan (seret), duplikat. Editor: foto (urutkan, jadikan sampul), lokasi di peta (cari atau klik), kategori, luas & durasi |
| **Klien** | Logo, klien utama, situs web, urutan tampil |
| **Sertifikat & Legalitas** | Tambah/ubah/hapus dokumen, tanggal berlaku (status otomatis kedaluwarsa + pengingat 60 hari), unggah PDF |
| **Galeri Foto** | Semua foto & PDF di satu tempat, unggah massal, lihat dipakai di mana, hapus yang tidak dipakai |
| **Inbox Penawaran** | Permintaan dari formulir Hubungi Kami: status tindak lanjut, catatan internal, balas WhatsApp/email sekali klik, unduh CSV |
| **Info Perusahaan** | Identitas, kontak + titik kantor di peta, pesan awal WhatsApp, media sosial, direktur + foto, nomor legal, ISO & SMK3, angka statistik, kategori proyek |
| **Akun Admin** | Ganti kata sandi; tambah akun dengan peran Admin / Editor / Hanya lihat |
| **Cadangan Data** | Unduh seluruh konten jadi satu file JSON, dan pulihkan dari file itu |

Foto yang diunggah dikompres di browser (maks. 2400 px, WebP) sebelum dikirim, jadi foto HP 5–10 MB menjadi ±300–600 KB.

## Penyimpanan data

- **Produksi (Vercel)** — env `BLOB_READ_WRITE_TOKEN` terpasang: konten disimpan sebagai JSON di Vercel Blob *private* (`content/*.json`); unggahan di `images/uploads/…` dan `documents/…`, disajikan lewat `/media/…`. Browser mengunggah langsung ke Blob (token sementara dari `/api/admin/upload`), jadi tidak kena batas 4,5 MB fungsi Vercel. Koleksi yang belum pernah disimpan di Blob memakai file bawaan di `content/`.
- **Lokal** — tanpa token: konten ditulis ke `content/*.json` dan unggahan ke `public/images/uploads/`, sehingga perubahan terlihat di `git diff`.
- Hanya teks/foto/susunan yang **diubah** yang disimpan (koleksi `texts`, `media`, `layout`); sisanya memakai bawaan di [`src/lib/texts.ts`](src/lib/texts.ts) dan [`src/lib/media.ts`](src/lib/media.ts). Daftar halaman & section ada di [`src/lib/sections.ts`](src/lib/sections.ts) — editor admin dibuat otomatis dari ketiga file ini, jadi teks/foto baru cukup ditambahkan di sana.
- Halaman publik dibangun statis dan diperbarui otomatis (`revalidatePath`) setiap kali admin menyimpan.

## Konten yang sudah diisi

Data awal (23 proyek, 12 klien, 6 layanan, daftar alat, tim inti, dan sertifikasi) diambil dari *Company Profile* PDF resmi BBP dan data publik di indokontraktor.com. Empat SBU (SI003, BG001, BG003, BG009) ditandai **"Perlu Verifikasi"** karena kemungkinan sudah lewat masa berlaku cetak — perbarui status dan nomor terbaru lewat `/admin/sertifikat` setelah dikonfirmasi ke LPJK/SIKaP.

Status SBU bisa diperbarui lewat **Sertifikat & Legalitas** di admin.

## Peta interaktif

Peta jejak proyek nasional dan peta lokasi kantor memakai [Leaflet](https://leafletjs.com/) dengan tile [OpenStreetMap](https://www.openstreetmap.org/copyright) standar (gratis, tanpa API key). Untuk trafik produksi yang tinggi, pertimbangkan tile provider berbayar (mis. MapTiler, Mapbox, atau Geoapify) agar tidak melanggar kebijakan pemakaian wajar OSM.

## Struktur proyek

```
content/            data situs (JSON) — "basis data" file-based
public/images/       foto proyek, hero, workshop
src/app/(site)/      halaman publik (beranda, tentang, layanan, proyek, dst.)
src/app/admin/       admin panel (dilindungi login)
src/components/      komponen UI (site/ untuk publik, admin/ untuk admin)
src/lib/             tipe data, akses konten (repo.ts), daftar teks/foto/section, autentikasi
src/app/api/admin/   upload, galeri, dan unduh cadangan (khusus admin)
```

## Build produksi

```bash
npm run build
npm run start
```
