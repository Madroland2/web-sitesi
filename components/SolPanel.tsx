import Link from "next/link";
import { db } from "@/lib/db";
import { SOL_MENU } from "@/lib/baglantilar";

const OYUNLAR = [
  { href: "/oyunlar/xox", etiket: "Buğulu Ayna XOX" },
  { href: "/oyunlar/fener", etiket: "Deniz Feneri ve Gemi" },
  { href: "/oyunlar/kelime", etiket: "Yasaklı Kelime Avı" },
];

function Baslik({ href, cocuk }: { href: string; cocuk: string }) {
  return (
    <h2 className="mb-3">
      <Link
        href={href}
        className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#a89e8c] hover:text-[#d4a24c]"
      >
        {cocuk}
      </Link>
    </h2>
  );
}

export default async function SolPanel() {
  // Panel her sayfada göründüğü için sorgular dar tutuldu
  const [duyurular, gorseller] = await Promise.all([
    db.duyuru.findMany({
      where: { yayinda: true },
      orderBy: { olusturuldu: "desc" },
      take: 3,
      select: { id: true, baslik: true, baglanti: true },
    }),
    db.gorsel.findMany({
      where: { yayinda: true },
      orderBy: [{ sira: "asc" }, { olusturuldu: "desc" }],
      take: 4,
      select: { id: true, url: true, altMetin: true, baslik: true },
    }),
  ]);

  return (
    <aside className="space-y-9 text-sm" aria-label="Yan menü">
      {/* ── Duyurular ── */}
      <section>
        <Baslik href="/duyurular" cocuk="Duyurular" />
        {duyurular.length === 0 ? (
          <p className="text-xs text-[#8b949e]">Henüz duyuru yok.</p>
        ) : (
          <ul className="space-y-2.5">
            {duyurular.map((d) => (
              <li key={d.id} className="leading-snug">
                {d.baglanti ? (
                  <a
                    href={d.baglanti}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e9e2d4] hover:text-[#d4a24c]"
                  >
                    {d.baslik}
                  </a>
                ) : (
                  <Link href="/duyurular" className="text-[#e9e2d4] hover:text-[#d4a24c]">
                    {d.baslik}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Görseller ── */}
      <section>
        <Baslik href="/gorseller" cocuk="Görseller" />
        {gorseller.length === 0 ? (
          <p className="text-xs text-[#8b949e]">Henüz görsel yok.</p>
        ) : (
          <Link href="/gorseller" className="grid grid-cols-2 gap-1.5">
            {gorseller.map((g) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={g.id}
                src={g.url}
                alt={g.altMetin ?? g.baslik}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded border border-[#3a332a] object-cover opacity-90 hover:opacity-100"
              />
            ))}
          </Link>
        )}
      </section>

      {/* ── Oyunlar ── */}
      <section>
        <Baslik href="/oyunlar" cocuk="Oyunlar" />
        <ul className="space-y-2">
          {OYUNLAR.map((o) => (
            <li key={o.href}>
              <Link href={o.href} className="text-[#e9e2d4] hover:text-[#d4a24c]">
                {o.etiket}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Mobilde bölüm bağlantıları tek satırda toplansın */}
      <nav className="flex gap-4 border-t border-[#3a332a] pt-5 text-xs lg:hidden">
        {SOL_MENU.map((m) => (
          <Link key={m.href} href={m.href} className="text-[#a89e8c] hover:text-[#d4a24c]">
            {m.etiket}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
