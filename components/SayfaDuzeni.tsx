"use client";

import { usePathname } from "next/navigation";

interface Props {
  sol: React.ReactNode;
  sag: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Üç sütunlu yerleşim. Yan paneller sunucuda render edilip prop olarak gelir;
 * burada yalnızca hangi rotada gösterilecekleri kararlaştırılır — yönetim
 * ekranlarında panel istemiyoruz, orada tam genişlik gerekiyor.
 */
export default function SayfaDuzeni({ sol, sag, children }: Props) {
  const pathname = usePathname();
  const yonetim = pathname.startsWith("/admin");

  if (yonetim) {
    return (
      <main id="icerik" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {children}
      </main>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8 lg:gap-10">
      {/* Sol panel — geniş ekranda sabit kalır */}
      <div className="hidden w-52 shrink-0 lg:block">
        <div className="sticky top-24">{sol}</div>
      </div>

      {/* Orta sütun */}
      <main id="icerik" className="min-w-0 flex-1">
        {children}

        {/* Dar ekranda yan panel içeriği metnin altına iner */}
        <div className="mt-16 border-t border-[#3a332a] pt-10 lg:hidden">{sol}</div>
        <div className="mt-10 flex justify-center lg:hidden">{sag}</div>
      </main>

      {/* Sağ panel — dış bağlantı simgeleri */}
      <div className="hidden w-12 shrink-0 lg:block">
        <div className="sticky top-24">{sag}</div>
      </div>
    </div>
  );
}
