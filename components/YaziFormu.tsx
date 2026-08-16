"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Yazi {
  id: number;
  baslik: string;
  slug: string;
  ozet: string;
  icerik: string;
  kapakGorsel: string | null;
  yayinda: boolean;
}

interface Props {
  mod: "yeni" | "duzenle";
  yazi?: Yazi;
}

// Başlıktan URL-uyumlu slug üretir
function slugOlustur(baslik: string): string {
  return baslik
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function YaziFormu({ mod, yazi }: Props) {
  const router = useRouter();
  const [baslik, setBaslik] = useState(yazi?.baslik ?? "");
  const [slug, setSlug] = useState(yazi?.slug ?? "");
  const [ozet, setOzet] = useState(yazi?.ozet ?? "");
  const [icerik, setIcerik] = useState(yazi?.icerik ?? "");
  const [kapakGorsel, setKapakGorsel] = useState(yazi?.kapakGorsel ?? "");
  const [yayinda, setYayinda] = useState(yazi?.yayinda ?? false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  function baslikDegisti(deger: string) {
    setBaslik(deger);
    if (mod === "yeni") setSlug(slugOlustur(deger));
  }

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");

    const veri = { baslik, slug, ozet, icerik, kapakGorsel: kapakGorsel || null, yayinda };

    try {
      const cevap = await fetch(
        mod === "yeni" ? "/api/posts" : `/api/posts/${yazi!.id}`,
        {
          method: mod === "yeni" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(veri),
        }
      );

      if (!cevap.ok) {
        const j = await cevap.json();
        setHata(j.hata || "Kayıt başarısız.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setHata("Sunucu hatası, tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <form onSubmit={kaydet} className="space-y-5 max-w-2xl">
      {/* Başlık */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">Başlık *</label>
        <input
          type="text"
          className="giris-alani"
          value={baslik}
          onChange={(e) => baslikDegisti(e.target.value)}
          placeholder="Yazı başlığı"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">Slug *</label>
        <input
          type="text"
          className="giris-alani font-mono text-sm"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="url-uyumlu-slug"
          required
        />
        <p className="mt-1 text-xs text-[#8b949e]">URL: /blog/{slug || "slug"}</p>
      </div>

      {/* Özet */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">Özet *</label>
        <textarea
          className="giris-alani resize-none"
          rows={2}
          value={ozet}
          onChange={(e) => setOzet(e.target.value)}
          placeholder="Yazının kısa özeti (liste görünümünde gösterilir)"
          required
        />
      </div>

      {/* İçerik */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">İçerik *</label>
        <textarea
          className="giris-alani resize-y font-mono text-sm"
          rows={12}
          value={icerik}
          onChange={(e) => setIcerik(e.target.value)}
          placeholder="Yazı içeriği (düz metin veya Markdown)"
          required
        />
      </div>

      {/* Kapak görseli */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">Kapak Görseli (URL)</label>
        <input
          type="url"
          className="giris-alani"
          value={kapakGorsel}
          onChange={(e) => setKapakGorsel(e.target.value)}
          placeholder="https://example.com/gorsel.jpg"
        />
      </div>

      {/* Yayın durumu */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="yayinda"
          checked={yayinda}
          onChange={(e) => setYayinda(e.target.checked)}
          className="h-4 w-4 rounded accent-[#58a6ff]"
        />
        <label htmlFor="yayinda" className="text-sm text-[#e6edf3]">
          Yayına al (anasayfada görünsün)
        </label>
      </div>

      {hata && (
        <p className="rounded-lg border border-[#f85149]/30 bg-[#f85149]/10 px-3 py-2 text-sm text-[#f85149]">
          {hata}
        </p>
      )}

      {/* Butonlar */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={yukleniyor} className="dugme-birincil disabled:opacity-50">
          {yukleniyor ? "Kaydediliyor…" : mod === "yeni" ? "Oluştur" : "Güncelle"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard")}
          className="dugme-ikincil"
        >
          İptal
        </button>
      </div>
    </form>
  );
}
