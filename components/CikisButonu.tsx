"use client";

import { useRouter } from "next/navigation";

export default function CikisButonu() {
  const router = useRouter();

  async function cikisYap() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <button type="button" onClick={cikisYap} className="dugme-ikincil">
      Çıkış
    </button>
  );
}
