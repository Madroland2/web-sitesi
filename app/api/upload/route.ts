import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getSession } from "@/lib/auth";

// Tarayıcının gönderdiği MIME tipine güvenilmez; dosyanın ilk baytlarındaki
// imzaya (magic number) bakılır. Aksi halde .exe dosyası image/png etiketiyle
// yüklenebilir.
const IMZALAR: { tip: string; uzanti: string; imza: number[] }[] = [
  { tip: "image/jpeg", uzanti: "jpg", imza: [0xff, 0xd8, 0xff] },
  { tip: "image/png", uzanti: "png", imza: [0x89, 0x50, 0x4e, 0x47] },
  { tip: "image/gif", uzanti: "gif", imza: [0x47, 0x49, 0x46, 0x38] },
  { tip: "image/webp", uzanti: "webp", imza: [0x52, 0x49, 0x46, 0x46] }, // "RIFF"
];

const AZAMI_BOYUT = 8 * 1024 * 1024; // 8 MB

function tipiBelirle(bayt: Uint8Array): { tip: string; uzanti: string } | null {
  for (const aday of IMZALAR) {
    if (aday.imza.every((b, i) => bayt[i] === b)) {
      // WEBP'te "RIFF"ten sonra 8. bayttan itibaren "WEBP" yazar
      if (aday.uzanti === "webp") {
        const etiket = String.fromCharCode(...bayt.slice(8, 12));
        if (etiket !== "WEBP") continue;
      }
      return { tip: aday.tip, uzanti: aday.uzanti };
    }
  }
  return null;
}

// Dosya adını URL'de güvenli hale getirir
function adiTemizle(ad: string): string {
  return (
    ad
      .toLowerCase()
      .replace(/\.[^.]+$/, "") // uzantıyı at, imzadan gelenini kullanacağız
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "gorsel"
  );
}

// POST /api/upload — görsel yükler, genel URL döner (admin gerekir)
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.adminGirisYapti) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const dosya = form.get("dosya");

    if (!(dosya instanceof File)) {
      return NextResponse.json({ hata: "Dosya bulunamadı." }, { status: 400 });
    }

    if (dosya.size === 0) {
      return NextResponse.json({ hata: "Dosya boş." }, { status: 400 });
    }

    if (dosya.size > AZAMI_BOYUT) {
      return NextResponse.json(
        { hata: "Dosya 8 MB'tan büyük olamaz." },
        { status: 413 }
      );
    }

    const tampon = new Uint8Array(await dosya.arrayBuffer());
    const tur = tipiBelirle(tampon);

    if (!tur) {
      return NextResponse.json(
        { hata: "Yalnızca JPEG, PNG, GIF ve WEBP yüklenebilir." },
        { status: 415 }
      );
    }

    // addRandomSuffix, aynı adlı dosyaların birbirini ezmesini engeller.
    // Blob'a Buffer verilir; Uint8Array doğrudan kabul edilmiyor.
    const sonuc = await put(
      `gorseller/${adiTemizle(dosya.name)}.${tur.uzanti}`,
      Buffer.from(tampon),
      {
        access: "public",
        contentType: tur.tip,
        addRandomSuffix: true,
      }
    );

    return NextResponse.json({ url: sonuc.url }, { status: 201 });
  } catch {
    return NextResponse.json({ hata: "Yükleme başarısız." }, { status: 500 });
  }
}
