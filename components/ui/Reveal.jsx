'use client';
import { useEffect, useRef, useState } from 'react';

// Muncul lembut saat digulir, tanpa pustaka animasi.
// Konten selalu terlihat di HTML server; hanya elemen yang masih di bawah layar
// yang disembunyikan setelah halaman dimuat, lalu dimunculkan saat masuk layar.
// Pengunjung dengan "kurangi gerakan" melihat semuanya langsung.
export default function Reveal({ children, delay = 0, y = 24, className = '' }) {
  const ref = useRef(null);
  const [fase, setFase] = useState('diam');

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
    setFase('sembunyi');
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setFase('tampil'); io.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const style = fase === 'sembunyi'
    ? { opacity: 0, transform: `translateY(${y}px)` }
    : fase === 'tampil'
      ? { opacity: 1, transform: 'none', transition: `opacity .6s ease-out ${delay}s, transform .6s ease-out ${delay}s` }
      : undefined;

  return <div ref={ref} className={className} style={style}>{children}</div>;
}
