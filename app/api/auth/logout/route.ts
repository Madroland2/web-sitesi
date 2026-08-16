import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  session.destroy();
  // admin giriş sayfasına yönlendir
  return NextResponse.json({ basarili: true });
}
