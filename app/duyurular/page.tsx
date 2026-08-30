import { db } from "@/lib/db";

export const metadata = {
  title: "Duyurular",
  description: "Yeni kitaplar, söyleşiler ve etkinlikler",
};

const tarihBicimlendirici = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function DuyurularSayfasi() {
  const duyurular = await db.duyuru.findMany({
    where: { yayinda: true },
    orderBy: { olusturuldu: "desc" },
  });

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <header className="text-center">
        <h1 className="dergi-basligi text-[2rem] leading-tight text-[#e9e2d4]">Duyurular</h1>
        <div className="suslu-ayirici mx-auto mt-7 max-w-[12rem]" aria-hidden="true">
          <span className="text-sm">❦</span>
        </div>
      </header>

      {duyurular.length === 0 ? (
        <p className="mt-14 text-center text-[#a89e8c]">Şimdilik duyuru yok.</p>
      ) : (
        <ul className="mt-12 space-y-10">
          {duyurular.map((d) => {
            const tarih = new Date(d.olusturuldu);
            return (
              <li key={d.id} className="border-b border-[#3a332a] pb-9 last:border-0">
                <p className="meta-etiket">
                  <time dateTime={tarih.toISOString()}>
                    {tarihBicimlendirici.format(tarih)}
                  </time>
                </p>

                <h2 className="dergi-basligi mt-3 text-[1.4rem] leading-snug text-[#e9e2d4]">
                  {d.baslik}
                </h2>

                {/* Duyuru içeriği düz metin; satır sonları korunur */}
                <p className="mt-3 whitespace-pre-line leading-relaxed text-[#a89e8c]">
                  {d.icerik}
                </p>

                {d.baglanti && (
                  <a
                    href={d.baglanti}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block border-b border-[#3a332a] pb-0.5 text-sm text-[#d4a24c] hover:border-[#d4a24c]"
                  >
                    Ayrıntılar →
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
