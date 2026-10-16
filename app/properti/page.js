import PageHeader from '@/components/PageHeader';
import ListingsClient from '@/components/ListingsClient';
import { site, properti } from '@/lib/data';
import { halaman } from '@/lib/seo';

export const metadata = halaman({
  judul: 'Properti dijual & disewakan',
  deskripsi: `${properti.length} listing ${site.name}: saring menurut status, jenis, kota, harga, dan jumlah kamar, lalu urutkan dari yang termurah.`,
  path: '/properti',
});

export default function PropertiPage() {
  return (
    <main>
      <PageHeader kicker="Katalog" title={site.katalog?.judul || 'Jelajahi properti'} subtitle={site.katalog?.sub || 'Saring berdasarkan status, jenis, kota, harga, dan jumlah kamar.'} />
      <ListingsClient />
    </main>
  );
}
