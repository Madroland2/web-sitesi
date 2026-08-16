"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { YASAKLI_KELIMELER, KITAP_METINLERI, type KitapMetni } from "@/lib/oyun-verisi";

const SURE = 8;
const KART_SAYISI = 10;

type OyunFaz = "intro" | "oynuyor" | "sonuc";
type KartFaz = "okuma" | "cevaplandi";

function karistir<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function bulunanKelime(metin: string): string | null {
  const kucuk = metin.toLocaleLowerCase("tr");
  for (const k of YASAKLI_KELIMELER) {
    if (kucuk.includes(k)) return k;
  }
  return null;
}

function MetinVurgulu({ metin, vurgula }: { metin: string; vurgula: boolean }) {
  if (!vurgula) return <span>{metin}</span>;

  const regex = new RegExp(`(${[...YASAKLI_KELIMELER].join("|")})`, "gi");
  const parcalar = metin.split(regex);

  return (
    <span>
      {parcalar.map((parca, i) => {
        const eslesme = YASAKLI_KELIMELER.some(
          (k) => k.toLowerCase() === parca.toLowerCase()
        );
        return eslesme ? (
          <mark
            key={i}
            className="rounded bg-[#f85149]/25 px-0.5 text-[#f85149] font-semibold not-italic"
          >
            {parca}
          </mark>
        ) : (
          <span key={i}>{parca}</span>
        );
      })}
    </span>
  );
}

export default function KelimeOyunu() {
  const [faz, setFaz] = useState<OyunFaz>("intro");
  const [kartlar, setKartlar] = useState<KitapMetni[]>([]);
  const [indeks, setIndeks] = useState(0);
  const [sure, setSure] = useState(SURE);
  const [kartFaz, setKartFaz] = useState<KartFaz>("okuma");
  const [kullaniciCevap, setKullaniciCevap] = useState<boolean | null>(null);
  const [dogru, setDogru] = useState(0);
  const [sonuclar, setSonuclar] = useState<boolean[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const kartiBitir = useCallback(
    (cevap: boolean | null) => {
      if (kartFaz === "cevaplandi") return;

      if (timerRef.current) clearInterval(timerRef.current);
      setKartFaz("cevaplandi");

      const dogruCevap = kartlar[indeks]?.yasakliKelimeVar ?? false;
      const isabetli = cevap === dogruCevap;

      setKullaniciCevap(cevap);
      if (isabetli) setDogru((d) => d + 1);
      setSonuclar((s) => [...s, isabetli]);
    },
    [kartFaz, kartlar, indeks]
  );

  // Süre sayacı
  useEffect(() => {
    if (faz !== "oynuyor" || kartFaz !== "okuma") return;

    setSure(SURE);
    timerRef.current = setInterval(() => {
      setSure((s) => {
        if (s <= 1) {
          kartiBitir(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [faz, indeks, kartFaz, kartiBitir]);

  // Cevap sonrası otomatik ilerle
  useEffect(() => {
    if (kartFaz !== "cevaplandi") return;
    const t = setTimeout(() => {
      const sonraki = indeks + 1;
      if (sonraki >= KART_SAYISI) {
        setFaz("sonuc");
      } else {
        setIndeks(sonraki);
        setKartFaz("okuma");
        setKullaniciCevap(null);
      }
    }, 1800);
    return () => clearTimeout(t);
  }, [kartFaz, indeks]);

  function oyunuBaslat() {
    const sec = karistir(KITAP_METINLERI).slice(0, KART_SAYISI);
    setKartlar(sec);
    setIndeks(0);
    setDogru(0);
    setSonuclar([]);
    setKartFaz("okuma");
    setKullaniciCevap(null);
    setFaz("oynuyor");
  }

  // ── INTRO ────────────────────────────────────────────────────────────────
  if (faz === "intro") {
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-6 text-center">
          <div className="mb-3 text-5xl">📚</div>
          <h1 className="text-2xl font-bold text-[#f85149]">Yasaklı Kelime Avı</h1>
          <p className="mt-2 text-sm text-[#8b949e]">
            Her kitap arka kapağında bu kelimelerden biri var mı?{" "}
            <span className="text-[#e6edf3]">{SURE} saniyende</span> karar ver!
          </p>
        </div>

        <div className="kart mb-6 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
            Yasaklı Kelimeler ({YASAKLI_KELIMELER.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {YASAKLI_KELIMELER.map((k) => (
              <span
                key={k}
                className="rounded border border-[#f85149]/40 bg-[#f85149]/10 px-2.5 py-1 text-sm text-[#f85149]"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={oyunuBaslat}
            className="rounded-lg bg-[#f85149] px-8 py-3 text-base font-semibold text-white hover:bg-[#f85149]/80 active:scale-95 transition-transform"
          >
            Başla
          </button>
          <p className="mt-3 text-xs text-[#8b949e]">{KART_SAYISI} kitap · her birinde 8 saniye</p>
        </div>
      </div>
    );
  }

  // ── SONUÇ ────────────────────────────────────────────────────────────────
  if (faz === "sonuc") {
    const yuzde = Math.round((dogru / KART_SAYISI) * 100);
    const mesaj =
      yuzde === 100
        ? "Mükemmel! Hiç kaçırmadın."
        : yuzde >= 70
        ? "Çok iyi! Kelime avcısısın."
        : yuzde >= 50
        ? "Fena değil, biraz daha pratik yap."
        : "Yasaklı kelimeleri bir daha gözden geçir.";

    return (
      <div className="mx-auto max-w-sm text-center">
        <div className="mb-2 text-5xl">
          {yuzde === 100 ? "🏆" : yuzde >= 70 ? "🎯" : yuzde >= 50 ? "📖" : "📚"}
        </div>
        <h2 className="text-xl font-bold text-[#e6edf3]">{dogru}/{KART_SAYISI} Doğru</h2>
        <p className="mt-1 text-[#8b949e]">{mesaj}</p>

        <div className="kart mt-6 mb-6 grid grid-cols-10 gap-1.5 p-4">
          {sonuclar.map((s, i) => (
            <div
              key={i}
              className={`h-5 rounded-sm ${s ? "bg-[#3fb950]" : "bg-[#f85149]"}`}
              title={`Kitap ${i + 1}: ${s ? "Doğru" : "Yanlış"}`}
            />
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={oyunuBaslat}
            className="rounded-lg bg-[#f85149] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#f85149]/80 transition-colors"
          >
            Tekrar Oyna
          </button>
          <button
            onClick={() => setFaz("intro")}
            className="rounded-lg border border-[#30363d] px-6 py-2.5 text-sm font-medium text-[#8b949e] hover:border-[#58a6ff] hover:text-[#58a6ff] transition-colors"
          >
            Kelimelere Bak
          </button>
        </div>
      </div>
    );
  }

  // ── OYUN ─────────────────────────────────────────────────────────────────
  const kart = kartlar[indeks];
  if (!kart) return null;

  const dogruCevap = kart.yasakliKelimeVar;
  const islendi = kartFaz === "cevaplandi";
  const isabetli = kullaniciCevap === dogruCevap;
  const sure_oran = sure / SURE;

  const timerRenk =
    sure_oran > 0.5
      ? "#3fb950"
      : sure_oran > 0.25
      ? "#e3b341"
      : "#f85149";

  return (
    <div className="mx-auto max-w-xl">
      {/* Durum çubuğu */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-[#8b949e]">
          <span className="font-semibold text-[#e6edf3]">{indeks + 1}</span>/{KART_SAYISI}
        </span>
        <span
          className={`font-mono font-semibold transition-colors ${
            sure <= 2 ? "text-[#f85149]" : "text-[#e6edf3]"
          }`}
        >
          {islendi ? "—" : `${sure}s`}
        </span>
        <span className="text-[#8b949e]">
          Doğru: <span className="font-semibold text-[#3fb950]">{dogru}</span>
        </span>
      </div>

      {/* Süre çubuğu */}
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-[#30363d]">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: islendi ? "0%" : `${sure_oran * 100}%`,
            backgroundColor: timerRenk,
          }}
        />
      </div>

      {/* Kitap kartı */}
      <div
        className={`kart mb-5 p-6 transition-colors duration-300 ${
          islendi
            ? isabetli
              ? "border-[#3fb950]/60 bg-[#3fb950]/5"
              : "border-[#f85149]/60 bg-[#f85149]/5"
            : ""
        }`}
      >
        {/* Geri bildirim rozeti */}
        {islendi && (
          <div
            className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              isabetli
                ? "bg-[#3fb950]/20 text-[#3fb950]"
                : "bg-[#f85149]/20 text-[#f85149]"
            }`}
          >
            {isabetli ? "✓ Doğru!" : "✗ Yanlış"}
            {!isabetli && kullaniciCevap === null && " (Süre doldu)"}
          </div>
        )}

        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
          Kitap Arka Kapağı
        </p>
        <h2 className="mb-3 text-lg font-bold text-[#e6edf3]">{kart.baslik}</h2>
        <p className="text-[#c9d1d9] leading-relaxed">
          <MetinVurgulu metin={kart.metin} vurgula={islendi && dogruCevap} />
        </p>

        {/* Kaçırılan kelime */}
        {islendi && dogruCevap && !isabetli && (
          <p className="mt-4 text-xs text-[#f85149]">
            Kaçırdığın kelime:{" "}
            <span className="font-semibold">
              {bulunanKelime(kart.metin) ?? "?"}
            </span>
          </p>
        )}
        {islendi && !dogruCevap && !isabetli && (
          <p className="mt-4 text-xs text-[#f85149]">
            Bu metinde yasaklı kelime yoktu.
          </p>
        )}
      </div>

      {/* Butonlar */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => kartiBitir(true)}
          disabled={islendi}
          className={`rounded-xl py-4 text-lg font-bold transition-all active:scale-95 ${
            islendi && kullaniciCevap === true
              ? isabetli
                ? "bg-[#3fb950] text-white"
                : "bg-[#f85149] text-white"
              : islendi
              ? "cursor-default bg-[#161b22] text-[#30363d]"
              : "bg-[#3fb950]/10 text-[#3fb950] hover:bg-[#3fb950]/20 border border-[#3fb950]/30"
          }`}
        >
          VAR ✓
        </button>
        <button
          onClick={() => kartiBitir(false)}
          disabled={islendi}
          className={`rounded-xl py-4 text-lg font-bold transition-all active:scale-95 ${
            islendi && kullaniciCevap === false
              ? isabetli
                ? "bg-[#3fb950] text-white"
                : "bg-[#f85149] text-white"
              : islendi
              ? "cursor-default bg-[#161b22] text-[#30363d]"
              : "bg-[#f85149]/10 text-[#f85149] hover:bg-[#f85149]/20 border border-[#f85149]/30"
          }`}
        >
          YOK ✗
        </button>
      </div>
    </div>
  );
}
