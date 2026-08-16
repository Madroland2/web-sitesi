"use client";

import { useRouter } from "next/navigation";

interface Props {
  id: number;
  baslik: string;
}

export default function SilButonu({ id, baslik }: Props) {
  const router = useRouter();

  async function sil() {
    if (!confirm(`"${baslik}" silinsin mi?`)) return;

    const cevap = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (cevap.ok) {
      router.refresh();
    } else {
      alert("Silme başarısız.");
    }
  }

  return (
    <button type="button" onClick={sil} className="text-[#f85149] hover:underline">
      Sil
    </button>
  );
}
