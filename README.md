# Propertia — Rumah yang dikurasi

Marketplace butik: sedikit listing, semuanya sudah didatangi dan diukur ulang. Editorial krem–zamrud dengan serif Fraunces dan motif lengkung katedral.

**Demo live:** https://properti-propertia.pintuweb.id

![Tangkapan layar Propertia](public/og.jpg)

> Purwarupa desain. Listing, agen, harga, dan alamat adalah contoh fiktif — alamat hanya sampai tingkat kawasan dan tidak ada nomor telepon. Semua formulir (jadwal survei, kontak) hanya menampilkan ringkasan dan tidak mengirim data.

## Fitur khas

- `/biaya` — kalkulator dana tunai beli rumah: uang muka, BPHTB 5% × (harga − NPOPTKP), PPN rumah baru, PPAT & balik nama, biaya KPR, cicilan, dan penghasilan yang disarankan. Bisa dibuka dari halaman detail (`/biaya?id=…`).
- Beranda menampilkan contoh rincian biaya untuk listing unggulan.

## Fitur bersama

- Katalog `/properti` dengan filter status, jenis, kota, harga (beli dan sewa dipisah), kamar, dan urutan.
- Halaman detail: galeri, spesifikasi termasuk harga per m², peta tingkat kecamatan, dan formulir jadwal survei (tanggal dihitung dalam WIB di peramban).
- `/kontak` dengan pilihan topik (tautan "Ajukan listing" membuka topik jual), `/tentang` dengan daftar agen yang disusun dari data.
- Semua konten berasal dari `lib/data.js`; statistik dihitung dari data, bukan klaim.

## Halaman

`/` · `/biaya` · `/kontak` · `/properti` · `/properti/[id]` · `/tentang`

## Teknologi

- Next.js 15.5 (App Router) dan React 19
- Tailwind CSS v4
- JavaScript
- Framer Motion, Lucide (ikon)
- Font: Fraunces, Plus Jakarta Sans (next/font)
- SEO: metadata per halaman, Open Graph, JSON-LD, sitemap.xml, dan robots.txt

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk build produksi: `npm run build` lalu `npm start`.

## Kredit foto

19 foto listing, kawasan, dan beranda berlisensi CC0 1.0 atau domain publik (WordPress Photo Directory dan
Wikimedia Commons), dipotong ke 4:3, nadanya disamakan, lalu disimpan sebagai WebP. Daftar lengkap per berkas —
judul, pembuat, halaman sumber, lisensi — ada di [`public/images/SUMBER.md`](public/images/SUMBER.md).

4 potret konsultan di `public/images/agen/` adalah ilustrasi buatan sendiri untuk tokoh fiktif (bukan foto orang
sungguhan), dibuat dari kode di `scripts/ilustrasi/potret.mjs`.

---

Bagian dari koleksi 4 template marketplace properti di [PortalProperti](https://www.pintuweb.id/website-properti). Dibuat oleh [PintuWeb](https://www.pintuweb.id), jasa pembuatan website.
