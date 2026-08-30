import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

async function yetkili() {
  const session = await getSession();
  return !!session.adminGirisYapti;
}

// PUT /api/duyurular/[id] — güncelle
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await yetkili())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const { baslik, icerik, baglanti, yayinda } = await req.json();

  try {
    const duyuru = await db.duyuru.update({
      where: { id: parseInt(id, 10) },
      data: {
        baslik: baslik?.trim(),
        icerik: icerik?.trim(),
        baglanti: baglanti?.trim() || null,
        yayinda: !!yayinda,
      },
    });
    return NextResponse.json(duyuru);
  } catch {
    return NextResponse.json({ hata: "Güncelleme başarısız." }, { status: 500 });
  }
}

// DELETE /api/duyurular/[id] — sil
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await yetkili())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;

  try {
    await db.duyuru.delete({ where: { id: parseInt(id, 10) } });
    return NextResponse.json({ basarili: true });
  } catch {
    return NextResponse.json({ hata: "Silme başarısız." }, { status: 500 });
  }
}
