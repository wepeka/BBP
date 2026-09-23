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
- **Radius kartu** — 6px, mengikuti arahan "Berani" pada panduan (radius 4–6px).
- Logo digambar ulang sebagai SVG ([logo.tsx](src/components/logo.tsx)) dari raster resolusi rendah di company profile, memakai warna resmi, supaya tetap tajam di ukuran apa pun.
- **Hijau dan kuning brand tidak berubah antar tema.** `#009049` dan `#FFF000` sama persis di mode terang maupun gelap ([globals.css](src/app/globals.css)) — hanya latar, permukaan, dan warna teks netral yang menyesuaikan; satu pengecualian adalah `--color-teal-text`, dipakai khusus untuk teks hijau kecil (label, angka statistik) yang butuh sedikit dicerahkan di mode gelap supaya tetap terbaca.

## Mode Terang / Gelap

Situs mengikuti preferensi sistem perangkat secara default, dan pengunjung bisa menggantinya lewat tombol matahari/bulan di header (situs publik) atau pojok kanan atas (admin panel). Pilihan tersimpan di `localStorage` browser masing-masing pengunjung, jadi tidak perlu login untuk diingat, dan langsung diterapkan sebelum halaman tampil (tanpa kedipan warna) lewat script kecil di [layout.tsx](src/app/layout.tsx).

## Admin Panel

URL: `/admin` (otomatis diarahkan ke `/admin/login` jika belum masuk)

Kredensial default (**ganti setelah instalasi pertama**, lihat di bawah):

- **Nama pengguna:** `admin`
- **Kata sandi:** `BbpKediri#2026`

Untuk mengganti kata sandi admin, buat hash baru lalu tempel ke `content/admin-users.json`:

```bash
node -e '
const crypto = require("crypto");
const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync("KATA_SANDI_BARU", salt, 64).toString("hex");
console.log(JSON.stringify({ salt, passwordHash: hash }, null, 2));
'
```

Salin nilai `salt` dan `passwordHash` yang dihasilkan ke objek pengguna di `content/admin-users.json`.

## Struktur konten (basis data)

Semua data situs (proyek, klien, layanan, sertifikat, tim, pengaturan, dan inbox RFQ) disimpan sebagai file JSON di folder [`content/`](content/), dan diubah lewat Admin Panel maupun langsung sebagai file. Ini membuat konten mudah diaudit lewat git diff, tanpa perlu database terpisah untuk menjalankannya secara lokal.

**Penting untuk deployment produksi:** penyimpanan berbasis file ini bekerja baik untuk menjalankan di server sendiri/VPS (Node.js long-running), tetapi **tidak cocok untuk hosting serverless** seperti Vercel/Netlify, karena filesystem di sana bersifat sementara dan tidak dibagi antar-request. Jika situs akan dihosting di platform serverless, migrasikan `src/lib/store.ts` ke database sesungguhnya (Postgres via Neon/Supabase + Prisma adalah pilihan yang paling dekat dengan struktur data saat ini) sebelum go-live. Untuk hosting VPS/Docker biasa, struktur saat ini aman dipakai apa adanya — cukup pastikan folder `content/` dan `public/images/uploads/` disertakan dalam strategi backup.

Foto proyek yang diunggah lewat Admin Panel tersimpan di `public/images/uploads/`, dan berkas PDF sertifikat di `public/documents/certificates/`.

## Konten yang sudah diisi

Data awal (23 proyek, 12 klien, 6 layanan, daftar alat, tim inti, dan sertifikasi) diambil dari *Company Profile* PDF resmi BBP dan data publik di indokontraktor.com. Empat SBU (SI003, BG001, BG003, BG009) ditandai **"Perlu Verifikasi"** karena kemungkinan sudah lewat masa berlaku cetak — perbarui status dan nomor terbaru lewat `/admin/sertifikat` setelah dikonfirmasi ke LPJK/SIKaP.

Satu contoh permintaan penawaran (RFQ) tersimpan di inbox admin sebagai contoh alur kerja — silakan dihapus lewat `/admin/rfq`.

## Peta interaktif

Peta jejak proyek nasional dan peta lokasi kantor memakai [Leaflet](https://leafletjs.com/) dengan tile [OpenStreetMap](https://www.openstreetmap.org/copyright) standar (gratis, tanpa API key). Untuk trafik produksi yang tinggi, pertimbangkan tile provider berbayar (mis. MapTiler, Mapbox, atau Geoapify) agar tidak melanggar kebijakan pemakaian wajar OSM.

## Struktur proyek

```
content/            data situs (JSON) — "basis data" file-based
public/images/       foto proyek, hero, workshop
src/app/(site)/      halaman publik (beranda, tentang, layanan, proyek, dst.)
src/app/admin/       admin panel (dilindungi login)
src/components/      komponen UI (site/ untuk publik, admin/ untuk admin)
src/lib/             tipe data, akses konten (repo.ts), autentikasi
```

## Build produksi

```bash
npm run build
npm run start
```
