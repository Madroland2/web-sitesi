"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ZenginEditor from "./ZenginEditor";

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

/**
 * Editör öncesi yazılar düz metin olarak kaydedilmişti. İçerikte hiç etiket
 * yoksa boş satırlara göre paragraflara bölünür, böylece eski yazılar
 * editörde tek blok halinde görünmez.
 */
function icerigiHazirla(ham: string): string {
  if (/<[a-z][\s\S]*>/i.test(ham)) return ham;
  return ham
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export default function YaziFormu({ mod, yazi }: Props) {
  const router = useRouter();
  const [baslik, setBaslik] = useState(yazi?.baslik ?? "");
  const [slug, setSlug] = useState(yazi?.slug ?? "");
  const [ozet, setOzet] = useState(yazi?.ozet ?? "");
  const [icerik, setIcerik] = useState(icerigiHazirla(yazi?.icerik ?? ""));
  const [kapakGorsel, setKapakGorsel] = useState(yazi?.kapakGorsel ?? "");
  const [yayinda, setYayinda] = useState(yazi?.yayinda ?? false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kapakYukleniyor, setKapakYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const kapakGirdisi = useRef<HTMLInputElement>(null);

  function baslikDegisti(deger: string) {
    setBaslik(deger);
    if (mod === "yeni") setSlug(slugOlustur(deger));
  }

  async function kapakSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];
    e.target.value = "";
    if (!dosya) return;

    setKapakYukleniyor(true);
    setHata("");
    try {
      const govde = new FormData();
      govde.append("dosya", dosya);
      const cevap = await fetch("/api/upload", { method: "POST", body: govde });
      const veri = await cevap.json();
      if (!cevap.ok) {
        setHata(veri.hata ?? "Kapak görseli yüklenemedi.");
        return;
      }
      setKapakGorsel(veri.url);
    } catch {
      setHata("Sunucuya ulaşılamadı.");
    } finally {
      setKapakYukleniyor(false);
    }
  }

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();

    // Editör boşken bile "<p></p>" döndürür; gerçekten metin var mı bakılır
    const metin = icerik.replace(/<[^>]*>/g, "").trim();
    if (!metin && !/<img/i.test(icerik)) {
      setHata("İçerik boş olamaz.");
      return;
    }

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
    <form onSubmit={kaydet} className="space-y-5">
      {/* Başlık */}
      <div className="max-w-2xl">
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
      <div className="max-w-2xl">
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
      <div className="max-w-2xl">
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

      {/* İçerik — zengin metin editörü */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">İçerik *</label>
        <ZenginEditor deger={icerik} degisti={setIcerik} />
      </div>

      {/* Kapak görseli */}
      <div className="max-w-2xl">
        <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">Kapak Görseli</label>
        <div className="flex gap-2">
          <input
            type="url"
            className="giris-alani"
            value={kapakGorsel}
            onChange={(e) => setKapakGorsel(e.target.value)}
            placeholder="https://… veya sağdaki düğmeyle yükleyin"
          />
          <button
            type="button"
            onClick={() => kapakGirdisi.current?.click()}
            disabled={kapakYukleniyor}
            className="dugme-ikincil shrink-0 disabled:opacity-50"
          >
            {kapakYukleniyor ? "Yükleniyor…" : "Yükle"}
          </button>
        </div>
        <input
          ref={kapakGirdisi}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={kapakSecildi}
          className="hidden"
        />

        {kapakGorsel && (
          <div className="mt-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={kapakGorsel}
              alt="Kapak önizlemesi"
              className="max-h-44 rounded-lg border border-[#3a332a] object-cover"
            />
            <button
              type="button"
              onClick={() => setKapakGorsel("")}
              className="mt-2 text-xs text-[#f85149] hover:underline"
            >
              Kapağı kaldır
            </button>
          </div>
        )}
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
        <p className="max-w-2xl rounded-lg border border-[#f85149]/30 bg-[#f85149]/10 px-3 py-2 text-sm text-[#f85149]">
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
