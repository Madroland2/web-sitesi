import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

// GET /api/posts — tüm yazılar (sadece yayında olanlar için ?yayinda=true)
export async function GET(req: NextRequest) {
  const sadeceyayinda = req.nextUrl.searchParams.get("yayinda") === "true";

  const yazilar = await db.post.findMany({
    where: sadeceyayinda ? { yayinda: true } : undefined,
    orderBy: { olusturuldu: "desc" },
  });

  return NextResponse.json(yazilar);
}

// POST /api/posts — yeni yazı (admin gerekir)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.adminGirisYapti) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  try {
    const { baslik, slug, ozet, icerik, kapakGorsel, yayinda } = await req.json();

    if (!baslik || !slug || !ozet || !icerik) {
      return NextResponse.json({ hata: "Zorunlu alanlar eksik." }, { status: 400 });
    }

    const yazi = await db.post.create({
      data: { baslik, slug, ozet, icerik, kapakGorsel: kapakGorsel ?? null, yayinda: !!yayinda },
    });

    return NextResponse.json(yazi, { status: 201 });
  } catch (err: unknown) {
    // Prisma unique constraint hatası (slug zaten var)
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return NextResponse.json({ hata: "Bu slug zaten kullanımda." }, { status: 409 });
    }
    return NextResponse.json({ hata: "Sunucu hatası." }, { status: 500 });
  }
}
