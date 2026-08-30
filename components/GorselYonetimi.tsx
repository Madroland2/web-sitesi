"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface Gorsel {
  id: number;
  baslik: string;
  url: string;
  altMetin: string | null;
  sira: number;
  yayinda: boolean;
}

export default function GorselYonetimi({ gorseller }: { gorseller: Gorsel[] }) {
  const router = useRouter();
  const dosyaGirdisi = useRef<HTMLInputElement>(null);
  const [baslik, setBaslik] = useState("");
  const [altMetin, setAltMetin] = useState("");
  const [url, setUrl] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState("");

  async function dosyaSecildi(e: React.ChangeEvent<HTMLInputElement>) {
    const dosya = e.target.files?.[0];
    e.target.value = "";
    if (!dosya) return;

    setYukleniyor(true);
    setHata("");
    try {
      const govde = new FormData();
      govde.append("dosya", dosya);
      const cevap = await fetch("/api/upload", { method: "POST", body: govde });
      const veri = await cevap.json();
      if (!cevap.ok) {
        setHata(veri.hata ?? "Yükleme başarısız.");
        return;
      }
      setUrl(veri.url);
      // Başlık boşsa dosya adından makul bir tane türet
      if (!baslik.trim()) setBaslik(dosya.name.replace(/\.[^.]+$/, ""));
    } catch {
      setHata("Sunucuya ulaşılamadı.");
    } finally {
      setYukleniyor(false);
    }
  }

  async function ekle(e: React.FormEvent) {
    e.preventDefault();
    if (!url) {
      setHata("Önce bir görsel yükleyin.");
      return;
    }

    setKaydediliyor(true);
    setHata("");
    try {
      const cevap = await fetch("/api/gorseller", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baslik, url, altMetin, sira: 0, yayinda: true }),
      });
      const veri = await cevap.json();
      if (!cevap.ok) {
        setHata(veri.hata ?? "Kayıt başarısız.");
        return;
      }
      setBaslik("");
      setAltMetin("");
      setUrl("");
      router.refresh();
    } catch {
      setHata("Sunucuya ulaşılamadı.");
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sil(id: number, ad: string) {
    if (!confirm(`"${ad}" görseli silinsin mi? Dosya da depodan kaldırılır.`)) return;
    const cevap = await fetch(`/api/gorseller/${id}`, { method: "DELETE" });
    if (cevap.ok) router.refresh();
    else setHata("Silme başarısız.");
  }

  async function yayinDegistir(g: Gorsel) {
    const cevap = await fetch(`/api/gorseller/${g.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baslik: g.baslik,
        altMetin: g.altMetin,
        sira: g.sira,
        yayinda: !g.yayinda,
      }),
    });
    if (cevap.ok) router.refresh();
    else setHata("Güncelleme başarısız.");
  }

  return (
    <>
      {/* Ekleme formu */}
      <form
        onSubmit={ekle}
        className="mb-8 space-y-4 rounded-xl border border-[#30363d] bg-[#161b22] p-5"
      >
        <h2 className="text-sm font-semibold text-[#e6edf3]">Yeni görsel</h2>

        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => dosyaGirdisi.current?.click()}
            disabled={yukleniyor}
            className="dugme-ikincil shrink-0 disabled:opacity-50"
          >
            {yukleniyor ? "Yükleniyor…" : url ? "Değiştir" : "Dosya seç"}
          </button>

          {url && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={url}
              alt="Önizleme"
              className="h-20 w-20 rounded-lg border border-[#30363d] object-cover"
            />
          )}
        </div>

        <input
          ref={dosyaGirdisi}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={dosyaSecildi}
          className="hidden"
        />

        <input
          type="text"
          className="giris-alani"
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="Başlık"
          required
        />

        <input
          type="text"
          className="giris-alani"
          value={altMetin}
          onChange={(e) => setAltMetin(e.target.value)}
          placeholder="Alt metin — görme engelliler için açıklama (isteğe bağlı)"
        />

        {hata && <p className="text-sm text-[#f85149]">{hata}</p>}

        <button
          type="submit"
          disabled={kaydediliyor || yukleniyor}
          className="dugme-birincil disabled:opacity-50"
        >
          {kaydediliyor ? "Ekleniyor…" : "Galeriye ekle"}
        </button>
      </form>

      {/* Liste */}
      {gorseller.length === 0 ? (
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] py-14 text-center">
          <p className="text-[#8b949e]">Henüz görsel yok.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {gorseller.map((g) => (
            <li
              key={g.id}
              className="overflow-hidden rounded-xl border border-[#30363d] bg-[#161b22]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.url}
                alt={g.altMetin ?? g.baslik}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="p-3">
                <p className="truncate text-sm font-medium text-[#e6edf3]">{g.baslik}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => yayinDegistir(g)}
                    className={`rounded-full px-2 py-0.5 font-medium ${
                      g.yayinda
                        ? "bg-[#3fb950]/20 text-[#3fb950]"
                        : "bg-[#8b949e]/20 text-[#8b949e]"
                    }`}
                  >
                    {g.yayinda ? "Yayında" : "Gizli"}
                  </button>
                  <button
                    type="button"
                    onClick={() => sil(g.id, g.baslik)}
                    className="text-[#f85149] hover:underline"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
