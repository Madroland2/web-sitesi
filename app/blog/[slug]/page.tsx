import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { okumaSuresi } from "@/components/BlogCard";
import { temizle, duzMetin } from "@/lib/icerik";

interface Props {
  params: Promise<{ slug: string }>;
}

const tarihBicimlendirici = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const yazi = await db.post.findUnique({ where: { slug, yayinda: true } });
  if (!yazi) return { title: "Yazı bulunamadı" };
  return { title: yazi.baslik, description: yazi.ozet };
}

export default async function YaziDetay({ params }: Props) {
  const { slug } = await params;
  const yazi = await db.post.findUnique({ where: { slug, yayinda: true } });
  if (!yazi) notFound();

  const tarihNesnesi = new Date(yazi.olusturuldu);
  const dakika = okumaSuresi(duzMetin(yazi.icerik));

  // Editör öncesi yazılar düz metindi; etiket yoksa paragraflara bölünür.
  const govde = /<[a-z][\s\S]*>/i.test(yazi.icerik)
    ? temizle(yazi.icerik)
    : yazi.icerik
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${p}</p>`)
        .join("");

  return (
    <article className="mx-auto max-w-2xl pb-10">
      {/* ── Geri bağlantısı ── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[#a89e8c] hover:text-[#d4a24c]"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Tüm yazılar
      </Link>

      {/* ── Başlık bloğu ── */}
      <header className="mt-10 text-center">
        <p className="meta-etiket">
          <time dateTime={tarihNesnesi.toISOString()}>
            {tarihBicimlendirici.format(tarihNesnesi)}
          </time>
          <span aria-hidden="true"> · </span>
          <span>{dakika} dakikalık okuma</span>
        </p>

        <h1 className="dergi-basligi mt-4 text-[2.1rem] leading-tight text-[#e9e2d4] sm:text-[2.6rem]">
          {yazi.baslik}
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-[17px] italic leading-relaxed text-[#a89e8c]">
          {yazi.ozet}
        </p>

        <div className="suslu-ayirici mx-auto mt-9 max-w-[14rem]" aria-hidden="true">
          <span className="text-sm">❦</span>
        </div>
      </header>

      {/* ── Kapak görseli ── */}
      {yazi.kapakGorsel && (
        <figure className="mt-10">
          <img
            src={yazi.kapakGorsel}
            alt=""
            width={1280}
            height={720}
            decoding="async"
            fetchPriority="high"
            className="w-full rounded-xl border border-[#3a332a] object-cover"
            style={{ maxHeight: "420px" }}
          />
        </figure>
      )}

      {/* ── Metin ── */}
      {/* İçerik lib/icerik.ts içinde beyaz listeyle sanitize edilir */}
      <div
        className="okuma mx-auto mt-12"
        dangerouslySetInnerHTML={{ __html: govde }}
      />

      {/* ── Bitiş süslemesi ── */}
      <div className="suslu-ayirici mx-auto mt-16 max-w-[10rem]" aria-hidden="true">
        <span className="text-xs">❦</span>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/"
          className="border-b border-[#3a332a] pb-0.5 text-sm text-[#a89e8c] hover:border-[#d4a24c] hover:text-[#d4a24c]"
        >
          Diğer yazılara dön
        </Link>
      </div>
    </article>
  );
}
