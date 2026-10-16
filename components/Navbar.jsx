'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, House } from 'lucide-react';
import { nav } from '@/lib/data';

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (h) => (h === '/' ? pathname === '/' : !!pathname && pathname.startsWith(h));

  // Menu ponsel tertutup saat pindah halaman atau menekan Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const tutup = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', tutup);
    return () => window.removeEventListener('keydown', tutup);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-cream/85 backdrop-blur-xl">
      <nav aria-label="Utama" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 py-1">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-cream"><House size={18} /></span>
          <span className="font-display text-2xl text-forest">Propertia</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex lg:gap-7">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? 'page' : undefined} className={`py-2 text-sm font-medium transition ${active(l.href) ? 'text-forest' : 'text-ink/75 hover:text-forest'}`}>{l.label}</Link>
          ))}
          <Link href="/kontak?topik=jual" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-forest-soft">Ajukan listing</Link>
        </div>

        <button type="button" className="-mr-2 grid h-11 w-11 place-items-center rounded-xl text-forest md:hidden" onClick={() => setOpen((v) => !v)} aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} aria-controls="menu-ponsel">{open ? <X /> : <Menu />}</button>
      </nav>

      {open && (
        <div id="menu-ponsel" className="border-t border-black/5 bg-cream px-4 py-3 md:hidden">
          {nav.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} aria-current={active(l.href) ? 'page' : undefined} className={`block rounded-lg px-3 py-3 text-base font-medium ${active(l.href) ? 'bg-forest/5 text-forest' : 'text-ink/80'}`}>{l.label}</Link>
          ))}
          <Link href="/kontak?topik=jual" onClick={() => setOpen(false)} className="mt-2 block rounded-full bg-forest px-5 py-3 text-center text-sm font-semibold text-cream">Ajukan listing</Link>
        </div>
      )}
    </header>
  );
}
