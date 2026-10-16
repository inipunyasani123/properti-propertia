'use client';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { properti, statusList, jenisList, kotaList, hargaFilter } from '@/lib/data';

// Rentang harga jual dan sewa dipisah: harga sewa per periode tidak sebanding dengan harga jual.
const KT = ['Semua', ...Array.from({ length: Math.min(4, Math.max(...properti.map((p) => p.spesifikasi.kamarTidur))) }, (_, i) => String(i + 1))];
const SORT = [{ label: 'Terbaru', v: 'baru' }, { label: 'Harga Termurah', v: 'murah' }, { label: 'Harga Termahal', v: 'mahal' }];
const AWAL = { q: '', status: 'Semua', jenis: 'Semua', kota: 'Semua', harga: 'all' };

// Membaca ?q=&status=&jenis=&kota=&harga= tanpa membuat seluruh daftar menunggu JavaScript:
// hanya komponen kecil ini yang dirender di peramban.
function BacaParam({ onUbah }) {
  const sp = useSearchParams();
  useEffect(() => {
    onUbah({
      q: sp.get('q') || '',
      status: sp.get('status') || 'Semua',
      jenis: sp.get('jenis') || 'Semua',
      kota: sp.get('kota') || 'Semua',
      harga: sp.get('harga') || 'all',
    });
  }, [sp, onUbah]);
  return null;
}

export default function ListingsClient() {
  const [f, setF] = useState(AWAL);
  const [kt, setKt] = useState('Semua');
  const [sort, setSort] = useState('baru');
  const set = (k) => (v) => setF((x) => ({ ...x, [k]: v }));
  const terapkan = useCallback((p) => setF(p), []);

  const rentang = hargaFilter.filter((h) => f.status === 'Semua' || h.status === f.status);
  const gantiStatus = (v) => setF((x) => {
    const h = hargaFilter.find((y) => y.v === x.harga);
    return { ...x, status: v, harga: h && v !== 'Semua' && h.status !== v ? 'all' : x.harga };
  });
  const reset = () => { setF(AWAL); setKt('Semua'); setSort('baru'); };

  const list = useMemo(() => {
    let r = properti.filter((p) => {
      const text = `${p.judul} ${p.lokasi.kota} ${p.lokasi.kecamatan} ${p.jenisProperti} ${(p.suasana || []).join(' ')}`.toLowerCase();
      if (f.q.trim() && !text.includes(f.q.trim().toLowerCase())) return false;
      if (f.status !== 'Semua' && p.status !== f.status) return false;
      if (f.jenis !== 'Semua' && p.jenisProperti !== f.jenis) return false;
      if (f.kota !== 'Semua' && p.lokasi.kota !== f.kota) return false;
      if (kt !== 'Semua' && p.spesifikasi.kamarTidur < Number(kt)) return false;
      const h = hargaFilter.find((x) => x.v === f.harga);
      if (h) {
        if (p.status !== h.status) return false;
        const nilai = h.perBulan && p.periode === 'tahun' ? p.harga / 12 : p.harga;
        if (h.min && nilai < h.min) return false;
        if (h.max && nilai >= h.max) return false;
      }
      return true;
    });
    if (sort === 'murah') r = [...r].sort((a, b) => a.harga - b.harga);
    else if (sort === 'mahal') r = [...r].sort((a, b) => b.harga - a.harga);
    else r = [...r].sort((a, b) => b.id - a.id);
    return r;
  }, [f, kt, sort]);

  // Hanya kartu yang baru masuk hasil saringan yang diberi animasi muncul.
  const sebelumnya = useRef(new Set(properti.map((p) => p.id)));
  useEffect(() => { sebelumnya.current = new Set(list.map((p) => p.id)); }, [list]);

  const sel = 'min-h-11 rounded-xl border border-black/10 bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-forest';
  const active = f.q || f.status !== 'Semua' || f.jenis !== 'Semua' || f.kota !== 'Semua' || f.harga !== 'all' || kt !== 'Semua';

  return (
    <section className="relative z-10 px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="judul-saring">
      <Suspense fallback={null}><BacaParam onUbah={terapkan} /></Suspense>
      <div className="mx-auto max-w-7xl">
        {/* Filter bar */}
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
          <h2 id="judul-saring" className="mb-3 flex items-center gap-2 text-base font-semibold text-ink"><SlidersHorizontal size={16} /> Saring properti</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            <div className="relative col-span-2 md:col-span-3 lg:col-span-2">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input type="search" value={f.q} onChange={(e) => set('q')(e.target.value)} placeholder="Cari kawasan / kata kunci…" aria-label="Kata kunci" className={`${sel} w-full pl-9`} />
            </div>
            <select value={f.status} onChange={(e) => gantiStatus(e.target.value)} className={sel} aria-label="Status">{statusList.map((s) => <option key={s} value={s}>{s === 'Semua' ? 'Semua Status' : s}</option>)}</select>
            <select value={f.jenis} onChange={(e) => set('jenis')(e.target.value)} className={sel} aria-label="Jenis">{jenisList.map((j) => <option key={j} value={j}>{j === 'Semua' ? 'Semua Jenis' : j}</option>)}</select>
            <select value={f.kota} onChange={(e) => set('kota')(e.target.value)} className={sel} aria-label="Kota">{kotaList.map((k) => <option key={k} value={k}>{k === 'Semua' ? 'Semua Kota' : k}</option>)}</select>
            <select value={f.harga} onChange={(e) => set('harga')(e.target.value)} className={sel} aria-label="Harga"><option value="all">Semua harga</option>{rentang.map((h) => <option key={h.v} value={h.v}>{h.label}</option>)}</select>
            <select value={kt} onChange={(e) => setKt(e.target.value)} className={`${sel} col-span-2 md:col-span-1`} aria-label="Kamar tidur">{KT.map((k) => <option key={k} value={k}>{k === 'Semua' ? 'Semua K. Tidur' : `${k}+ Kamar`}</option>)}</select>
          </div>
        </div>

        {/* Result header */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="text-sm text-muted" aria-live="polite"><span className="font-semibold text-ink">{list.length}</span> properti ditemukan</p>
            {active && (
              <button type="button" onClick={reset} className="-my-2 inline-flex items-center gap-1 py-2 text-sm text-forest hover:underline"><X size={13} /> Reset filter</button>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">Urutkan
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={sel}>{SORT.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}</select>
          </label>
        </div>

        {/* Grid */}
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Hasil pencarian properti">
          {list.map((p) => (
            <li key={p.id} className={sebelumnya.current.has(p.id) ? undefined : 'kartu-muncul'}>
              <PropertyCard item={p} />
            </li>
          ))}
        </ul>

        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-black/15 bg-white/50 py-20 text-center">
            <p className="font-display text-2xl text-ink">Tidak ada properti yang cocok</p>
            <p className="mt-2 text-muted">Coba ubah atau reset filter pencarianmu.</p>
            <button type="button" onClick={reset} className="mt-5 min-h-11 rounded-full bg-forest px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-soft">Reset filter</button>
          </div>
        )}
      </div>
    </section>
  );
}
