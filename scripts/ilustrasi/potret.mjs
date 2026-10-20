// Potret ilustrasi konsultan fiktif — digambar dari kode (SVG), bukan foto orang sungguhan.
// Satu varian = satu gaya: beranda (guas hangat, lengkung terakota), homigo (vektor bersih, lingkaran biru),
// lumora (chiaroscuro gelap dengan garis emas), propertia (tinta editorial di lengkung katedral).
// Tokoh yang sama selalu digambar dengan parameter yang sama (tabel TOKOH).
//
// Pemakaian (dari akar proyek):  node scripts/ilustrasi/potret.mjs <varian>
//   → scripts/ilustrasi/svg/<kunci>.svg (sumber) + public/images/agen/<kunci>.webp (potret 4:5, 640×800)
//     + public/images/agen/<kunci>-wajah.webp (kotak 320×320 berpusat di wajah, untuk avatar bulat)
// Lalu: node scripts/static-images.mjs . --dirs public/images
import { writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const W = 640, H = 800, CX = 320

// ───────────────────────── tokoh per varian ─────────────────────────
// lebar: skala lebar wajah · mata: >1 lebih bulat, <1 lebih sipit · usia: garis senyum & kantung mata
export const TOKOH = {
  beranda: [
    { kunci: 'dewi', lebar: 0.98, kulit: '#d6a07a', rambut: { gaya: 'hijab', warna: '#7d9a7f', dalam: '#ecdfc8' }, baju: { jenis: 'blus', warna: '#efe2cc' }, senyum: 0.9, alis: 6.5 },
    { kunci: 'andre', lebar: 1.04, mata: 0.9, kulit: '#c48a60', rambut: { gaya: 'belah', warna: '#2b1d16' }, baju: { jenis: 'kemeja', warna: '#9a4a2f', motif: 'kawung', motifWarna: '#e7c9a3' }, kacamata: '#3a2a20', senyum: 0.8, alis: 8 },
    { kunci: 'komang', lebar: 0.95, mata: 1.05, kulit: '#b67a52', rambut: { gaya: 'kuncir', warna: '#1f1511' }, baju: { jenis: 'blus', warna: '#47664f', motif: 'endek', motifWarna: '#e8c79a' }, anting: '#d9a441', senyum: 1, alis: 6.5 },
  ],
  homigo: [
    { kunci: 'rizky', lebar: 1, mata: 0.95, kulit: '#c99067', rambut: { gaya: 'jambul', warna: '#1c1714' }, baju: { jenis: 'polo', warna: '#ffffff', aksen: '#1d4ed8' }, senyum: 1, alis: 8 },
    { kunci: 'sinta', lebar: 0.97, mata: 1.1, kulit: '#e2b38e', rambut: { gaya: 'hijab', warna: '#7fb8dc', dalam: '#e5edfc' }, baju: { jenis: 'blazer', warna: '#0f1b2e', dalam: '#ffffff' }, senyum: 0.9, alis: 6.5 },
    { kunci: 'fajar', lebar: 1.05, mata: 0.9, kulit: '#a96b45', rambut: { gaya: 'ikal', warna: '#1a1411' }, baju: { jenis: 'kemeja', warna: '#0e7490' }, janggut: true, senyum: 0.7, alis: 8.5 },
  ],
  lumora: [
    { kunci: 'laras', lebar: 0.96, mata: 0.9, kulit: '#d2a27e', rambut: { gaya: 'bob', warna: '#17110d' }, baju: { jenis: 'blazer', warna: '#15110c', dalam: '#e9dcc0' }, anting: '#c6a25c', senyum: 0.55, alis: 6 },
    { kunci: 'made', lebar: 1.04, usia: true, mata: 0.85, kulit: '#9d6642', rambut: { gaya: 'beruban', warna: '#1c1612', uban: '#c9c0b2' }, baju: { jenis: 'kemeja-mandarin', warna: '#1d1812', motif: 'endek', motifWarna: '#6f5a33' }, senyum: 0.5, alis: 8 },
  ],
  propertia: [
    { kunci: 'nadia', lebar: 0.97, kulit: '#dcac86', rambut: { gaya: 'hijab', warna: '#c9d8c3', dalam: '#f6f3ea' }, baju: { jenis: 'blus', warna: '#eadfca' }, senyum: 0.85, alis: 6.5 },
    { kunci: 'bayu', lebar: 1.03, mata: 1.05, kulit: '#bd8259', rambut: { gaya: 'ikal', warna: '#211813' }, baju: { jenis: 'kemeja', warna: '#f3efe4' }, senyum: 0.9, alis: 8 },
    { kunci: 'wulan', lebar: 0.95, kulit: '#c78e65', rambut: { gaya: 'panjang', warna: '#1d1410' }, baju: { jenis: 'blus', warna: '#ead9b5', motif: 'parang', motifWarna: '#7f5d22' }, anting: '#7f5d22', senyum: 0.95, alis: 6.5 },
    { kunci: 'dimas', lebar: 1.01, mata: 0.9, kulit: '#b07650', rambut: { gaya: 'belah', warna: '#1b1512' }, baju: { jenis: 'blazer', warna: '#0f3d2e', dalam: '#f6f3ea' }, kacamata: '#16231c', senyum: 0.75, alis: 7.5 },
  ],
}

// ───────────────────────── gaya per varian ─────────────────────────
const GAYA = {
  beranda: { latar: '#f0e6d6', bentuk: '#b04e30', aksen: '#47664f', aksen2: '#e3c9a6', tinta: null, bayang: '#7a3a22', bayangO: 0.24, butir: 0.16 },
  homigo: { latar: '#e5edfc', bentuk: '#1d4ed8', aksen: '#93b4f5', aksen2: '#ffffff', tinta: null, bayang: '#1e3a8a', bayangO: 0.2, butir: 0 },
  lumora: { latar: '#13100b', bentuk: '#1e190f', aksen: '#c6a25c', aksen2: '#3a2f1c', tinta: null, bayang: '#000000', bayangO: 0.62, butir: 0.2 },
  propertia: { latar: '#f6f3ea', bentuk: '#0f3d2e', aksen: '#7f5d22', aksen2: '#eadfca', tinta: '#0f3d2e', bayang: '#0f3d2e', bayangO: 0.12, butir: 0.08 },
}

// ───────────────────────── utilitas warna ─────────────────────────
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
const toHex = (r) => '#' + r.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t))
const shade = (c, t) => mix(c, '#000000', t)
const tint = (c, t) => mix(c, '#ffffff', t)

// ───────────────────────── geometri dasar ─────────────────────────
const TOP = 200, CHIN = 468
const EY = 338 // garis mata
function wajahD(hw) {
  const r = [
    [CX + hw * 0.64, TOP, CX + hw, TOP + 50, CX + hw, TOP + 122],
    [CX + hw, TOP + 178, CX + hw * 0.9, TOP + 222, CX + hw * 0.62, TOP + 248],
    [CX + hw * 0.38, TOP + 266, CX + hw * 0.2, CHIN, CX, CHIN],
  ]
  const m = (x) => 2 * CX - x
  return `M ${CX} ${TOP} C ${r[0].join(' ')} C ${r[1].join(' ')} C ${r[2].join(' ')} ` +
    `C ${m(r[2][2])} ${r[2][3]} ${m(r[2][0])} ${r[2][1]} ${m(r[1][4])} ${r[1][5]} ` +
    `C ${m(r[1][2])} ${r[1][3]} ${m(r[1][0])} ${r[1][1]} ${m(r[0][4])} ${r[0][5]} ` +
    `C ${m(r[0][2])} ${r[0][3]} ${m(r[0][0])} ${r[0][1]} ${CX} ${TOP} Z`
}
const LEHER = `M ${CX - 46} 400 C ${CX - 46} 460 ${CX - 48} 500 ${CX - 54} 546 C ${CX - 20} 566 ${CX + 20} 566 ${CX + 54} 546 C ${CX + 48} 500 ${CX + 46} 460 ${CX + 46} 400 Z`
const BAHU = `M ${CX - 56} 528 C ${CX - 96} 552 ${CX - 172} 556 ${CX - 220} 584 C ${CX - 266} 612 ${CX - 288} 690 ${CX - 296} 800 L ${CX + 296} 800 C ${CX + 288} 690 ${CX + 266} 612 ${CX + 220} 584 C ${CX + 172} 556 ${CX + 96} 552 ${CX + 56} 528 Z`

// ───────────────────────── motif kain (kawung, parang, endek) ─────────────────────────
function motif(id, jenis, dasar, warna) {
  if (jenis === 'kawung') return `<pattern id="${id}" width="44" height="44" patternUnits="userSpaceOnUse" patternTransform="rotate(45 ${CX} 600)">
    <rect width="44" height="44" fill="${dasar}"/>
    <g fill="${warna}" opacity=".85"><ellipse cx="22" cy="9" rx="6.5" ry="9.5"/><ellipse cx="22" cy="35" rx="6.5" ry="9.5"/><ellipse cx="9" cy="22" rx="9.5" ry="6.5"/><ellipse cx="35" cy="22" rx="9.5" ry="6.5"/></g>
    <circle cx="22" cy="22" r="2.6" fill="${shade(dasar, 0.35)}"/><circle cx="0" cy="0" r="2.4" fill="${warna}"/><circle cx="44" cy="44" r="2.4" fill="${warna}"/><circle cx="44" cy="0" r="2.4" fill="${warna}"/><circle cx="0" cy="44" r="2.4" fill="${warna}"/></pattern>`
  if (jenis === 'parang') return `<pattern id="${id}" width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(-45 ${CX} 600)">
    <rect width="36" height="36" fill="${dasar}"/>
    <path d="M0 18 C 6 6, 12 6, 18 18 S 30 30, 36 18" fill="none" stroke="${warna}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M0 4 L36 4 M0 32 L36 32" stroke="${warna}" stroke-width="2" opacity=".7"/>
    <circle cx="9" cy="24" r="2" fill="${warna}"/><circle cx="27" cy="12" r="2" fill="${warna}"/></pattern>`
  if (jenis === 'endek') return `<pattern id="${id}" width="34" height="34" patternUnits="userSpaceOnUse">
    <rect width="34" height="34" fill="${dasar}"/>
    <g filter="url(#ikat)" opacity=".9"><path d="M17 4 L28 17 L17 30 L6 17 Z" fill="none" stroke="${warna}" stroke-width="3.2"/><path d="M17 12.5 L21.5 17 L17 21.5 L12.5 17 Z" fill="${warna}"/>
    <path d="M0 0 L3.5 0 L0 4 Z M34 0 L30.5 0 L34 4 Z M0 34 L3.5 34 L0 30 Z M34 34 L30.5 34 L34 30 Z" fill="${warna}"/></g></pattern>`
  return ''
}

// ───────────────────────── rambut ─────────────────────────
function rambutBelakang(r, hw, ink) {
  const g = r.gaya, c = r.warna
  if (g === 'panjang') return `<path d="M ${CX - hw - 34} 636 C ${CX - hw - 52} 470 ${CX - hw - 44} 240 ${CX - 30} 164 C ${CX + 40} 152 ${CX + hw + 40} 212 ${CX + hw + 44} 330 C ${CX + hw + 50} 470 ${CX + hw + 46} 560 ${CX + hw + 34} 636 C ${CX + 60} 664 ${CX - 60} 664 ${CX - hw - 34} 636 Z" fill="${c}"${ink}/>`
  if (g === 'bob') return `<path d="M ${CX - hw - 36} 478 C ${CX - hw - 50} 380 ${CX - hw - 40} 222 ${CX - 20} 162 C ${CX + 60} 152 ${CX + hw + 44} 216 ${CX + hw + 40} 340 C ${CX + hw + 38} 420 ${CX + hw + 40} 462 ${CX + hw + 30} 484 C ${CX + 70} 510 ${CX - 70} 510 ${CX - hw - 36} 478 Z" fill="${c}"${ink}/>`
  if (g === 'hijab') return ''
  return `<path d="M ${CX - hw - 10} 352 C ${CX - hw - 20} 226 ${CX - 70} 152 ${CX} 152 C ${CX + 76} 152 ${CX + hw + 20} 226 ${CX + hw + 10} 352 Z" fill="${c}"${ink}/>`
}

function rambutDepan(r, hw, ink) {
  const g = r.gaya, c = r.warna, hl = tint(c, 0.22)
  const garis = (d, w, o) => `<path d="${d}" fill="none" stroke="${hl}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`
  if (g === 'belah') return `<g>
    <path d="M ${CX - hw - 6} 326 C ${CX - hw - 14} 236 ${CX - 66} 150 ${CX + 6} 148 C ${CX + 86} 146 ${CX + hw + 18} 210 ${CX + hw + 8} 324 C ${CX + hw - 2} 292 ${CX + hw - 10} 268 ${CX + 72} 250 C ${CX + 34} 236 ${CX - 8} 236 ${CX - 34} 222 C ${CX - 48} 246 ${CX - 70} 262 ${CX - hw + 4} 280 C ${CX - hw - 2} 294 ${CX - hw - 4} 310 ${CX - hw - 6} 326 Z" fill="${c}"${ink}/>
    ${garis(`M ${CX - 34} 222 C ${CX + 10} 186 ${CX + 70} 182 ${CX + hw} 236`, 5, 0.55)}
    ${garis(`M ${CX - 20} 200 C ${CX + 20} 176 ${CX + 64} 172 ${CX + 90} 196`, 3.5, 0.4)}
    ${garis(`M ${CX - 40} 214 C ${CX - 60} 190 ${CX - 80} 196 ${CX - hw + 2} 240`, 3.5, 0.35)}</g>`
  if (g === 'jambul') return `<g>
    <path d="M ${CX - hw - 2} 330 C ${CX - hw - 6} 280 ${CX - hw - 2} 238 ${CX - hw + 18} 214 C ${CX - 66} 156 ${CX - 8} 124 ${CX + 52} 130 C ${CX + 106} 138 ${CX + hw + 14} 182 ${CX + hw + 8} 252 C ${CX + hw + 6} 290 ${CX + hw + 4} 312 ${CX + hw + 2} 330 C ${CX + hw - 8} 298 ${CX + hw - 14} 272 ${CX + 70} 254 C ${CX + 32} 240 ${CX - 18} 238 ${CX - 56} 250 C ${CX - hw + 12} 262 ${CX - hw + 2} 292 ${CX - hw - 2} 330 Z" fill="${c}"${ink}/>
    ${garis(`M ${CX - 56} 214 C ${CX - 24} 160 ${CX + 40} 146 ${CX + 92} 176`, 6, 0.5)}
    ${garis(`M ${CX - 34} 232 C ${CX} 186 ${CX + 56} 178 ${CX + hw - 4} 210`, 4, 0.35)}
    ${garis(`M ${CX - hw + 6} 300 C ${CX - hw + 4} 270 ${CX - hw + 12} 244 ${CX - 72} 226`, 3, 0.3)}</g>`
  if (g === 'ikal' || g === 'beruban') {
    const base = `<path d="M ${CX - hw - 8} 330 C ${CX - hw - 18} 220 ${CX - 70} 148 ${CX} 148 C ${CX + 72} 148 ${CX + hw + 18} 220 ${CX + hw + 8} 330 C ${CX + hw - 2} 290 ${CX + hw - 12} 262 ${CX + 64} 246 C ${CX + 30} 238 ${CX - 30} 238 ${CX - 64} 246 C ${CX - hw + 12} 262 ${CX - hw + 2} 290 ${CX - hw - 8} 330 Z" fill="${c}"${ink}/>`
    if (g === 'ikal') {
      let s = '', hls = ''
      const pts = []
      for (let i = 0; i <= 16; i++) { const t = Math.PI * (1.04 + (i / 16) * 0.92); pts.push([CX + Math.cos(t) * (hw + 12), 300 + Math.sin(t) * 150]) }
      for (const [x, y] of pts) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22" fill="${c}"${ink}/>`
      for (let i = 0; i < 9; i++) { const x = CX - 70 + i * 17.5, y = 238 + Math.abs(i - 4) * 4; s += `<circle cx="${x}" cy="${y}" r="15" fill="${c}"/>` }
      for (const [x, y] of pts.filter((_, i) => i % 2)) hls += `<path d="M ${(x - 9).toFixed(1)} ${(y - 4).toFixed(1)} a 11 11 0 0 1 16 -6" fill="none" stroke="${hl}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`
      return `<g>${base}${s}<path d="M ${CX - hw + 2} 300 C ${CX - hw} 220 ${CX - 50} 170 ${CX} 170 C ${CX + 50} 170 ${CX + hw} 220 ${CX + hw - 2} 300 L ${CX + 60} 246 L ${CX - 60} 246 Z" fill="${c}"/>${hls}</g>`
    }
    // beruban: pendek rapi, uban lembut di pelipis dan beberapa helai di atas
    const u = r.uban
    const helai = [-1, 1].map((d) => `<ellipse cx="${CX + d * (hw + 1)}" cy="290" rx="6" ry="26" fill="${u}" opacity=".28" filter="url(#lembut3)"/>` +
      [0, 1, 2].map((i) => `<path d="M ${CX + d * (hw + 6 - i * 3)} ${264 + i * 14} q ${-d * 4} 10 ${-d * 2} 20" fill="none" stroke="${u}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`).join('')).join('')
    const atas = [[-56, 196, 28], [-18, 184, 30], [22, 184, 28], [56, 196, 24]].map(([dx, y, l]) => `<path d="M ${CX + dx} ${y} q ${l / 2} -8 ${l} -3" fill="none" stroke="${u}" stroke-width="2.2" stroke-linecap="round" opacity=".45"/>`).join('')
    return `<g>${base}${helai}${atas}</g>`
  }
  if (g === 'panjang') return `<g>
    <path d="M ${CX - 4} 170 C ${CX - 70} 172 ${CX - hw - 14} 236 ${CX - hw - 10} 330 C ${CX - hw - 8} 400 ${CX - hw + 2} 452 ${CX - hw + 14} 492 C ${CX - hw - 10} 470 ${CX - hw - 24} 420 ${CX - hw - 26} 360 C ${CX - hw - 24} 300 ${CX - hw - 6} 250 ${CX - 70} 224 C ${CX - 40} 212 ${CX - 16} 208 ${CX - 4} 170 Z" fill="${c}"${ink}/>
    <path d="M ${CX - 4} 170 C ${CX + 76} 168 ${CX + hw + 16} 236 ${CX + hw + 12} 330 C ${CX + hw + 10} 400 ${CX + hw - 2} 452 ${CX + hw - 14} 492 C ${CX + hw + 12} 470 ${CX + hw + 26} 420 ${CX + hw + 28} 360 C ${CX + hw + 26} 300 ${CX + hw + 8} 250 ${CX + 70} 224 C ${CX + 34} 212 ${CX + 6} 206 ${CX - 4} 170 Z" fill="${c}"${ink}/>
    <path d="M ${CX - 4} 174 C ${CX - 30} 198 ${CX - 64} 210 ${CX - hw + 4} 238 C ${CX - hw + 30} 216 ${CX - 30} 202 ${CX - 4} 174 Z" fill="${c}"/>
    <path d="M ${CX - 4} 174 C ${CX + 34} 196 ${CX + 72} 208 ${CX + hw - 2} 238 C ${CX + hw - 24} 214 ${CX + 30} 200 ${CX - 4} 174 Z" fill="${c}"/>
    ${garis(`M ${CX - 12} 182 C ${CX - 60} 198 ${CX - hw - 6} 252 ${CX - hw - 16} 342`, 4, 0.45)}
    ${garis(`M ${CX + 8} 182 C ${CX + 56} 198 ${CX + hw + 8} 252 ${CX + hw + 18} 342`, 3, 0.35)}</g>`
  if (g === 'bob') return `<g>
    <path d="M ${CX - hw - 12} 466 C ${CX - hw - 22} 400 ${CX - hw - 18} 300 ${CX - hw + 6} 240 C ${CX - 60} 178 ${CX + 30} 158 ${CX + 92} 188 C ${CX + hw + 30} 224 ${CX + hw + 22} 300 ${CX + hw + 20} 380 C ${CX + hw + 18} 430 ${CX + hw + 14} 456 ${CX + hw + 4} 472 C ${CX + hw - 10} 420 ${CX + hw - 4} 330 ${CX + hw - 18} 272 C ${CX + 50} 248 ${CX - 10} 228 ${CX - 52} 216 C ${CX - 70} 242 ${CX - hw + 4} 282 ${CX - hw - 2} 340 C ${CX - hw - 4} 390 ${CX - hw} 436 ${CX - hw - 12} 466 Z" fill="${c}"${ink}/>
    ${garis(`M ${CX - 52} 216 C ${CX} 188 ${CX + 60} 192 ${CX + hw + 4} 252`, 5, 0.5)}
    ${garis(`M ${CX - 70} 224 C ${CX - hw} 262 ${CX - hw - 14} 330 ${CX - hw - 10} 420`, 3.5, 0.35)}</g>`
  if (g === 'kuncir') return `<g>
    <path d="M ${CX - hw - 4} 320 C ${CX - hw - 10} 238 ${CX - 64} 164 ${CX + 2} 164 C ${CX + 70} 164 ${CX + hw + 10} 238 ${CX + hw + 4} 320 C ${CX + hw - 6} 282 ${CX + hw - 18} 256 ${CX + 64} 240 C ${CX + 34} 230 ${CX + 14} 228 ${CX + 2} 214 C ${CX - 12} 228 ${CX - 34} 230 ${CX - 64} 240 C ${CX - hw + 18} 256 ${CX - hw + 6} 282 ${CX - hw - 4} 320 Z" fill="${c}"${ink}/>
    ${garis(`M ${CX + 2} 216 C ${CX + 40} 192 ${CX + 80} 198 ${CX + hw} 252`, 4, 0.45)}
    ${garis(`M ${CX + 2} 216 C ${CX - 36} 192 ${CX - 76} 198 ${CX - hw} 252`, 4, 0.45)}</g>`
  return ''
}

// kuncir rendah yang jatuh di depan bahu kanan (digambar di atas baju)
function kuncirDepan(r, ink) {
  if (r.gaya !== 'kuncir') return ''
  const c = r.warna, hl = tint(c, 0.22)
  return `<g><path d="M ${CX + 96} 330 C ${CX + 128} 380 ${CX + 128} 452 ${CX + 118} 520 C ${CX + 110} 580 ${CX + 128} 640 ${CX + 150} 690 C ${CX + 120} 676 ${CX + 92} 640 ${CX + 88} 590 C ${CX + 84} 530 ${CX + 104} 470 ${CX + 92} 400 Z" fill="${c}"${ink}/>
    <path d="M ${CX + 106} 380 C ${CX + 118} 450 ${CX + 104} 540 ${CX + 122} 640" fill="none" stroke="${hl}" stroke-width="3.5" stroke-linecap="round" opacity=".45"/>
    <rect x="${CX + 96}" y="392" width="26" height="12" rx="6" fill="#c9a24e" transform="rotate(14 ${CX + 109} 398)"/></g>`
}

// ───────────────────────── hijab ─────────────────────────
function hijab(r, hw, ink) {
  const c = r.warna, d = r.dalam || tint(c, 0.6)
  const luar = `M ${CX} 150 C ${CX + 116} 150 ${CX + hw + 46} 232 ${CX + hw + 42} 336 C ${CX + hw + 40} 420 ${CX + hw + 22} 470 ${CX + hw + 40} 520 C ${CX + hw + 70} 560 ${CX + 200} 576 ${CX + 230} 624 C ${CX + 250} 660 ${CX + 236} 720 ${CX + 196} 760 C ${CX + 150} 800 ${CX + 60} 812 ${CX} 812 C ${CX - 60} 812 ${CX - 150} 800 ${CX - 196} 760 C ${CX - 236} 720 ${CX - 250} 660 ${CX - 230} 624 C ${CX - 200} 576 ${CX - hw - 70} 560 ${CX - hw - 40} 520 C ${CX - hw - 22} 470 ${CX - hw - 40} 420 ${CX - hw - 42} 336 C ${CX - hw - 46} 232 ${CX - 116} 150 ${CX} 150 Z`
  const lubang = `M ${CX} 226 C ${CX + 72} 226 ${CX + hw - 4} 286 ${CX + hw - 4} 348 C ${CX + hw - 4} 414 ${CX + 64} 466 ${CX} 476 C ${CX - 64} 466 ${CX - hw + 4} 414 ${CX - hw + 4} 348 C ${CX - hw + 4} 286 ${CX - 72} 226 ${CX} 226 Z`
  const ciput = `M ${CX - hw + 4} 300 C ${CX - hw + 12} 248 ${CX - 60} 220 ${CX} 220 C ${CX + 60} 220 ${CX + hw - 12} 248 ${CX + hw - 4} 300 C ${CX + hw - 16} 262 ${CX + 60} 236 ${CX} 236 C ${CX - 60} 236 ${CX - hw + 16} 262 ${CX - hw + 4} 300 Z`
  const sd = shade(c, 0.18), hl = tint(c, 0.25)
  const lip = (dd, w, o) => `<path d="${dd}" fill="none" stroke="${sd}" stroke-width="${w}" stroke-linecap="round" opacity="${o}"/>`
  return `<g>
    <path d="${luar} ${lubang}" fill-rule="evenodd" fill="${c}"${ink}/>
    <path d="${ciput}" fill="${d}"/>
    ${lip(`M ${CX - hw - 20} 470 C ${CX - 70} 536 ${CX + 40} 556 ${CX + 150} 596`, 5, 0.55)}
    ${lip(`M ${CX - hw - 10} 516 C ${CX - 40} 596 ${CX + 60} 636 ${CX + 190} 646`, 4, 0.45)}
    ${lip(`M ${CX - 180} 646 C ${CX - 100} 716 ${CX + 20} 736 ${CX + 150} 736`, 4, 0.4)}
    ${lip(`M ${CX + hw + 10} 300 C ${CX + hw + 22} 360 ${CX + hw + 10} 430 ${CX + hw + 4} 480`, 5, 0.4)}
    <path d="M ${CX - 70} 172 C ${CX - 20} 160 ${CX + 40} 162 ${CX + 90} 184" fill="none" stroke="${hl}" stroke-width="6" stroke-linecap="round" opacity=".55"/></g>`
}

// ───────────────────────── baju ─────────────────────────
function baju(b, kulit, motifId, ink) {
  const isi = b.motif ? `url(#${motifId})` : b.warna
  const sd = shade(b.warna, b.warna === '#ffffff' ? 0.12 : 0.22)
  const kerah = b.aksen || (b.motif ? b.warna : shade(b.warna, 0.06))
  const lipat = `<path d="M ${CX - 220} 586 C ${CX - 198} 650 ${CX - 194} 724 ${CX - 198} 800" fill="none" stroke="${sd}" stroke-width="4" opacity=".35"/>
      <path d="M ${CX + 220} 586 C ${CX + 198} 650 ${CX + 194} 724 ${CX + 198} 800" fill="none" stroke="${sd}" stroke-width="4" opacity=".35"/>`
  if (b.jenis === 'kemeja' || b.jenis === 'polo') {
    const polo = b.jenis === 'polo'
    const kancing = polo ? [604, 642] : [622, 682, 742]
    return `<g>
      <path d="${BAHU}" fill="${isi}"${ink}/>
      <path d="M ${CX - 50} 524 L ${CX} ${polo ? 590 : 606} L ${CX + 50} 524 Z" fill="${kulit}"/>
      <path d="M ${CX - 60} 522 C ${CX - 52} 548 ${CX - 32} 588 ${CX - 4} ${polo ? 598 : 616} L ${CX - 56} 630 C ${CX - 80} 600 ${CX - 94} 570 ${CX - 94} 548 Z" fill="${kerah}"${ink}/>
      <path d="M ${CX + 60} 522 C ${CX + 52} 548 ${CX + 32} 588 ${CX + 4} ${polo ? 598 : 616} L ${CX + 56} 630 C ${CX + 80} 600 ${CX + 94} 570 ${CX + 94} 548 Z" fill="${kerah}"${ink}/>
      <path d="M ${CX} ${polo ? 596 : 614} L ${CX} ${polo ? 668 : 800}" stroke="${sd}" stroke-width="3" opacity=".55"/>
      ${kancing.map((y) => `<circle cx="${CX + 8}" cy="${y}" r="5" fill="${tint(b.warna, 0.5)}" stroke="${sd}" stroke-width="1.5"/>`).join('')}
      ${b.jenis === 'kemeja' && !b.motif ? `<path d="M ${CX - 150} 650 L ${CX - 92} 650 L ${CX - 92} 712 C ${CX - 110} 720 ${CX - 132} 720 ${CX - 150} 712 Z" fill="none" stroke="${sd}" stroke-width="3" opacity=".45"/>` : ''}
      ${lipat}</g>`
  }
  if (b.jenis === 'kemeja-mandarin') return `<g>
      <path d="${BAHU}" fill="${isi}"${ink}/>
      <path d="M ${CX - 52} 528 C ${CX - 30} 548 ${CX + 30} 548 ${CX + 52} 528 L ${CX + 58} 552 C ${CX + 30} 574 ${CX - 30} 574 ${CX - 58} 552 Z" fill="${b.warna}"/>
      <path d="M ${CX - 58} 552 C ${CX - 30} 574 ${CX + 30} 574 ${CX + 58} 552" fill="none" stroke="${tint(b.warna, 0.3)}" stroke-width="2" opacity=".8"/>
      <path d="M ${CX} 568 L ${CX} 800" stroke="${tint(b.warna, 0.25)}" stroke-width="3" opacity=".6"/>
      ${[612, 672, 732].map((y) => `<circle cx="${CX + 8}" cy="${y}" r="5" fill="${tint(b.warna, 0.35)}"/>`).join('')}</g>`
  if (b.jenis === 'blazer') return `<g>
      <path d="${BAHU}" fill="${b.warna}"${ink}/>
      <path d="M ${CX - 56} 536 C ${CX - 30} 590 ${CX - 10} 650 ${CX} 752 C ${CX + 10} 650 ${CX + 30} 590 ${CX + 56} 536 C ${CX + 20} 562 ${CX - 20} 562 ${CX - 56} 536 Z" fill="${b.dalam}"${ink}/>
      <path d="M ${CX - 50} 522 L ${CX + 50} 522 C ${CX + 30} 572 ${CX - 30} 572 ${CX - 50} 522 Z" fill="${kulit}"/>
      <path d="M ${CX - 60} 530 C ${CX - 74} 590 ${CX - 60} 650 ${CX - 6} 762 L ${CX - 40} 692 L ${CX - 96} 632 L ${CX - 78} 598 L ${CX - 108} 566 C ${CX - 94} 550 ${CX - 76} 538 ${CX - 60} 530 Z" fill="${tint(b.warna, 0.1)}"${ink}/>
      <path d="M ${CX + 60} 530 C ${CX + 74} 590 ${CX + 60} 650 ${CX + 6} 762 L ${CX + 40} 692 L ${CX + 96} 632 L ${CX + 78} 598 L ${CX + 108} 566 C ${CX + 94} 550 ${CX + 76} 538 ${CX + 60} 530 Z" fill="${tint(b.warna, 0.1)}"${ink}/>
      <path d="M ${CX - 96} 632 L ${CX - 40} 692 M ${CX + 96} 632 L ${CX + 40} 692" stroke="${shade(b.warna, 0.4)}" stroke-width="3" opacity=".6"/></g>`
  // blus berleher bulat
  return `<g>
      <path d="${BAHU}" fill="${isi}"${ink}/>
      <path d="M ${CX - 66} 530 C ${CX - 40} 586 ${CX + 40} 586 ${CX + 66} 530 C ${CX + 30} 546 ${CX - 30} 546 ${CX - 66} 530 Z" fill="${kulit}"/>
      <path d="M ${CX - 70} 528 C ${CX - 40} 592 ${CX + 40} 592 ${CX + 70} 528" fill="none" stroke="${b.motif ? b.motifWarna : sd}" stroke-width="7" stroke-linecap="round"/>
      ${lipat}</g>`
}

// ───────────────────────── wajah & fitur ─────────────────────────
function fitur(t, hw, varian) {
  const kulit = t.kulit, gelap = '#2a1c15'
  const alisWarna = t.rambut.gaya === 'hijab' ? '#3a2a20' : t.rambut.warna
  const ex = 42 * Math.min(1.04, t.lebar || 1), s = t.senyum ?? 0.8, aw = t.alis || 7
  const bibir = mix(shade(kulit, 0.25), '#b5484a', 0.35)
  const mt = t.mata || 1
  // bentuk mata per gaya: guas (almon + kilau), vektor (titik), chiaroscuro (almon + kelopak), tinta (garis + iris)
  const mata = (x) => {
    if (varian === 'homigo') return `<ellipse cx="${x}" cy="${EY}" rx="8.5" ry="${(9.5 * mt).toFixed(1)}" fill="${gelap}"/><circle cx="${x - 2.5}" cy="${EY - 3}" r="2.6" fill="#fff" opacity=".9"/>`
    if (varian === 'propertia') return `<path d="M ${x - 18} ${EY} C ${x - 10} ${EY - 11 * mt} ${x + 10} ${EY - 11 * mt} ${x + 18} ${EY} C ${x + 10} ${EY + 7 * mt} ${x - 10} ${EY + 7 * mt} ${x - 18} ${EY} Z" fill="#fbf7ee" stroke="${t.tinta}" stroke-width="2.6"/>
      <circle cx="${x + 1}" cy="${EY - 1}" r="${(6.5 * Math.min(mt, 1.1)).toFixed(1)}" fill="${gelap}"/><circle cx="${x - 1.5}" cy="${EY - 3}" r="1.8" fill="#fff"/>`
    const tinggi = varian === 'lumora' ? 9.5 * mt : 10 * mt
    return `<path d="M ${x - 17} ${EY} C ${x - 10} ${EY - tinggi} ${x + 10} ${EY - tinggi} ${x + 17} ${EY} C ${x + 10} ${EY + 0.6 * tinggi} ${x - 10} ${EY + 0.6 * tinggi} ${x - 17} ${EY} Z" fill="${gelap}"/>
    <circle cx="${x - 4}" cy="${EY - 3}" r="${varian === 'lumora' ? 2.4 : 3.2}" fill="#fff" opacity="${varian === 'lumora' ? 0.7 : 0.85}"/>
    <path d="M ${x - 20} ${EY - 2} C ${x - 10} ${EY - tinggi - 3} ${x + 10} ${EY - tinggi - 3} ${x + 20} ${EY - 3}" fill="none" stroke="${gelap}" stroke-width="3" stroke-linecap="round"/>
    ${varian === 'lumora' ? `<path d="M ${x - 15} ${EY - tinggi - 9} C ${x - 6} ${EY - tinggi - 14} ${x + 8} ${EY - tinggi - 14} ${x + 16} ${EY - tinggi - 8}" fill="none" stroke="${shade(kulit, 0.3)}" stroke-width="2" stroke-linecap="round" opacity=".7"/>` : ''}`
  }
  const al = (x, d) => `<path d="M ${x - 22 * d} ${EY - 26} C ${x - 8 * d} ${EY - 36} ${x + 10 * d} ${EY - 36} ${x + 24 * d} ${EY - 28}" fill="none" stroke="${alisWarna}" stroke-width="${aw}" stroke-linecap="round"/>`
  const MY = 424
  const mulut = `<path d="M ${CX - 28} ${MY} C ${CX - 14} ${MY + 12 * s} ${CX + 14} ${MY + 12 * s} ${CX + 28} ${MY} C ${CX + 16} ${MY + 8 + 14 * s} ${CX - 16} ${MY + 8 + 14 * s} ${CX - 28} ${MY} Z" fill="${bibir}"/>
    <path d="M ${CX - 30} ${MY - 1} C ${CX - 14} ${MY + 1 + 12 * s} ${CX + 14} ${MY + 1 + 12 * s} ${CX + 30} ${MY - 1}" fill="none" stroke="${shade(bibir, 0.35)}" stroke-width="3" stroke-linecap="round"/>
    <path d="M ${CX - 34} ${MY - 4} C ${CX - 31} ${MY - 2} ${CX - 30} ${MY} ${CX - 30} ${MY + 3} M ${CX + 34} ${MY - 4} C ${CX + 31} ${MY - 2} ${CX + 30} ${MY} ${CX + 30} ${MY + 3}" stroke="${shade(kulit, 0.25)}" stroke-width="2.5" stroke-linecap="round" fill="none" opacity=".6"/>`
  const hidung = `<path d="M ${CX + 6} 354 C ${CX + 12} 378 ${CX + 18} 390 ${CX + 10} 398 C ${CX + 4} 402 ${CX - 6} 402 ${CX - 12} 397" fill="none" stroke="${shade(kulit, 0.26)}" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="${CX - 2}" cy="390" rx="16" ry="9" fill="${shade(kulit, 0.12)}" opacity=".35"/>`
  const pipi = `<circle cx="${CX - 58}" cy="388" r="26" fill="url(#pipi)"/><circle cx="${CX + 58}" cy="388" r="26" fill="url(#pipi)"/>` +
    (t.usia ? `<g fill="none" stroke="${shade(kulit, 0.3)}" stroke-width="2.6" stroke-linecap="round" opacity=".55"><path d="M ${CX - 40} 394 C ${CX - 46} 408 ${CX - 44} 420 ${CX - 38} 430"/><path d="M ${CX + 40} 394 C ${CX + 46} 408 ${CX + 44} 420 ${CX + 38} 430"/><path d="M ${CX - 62} ${EY + 12} q 9 5 18 1"/><path d="M ${CX + 62} ${EY + 12} q -9 5 -18 1"/></g>` : '')
  let kacamata = ''
  if (t.kacamata) {
    const k = t.kacamata
    kacamata = `<g fill="none" stroke="${k}" stroke-width="5"><rect x="${CX - ex - 30}" y="${EY - 24}" width="60" height="44" rx="16"/><rect x="${CX + ex - 30}" y="${EY - 24}" width="60" height="44" rx="16"/>
      <path d="M ${CX - 12} ${EY - 8} C ${CX - 4} ${EY - 14} ${CX + 4} ${EY - 14} ${CX + 12} ${EY - 8}"/><path d="M ${CX - ex - 30} ${EY - 10} L ${CX - hw + 2} ${EY - 16} M ${CX + ex + 30} ${EY - 10} L ${CX + hw - 2} ${EY - 16}"/></g>
      <path d="M ${CX - ex - 22} ${EY - 16} L ${CX - ex - 8} ${EY - 20}" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>`
  }
  let janggut = ''
  if (t.janggut) {
    const jc = t.rambut.warna
    janggut = `<path d="M ${CX - hw + 4} 356 C ${CX - hw + 6} 416 ${CX - 50} 460 ${CX} 470 C ${CX + 50} 460 ${CX + hw - 6} 416 ${CX + hw - 4} 356 C ${CX + hw - 18} 404 ${CX + 60} 438 ${CX + 34} 444 C ${CX + 30} 430 ${CX + 18} 424 ${CX} 426 C ${CX - 18} 424 ${CX - 30} 430 ${CX - 34} 444 C ${CX - 60} 438 ${CX - hw + 18} 404 ${CX - hw + 4} 356 Z" fill="${jc}" opacity=".88"/>
      <path d="M ${CX - 32} 414 C ${CX - 16} 404 ${CX + 16} 404 ${CX + 32} 414 C ${CX + 20} 410 ${CX - 20} 410 ${CX - 32} 414 Z" fill="${jc}" stroke="${jc}" stroke-width="6" stroke-linejoin="round"/>`
  }
  let anting = ''
  if (t.anting && t.rambut.gaya !== 'hijab') anting = `<circle cx="${CX - hw - 2}" cy="388" r="6" fill="${t.anting}"/><circle cx="${CX + hw + 2}" cy="388" r="6" fill="${t.anting}"/>`
  return { mata: mata(CX - ex) + mata(CX + ex), alis: al(CX - ex, 1) + al(CX + ex, -1), mulut, hidung, pipi, kacamata, janggut, anting }
}

// ───────────────────────── latar ─────────────────────────
function latarDefs(varian, G) {
  if (varian === 'homigo') return `<radialGradient id="lingkar" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stop-color="#5b8def"/><stop offset="1" stop-color="${G.bentuk}"/></radialGradient>`
  if (varian === 'lumora') return `<radialGradient id="pendar" cx="0.42" cy="0.36" r="0.62"><stop offset="0" stop-color="#3a2d18"/><stop offset="0.55" stop-color="#1b150c"/><stop offset="1" stop-color="#0d0b07"/></radialGradient>
    <filter id="lembut2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>`
  if (varian === 'propertia') return `<pattern id="arsir" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><path d="M0 4.5 L9 4.5" stroke="${G.tinta}" stroke-width="1.6"/></pattern>`
  return `<radialGradient id="matahari" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#e9b46a"/><stop offset="1" stop-color="#d9964a"/></radialGradient>`
}
function latarSVG(varian, G) {
  if (varian === 'beranda') return `<rect width="${W}" height="${H}" fill="${G.latar}"/>
    <path d="M 104 800 L 104 330 C 104 190 200 100 320 100 C 440 100 536 190 536 330 L 536 800 Z" fill="${G.bentuk}"/>
    <circle cx="474" cy="156" r="54" fill="url(#matahari)"/>
    <path d="M 60 700 C 120 640 150 600 190 560 M 70 760 C 130 700 170 666 210 640" stroke="${G.aksen}" stroke-width="10" stroke-linecap="round" fill="none" opacity=".9"/>
    <ellipse cx="150" cy="590" rx="22" ry="11" transform="rotate(-40 150 590)" fill="${G.aksen}"/><ellipse cx="118" cy="640" rx="22" ry="11" transform="rotate(-40 118 640)" fill="${G.aksen}"/>`
  if (varian === 'homigo') return `<rect width="${W}" height="${H}" fill="${G.latar}"/>
    <circle cx="320" cy="400" r="292" fill="url(#lingkar)"/>
    <circle cx="320" cy="400" r="292" fill="none" stroke="#ffffff" stroke-width="10" opacity=".9"/>
    <path d="M 70 214 A 292 292 0 0 1 206 130" stroke="#ffffff" stroke-width="16" stroke-linecap="round" fill="none" opacity=".3"/>`
  if (varian === 'lumora') return `<rect width="${W}" height="${H}" fill="url(#pendar)"/>
    <path d="M 112 800 L 112 300 C 112 172 204 84 320 84 C 436 84 528 172 528 300 L 528 800" fill="none" stroke="${G.aksen}" stroke-width="2" opacity=".75"/>
    <path d="M 132 800 L 132 304 C 132 186 216 104 320 104 C 424 104 508 186 508 304 L 508 800" fill="none" stroke="${G.aksen}" stroke-width="1" opacity=".35"/>`
  return `<rect width="${W}" height="${H}" fill="${G.latar}"/>
    <path d="M 104 800 L 104 320 C 104 190 200 100 320 100 C 440 100 536 190 536 320 L 536 800 Z" fill="${G.aksen2}" stroke="${G.tinta}" stroke-width="3"/>
    <path d="M 122 800 L 122 324 C 122 204 210 120 320 120 C 430 120 518 204 518 324 L 518 800" fill="none" stroke="${G.aksen}" stroke-width="1.6" opacity=".9"/>`
}
// arsiran tinta (propertia) di sisi bayangan
const arsir = (G, d, klip) => (G.tinta ? `<path d="${d}" fill="url(#arsir)" opacity=".5" clip-path="url(#${klip})"/>` : '')

// ───────────────────────── perakitan ─────────────────────────
export function potretSVG(varian, t) {
  const G = GAYA[varian]
  const hw = 98 * (t.lebar || 1)
  const kulit = t.kulit, kulitGelap = shade(kulit, 0.2)
  const ink = G.tinta ? ` stroke="${G.tinta}" stroke-width="3.2" stroke-linejoin="round"` : ''
  const f = fitur({ ...t, tinta: G.tinta }, hw, varian)
  const motifId = `motif-${t.kunci}`
  const WAJAH = wajahD(hw)
  const lum = varian === 'lumora'
  const hj = t.rambut.gaya === 'hijab'
  const defs = `<defs>
    <filter id="ikat" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="0.8"/></filter>
    ${t.baju.motif ? motif(motifId, t.baju.motif, t.baju.warna, t.baju.motifWarna) : ''}
    <radialGradient id="pipi"><stop offset="0" stop-color="#e0786a" stop-opacity="${lum ? 0.16 : 0.3}"/><stop offset="1" stop-color="#e0786a" stop-opacity="0"/></radialGradient>
    <linearGradient id="bayangWajah" x1="0" y1="0" x2="1" y2="0"><stop offset="0.42" stop-color="${G.bayang}" stop-opacity="0"/><stop offset="1" stop-color="${G.bayang}" stop-opacity="${G.bayangO}"/></linearGradient>
    <linearGradient id="bayangBadan" x1="0" y1="0" x2="1" y2="0"><stop offset="0.5" stop-color="${G.bayang}" stop-opacity="0"/><stop offset="1" stop-color="${G.bayang}" stop-opacity="${G.bayangO * 0.85}"/></linearGradient>
    <radialGradient id="cahaya" cx="0.3" cy="0.28" r="0.75"><stop offset="0" stop-color="${lum ? G.aksen : '#ffffff'}" stop-opacity="${lum ? 0.16 : 0.18}"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>
    <clipPath id="klipWajah"><path d="${WAJAH}"/></clipPath>
    <clipPath id="klipLeher"><path d="${LEHER}"/></clipPath>
    <clipPath id="klipBadan"><path d="${BAHU}"/></clipPath>
    <clipPath id="klipArsirW"><path d="M ${CX + 40} ${TOP} L ${CX + hw + 20} ${TOP} L ${CX + hw + 20} ${CHIN} L ${CX + 10} ${CHIN} C ${CX + 70} 420 ${CX + 86} 330 ${CX + 40} ${TOP} Z"/></clipPath>
    <clipPath id="klipArsirB"><path d="M ${CX + 150} 540 L ${CX + 300} 540 L ${CX + 300} 800 L ${CX + 170} 800 C ${CX + 190} 700 ${CX + 180} 620 ${CX + 150} 540 Z"/></clipPath>
    <filter id="lembut" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="10"/></filter>
    <filter id="lembut3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter>
    <filter id="butir" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${t.kunci.length * 7}" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.1" result="a"/>
      <feComposite in="a" in2="SourceGraphic" operator="in"/>
    </filter>
    ${latarDefs(varian, G)}
  </defs>`
  const telinga = hj ? '' : `<g fill="${kulit}"${ink}><ellipse cx="${CX - hw - 4}" cy="354" rx="16" ry="30"/><ellipse cx="${CX + hw + 4}" cy="354" rx="16" ry="30"/></g>
    <g fill="none" stroke="${kulitGelap}" stroke-width="3" opacity=".6"><path d="M ${CX - hw - 2} 338 C ${CX - hw - 12} 342 ${CX - hw - 12} 364 ${CX - hw - 2} 370"/><path d="M ${CX + hw + 2} 338 C ${CX + hw + 12} 342 ${CX + hw + 12} 364 ${CX + hw + 2} 370"/></g>`
  const leher = `<path d="${LEHER}" fill="${kulit}"${ink}/><g clip-path="url(#klipLeher)"><ellipse cx="${CX}" cy="428" rx="80" ry="46" fill="${kulitGelap}" opacity=".55" filter="url(#lembut)"/><rect x="${CX - 60}" y="400" width="120" height="180" fill="url(#bayangBadan)"/></g>`
  const badan = `${baju(t.baju, kulit, motifId, ink)}<rect x="${CX - 300}" y="520" width="600" height="280" fill="url(#bayangBadan)" clip-path="url(#klipBadan)"/>${arsir(G, BAHU, 'klipArsirB')}`
  const wajah = `<path d="${WAJAH}" fill="${kulit}"${ink}/>
    <g clip-path="url(#klipWajah)">
      <rect x="${CX - hw}" y="${TOP}" width="${hw * 2}" height="${CHIN - TOP}" fill="url(#bayangWajah)"/>
      <rect x="${CX - hw}" y="${TOP}" width="${hw * 2}" height="${CHIN - TOP}" fill="url(#cahaya)"/>
      <ellipse cx="${CX}" cy="${hj ? 232 : 252}" rx="${hw + 10}" ry="26" fill="${kulitGelap}" opacity=".35" filter="url(#lembut)"/>
    </g>${arsir(G, WAJAH, 'klipArsirW')}`
  const rim = lum ? `<g fill="none" stroke="${G.aksen}" stroke-linecap="round" filter="url(#lembut2)" opacity=".8">
      <path d="M ${CX - hw + 3} 262 C ${CX - hw - 1} 312 ${CX - hw + 1} 386 ${CX - hw * 0.6} 448" stroke-width="4.5"/>
      <path d="M ${CX - 222} 588 C ${CX - 264} 616 ${CX - 284} 690 ${CX - 292} 800" stroke-width="4.5"/></g>` : ''
  const butir = G.butir ? `<rect width="${W}" height="${H}" fill="${lum ? '#000' : '#3b2a1c'}" filter="url(#butir)" opacity="${G.butir}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${defs}
  ${latarSVG(varian, G)}
  ${rambutBelakang(t.rambut, hw, ink)}
  ${leher}
  ${badan}
  ${kuncirDepan(t.rambut, ink)}
  ${telinga}
  ${wajah}
  ${f.pipi}${f.janggut}${f.hidung}${f.mulut}${f.mata}${f.alis}
  ${hj ? hijab(t.rambut, hw, ink) : rambutDepan(t.rambut, hw, ink)}
  ${f.kacamata}${f.anting}
  ${rim}
  ${butir}
</svg>`
}

// ───────────────────────── CLI ─────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const varian = process.argv[2]
  if (!TOKOH[varian]) { console.error('varian: ' + Object.keys(TOKOH).join(' | ')); process.exit(1) }
  const proj = process.cwd()
  const sharp = createRequire(path.join(proj, 'package.json'))('sharp')
  const svgDir = path.join(proj, 'scripts/ilustrasi/svg'), outDir = path.join(proj, process.argv[3] || 'public/images/agen')
  mkdirSync(svgDir, { recursive: true }); mkdirSync(outDir, { recursive: true })
  for (const t of TOKOH[varian]) {
    const svg = potretSVG(varian, t)
    writeFileSync(path.join(svgDir, `${t.kunci}.svg`), svg)
    const png = await sharp(Buffer.from(svg), { density: 144 }).resize(W * 2, H * 2).png().toBuffer()
    await sharp(png).resize(W, H).webp({ quality: 84, effort: 6 }).toFile(path.join(outDir, `${t.kunci}.webp`))
    await sharp(png).extract({ left: 200, top: 250, width: 880, height: 880 }).resize(320, 320).webp({ quality: 84, effort: 6 }).toFile(path.join(outDir, `${t.kunci}-wajah.webp`))
    console.log('->', path.relative(proj, path.join(outDir, `${t.kunci}.webp`)), '+ -wajah')
  }
}
