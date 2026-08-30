import Link from "next/link";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import SilButonu from "@/components/SilButonu";
import CikisButonu from "@/components/CikisButonu";
import AdminMenu from "@/components/AdminMenu";

export const metadata = { title: "Admin Paneli | websitesi" };

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session.adminGirisYapti) redirect("/admin");

  const yazilar = await db.post.findMany({
    orderBy: { olusturuldu: "desc" },
  });

  return (
    <>
      <AdminMenu />

      {/* Üst bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e6edf3]">Yazılar</h1>
          <p className="text-sm text-[#8b949e]">{yazilar.length} yazı</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/yeni" className="dugme-birincil">
            + Yeni Yazı
          </Link>
          <CikisButonu />
        </div>
      </div>

      {/* Tablo */}
      {yazilar.length === 0 ? (
        <div className="rounded-xl border border-[#30363d] bg-[#161b22] py-16 text-center">
          <p className="text-[#8b949e]">Henüz yazı yok.</p>
          <Link href="/admin/yeni" className="mt-3 inline-block text-sm text-[#58a6ff] hover:underline">
            İlk yazıyı ekle →
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#30363d]">
          <table className="w-full text-sm">
            <thead className="border-b border-[#30363d] bg-[#161b22] text-[#8b949e]">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Başlık</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Durum</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Tarih</th>
                <th className="px-4 py-3 text-right font-medium">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {yazilar.map((yazi, i) => (
                <tr
                  key={yazi.id}
                  className={`border-b border-[#30363d] ${i % 2 === 0 ? "bg-[#0d1117]" : "bg-[#161b22]"}`}
                >
                  <td className="px-4 py-3 font-medium text-[#e6edf3]">{yazi.baslik}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        yazi.yayinda
                          ? "bg-[#3fb950]/20 text-[#3fb950]"
                          : "bg-[#8b949e]/20 text-[#8b949e]"
                      }`}
                    >
                      {yazi.yayinda ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-[#8b949e]">
                    {new Date(yazi.olusturuldu).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/duzenle/${yazi.id}`}
                        className="text-[#58a6ff] hover:underline"
                      >
                        Düzenle
                      </Link>
                      <SilButonu id={yazi.id} baslik={yazi.baslik} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
