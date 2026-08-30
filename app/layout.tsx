import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SolPanel from "@/components/SolPanel";
import SagPanel from "@/components/SagPanel";
import SayfaDuzeni from "@/components/SayfaDuzeni";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Edebiyat bölümünün okuma yazı tipi
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "websitesi", template: "%s | websitesi" },
  description: "Edebiyat üzerine yazılar ve üç küçük tarayıcı oyunu",
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  colorScheme: "dark",
};

/**
 * Her sayfa isteğinde yeniden render edilir.
 *
 * Gerekli, çünkü sol panel kök düzende duruyor ve her sayfada veritabanından
 * duyuru/görsel okuyor. Varsayılan davranışta Next.js bu sayfaları derleme
 * anında dondurur; o zaman admin panelinden eklenen içerik siteye yansımaz,
 * yeni dağıtım yapılana kadar eski hâli görünür.
 *
 * Bedeli: oyun sayfaları da statik servis edilemez. Trafik düşük olduğu için
 * kabul edilebilir; ileride sorun olursa sol panel düzenden çıkarılıp yalnız
 * ilgili sayfalara taşınabilir.
 */
export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${lora.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[#0d1117] text-[#e6edf3] antialiased">
        <a href="#icerik" className="atla-baglantisi">
          İçeriğe atla
        </a>
        <Header />
        {/* Yan paneller sunucuda hazırlanır, gösterim kararı SayfaDuzeni'nde */}
        <SayfaDuzeni sol={<SolPanel />} sag={<SagPanel />}>
          {children}
        </SayfaDuzeni>
        <Footer />
      </body>
    </html>
  );
}
