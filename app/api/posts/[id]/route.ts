import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

// Ortak yetki kontrolü
async function yetkiKontrol() {
  const session = await getSession();
  if (!session.adminGirisYapti) return false;
  return true;
}

// GET /api/posts/[id] — tek yazı
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const yazi = await db.post.findUnique({ where: { id: parseInt(id, 10) } });
  if (!yazi) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  return NextResponse.json(yazi);
}

// PUT /api/posts/[id] — güncelle
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await yetkiKontrol())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const { baslik, slug, ozet, icerik, kapakGorsel, yayinda } = await req.json();

  try {
    const yazi = await db.post.update({
      where: { id: parseInt(id, 10) },
      data: { baslik, slug, ozet, icerik, kapakGorsel: kapakGorsel ?? null, yayinda: !!yayinda },
    });
    return NextResponse.json(yazi);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "code" in err && (err as { code: string }).code === "P2002") {
      return NextResponse.json({ hata: "Bu slug zaten kullanımda." }, { status: 409 });
    }
    return NextResponse.json({ hata: "Güncelleme başarısız." }, { status: 500 });
  }
}

// DELETE /api/posts/[id] — sil
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await yetkiKontrol())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.post.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ basarili: true });
  } catch {
    return NextResponse.json({ hata: "Silme başarısız." }, { status: 500 });
  }
}
