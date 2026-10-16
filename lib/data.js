// Konten terpusat Propertia — marketplace properti yang dikurasi (fiktif).
// Listing, agen, dan harga adalah contoh purwarupa desain. Alamat sengaja hanya
// sampai tingkat kawasan; tidak ada nomor telepon sungguhan.

export const site = {
  name: 'Propertia',
  tagline: 'Rumah yang dikurasi, bukan sekadar didaftarkan',
  email: 'halo@propertia.example',
  address: 'Kantor contoh di Jakarta Selatan',
  jam: 'Senin–Sabtu, 09.00–18.00 WIB',
  url: 'https://properti-propertia.pintuweb.id',
  survei: { judul: 'Jadwalkan survei', catatan: 'Alamat lengkap dikirim setelah jadwal dikonfirmasi.' },
  katalog: { judul: 'Delapan rumah, semuanya sudah kami datangi', sub: 'Harga jual belum termasuk BPHTB, notaris, dan biaya KPR — hitung semuanya di halaman Hitung biaya.' },
  kontak: { judul: 'Tulis, kami yang menjadwalkan', sub: 'Untuk pertanyaan tentang listing tertentu, jalur tercepat adalah formulir jadwal survei di halaman propertinya.' },
};

export const nav = [
  { label: 'Beranda', href: '/' },
  { label: 'Properti', href: '/properti' },
  { label: 'Hitung biaya', href: '/biaya' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Kontak', href: '/kontak' },
];

export function formatHarga(n) {
  if (n >= 1e9) return 'Rp ' + (n / 1e9).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' M';
  if (n >= 1e6) return 'Rp ' + (n / 1e6).toLocaleString('id-ID', { maximumFractionDigits: 1 }) + ' Jt';
  return 'Rp ' + n.toLocaleString('id-ID');
}
export const rp = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
// Harga sewa selalu disertai periodenya.
export const hargaLabel = (p) => formatHarga(p.harga) + (p.status === 'Disewakan' ? `/${p.periode === 'tahun' ? 'thn' : 'bln'}` : '');

const agen = {
  nadia: { nama: 'Nadia Prameswari', kode: 'PR-03', wilayah: 'Jakarta & Tangerang' },
  bayu: { nama: 'Bayu Kusuma', kode: 'PR-07', wilayah: 'Bandung & Bogor' },
  wulan: { nama: 'Wulan Sari', kode: 'PR-11', wilayah: 'Bali' },
  dimas: { nama: 'Dimas Arya', kode: 'PR-14', wilayah: 'Surabaya' },
};
const f = (n) => `/images/properti/${n}.webp`;

export const properti = [
  {
    id: 1, judul: 'Rumah taman dua lantai di Bintaro', jenisProperti: 'Rumah', status: 'Dijual', harga: 4850000000, featured: true,
    spesifikasi: { luasTanah: 220, luasBangunan: 240, kamarTidur: 4, kamarMandi: 3, jumlahLantai: 2 },
    lokasi: { alamat: 'Kawasan Bintaro Sektor 9', kota: 'Tangerang Selatan', kecamatan: 'Pondok Aren' },
    agen: agen.nadia, media: { foto: [f('rumah-modern'), f('ruang-tamu-terang'), f('kamar-hangat'), f('dapur-terang')], video: null },
    sertifikat: 'SHM', tahun: 2019,
    deskripsi: 'Rumah dengan teras belakang terbuka yang menyambung ke taman. Ruang keluarga menghadap timur sehingga pagi terang tanpa silau sore. Sepuluh menit ke stasiun Jurangmangu.',
    fasilitas: ['Teras belakang', 'Carport 2 mobil', 'Listrik 5.500 W', 'Air PAM', 'Keamanan kawasan 24 jam'],
  },
  {
    id: 2, judul: 'Rumah minimalis tiga kamar di Serpong', jenisProperti: 'Rumah', status: 'Dijual', harga: 2150000000, featured: true,
    spesifikasi: { luasTanah: 120, luasBangunan: 110, kamarTidur: 3, kamarMandi: 2, jumlahLantai: 2 },
    lokasi: { alamat: 'Kawasan cluster di BSD', kota: 'Tangerang Selatan', kecamatan: 'Serpong' },
    agen: agen.nadia, media: { foto: [f('rumah-kotak'), f('ruang-tamu-sofa'), f('kamar-studio')], video: null },
    sertifikat: 'SHM', tahun: 2022,
    deskripsi: 'Bangunan berbentuk kotak sederhana dengan jendela tinggi di tangga. Dibangun 2022, belum pernah direnovasi. Cocok untuk keluarga muda dengan satu anak.',
    fasilitas: ['One gate system', 'Carport', 'Taman depan', 'Listrik 3.500 W', 'Dekat sekolah'],
  },
  {
    id: 3, judul: 'Apartemen dua kamar di Kuningan', jenisProperti: 'Apartemen', status: 'Disewakan', harga: 9500000, periode: 'bulan', featured: true,
    spesifikasi: { luasTanah: 0, luasBangunan: 72, kamarTidur: 2, kamarMandi: 1, jumlahLantai: 1 },
    lokasi: { alamat: 'Kawasan Kuningan', kota: 'Jakarta Selatan', kecamatan: 'Setiabudi' },
    agen: agen.nadia, media: { foto: [f('apartemen-putih'), f('kamar-kota'), f('ruang-tamu-sofa')], video: null },
    sertifikat: 'Strata Title', tahun: 2018,
    deskripsi: 'Unit lantai 18 dengan jendela ke arah utara. Furnitur dasar sudah ada; sewa minimal enam bulan, biaya pengelolaan sudah termasuk.',
    fasilitas: ['Furnished', 'Kolam renang', 'Gym', 'Parkir 1 mobil', 'Akses LRT'],
  },
  {
    id: 4, judul: 'Villa batu dengan kolam di Ubud', jenisProperti: 'Villa', status: 'Dijual', harga: 8900000000, featured: true,
    spesifikasi: { luasTanah: 600, luasBangunan: 380, kamarTidur: 4, kamarMandi: 4, jumlahLantai: 2 },
    lokasi: { alamat: 'Kawasan perbukitan Ubud', kota: 'Gianyar', kecamatan: 'Ubud' },
    agen: agen.wulan, media: { foto: [f('villa-batu'), f('teras-tropis'), f('kamar-hangat')], video: null },
    sertifikat: 'SHM', tahun: 2020,
    deskripsi: 'Dinding batu alam yang menjaga ruang tetap sejuk, kolam 12 meter menghadap sawah. Saat ini disewakan harian; pembeli boleh melanjutkan atau menghentikannya.',
    fasilitas: ['Kolam 12 m', 'Furnished', 'Kamar staf', 'Taman tropis', 'Akses mobil'],
  },
  {
    id: 5, judul: 'Rumah satu lantai berhalaman di Dago', jenisProperti: 'Rumah', status: 'Dijual', harga: 3400000000, featured: false,
    spesifikasi: { luasTanah: 300, luasBangunan: 180, kamarTidur: 3, kamarMandi: 2, jumlahLantai: 1 },
    lokasi: { alamat: 'Kawasan Dago atas', kota: 'Bandung', kecamatan: 'Coblong' },
    agen: agen.bayu, media: { foto: [f('rumah-satu-lantai'), f('ruang-teras-kayu'), f('dapur-terang')], video: null },
    sertifikat: 'SHM', tahun: 2015,
    deskripsi: 'Rumah tanpa tangga dengan halaman luas — nyaman untuk orang tua. Teras beratap kayu menghadap ke kebun, udara Dago atas tetap sejuk sepanjang tahun.',
    fasilitas: ['Halaman luas', 'Teras beratap', 'Tanpa tangga', 'Carport 2 mobil', 'Sumur + PAM'],
  },
  {
    id: 6, judul: 'Rumah empat kamar di Citraland', jenisProperti: 'Rumah', status: 'Dijual', harga: 3950000000, featured: false,
    spesifikasi: { luasTanah: 200, luasBangunan: 230, kamarTidur: 4, kamarMandi: 3, jumlahLantai: 2 },
    lokasi: { alamat: 'Kawasan Citraland', kota: 'Surabaya', kecamatan: 'Sambikerep' },
    agen: agen.dimas, media: { foto: [f('rumah-dua-lantai'), f('ruang-tamu-terang'), f('kamar-kota')], video: null },
    sertifikat: 'SHM', tahun: 2017,
    deskripsi: 'Garasi dua mobil, kamar utama di lantai bawah, dan tiga kamar anak di atas. Kawasan sudah ramai dengan sekolah dan pusat belanja dalam lima menit.',
    fasilitas: ['Garasi 2 mobil', 'Kamar utama di bawah', 'Listrik 5.500 W', 'Keamanan 24 jam', 'Dekat sekolah'],
  },
  {
    id: 7, judul: 'Tanah kavling berkontur di Sentul', jenisProperti: 'Tanah', status: 'Dijual', harga: 1350000000, featured: false,
    spesifikasi: { luasTanah: 300, luasBangunan: 0, kamarTidur: 0, kamarMandi: 0, jumlahLantai: 0 },
    lokasi: { alamat: 'Kawasan perumahan Sentul', kota: 'Bogor', kecamatan: 'Babakan Madang' },
    agen: agen.bayu, media: { foto: [f('lahan')], video: null },
    sertifikat: 'SHM', tahun: null,
    deskripsi: 'Kavling siap bangun dengan kemiringan landai ke arah selatan — cocok untuk rumah bertingkat setengah. IMB kawasan sudah ada.',
    fasilitas: ['Siap bangun', 'Jalan lebar 8 m', 'Air & listrik tersedia', 'Pemandangan bukit'],
  },
  {
    id: 8, judul: 'Rumah tepi bukit dengan kolam di Jimbaran', jenisProperti: 'Villa', status: 'Dijual', harga: 12500000000, featured: true,
    spesifikasi: { luasTanah: 500, luasBangunan: 420, kamarTidur: 4, kamarMandi: 4, jumlahLantai: 2 },
    lokasi: { alamat: 'Kawasan perbukitan Jimbaran', kota: 'Badung', kecamatan: 'Kuta Selatan' },
    agen: agen.wulan, media: { foto: [f('teras-kolam'), f('teras-tropis'), f('ruang-tamu-terang')], video: null },
    sertifikat: 'SHM', tahun: 2021,
    deskripsi: 'Kolam melengkung di sisi bukit dengan pemandangan teluk. Bangunan beton dengan atap datar dan dinding kaca penuh di ruang keluarga.',
    fasilitas: ['Kolam infinity', 'Pemandangan laut', 'Furnished', 'Smart lock', 'Kamar staf'],
  },
];

export const jenisList = ['Semua', ...Array.from(new Set(properti.map((p) => p.jenisProperti)))];
export const statusList = ['Semua', 'Dijual', 'Disewakan'];
export const hargaFilter = [
  { v: 'j2', label: 'Beli di bawah Rp 2,5 M', status: 'Dijual', max: 2.5e9 },
  { v: 'j5', label: 'Beli Rp 2,5–5 M', status: 'Dijual', min: 2.5e9, max: 5e9 },
  { v: 'j9', label: 'Beli di atas Rp 5 M', status: 'Dijual', min: 5e9 },
  { v: 's1', label: 'Sewa di bawah Rp 10 Jt/bln', status: 'Disewakan', max: 1e7 },
];
export const kotaList = ['Semua', ...Array.from(new Set(properti.map((p) => p.lokasi.kota)))];

const IKON = { Rumah: 'Home', Apartemen: 'Building2', Villa: 'Palmtree', Tanah: 'Trees', Kost: 'BedDouble', Gudang: 'Warehouse', Ruko: 'Store' };
export const kategori = jenisList.slice(1).map((j) => ({ jenis: j, icon: IKON[j] || 'Home' }));

// Angka dihitung dari data, bukan klaim.
export const stats = [
  { value: String(properti.length), label: 'Listing dikurasi' },
  { value: String(new Set(properti.map((p) => p.lokasi.kota)).size), label: 'Kota' },
  { value: String(new Set(properti.map((p) => p.agen.kode)).size), label: 'Konsultan' },
  { value: formatHarga(Math.min(...properti.filter((p) => p.status === 'Dijual').map((p) => p.harga))), label: 'Harga jual mulai' },
];

export const services = [
  { icon: 'Search', title: 'Kurasi listing', desc: 'Kami menolak sekitar tiga dari empat pengajuan — yang tampil hanya yang kami sendiri mau tinggali.' },
  { icon: 'Tag', title: 'Jual bersama kami', desc: 'Kami datang memotret, mengukur ulang, dan menulis deskripsi yang jujur sebelum listing tayang.' },
  { icon: 'Landmark', title: 'Hitung biaya beli', desc: 'Kalkulator BPHTB, notaris, dan biaya KPR — supaya angka yang disiapkan bukan cuma harga rumah.' },
  { icon: 'UserCheck', title: 'Satu konsultan', desc: 'Satu orang yang sama dari survei pertama sampai serah terima kunci.' },
];

export const keunggulan = [
  { title: 'Diukur ulang', desc: 'Luas tanah dan bangunan dicocokkan dengan sertifikat dan meteran sebelum tayang.' },
  { title: 'Harga lengkap', desc: 'Setiap listing bisa dihitung biaya belinya, bukan hanya harga yang tertera.' },
  { title: 'Survei dijadwalkan', desc: 'Kamu memilih waktu; konsultan yang datang, bukan kamu yang mengejar.' },
];

export const faqs = [
  { q: 'Mengapa alamat lengkap tidak ditampilkan?', a: 'Untuk keamanan pemilik. Alamat lengkap diberikan setelah jadwal survei disepakati.' },
  { q: 'Berapa biaya yang perlu disiapkan selain harga rumah?', a: 'Biasanya 7–10% dari harga untuk BPHTB, notaris/PPAT, dan biaya KPR. Hitung rinciannya di halaman Hitung biaya.' },
  { q: 'Apakah memasang listing berbayar?', a: 'Tidak. Komisi 2,5% dibayar pemilik setelah transaksi selesai — dan hanya bila listing lolos kurasi.' },
  { q: 'Bisakah survei di akhir pekan?', a: 'Bisa, Sabtu sampai pukul 16.00. Pilih waktunya di halaman properti.' },
];

export const tentang = {
  judul: 'Lebih sedikit listing, lebih banyak yang kami tahu',
  subjudul: 'Setiap listing sudah kami datangi',
  cta: 'Delapan rumah, semuanya sudah kami ukur ulang',
  cerita: [
    'Propertia memilih untuk tidak menjadi marketplace terbesar. Setiap rumah yang tampil sudah kami datangi, ukur ulang, dan foto sendiri.',
    'Akibatnya listing kami sedikit. Tapi setiap pertanyaan tentang listing itu — dari arah matahari sampai tagihan listrik — bisa dijawab oleh konsultan yang pernah berdiri di dalamnya.',
  ],
  foto: f('ruang-teras-kayu'),
  nilai: [
    ['Datang sendiri', 'Tidak ada listing yang tayang tanpa kunjungan konsultan.'],
    ['Angka jujur', 'Harga, luas, dan biaya tambahan ditulis apa adanya.'],
    ['Pemilik terlindungi', 'Alamat lengkap hanya untuk calon pembeli yang sudah dijadwalkan.'],
  ],
};

export const halamanEkstra = [];

// Tautan khas di halaman detail: hitung biaya beli rumah ini.
export const tautanDetail = (p) =>
  p.status === 'Dijual' && p.jenisProperti !== 'Tanah' ? { label: 'Hitung biaya beli rumah ini', sub: 'BPHTB, notaris, KPR, cicilan', href: `/biaya?id=${p.id}` } : null;

export const getProperti = (id) => properti.find((p) => String(p.id) === String(id));
export const propertiSerupa = (item, n = 3) =>
  properti.filter((p) => p.id !== item.id && (p.jenisProperti === item.jenisProperti || p.lokasi.kota === item.lokasi.kota)).slice(0, n);
