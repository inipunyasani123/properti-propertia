'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check } from 'lucide-react';
import { site } from '@/lib/data';

const TOPIK = [
  ['listing', 'Tanya tentang listing'],
  ['jual', 'Jual atau sewakan properti'],
  ['kerja-sama', 'Kerja sama'],
  ['lain', 'Lainnya'],
];
const KOSONG = { nama: '', email: '', topik: 'listing', pesan: '' };

// Tautan "Ajukan listing" membuka formulir dengan topik jual (?topik=jual).
// Dibaca di komponen kecil supaya formulir tetap dirender di server.
function BacaTopik({ onTopik }) {
  const sp = useSearchParams();
  useEffect(() => {
    const t = sp.get('topik');
    if (t && TOPIK.some(([v]) => v === t)) onTopik(t);
  }, [sp, onTopik]);
  return null;
}

export default function FormKontak() {
  const [form, setForm] = useState(KOSONG);
  const [sent, setSent] = useState(false);
  const judul = useRef(null);
  const [onTopik] = useState(() => (t) => setForm((f) => ({ ...f, topik: t })));

  useEffect(() => { if (sent) judul.current?.focus(); }, [sent]);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); if (form.nama.trim() && form.email.trim() && form.pesan.trim()) setSent(true); };
  const field = 'mt-1 w-full rounded-xl border border-black/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition focus:border-forest';
  const label = 'block text-sm font-semibold text-ink';

  if (sent) {
    return (
      <div className="rounded-3xl border border-black/5 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest text-cream"><Check size={28} /></div>
        <h2 ref={judul} tabIndex={-1} className="mt-4 font-display text-2xl text-ink outline-none">Terima kasih, {form.nama.trim().split(' ')[0]}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted">
          Topik: {TOPIK.find(([v]) => v === form.topik)[1].toLowerCase()}. {site.name} adalah situs contoh, jadi pesan ini tidak dikirim ke mana pun.
          {form.topik === 'jual' ? ' Di layanan sungguhan, konsultan akan menghubungimu untuk menjadwalkan kunjungan penilaian.' : ' Di layanan sungguhan, balasan dikirim ke email yang kamu tulis.'}
        </p>
        <button type="button" onClick={() => { setSent(false); setForm(KOSONG); }} className="mt-6 min-h-11 rounded-full border border-black/10 px-6 py-2.5 text-sm font-semibold text-ink transition hover:border-forest hover:text-forest">Tulis pesan lain</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
      <Suspense fallback={null}><BacaTopik onTopik={onTopik} /></Suspense>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>Nama<input name="nama" value={form.nama} onChange={handle} autoComplete="name" required className={field} /></label>
        <label className={label}>Email<input type="email" name="email" value={form.email} onChange={handle} autoComplete="email" required className={field} /></label>
      </div>
      <label className={label}>Topik
        <select name="topik" value={form.topik} onChange={handle} className={field}>
          {TOPIK.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label className={label}>Pesan
        <textarea name="pesan" value={form.pesan} onChange={handle} rows={6} required placeholder={form.topik === 'jual' ? 'Jenis properti, kawasan, perkiraan luas, dan kapan bisa dikunjungi.' : 'Tulis pertanyaanmu.'} className={`${field} resize-none`} />
      </label>
      <button type="submit" className="w-full rounded-xl bg-forest py-3.5 font-semibold text-cream transition hover:bg-forest-soft">Kirim pesan</button>
      <p className="text-center text-xs text-muted">Purwarupa: formulir ini tidak mengirim data.</p>
    </form>
  );
}
