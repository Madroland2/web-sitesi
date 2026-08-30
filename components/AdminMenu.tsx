"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SEKMELER = [
  { href: "/admin/dashboard", etiket: "Yazılar" },
  { href: "/admin/duyurular", etiket: "Duyurular" },
  { href: "/admin/gorseller", etiket: "Görseller" },
];

export default function AdminMenu() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-1 border-b border-[#30363d]">
      {SEKMELER.map((s) => {
        const aktif = pathname === s.href || pathname.startsWith(s.href + "/");
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={aktif ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium ${
              aktif
                ? "border-[#58a6ff] text-[#58a6ff]"
                : "border-transparent text-[#8b949e] hover:text-[#e6edf3]"
            }`}
          >
            {s.etiket}
          </Link>
        );
      })}
    </nav>
  );
}
