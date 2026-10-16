import Link from 'next/link';
import { Mail, Clock, Map as Peta, Users } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import FormKontak from '@/components/FormKontak';
import { site, properti, faqs } from '@/lib/data';
import { halaman } from '@/lib/seo';

export const metadata = halaman({
  judul: 'Kontak',
  deskripsi: `Tanya listing, jual atau sewakan properti, atau ajak ${site.name} bekerja sama. ${site.jam}; balasan lewat email.`,
  path: '/kontak',
});

export default function KontakPage() {
  const wilayah = Array.from(new Set(properti.map((p) => p.agen.wilayah)));
  const konsultan = new Set(properti.map((p) => p.agen.kode)).size;

  return (
    <main className="relative z-10">
      <PageHeader kicker="Kontak" title={site.kontak?.judul || 'Tulis, kami yang menjadwalkan'} subtitle={site.kontak?.sub || 'Untuk pertanyaan tentang listing tertentu, jalur tercepat adalah tombol jadwal survei di halaman propertinya.'} />

      <section className="px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
          {/* Di ponsel formulir tampil lebih dulu; info pendukung menyusul di bawahnya. */}
          <div className="order-2 space-y-4 lg:order-1">
            <Info icon={Mail} label="Email" value={site.email} note="Alamat contoh — situs ini purwarupa." />
            <Info icon={Clock} label="Jam layanan" value={site.jam} />
            <Info icon={Users} label="Konsultan" value={`${konsultan} orang`} />
            <Info icon={Peta} label="Wilayah" value={wilayah.join(' · ')} />
            {faqs.length > 0 && (
              <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-muted">Sebelum bertanya</p>
                <ul className="mt-3 space-y-3 text-sm">
                  {faqs.slice(0, 3).map((f) => (
                    <li key={f.q}><p className="font-semibold text-ink">{f.q}</p><p className="mt-0.5 text-muted">{f.a}</p></li>
                  ))}
                </ul>
                <Link href="/properti" className="mt-3 inline-block py-1 text-sm font-semibold text-forest underline-offset-4 hover:underline">Lihat semua properti</Link>
              </div>
            )}
          </div>

          <div className="order-1 lg:order-2"><FormKontak /></div>
        </div>
      </section>
    </main>
  );
}

function Info({ icon: Icon, label, value, note }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest/10 text-forest"><Icon size={20} /></span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 break-words font-semibold text-ink">{value}</p>
        {note && <p className="mt-0.5 text-xs text-muted">{note}</p>}
      </div>
    </div>
  );
}
