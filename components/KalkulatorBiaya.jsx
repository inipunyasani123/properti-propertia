'use client';
import { useEffect, useMemo, useState } from 'react';
import { hitungBiaya, ASUMSI } from '@/lib/biaya';
import { properti, rp, formatHarga } from '@/lib/data';

const DIJUAL = properti.filter((p) => p.status === 'Dijual' && p.jenisProperti !== 'Tanah');
const WARNA = { awal: 'bg-forest', bphtb: 'bg-gold', ppn: 'bg-ink/70', ppat: 'bg-forest-soft/50', kpr: 'bg-gold/45' };
const angka = (t) => Number(String(t).replace(/\D/g, '')) || 0;

export default function KalkulatorBiaya() {
  const [pilih, setPilih] = useState(String(DIJUAL[0].id));
  const [harga, setHarga] = useState(DIJUAL[0].harga);
  const [baru, setBaru] = useState(false);
  const [kpr, setKpr] = useState(true);
  const [dp, setDp] = useState(20);
  const [bunga, setBunga] = useState(7.5);
  const [tenor, setTenor] = useState(20);
  const [npoptkp, setNpoptkp] = useState(ASUMSI.npoptkp);

  // ?id= dari halaman detail memilih listing itu (dibaca setelah dimuat supaya kalkulator tetap dirender di server).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('id');
    const p = DIJUAL.find((x) => String(x.id) === id);
    if (p) { setPilih(String(p.id)); setHarga(p.harga); }
  }, []);

  const gantiListing = (v) => {
    setPilih(v);
    const p = DIJUAL.find((x) => String(x.id) === v);
    if (p) setHarga(p.harga);
  };

  const h = useMemo(() => hitungBiaya({ harga, baru, kpr, dpPersen: dp, bunga, tenor, npoptkp }), [harga, baru, kpr, dp, bunga, tenor, npoptkp]);
  const field = 'mt-1 w-full rounded-xl border border-black/10 bg-cream px-3 py-2.5 text-sm text-ink outline-none transition focus:border-forest';
  const label = 'block text-sm font-semibold text-ink';

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <form className="space-y-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm" onSubmit={(e) => e.preventDefault()}>
        <label className={label}>Rumah
          <select value={pilih} onChange={(e) => gantiListing(e.target.value)} className={field}>
            {DIJUAL.map((p) => <option key={p.id} value={p.id}>{p.judul} — {formatHarga(p.harga)}</option>)}
            <option value="lain">Isi harga sendiri</option>
          </select>
        </label>
        <label className={label}>Harga rumah (Rp)
          <input inputMode="numeric" value={harga.toLocaleString('id-ID')} onChange={(e) => { setPilih('lain'); setHarga(angka(e.target.value)); }} className={field} />
        </label>

        <fieldset className="space-y-2">
          <legend className="text-sm font-semibold text-ink">Jenis transaksi</legend>
          <label className="flex min-h-8 items-center gap-2 text-sm text-ink/85"><input type="checkbox" checked={baru} onChange={(e) => setBaru(e.target.checked)} className="h-5 w-5 accent-forest" /> Rumah baru dari pengembang (kena PPN)</label>
          <label className="flex min-h-8 items-center gap-2 text-sm text-ink/85"><input type="checkbox" checked={kpr} onChange={(e) => setKpr(e.target.checked)} className="h-5 w-5 accent-forest" /> Dibiayai KPR</label>
        </fieldset>

        {kpr && (
          <>
            <label className={label}>Uang muka: {dp}%
              <input type="range" min={10} max={50} step={5} value={dp} onChange={(e) => setDp(+e.target.value)} aria-valuetext={`${dp} persen`} className="mt-2 h-6 w-full cursor-pointer accent-forest" />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={label}>Bunga/thn (%)
                <input type="number" min={0} max={20} step={0.25} value={bunga} onChange={(e) => setBunga(+e.target.value)} className={field} />
              </label>
              <label className={label}>Tenor
                <select value={tenor} onChange={(e) => setTenor(+e.target.value)} className={field}>
                  {[5, 10, 15, 20, 25].map((t) => <option key={t} value={t}>{t} tahun</option>)}
                </select>
              </label>
            </div>
          </>
        )}

        <label className={label}>NPOPTKP daerah (Rp)
          <input inputMode="numeric" value={npoptkp.toLocaleString('id-ID')} onChange={(e) => setNpoptkp(angka(e.target.value))} className={field} />
          <span className="mt-1 block text-xs font-normal text-muted">Nilai tidak kena pajak untuk BPHTB, berbeda tiap daerah.</span>
        </label>
      </form>

      <section aria-labelledby="hasil" className="min-w-0">
        <div className="rounded-3xl bg-forest p-7 text-cream md:p-9">
          <h2 id="hasil" className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/75">Siapkan dana tunai</h2>
          <p className="mt-2 font-display text-4xl md:text-6xl" aria-live="polite">{rp(h.tunai)}</p>
          <p className="mt-3 text-cream/80">
            {rp(h.tambahan)} di antaranya biaya di luar {kpr ? 'uang muka' : 'harga rumah'} — {harga ? ((h.tambahan / harga) * 100).toFixed(1).replace('.', ',') : 0}% dari harga.
          </p>
          {kpr && (
            <p className="mt-5 border-t border-cream/20 pt-5 text-cream/85">
              Cicilan ±<span className="font-semibold text-cream">{rp(h.cicilan)}/bulan</span> selama {tenor} tahun untuk pinjaman {rp(h.pokok)}.
              Agar cicilan tidak lebih dari 30% penghasilan, penghasilan bersih rumah tangga sekitar <span className="font-semibold text-cream">{rp(h.cicilan / 0.3)}/bulan</span>.
            </p>
          )}
        </div>

        <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-sand" aria-hidden="true">
          {h.rincian.map((r) => <span key={r.k} className={WARNA[r.k]} style={{ width: `${(r.nilai / h.tunai) * 100}%` }} />)}
        </div>

        <dl className="mt-6 divide-y divide-black/10 rounded-3xl border border-black/5 bg-white px-6 shadow-sm">
          {h.rincian.map((r) => (
            <div key={r.k} className="grid gap-1 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
              <dt>
                <span className="flex items-center gap-2 font-semibold text-ink"><span className={`h-3 w-3 shrink-0 rounded-full ${WARNA[r.k]}`} aria-hidden="true" />{r.label}</span>
                <span className="mt-1 block text-sm text-muted">{r.ket}</span>
              </dt>
              <dd className="font-display text-xl text-ink sm:text-right">{rp(r.nilai)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-muted">PPh final 2,5% ditanggung penjual, jadi tidak dihitung di sini. Semua angka adalah simulasi dengan asumsi umum — angka akhir mengikuti tagihan bank, notaris, dan pemda saat transaksi.</p>
      </section>
    </div>
  );
}
