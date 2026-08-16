import Link from "next/link";

export const metadata = {
  title: "Oyunlar | websitesi",
};

const OYUNLAR = [
  {
    href: "/oyunlar/xox",
    baslik: "Buğulu Ayna XOX",
    aciklama:
      "Buğulanmış bir ayna üzerinde XOX oyna. Parmağınla buğuyu silerek hamle yap.",
    emoji: "🪞",
    renk: "#58a6ff",
  },
  {
    href: "/oyunlar/fener",
    baslik: "Deniz Feneri ve Gemi",
    aciklama:
      "Gemiyi yönlendir, dönen fener ışığından kaç, karaya çarpmadan adaya ulaş.",
    emoji: "🚢",
    renk: "#3fb950",
  },
  {
    href: "/oyunlar/kelime",
    baslik: "Yasaklı Kelime Avı",
    aciklama:
      "Kitap arka kapağı metinlerinde yasaklı kelime var mı yok mu? Hızlı karar ver!",
    emoji: "📚",
    renk: "#f85149",
  },
];

export default function OyunlarSayfasi() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e6edf3]">Oyunlar</h1>
        <p className="mt-1 text-sm text-[#8b949e]">Üç küçük tarayıcı oyunu</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {OYUNLAR.map((oyun) => (
          <Link key={oyun.href} href={oyun.href} className="kart group block p-6">
            {/* İkon */}
            <div
              className="mb-4 text-4xl"
              style={{ filter: `drop-shadow(0 0 12px ${oyun.renk}55)` }}
            >
              {oyun.emoji}
            </div>

            {/* Başlık */}
            <h2
              className="text-lg font-semibold group-hover:text-[#58a6ff]"
              style={{ color: oyun.renk }}
            >
              {oyun.baslik}
            </h2>

            {/* Açıklama */}
            <p className="mt-2 text-sm text-[#8b949e] leading-relaxed">
              {oyun.aciklama}
            </p>

            {/* Oyna butonu */}
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#58a6ff]">
              Oyna
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
