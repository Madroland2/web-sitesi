"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface Duyuru {
  id: number;
  baslik: string;
  icerik: string;
  baglanti: string | null;
  yayinda: boolean;
  olusturuldu: string | Date;
}

export default function DuyuruYonetimi({ duyurular }: { duyurular: Duyuru[] }) {
  const router = useRouter();
  const [baslik, setBaslik] = useState("");
  const [icerik, setIcerik] = useState("");
  const [baglanti, setBaglanti] = useState("");
  const [kaydediliyor, setKaydediliyor] = useState(false);
  const [hata, setHata] = useState("");

  async function ekle(e: React.FormEvent) {
    e.preventDefault();
    setKaydediliyor(true);
    setHata("");

    try {
      const cevap = await fetch("/api/duyurular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baslik, icerik, baglanti, yayinda: true }),
      });
      const veri = await cevap.json();
      if (!cevap.ok) {
        setHata(veri.hata ?? "Kayıt başarısız.");
        return;
      }
      setBaslik("");
      setIcerik("");
      setBaglanti("");
      router.refresh();
    } catch {
      setHata("Sunucuya ulaşılamadı.");
    } finally {
      setKaydediliyor(false);
    }
  }

  async function sil(id: number, ad: string) {
    if (!confirm(`"${ad}" duyurusu silinsin mi?`)) return;
    const cevap = await fetch(`/api/duyurular/${id}`, { method: "DELETE" });
    if (cevap.ok) router.refresh();
    else setHata("Silme başarısız.");
  }

  async function yayinDegistir(d: Duyuru) {
    const cevap = await fetch(`/api/duyurular/${d.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        baslik: d.baslik,
        icerik: d.icerik,
        baglanti: d.baglanti,
        yayinda: !d.yayinda,
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
        <h2 className="text-sm font-semibold text-[#e6edf3]">Yeni duyuru</h2>

        <input
          type="text"
          className="giris-alani"
          value={baslik}
          onChange={(e) => setBaslik(e.target.value)}
          placeholder="Başlık"
          required
        />

        <textarea
          className="giris-alani resize-y"
          rows={3}
          value={icerik}
          onChange={(e) => setIcerik(e.target.value)}
          placeholder="Duyuru metni"
          required
        />

        <input
          type="url"
          className="giris-alani"
          value={baglanti}
          onChange={(e) => setBaglanti(e.target.value)}
          placeholder="Bağlantı (isteğe bağlı) — https://…"
        />

        {hata && <p className="text-sm text-[#f85149]">{hata}</p>}

        <button type="submit" disabled={kaydediliyor} className="dugme-birincil disabled:opacity-50">
          {kaydediliyor ? "Ekleniyor…" : "Ekle"}
        </button>
      </form>

      {/* Liste */}
      {duyurular.length === 0 ? (
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] py-14 text-center">
          <p className="text-[#8b949e]">Henüz duyuru yok.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {duyurular.map((d) => (
            <li
              key={d.id}
              className="rounded-xl border border-[#30363d] bg-[#161b22] p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium text-[#e6edf3]">{d.baslik}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-[#8b949e]">{d.icerik}</p>
                  {d.baglanti && (
                    <p className="mt-1 truncate text-xs text-[#58a6ff]">{d.baglanti}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={() => yayinDegistir(d)}
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      d.yayinda
                        ? "bg-[#3fb950]/20 text-[#3fb950]"
                        : "bg-[#8b949e]/20 text-[#8b949e]"
                    }`}
                  >
                    {d.yayinda ? "Yayında" : "Gizli"}
                  </button>
                  <button
                    type="button"
                    onClick={() => sil(d.id, d.baslik)}
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
