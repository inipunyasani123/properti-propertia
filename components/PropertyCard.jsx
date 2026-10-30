import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Bath, Maximize, MapPin, ArrowUpRight } from 'lucide-react';
import { hargaLabel } from '@/lib/data';

export default function PropertyCard({ item }) {
  const s = item.spesifikasi;
  const luas = s.luasBangunan || s.luasTanah;
  return (
    <Link href={`/properti/${item.id}`} className="group block">
      <div className="arch-sm relative h-72 overflow-hidden bg-sand">
        <Image src={item.media.foto[0]} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <span className={`absolute bottom-4 left-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${item.status === 'Dijual' ? 'bg-forest' : 'bg-gold'}`}>{item.status}</span>
        <span className="absolute right-4 top-4 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-cream text-forest opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={16} /></span>
      </div>
      <div className="px-1 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{item.jenisProperti}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-xl leading-snug text-ink transition-colors group-hover:text-forest">{item.judul}</h3>
        <p className="mt-1.5 flex items-center gap-1 text-sm text-muted"><MapPin size={14} /> {item.lokasi.kecamatan}, {item.lokasi.kota}</p>
        <div className="mt-3 flex items-center gap-4 text-sm text-ink/70">
          {s.kamarTidur > 0 && <span className="flex items-center gap-1"><BedDouble size={15} /> {s.kamarTidur}</span>}
          {s.kamarMandi > 0 && <span className="flex items-center gap-1"><Bath size={15} /> {s.kamarMandi}</span>}
          <span className="flex items-center gap-1"><Maximize size={15} /> {luas} m²</span>
        </div>
        <p className="mt-3 border-t border-black/10 pt-3 font-display text-2xl text-forest">{hargaLabel(item)}</p>
      </div>
    </Link>
  );
}
