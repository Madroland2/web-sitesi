"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENU = [
  { href: "/", etiket: "Blog" },
  { href: "/oyunlar", etiket: "Oyunlar" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#30363d] bg-[#0d1117]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold text-[#e6edf3] hover:text-[#58a6ff]">
          web<span className="text-[#58a6ff]">sitesi</span>
        </Link>

        {/* Navigasyon */}
        <nav className="flex items-center gap-1">
          {MENU.map(({ href, etiket }) => {
            const aktif = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  aktif
                    ? "bg-[#161b22] text-[#58a6ff]"
                    : "text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]"
                }`}
              >
                {etiket}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
