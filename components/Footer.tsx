import Link from "next/link";

export default function Footer() {
  const yil = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[#30363d] bg-[#161b22]">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm text-[#8b949e] sm:flex-row">
        <span>© {yil} websitesi</span>
        <div className="flex gap-4">
          <Link href="/" className="hover:text-[#e6edf3]">Blog</Link>
          <Link href="/oyunlar" className="hover:text-[#e6edf3]">Oyunlar</Link>
          <Link href="/admin" className="hover:text-[#e6edf3]">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
