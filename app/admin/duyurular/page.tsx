import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminMenu from "@/components/AdminMenu";
import CikisButonu from "@/components/CikisButonu";
import DuyuruYonetimi from "@/components/DuyuruYonetimi";

export const metadata = { title: "Duyurular | Admin" };

export default async function AdminDuyurular() {
  const session = await getSession();
  if (!session.adminGirisYapti) redirect("/admin");

  const duyurular = await db.duyuru.findMany({
    orderBy: { olusturuldu: "desc" },
  });

  return (
    <>
      <AdminMenu />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e6edf3]">Duyurular</h1>
          <p className="text-sm text-[#8b949e]">{duyurular.length} duyuru</p>
        </div>
        <CikisButonu />
      </div>

      <DuyuruYonetimi
        duyurular={duyurular.map((d) => ({
          ...d,
          olusturuldu: d.olusturuldu.toISOString(),
        }))}
      />
    </>
  );
}
