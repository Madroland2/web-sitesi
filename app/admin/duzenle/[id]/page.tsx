import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import YaziFormu from "@/components/YaziFormu";

export const metadata = { title: "Yazıyı Düzenle | Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function YaziDuzenle({ params }: Props) {
  const session = await getSession();
  if (!session.adminGirisYapti) redirect("/admin");

  const { id } = await params;
  const yazi = await db.post.findUnique({ where: { id: parseInt(id, 10) } });
  if (!yazi) notFound();

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-[#e6edf3]">Yazıyı Düzenle</h1>
      </div>
      <YaziFormu mod="duzenle" yazi={yazi} />
    </>
  );
}
