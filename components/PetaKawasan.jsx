'use client';
import { useEffect, useRef, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

// Peta Google baru dimuat setelah diminta: halaman tetap ringan, tidak menunggu
// peta pihak ketiga, dan tidak ada data yang dikirim ke Google sebelum pengunjung memilih.
// Peta hanya sampai tingkat kecamatan; alamat lengkap diberikan saat survei.
export default function PetaKawasan({ kecamatan, kota }) {
  const [buka, setBuka] = useState(false);
  const bingkai = useRef(null);
  const q = encodeURIComponent(`${kecamatan}, ${kota}`);
  const judul = `Peta kawasan ${kecamatan}, ${kota}`;

  useEffect(() => { if (buka) bingkai.current?.focus(); }, [buka]);

  return (
    <div className="relative h-72 overflow-hidden rounded-2xl border border-black/5 bg-sand shadow-sm">
      {buka ? (
        <iframe ref={bingkai} title={judul} src={`https://www.google.com/maps?q=${q}&z=13&output=embed`} className="h-full w-full" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 640 288" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
            <g className="text-ink" stroke="currentColor" fill="none" strokeLinecap="round">
              <g strokeOpacity="0.07" strokeWidth="2">
                <path d="M0 40h640M0 96h640M0 152h640M0 208h640M0 264h640" />
                <path d="M60 0v288M140 0v288M220 0v288M420 0v288M500 0v288M580 0v288" />
              </g>
              <g strokeOpacity="0.14" strokeWidth="9">
                <path d="M-20 228C120 200 190 132 320 120s230 22 340-28" />
                <path d="M250 -20c22 90 38 170 26 320" />
                <path d="M470 -20c-28 110-10 210 60 330" />
              </g>
            </g>
            <path d="M-20 70c90 30 150 10 210-14s120-20 170 18" className="text-forest" stroke="currentColor" strokeOpacity="0.18" strokeWidth="14" fill="none" strokeLinecap="round" />
            <g className="text-forest">
              <circle cx="320" cy="144" r="92" fill="currentColor" fillOpacity="0.07" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="7 7" />
              <circle cx="320" cy="144" r="46" fill="currentColor" fillOpacity="0.06" />
            </g>
          </svg>
          <div className="relative flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-forest text-cream shadow-lg"><MapPin size={22} /></span>
            <div className="rounded-xl bg-sand/85 px-4 py-1.5 backdrop-blur-[2px]">
              <p className="font-display text-xl text-ink">Kawasan {kecamatan}</p>
              <p className="text-sm text-muted">{kota} · lingkaran kecamatan, bukan titik rumah</p>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => setBuka(true)} className="min-h-11 rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-soft">Tampilkan peta</button>
              <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-forest hover:text-forest">
                Google Maps <ExternalLink size={14} /><span className="sr-only"> (membuka tab baru)</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
