'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { statusList, jenisList, kotaList } from '@/lib/data';

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('Semua');
  const [jenis, setJenis] = useState('Semua');
  const [kota, setKota] = useState('Semua');

  const submit = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set('q', q.trim());
    if (status !== 'Semua') p.set('status', status);
    if (jenis !== 'Semua') p.set('jenis', jenis);
    if (kota !== 'Semua') p.set('kota', kota);
    const qs = p.toString();
    router.push('/properti' + (qs ? `?${qs}` : ''));
  };

  const sel = 'min-h-11 w-full rounded-xl border border-black/10 bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-forest sm:py-3';

  return (
    <form onSubmit={submit} role="search" aria-label="Cari properti" className="rounded-2xl border border-black/5 bg-white p-3 shadow-xl sm:p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 sm:gap-3">
        <div className="relative col-span-2 sm:col-span-4">
          <Search size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari kawasan / kata kunci…" aria-label="Kata kunci" className={`${sel} pl-10`} />
        </div>
        <select value={kota} onChange={(e) => setKota(e.target.value)} className={`${sel} sm:col-span-2`} aria-label="Kota">
          {kotaList.map((k) => <option key={k} value={k}>{k === 'Semua' ? 'Semua Kota' : k}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${sel} sm:col-span-2`} aria-label="Status">
          {statusList.map((s) => <option key={s} value={s}>{s === 'Semua' ? 'Semua Status' : s}</option>)}
        </select>
        <select value={jenis} onChange={(e) => setJenis(e.target.value)} className={`${sel} sm:col-span-2`} aria-label="Jenis">
          {jenisList.map((j) => <option key={j} value={j}>{j === 'Semua' ? 'Semua Jenis' : j}</option>)}
        </select>
        <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-forest px-6 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-soft sm:col-span-2 sm:py-3">
          <Search size={16} /> Cari
        </button>
      </div>
    </form>
  );
}
