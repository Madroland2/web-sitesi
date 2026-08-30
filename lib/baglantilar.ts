/**
 * Sağ paneldeki dış bağlantılar.
 *
 * Adresleri buradan değiştirin — başka yerde tekrarlanmıyor.
 * `adres` boş bırakılırsa o simge sağ panelde hiç gösterilmez.
 */
export interface DisBaglanti {
  ad: string;
  adres: string;
  baslik: string;
}

export const DIS_BAGLANTILAR: DisBaglanti[] = [
  {
    ad: "instagram",
    // TODO: gerçek Instagram adresiyle değiştirin
    adres: "",
    baslik: "Instagram",
  },
  {
    ad: "kitapyurdu",
    // TODO: gerçek Kitapyurdu yazar/kitap sayfasıyla değiştirin
    adres: "",
    baslik: "Kitapyurdu",
  },
];

/** Sol paneldeki bölüm başlıkları ve hedefleri */
export const SOL_MENU = [
  { href: "/duyurular", etiket: "Duyurular" },
  { href: "/gorseller", etiket: "Görseller" },
  { href: "/oyunlar", etiket: "Oyunlar" },
] as const;
