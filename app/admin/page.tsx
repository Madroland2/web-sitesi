"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGiris() {
  const router = useRouter();
  const [sifre, setSifre] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");

  async function girisYap(e: React.FormEvent) {
    e.preventDefault();
    setYukleniyor(true);
    setHata("");

    try {
      const cevap = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sifre }),
      });

      if (!cevap.ok) {
        const veri = await cevap.json();
        setHata(veri.hata || "Giriş başarısız.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setHata("Sunucu hatası, tekrar deneyin.");
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Başlık */}
        <div className="mb-6 text-center">
          <div className="mb-3 text-4xl">🔐</div>
          <h1 className="text-xl font-semibold text-[#e6edf3]">Admin Girişi</h1>
          <p className="mt-1 text-sm text-[#8b949e]">Devam etmek için şifreyi gir</p>
        </div>

        {/* Form */}
        <form onSubmit={girisYap} className="kart p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#e6edf3]">
              Şifre
            </label>
            <input
              type="password"
              className="giris-alani"
              placeholder="••••••••"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
              autoFocus
            />
          </div>

          {hata && (
            <p className="rounded-lg border border-[#f85149]/30 bg-[#f85149]/10 px-3 py-2 text-sm text-[#f85149]">
              {hata}
            </p>
          )}

          <button
            type="submit"
            disabled={yukleniyor}
            className="dugme-birincil w-full justify-center disabled:opacity-50"
          >
            {yukleniyor ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
