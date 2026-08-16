import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { sifre } = await req.json();

    if (!sifre || typeof sifre !== "string") {
      return NextResponse.json({ hata: "Şifre gerekli." }, { status: 400 });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      return NextResponse.json({ hata: "Sunucu yapılandırma hatası." }, { status: 500 });
    }

    const dogru = await bcrypt.compare(sifre, hash);
    if (!dogru) {
      return NextResponse.json({ hata: "Yanlış şifre." }, { status: 401 });
    }

    const session = await getSession();
    session.adminGirisYapti = true;
    await session.save();

    return NextResponse.json({ basarili: true });
  } catch {
    return NextResponse.json({ hata: "Sunucu hatası." }, { status: 500 });
  }
}
