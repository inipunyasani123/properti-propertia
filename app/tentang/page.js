import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/ui/Reveal';
import { site, stats, properti, tentang } from '@/lib/data';
import { halaman } from '@/lib/seo';

export const metadata = halaman({ judul: 'Tentang kami', deskripsi: tentang.cerita[0], path: '/tentang', gambar: tentang.foto, alt: tentang.judul });

export default function TentangPage() {
  // Daftar konsultan disusun dari listing yang mereka pegang.
  const konsultan = Object.values(
    properti.reduce((acc, p) => {
      const a = acc[p.agen.kode] || { ...p.agen, jumlah: 0 };
      a.jumlah += 1;
      acc[p.agen.kode] = a;
      return acc;
    }, {})
  );

  return (
    <main className="relative z-10">
      <PageHeader kicker={`Tentang ${site.name}`} title={tentang.judul} subtitle={site.tagline} />

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl">
              <Image src={tentang.foto} alt="" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl text-ink md:text-4xl">{tentang.subjudul || 'Cara kami bekerja'}</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink/80">
              {tentang.cerita.map((c) => <p key={c.slice(0, 24)}>{c}</p>)}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-6 lg:px-8">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-black/5 bg-black/5 shadow-sm md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col bg-white px-6 py-8 text-center">
              <dt className="text-sm text-muted">{s.label}</dt>
              <dd className="order-first font-display text-3xl text-forest md:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal><h2 className="font-display text-3xl text-ink md:text-4xl">Yang kami pegang</h2></Reveal>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {tentang.nilai.map(([judul, isi], i) => (
              <li key={judul}>
                <Reveal delay={i * 0.1} className="h-full rounded-2xl border border-black/5 bg-white p-7 shadow-sm">
                  <span className="font-display text-4xl leading-none numeral-outline" aria-hidden="true">0{i + 1}</span>
                  <h3 className="mt-4 font-display text-xl text-ink">{judul}</h3>
                  <p className="mt-2 text-muted">{isi}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-sand/50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal><h2 className="font-display text-3xl text-ink md:text-4xl">Konsultan</h2></Reveal>
          <ul className={`mt-8 grid grid-cols-2 gap-4 sm:gap-6 ${konsultan.length > 3 ? 'lg:grid-cols-4' : konsultan.length === 3 ? 'lg:grid-cols-3' : 'max-w-3xl'}`}>
            {konsultan.map((a) => (
              <li key={a.kode} className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                <div className="relative aspect-[4/5] bg-sand">
                  <Image src={a.foto} alt={`Ilustrasi potret ${a.nama}`} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover" />
                </div>
                <div className="p-4 sm:p-5">
                  <p className="font-display text-lg leading-snug text-ink">{a.nama}</p>
                  <p className="text-sm text-muted">{a.wilayah}</p>
                  <p className="mt-2 text-xs text-muted">{a.kode} · {a.jumlah} listing</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-sm text-muted">{site.name} adalah purwarupa desain. Listing, konsultan, dan harga di situs ini adalah contoh. Foto berasal dari sumber CC0 dan domain publik; potret konsultan adalah ilustrasi buatan sendiri.</p>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-forest px-8 py-14 text-center text-cream">
            <h2 className="mx-auto max-w-2xl font-display text-3xl md:text-4xl">{tentang.cta || 'Lihat apa yang sedang kami tawarkan'}</h2>
            <Link href="/properti" className="mt-7 inline-flex items-center gap-2 rounded-full border border-cream/50 px-7 py-3 font-semibold text-cream transition hover:bg-cream/10">Jelajahi properti <ArrowRight size={16} /></Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
