import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
        <main
          id="icerik"
          className="mx-auto w-full max-w-5xl flex-1 px-4 py-8"
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
