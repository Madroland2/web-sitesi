import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/duyurular — liste (?yayinda=true ile yalnız yayındakiler)
export async function GET(req: NextRequest) {
  const sadeceYayinda = req.nextUrl.searchParams.get("yayinda") === "true";

  const duyurular = await db.duyuru.findMany({
    where: sadeceYayinda ? { yayinda: true } : undefined,
    orderBy: { olusturuldu: "desc" },
  });

  return NextResponse.json(duyurular);
}

// POST /api/duyurular — yeni duyuru (admin gerekir)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.adminGirisYapti) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { baslik, icerik, baglanti, yayinda } = await req.json();

  if (!baslik?.trim() || !icerik?.trim()) {
    return NextResponse.json({ hata: "Başlık ve içerik zorunlu." }, { status: 400 });
  }

  try {
    const duyuru = await db.duyuru.create({
      data: {
        baslik: baslik.trim(),
        icerik: icerik.trim(),
        baglanti: baglanti?.trim() || null,
        yayinda: yayinda !== false,
      },
    });
    return NextResponse.json(duyuru, { status: 201 });
  } catch {
    return NextResponse.json({ hata: "Kayıt başarısız." }, { status: 500 });
  }
}
