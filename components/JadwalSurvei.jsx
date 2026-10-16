'use client';
import { useEffect, useRef, useState } from 'react';
import { CalendarCheck, Check, Video, Footprints } from 'lucide-react';

// Penjadwal survei purwarupa: memilih hari & jam, lalu menampilkan ringkasan.
// Tidak ada data yang dikirim ke mana pun.
const SLOT = ['10.00', '13.00', '15.30'];
const SLOT_SABTU = ['10.00', '13.00'];

function hariKeDepan(n) {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  d.setHours(0, 0, 0, 0);
  const out = [];
  while (out.length < n) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) out.push(new Date(d));
  }
  return out;
}
const fmt = (d, o) => d.toLocaleDateString('id-ID', o);

export default function JadwalSurvei({ id, judul, agen, judulForm = 'Jadwalkan survei', catatan = 'Alamat lengkap dikirim setelah jadwal dikonfirmasi.' }) {
  const [hari, setHari] = useState([]);
  const [h, setH] = useState(0);
  const [jam, setJam] = useState('');
  const [cara, setCara] = useState('langsung');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [selesai, setSelesai] = useState(false);
  const [galat, setGalat] = useState('');
  const judulSelesai = useRef(null);
  const grupJam = useRef(null);

  // Tanggal dihitung di peramban (WIB), bukan saat build.
  useEffect(() => setHari(hariKeDepan(8)), []);

  const dipilih = hari[h];
  const slot = dipilih && dipilih.getDay() === 6 ? SLOT_SABTU : SLOT;
  const kode = dipilih && jam ? `SV-${id}${fmt(dipilih, { day: '2-digit' })}${jam.replace('.', '')}` : '';
  useEffect(() => { if (selesai) judulSelesai.current?.focus(); }, [selesai]);

  // Nama dan email diperiksa peramban (required); jam diperiksa di sini dengan pesan yang jelas.
  const kirim = (e) => {
    e.preventDefault();
    if (!dipilih || !jam) { setGalat('Pilih jam survei dulu.'); grupJam.current?.querySelector('input')?.focus(); return; }
    setGalat('');
    setSelesai(true);
  };

  if (selesai) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-cream"><Check size={22} /></span>
        <h2 ref={judulSelesai} tabIndex={-1} className="mt-4 font-display text-xl text-ink outline-none">Permintaan tercatat, {nama.trim().split(' ')[0]}</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-muted">Kode</dt><dd className="font-mono font-semibold text-ink">{kode}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Waktu</dt><dd className="text-right text-ink">{fmt(dipilih, { weekday: 'long', day: 'numeric', month: 'long' })}, {jam} WIB</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Cara</dt><dd className="text-ink">{cara === 'langsung' ? 'Datang ke lokasi' : 'Video call'}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-muted">Konsultan</dt><dd className="text-ink">{agen.nama}</dd></div>
        </dl>
        <p className="mt-4 rounded-xl bg-sand/60 p-3 text-xs leading-relaxed text-ink/80">Ini situs contoh — tidak ada yang dikirim. Di layanan sungguhan, {agen.nama.split(' ')[0]} mengonfirmasi lewat email ke {email} dan {catatan.charAt(0).toLowerCase() + catatan.slice(1)}</p>
        <button type="button" onClick={() => setSelesai(false)} className="mt-4 w-full rounded-xl border border-black/10 py-2.5 text-sm font-semibold text-ink transition hover:border-forest hover:text-forest">Ubah jadwal</button>
      </div>
    );
  }

  const pilihan = 'block rounded-xl border border-black/10 px-2 py-2 text-center text-sm text-ink transition peer-checked:border-forest peer-checked:bg-forest peer-checked:text-cream peer-focus-visible:ring-2 peer-focus-visible:ring-forest hover:border-forest';
  const field = 'mt-1 w-full rounded-xl border border-black/10 bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-forest';

  return (
    <form onSubmit={kirim} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm" aria-label={`${judulForm}: ${judul}`}>
      <p className="flex items-center gap-2 font-display text-lg text-ink"><CalendarCheck size={18} className="text-forest" /> {judulForm}</p>
      <p className="mt-1 text-xs text-muted">Bersama {agen.nama} · {agen.kode}</p>

      <fieldset className="mt-5">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">Hari</legend>
        {hari.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Memuat tanggal…</p>
        ) : (
          <div className="mt-2 grid grid-cols-4 gap-2">
            {hari.map((d, i) => (
              <label key={i} className="relative cursor-pointer">
                <input type="radio" name="hari" checked={h === i} onChange={() => { setH(i); setJam(''); }} className="peer sr-only" />
                <span className={pilihan} aria-hidden="true">
                  <span className="block text-[11px] uppercase">{fmt(d, { weekday: 'short' })}</span>
                  <span className="block font-semibold">{fmt(d, { day: 'numeric' })}</span>
                </span>
                <span className="sr-only">{fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">Jam (WIB)</legend>
        <div ref={grupJam} className="mt-2 grid grid-cols-3 gap-2">
          {slot.map((s) => (
            <label key={s} className="relative cursor-pointer">
              <input type="radio" name="jam" checked={jam === s} onChange={() => { setJam(s); setGalat(''); }} className="peer sr-only" />
              <span className={pilihan}>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-4">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">Cara</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[['langsung', 'Datang', Footprints], ['video', 'Video call', Video]].map(([v, l, Ikon]) => (
            <label key={v} className="relative cursor-pointer">
              <input type="radio" name="cara" checked={cara === v} onChange={() => setCara(v)} className="peer sr-only" />
              <span className={`${pilihan} flex items-center justify-center gap-1.5`}><Ikon size={14} /> {l}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-muted">Nama
        <input value={nama} onChange={(e) => setNama(e.target.value)} autoComplete="name" required className={field} />
      </label>
      <label className="mt-3 block text-xs font-semibold uppercase tracking-wide text-muted">Email
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={field} />
      </label>

      <p className="mt-3 min-h-5 text-sm font-semibold text-forest" role="alert">{galat}</p>
      <button type="submit" className="mt-1 w-full rounded-xl bg-forest py-3 font-semibold text-cream transition hover:bg-forest-soft">
        {jam ? `Minta jadwal ${jam} WIB` : 'Minta jadwal ini'}
      </button>
      <p className="mt-3 text-center text-xs text-muted">{catatan}</p>
    </form>
  );
}
