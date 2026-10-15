import "./globals.css";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

const __jsonld = {"@context":"https://schema.org","@type":"RealEstateAgent","name":"Propertia","description":"Marketplace properti yang dikurasi: setiap rumah, apartemen, villa, dan tanah sudah didatangi dan diukur ulang, lengkap dengan kalkulator biaya beli.","url":"https://properti-propertia.pintuweb.id","areaServed":"ID"};

export const metadata = {
  metadataBase: new URL("https://properti-propertia.pintuweb.id"),
  title: { default: "Propertia — Rumah yang dikurasi", template: "%s — Propertia" },
  description: "Marketplace properti yang dikurasi: setiap rumah, apartemen, villa, dan tanah sudah didatangi dan diukur ulang, lengkap dengan kalkulator biaya beli.",
  applicationName: "Propertia",
  keywords: ["rumah dijual", "properti dikurasi", "biaya beli rumah", "BPHTB", "sewa apartemen"],
  authors: [{ name: "Propertia" }],
  creator: "Propertia",
  publisher: "Propertia",
  alternates: { canonical: "https://properti-propertia.pintuweb.id" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://properti-propertia.pintuweb.id",
    siteName: "Propertia",
    title: "Propertia — Rumah yang dikurasi",
    description: "Marketplace properti yang dikurasi: setiap rumah, apartemen, villa, dan tanah sudah didatangi dan diukur ulang, lengkap dengan kalkulator biaya beli.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Propertia — Rumah yang dikurasi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Propertia — Rumah yang dikurasi",
    description: "Marketplace properti yang dikurasi: setiap rumah, apartemen, villa, dan tanah sudah didatangi dan diukur ulang, lengkap dengan kalkulator biaya beli.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body className="antialiased">
        <div className="grain" aria-hidden="true" />
        <Navbar />
        {children}
        <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        <aside aria-label="Tentang situs demo ini" style={{ display: 'block', margin: 0, padding: '12px 16px', background: '#0f1b33', color: '#dfe6f3', font: '400 13px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', textAlign: 'center' }}>
          Situs demo buatan PintuWeb — nama dan isinya rekaan.{' '}
          <a href="https://www.pintuweb.id/kontak?demo=propertia" style={{ color: '#ffffff', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>Buat yang seperti ini →</a>
        </aside>
        </body>
    </html>
  );
}
