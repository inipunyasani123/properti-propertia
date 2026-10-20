import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Maximize, LandPlot, Layers, FileText, CalendarDays, Check, ArrowLeft, ArrowRight, Ruler, ShieldCheck } from 'lucide-react';
import Gallery from '@/components/Gallery';
import PropertyCard from '@/components/PropertyCard';
import JadwalSurvei from '@/components/JadwalSurvei';
import PetaKawasan from '@/components/PetaKawasan';
import Reveal from '@/components/ui/Reveal';
import { site, properti, getProperti, propertiSerupa, formatHarga, hargaLabel, tautanDetail } from '@/lib/data';
import { halaman } from '@/lib/seo';

export function generateStaticParams() {
  return properti.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const item = getProperti(id);
  if (!item) return { title: 'Properti tidak ditemukan' };
  return halaman({
    judul: item.judul,
    deskripsi: `${item.jenisProperti} ${item.status.toLowerCase()} di ${item.lokasi.kecamatan}, ${item.lokasi.kota}, ${hargaLabel(item)}. ${item.deskripsi}`,
    path: `/properti/${item.id}`,
    gambar: item.media.foto[0],
    alt: item.judul,
  });
}

export default async function DetailPage({ params }) {
  const { id } = await params;
  const item = getProperti(id);
  if (!item) notFound();

  const s = item.spesifikasi;
  const serupa = propertiSerupa(item);
  const ekstra = tautanDetail(item);
  // Remah roti untuk mesin pencari: Beranda › Properti › listing ini.
  const remah = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: site.name, item: site.url },
    { '@type': 'ListItem', position: 2, name: 'Properti', item: `${site.url}/properti` },
    { '@type': 'ListItem', position: 3, name: item.judul, item: `${site.url}/properti/${item.id}` },
  ] };
  const luasAcuan = s.luasBangunan || s.luasTanah;
  const perMeter = item.status === 'Dijual' && luasAcuan ? item.harga / luasAcuan : 0;

  const specs = [
    s.kamarTidur > 0 && { icon: BedDouble, label: 'Kamar tidur', val: s.kamarTidur },
    s.kamarMandi > 0 && { icon: Bath, label: 'Kamar mandi', val: s.kamarMandi },
    s.luasBangunan > 0 && { icon: Maximize, label: 'Luas bangunan', val: `${s.luasBangunan} m²` },
    s.luasTanah > 0 && { icon: LandPlot, label: 'Luas tanah', val: `${s.luasTanah} m²` },
    s.jumlahLantai > 0 && { icon: Layers, label: 'Jumlah lantai', val: s.jumlahLantai },
    item.sertifikat && item.sertifikat !== '-' && { icon: FileText, label: 'Sertifikat', val: item.sertifikat },
    item.tahun && { icon: CalendarDays, label: 'Tahun dibangun', val: item.tahun },
    perMeter > 0 && { icon: Ruler, label: `Harga per m² ${s.luasBangunan ? 'bangunan' : 'tanah'}`, val: formatHarga(perMeter) },
  ].filter(Boolean);

  return (
    <main className="relative z-10">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link href="/properti" className="-my-2 inline-flex items-center gap-1 py-2 text-sm text-muted transition hover:text-forest"><ArrowLeft size={15} /> Kembali ke daftar</Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${item.status === 'Dijual' ? 'bg-forest' : 'bg-gold'}`}>{item.status}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted">{item.jenisProperti}</span>
            </div>
            <h1 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-ink md:text-4xl">{item.judul}</h1>
            <p className="mt-2 flex items-center gap-1 text-muted"><MapPin size={16} className="shrink-0" /> {item.lokasi.alamat}, {item.lokasi.kecamatan}, {item.lokasi.kota}</p>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-3xl text-forest md:text-4xl">{formatHarga(item.harga)}</p>
            <p className="text-sm text-muted">{item.status === 'Disewakan' ? `per ${item.periode || 'bulan'}` : 'harga jual, belum termasuk biaya transaksi'}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Gallery foto={item.media.foto} ket={item.media.ket} video={item.media.video} judul={item.judul} />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="min-w-0">
          <h2 className="sr-only">Spesifikasi</h2>
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {specs.map((sp) => (
              <div key={sp.label} className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
                <dt className="text-xs text-muted"><sp.icon size={20} className="mb-2 block text-forest" aria-hidden="true" />{sp.label}</dt>
                <dd className="font-display text-lg text-ink">{sp.val}</dd>
              </div>
            ))}
          </dl>

          <h2 className="mt-10 font-display text-2xl text-ink">Deskripsi</h2>
          <p className="mt-3 leading-relaxed text-ink/80">{item.deskripsi}</p>

          <h2 className="mt-10 font-display text-2xl text-ink">Fasilitas</h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {item.fasilitas.map((f) => (
              <li key={f} className="flex items-center gap-2 text-ink/80"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-forest/10 text-forest"><Check size={14} /></span> {f}</li>
            ))}
          </ul>

          <h2 className="mt-10 font-display text-2xl text-ink">Lokasi</h2>
          <p className="mt-2 text-sm text-muted">Peta menunjukkan kawasan {item.lokasi.kecamatan}, bukan titik rumah. Alamat lengkap diberikan setelah survei dijadwalkan.</p>
          <div className="mt-4"><PetaKawasan kecamatan={item.lokasi.kecamatan} kota={item.lokasi.kota} /></div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-sand ring-2 ring-forest/20"><Image src={item.agen.wajah} alt={`Ilustrasi potret ${item.agen.nama}`} fill sizes="64px" className="object-cover" /></span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted">Konsultan listing</p>
              <p className="font-display text-lg text-ink">{item.agen.nama}</p>
              <p className="flex items-center gap-1 text-xs text-muted"><ShieldCheck size={13} className="text-forest" /> {item.agen.kode} · {item.agen.wilayah}</p>
            </div>
          </div>
          {ekstra && (
            <Link href={ekstra.href} className="flex items-center justify-between gap-3 rounded-2xl border border-forest/30 bg-forest/5 px-5 py-4 text-sm font-semibold text-forest transition hover:bg-forest/10">
              <span>{ekstra.label}{ekstra.sub && <span className="mt-0.5 block text-xs font-normal text-muted">{ekstra.sub}</span>}</span>
              <ArrowRight size={16} className="shrink-0" />
            </Link>
          )}
          <JadwalSurvei id={item.id} judul={item.judul} agen={item.agen} judulForm={site.survei?.judul} catatan={site.survei?.catatan} />
        </aside>
      </div>

      {serupa.length > 0 && (
        <section className="bg-sand/50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal><h2 className="font-display text-3xl text-ink">Mungkin juga cocok</h2></Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {serupa.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 0.08}><PropertyCard item={p} /></Reveal>)}
            </div>
          </div>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(remah) }} />
    </main>
  );
}
