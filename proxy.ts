import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";
import type { SessionData } from "@/lib/auth";

const COOKIE_ADI = "ws-admin-oturum";

// Korunan yollar: /admin/dashboard, /admin/yeni, /admin/duzenle/**
const KORUNAN_YOLLAR = ["/admin/dashboard", "/admin/yeni", "/admin/duzenle"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const korunuyor = KORUNAN_YOLLAR.some((yol) => pathname.startsWith(yol));
  if (!korunuyor) return NextResponse.next();

  try {
    const cookieDegeri = request.cookies.get(COOKIE_ADI)?.value;
    if (!cookieDegeri) throw new Error("Cookie yok");

    const session = await unsealData<SessionData>(cookieDegeri, {
      password: process.env.SESSION_SECRET as string,
    });

    if (!session.adminGirisYapti) throw new Error("Yetkisiz");
  } catch {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
