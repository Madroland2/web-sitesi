import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { del } from "@vercel/blob";

interface Params {
  params: Promise<{ id: string }>;
}

async function yetkili() {
  const session = await getSession();
  return !!session.adminGirisYapti;
}

// PUT /api/gorseller/[id] — güncelle
export async function PUT(req: NextRequest, { params }: Params) {
  if (!(await yetkili())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;
  const { baslik, altMetin, sira, yayinda } = await req.json();

  try {
    const gorsel = await db.gorsel.update({
      where: { id: parseInt(id, 10) },
      data: {
        baslik: baslik?.trim(),
        altMetin: altMetin?.trim() || null,
        sira: Number.isFinite(Number(sira)) ? Number(sira) : undefined,
        yayinda: !!yayinda,
      },
    });
    return NextResponse.json(gorsel);
  } catch {
    return NextResponse.json({ hata: "Güncelleme başarısız." }, { status: 500 });
  }
}

// DELETE /api/gorseller/[id] — kaydı ve dosyayı sil
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!(await yetkili())) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const gorsel = await db.gorsel.delete({ where: { id: parseInt(id, 10) } });

    // Depoda yetim dosya kalmasın. Blob silinemezse kayıt yine de gitmiş
    // olur — bu yüzden hata yutuluyor, işlem başarısız sayılmıyor.
    if (gorsel.url.includes("blob.vercel-storage.com")) {
      try {
        await del(gorsel.url);
      } catch {
        // yoksayılır
      }
    }

    return NextResponse.json({ basarili: true });
  } catch {
    return NextResponse.json({ hata: "Silme başarısız." }, { status: 500 });
  }
}
