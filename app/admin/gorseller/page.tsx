import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminMenu from "@/components/AdminMenu";
import CikisButonu from "@/components/CikisButonu";
import GorselYonetimi from "@/components/GorselYonetimi";

export const metadata = { title: "Görseller | Admin" };

export default async function AdminGorseller() {
  const session = await getSession();
  if (!session.adminGirisYapti) redirect("/admin");

  const gorseller = await db.gorsel.findMany({
    orderBy: [{ sira: "asc" }, { olusturuldu: "desc" }],
  });

  return (
    <>
      <AdminMenu />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e6edf3]">Görseller</h1>
          <p className="text-sm text-[#8b949e]">{gorseller.length} görsel</p>
        </div>
        <CikisButonu />
      </div>

      <GorselYonetimi gorseller={gorseller} />
    </>
  );
}
