import Link from "next/link";

interface BlogKartProps {
  baslik: string;
  slug: string;
  ozet: string;
  icerik?: string;
  tarih: string | Date;
  kapakGorsel?: string | null;
}

const tarihBicimlendirici = new Intl.DateTimeFormat("tr-TR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Ortalama 200 kelime/dakika üzerinden okuma süresi */
export function okumaSuresi(metin: string): number {
  const kelime = metin.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(kelime / 200));
}

export default function BlogCard({
  baslik,
  slug,
  ozet,
  icerik,
  tarih,
  kapakGorsel,
}: BlogKartProps) {
  const tarihNesnesi = new Date(tarih);
  const dakika = icerik ? okumaSuresi(icerik) : null;

  return (
    <article className="yazi-girdisi">
      <Link
        href={`/blog/${slug}`}
        className="group flex gap-6 py-8 sm:gap-8"
      >
        {/* Metin bloğu — min-w-0 kırpmanın çalışması için gerekli */}
        <div className="min-w-0 flex-1">
          <p className="meta-etiket">
            <time dateTime={tarihNesnesi.toISOString()}>
              {tarihBicimlendirici.format(tarihNesnesi)}
            </time>
            {dakika !== null && (
              <>
                <span aria-hidden="true"> · </span>
                <span>{dakika} dakika</span>
              </>
            )}
          </p>

          <h2 className="yazi-basligi mt-2.5 text-2xl leading-snug line-clamp-2">
            {baslik}
          </h2>

          <p className="mt-3 text-[15px] leading-relaxed text-[#a89e8c] line-clamp-2">
            {ozet}
          </p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#d4a24c]">
            Okumaya başla
            <svg
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>

        {/* Kapak görseli — küçük ekranda gizli */}
        {kapakGorsel && (
          <div className="hidden shrink-0 sm:block">
            <img
              src={kapakGorsel}
              alt=""
              width={160}
              height={160}
              loading="lazy"
              decoding="async"
              className="h-28 w-28 rounded-lg border border-[#3a332a] object-cover sm:h-32 sm:w-32"
            />
          </div>
        )}
      </Link>
    </article>
  );
}
