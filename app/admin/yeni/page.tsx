import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import YaziFormu from "@/components/YaziFormu";

export const metadata = { title: "Yeni Yazı | Admin" };

export default async function YeniYazi() {
  const session = await getSession();
  if (!session.adminGirisYapti) redirect("/admin");

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#e6edf3]">Yeni Yazı</h1>
      </div>
      <YaziFormu mod="yeni" />
    </>
  );
}
