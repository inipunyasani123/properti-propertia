'use client';
import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';

export default function Gallery({ foto = [], ket = [], video, judul }) {
  // ket: keterangan tiap foto (mis. "Ruang keluarga"), dipakai untuk teks alternatif dan label tombol.
  const items = [...foto.map((src, i) => ({ type: 'img', src, ket: ket[i] })), ...(video ? [{ type: 'video', src: video }] : [])];
  const [active, setActive] = useState(0);
  const cur = items[active] || items[0];

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sand shadow-sm">
        {cur.type === 'img'
          ? <Image src={cur.src} alt={cur.ket ? `${cur.ket} — ${judul}` : `${judul}, foto ${active + 1} dari ${items.length}`} fill priority fetchPriority="high" sizes="(max-width:1024px) 100vw, 70vw" className="object-cover" />
          : <video src={cur.src} controls className="h-full w-full object-cover" />}
      </div>
      {items.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2 sm:gap-3">
          {items.map((it, i) => (
            <button key={i} type="button" onClick={() => setActive(i)} aria-pressed={i === active} aria-label={`${it.type === 'img' ? 'Foto' : 'Video'} ${i + 1} dari ${items.length}${it.ket ? `: ${it.ket}` : ''}`} className={`relative h-16 w-24 overflow-hidden rounded-xl ring-2 transition sm:h-20 sm:w-28 ${i === active ? 'ring-forest' : 'ring-transparent hover:ring-forest/40'}`}>
              {it.type === 'img'
                ? <Image src={it.src} alt="" fill sizes="120px" className="object-cover" />
                : <span className="flex h-full w-full items-center justify-center gap-1 bg-forest text-xs font-semibold text-cream"><Play size={14} /> Video</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
