import { db } from "@/lib/db";

export const metadata = {
  title: "Görseller",
  description: "Fotoğraflar ve görsel arşiv",
};

export default async function GorsellerSayfasi() {
  const gorseller = await db.gorsel.findMany({
    where: { yayinda: true },
    orderBy: [{ sira: "asc" }, { olusturuldu: "desc" }],
  });

  return (
    <div className="pb-10">
      <header className="text-center">
        <h1 className="dergi-basligi text-[2rem] leading-tight text-[#e9e2d4]">Görseller</h1>
        <div className="suslu-ayirici mx-auto mt-7 max-w-[12rem]" aria-hidden="true">
          <span className="text-sm">❦</span>
        </div>
      </header>

      {gorseller.length === 0 ? (
        <p className="mt-14 text-center text-[#a89e8c]">Şimdilik görsel yok.</p>
      ) : (
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {gorseller.map((g) => (
            <li key={g.id}>
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.url}
                  alt={g.altMetin ?? g.baslik}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-lg border border-[#3a332a] object-cover"
                />
                <figcaption className="mt-2.5 text-sm text-[#a89e8c]">{g.baslik}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
