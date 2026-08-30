import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/gorseller — liste (?yayinda=true ile yalnız yayındakiler)
export async function GET(req: NextRequest) {
  const sadeceYayinda = req.nextUrl.searchParams.get("yayinda") === "true";

  const gorseller = await db.gorsel.findMany({
    where: sadeceYayinda ? { yayinda: true } : undefined,
    orderBy: [{ sira: "asc" }, { olusturuldu: "desc" }],
  });

  return NextResponse.json(gorseller);
}

// POST /api/gorseller — galeriye görsel ekle (admin gerekir)
// Dosyanın kendisi önce /api/upload'a yüklenir, buraya URL'i gelir.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.adminGirisYapti) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { baslik, url, altMetin, sira, yayinda } = await req.json();

  if (!baslik?.trim() || !url?.trim()) {
    return NextResponse.json({ hata: "Başlık ve görsel zorunlu." }, { status: 400 });
  }

  try {
    const gorsel = await db.gorsel.create({
      data: {
        baslik: baslik.trim(),
        url: url.trim(),
        altMetin: altMetin?.trim() || null,
        sira: Number.isFinite(Number(sira)) ? Number(sira) : 0,
        yayinda: yayinda !== false,
      },
    });
    return NextResponse.json(gorsel, { status: 201 });
  } catch {
    return NextResponse.json({ hata: "Kayıt başarısız." }, { status: 500 });
  }
}
