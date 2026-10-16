import Link from 'next/link';
import { House, Clock, Mail } from 'lucide-react';
import { site, nav, kategori } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-forest px-4 pt-12 pb-8 md:pt-16 text-cream/80 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-cream text-forest"><House size={18} /></span>
              <span className="font-display text-2xl text-cream">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{site.tagline}.</p>
          </div>
          <div>
            <h2 className="font-display text-lg text-cream">Navigasi</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {nav.map((l) => <li key={l.href}><Link href={l.href} className="inline-block py-1 transition hover:text-cream">{l.label}</Link></li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-lg text-cream">Jenis</h2>
            <ul className="mt-3 space-y-1 text-sm">
              {kategori.slice(0, 5).map((k) => <li key={k.jenis}><Link href={`/properti?jenis=${k.jenis}`} className="inline-block py-1 transition hover:text-cream">{k.jenis}</Link></li>)}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-display text-lg text-cream">Kontak</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} className="shrink-0" /> <span className="break-all">{site.email}</span></li>
              <li className="flex items-start gap-2"><Clock size={16} className="mt-0.5 shrink-0" /> {site.jam}</li>
              <li><Link href="/kontak?topik=jual" className="inline-block py-1 underline-offset-4 transition hover:text-cream hover:underline">Ajukan properti untuk dijual</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-cream/15 pt-6 text-center text-sm text-cream/90">
          © {new Date().getFullYear()} {site.name} · Purwarupa desain: listing, konsultan, dan harga adalah contoh. Foto CC0.
        </p>
      </div>
    </footer>
  );
}
