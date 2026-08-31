import Link from "next/link";
import { db } from "@/lib/db";
import BlogCard from "@/components/BlogCard";

export const metadata = {
  title: "Blog | websitesi",
  description: "Edebiyat üzerine yazılar",
};

export default async function AnaSayfa() {
  const yazilar = await db.post
    .findMany({
      where: { yayinda: true },
      orderBy: { olusturuldu: "desc" },
    })
    .catch(() => []); // Veritabanı henüz hazır değilse boş dizi dön

  return (
    <>
      {/* ── Dergi başlığı ── */}
      <header className="mb-14 pt-6 text-center">
        <p className="meta-etiket">Edebiyat Defteri</p>

        <h1 className="dergi-basligi mt-3 text-4xl text-[#e9e2d4] sm:text-5xl">
          SONDÜŞ
        </h1>

        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#a89e8c]">
          Sessiz gece bin bataklık, kaygan düşler hep tuzaklı
        </p>

        <div className="suslu-ayirici mx-auto mt-8 max-w-xs" aria-hidden="true">
          <span className="text-sm">❦</span>
        </div>
      </header>

      {/* ── Yazı listesi ── */}
      {yazilar.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <p className="dergi-basligi text-xl text-[#e9e2d4]">
            Defter henüz boş
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#a89e8c]">
            İlk yazı yazıldığında burada görünecek.
          </p>
          <Link
            href="/admin"
            className="mt-6 inline-block border-b border-[#d4a24c] pb-0.5 text-sm text-[#d4a24c] hover:border-[#e6bc72] hover:text-[#e6bc72]"
          >
            Admin panelinden yazı ekle
          </Link>
        </div>
      ) : (
        <section aria-label="Yazılar">
          {yazilar.map((yazi) => (
            <BlogCard
              key={yazi.id}
              baslik={yazi.baslik}
              slug={yazi.slug}
              ozet={yazi.ozet}
              icerik={yazi.icerik}
              tarih={yazi.olusturuldu}
              kapakGorsel={yazi.kapakGorsel}
            />
          ))}

          <div className="yazi-girdisi" aria-hidden="true" />

          <p className="mt-10 text-center text-xs text-[#a89e8c]">
            {yazilar.length} yazı
          </p>
        </section>
      )}
    </>
  );
}
