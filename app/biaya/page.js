import PageHeader from '@/components/PageHeader';
import KalkulatorBiaya from '@/components/KalkulatorBiaya';
import { halaman } from '@/lib/seo';

export const metadata = halaman({
  judul: 'Hitung biaya beli rumah',
  deskripsi: 'Simulasi dana tunai yang perlu disiapkan saat membeli rumah: uang muka, BPHTB, PPN rumah baru, PPAT dan balik nama, biaya KPR, serta cicilan bulanan.',
  path: '/biaya',
});

const LANGKAH = [
  ['Tanda jadi', 'Biasanya 1–5% dari harga, menjadi bagian uang muka.'],
  ['Pengajuan KPR', 'Bank menilai rumah (appraisal) dan kemampuan bayar. Sekitar 2–4 minggu.'],
  ['Setor BPHTB', 'Dibayar pembeli sebelum akta ditandatangani; bukti setor dibawa ke PPAT.'],
  ['Akad & AJB', 'Akta jual beli dan akad kredit ditandatangani di depan PPAT.'],
  ['Balik nama', 'Sertifikat diproses atas namamu di BPN, umumnya beberapa minggu.'],
];

export default function BiayaPage() {
  return (
    <main className="relative z-10">
      <PageHeader kicker="Hitung biaya" title="Harga rumah bukan angka terakhir" subtitle="BPHTB, notaris, dan biaya KPR biasanya menambah 7–10% dari harga. Pilih rumah atau isi harga sendiri untuk melihat rinciannya." />
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <KalkulatorBiaya />
        </div>
      </section>
      <section className="bg-sand/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl text-ink md:text-4xl">Kapan uangnya keluar</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-5">
            {LANGKAH.map(([judul, isi], i) => (
              <li key={judul} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <span className="font-display text-3xl leading-none numeral-outline" aria-hidden="true">0{i + 1}</span>
                <h3 className="mt-3 font-display text-lg text-ink">{judul}</h3>
                <p className="mt-1 text-sm text-muted">{isi}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
