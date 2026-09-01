# Proje: SONDÜŞ — Edebiyat Blogu + 3 Oyun

Bu dosya, konuşma kesildiğinde **kaldığın yerden devam etmek** için yazıldı.
Yeni bir konuşmada şunu söylemek yeterli:

> "web-sitesi projesine devam et, CLAUDE.md'yi oku"

**Bu depo herkese açıktır.** Buraya parola, token veya bağlantı dizesi yazma;
gerçek değerler aşağıda adı geçen git-ignore'lu dosyalardadır.

Son güncelleme: 2026-09-01

---

## Nerede yayında

| Ne | Nerede |
|----|--------|
| Site | https://web-sitesi-sage.vercel.app |
| Kod | https://github.com/Madroland2/web-sitesi (public) |
| Barındırma | Vercel — `web-sitesi/web-sitesi`, GitHub'a bağlı, her push'ta otomatik dağıtım |
| Veritabanı | Neon Postgres, proje `red-butterfly-84043070`, branch `production`, bölge **eu-central-1** |
| Dosya deposu | Vercel Blob, store `web-sitesi-gorseller` (public erişim) |

Dikkat: Neon hesabında **aynı adla ikinci bir proje** var
(`nameless-cell-50869289`, us-east-2). Kullanılan o değil, yukarıdaki.

### Gizli değerler nerede (hiçbiri depoda değil)

| Dosya | İçerik |
|-------|--------|
| `.env` | Neon'dan `neon link` ile çekilen 5 değişken |
| `.env.local` | `SESSION_SECRET`, `ADMIN_PASSWORD_HASH`, `BLOB_READ_WRITE_TOKEN` |
| `.vercel-kurulum/URETIM-DEGERLERI.txt` | Üretim değişkenleri + yönetici parolası |
| `~/.neon-key` | Neon API anahtarı (CLI bunu kullanıyor) |

---

## Teknik Stack

| Katman | Seçim |
|--------|-------|
| Framework | Next.js 16 App Router |
| Veritabanı | PostgreSQL (Neon) + Prisma 5 |
| Auth | bcryptjs + iron-session (HTTP-only cookie) |
| Stil | Tailwind CSS v4 (CSS-first `@theme`, config dosyası yok) |
| Editör | Tiptap — içerik HTML olarak saklanıyor |
| Sanitize | isomorphic-dompurify (`lib/icerik.ts`) |
| Görsel | Vercel Blob (`@vercel/blob`) |
| Oyunlar | HTML5 Canvas + React hooks |

### Renk paleti

Arayüz mavi tonlarında, edebiyat bölümü sıcak mürekkep tonlarında — ikisi
`app/globals.css` içindeki `@theme` blokunda tanımlı.

```
Arayüz : bg #0d1117 · yüzey #161b22 · kenarlık #30363d · vurgu #58a6ff
Edebiyat: metin #e9e2d4 · ikincil #a89e8c · yaldız #d4a24c · çizgi #3a332a
```

---

## Veri modeli (`prisma/schema.prisma`)

- **Post** — `baslik, slug, ozet, icerik (HTML), kapakGorsel, yayinda`
- **Duyuru** — `baslik, icerik (düz metin), baglanti, yayinda`
- **Gorsel** — `baslik, url (Blob), altMetin, sira, yayinda`

`datasource` iki adres kullanır: `url` havuzlanmış (uygulama),
`directUrl` havuzlanmamış (migration). Neon'da bu şart.

---

## Sayfa düzeni

Kök düzen üç sütun (`components/SayfaDuzeni.tsx`):

```
SOL PANEL           ORTA            SAĞ
Duyurular (son 3)   içerik          Instagram
Görseller (son 4)                   Kitapyurdu
Oyunlar
```

- Yan paneller sunucuda render edilip prop olarak geçer; `/admin` altında gizlenir.
- Mobilde sol panel içeriğin altına iner.
- **Sağ paneldeki adresler `lib/baglantilar.ts` içinde boş** — adres verilmeyen
  simge hiç gösterilmiyor. Kullanıcıdan Instagram ve Kitapyurdu adresleri bekleniyor.

---

## Aşama durumu

| # | Aşama | Durum |
|---|-------|-------|
| 1 | İskelet + tasarım | ✅ |
| 2 | Blog + admin + auth | ✅ |
| 3 | Oyun — Yasaklı Kelime Avı | ✅ |
| 4 | Oyun — Buğulu Ayna XOX | ✅ |
| 5 | **Oyun — Deniz Feneri** | ⬜ `app/oyunlar/fener/page.tsx` yer tutucu ("Oyun hazırlanıyor…"), `FenerCanvas.tsx` yok |
| 6 | Yayına alma (GitHub + Vercel + Neon) | ✅ |
| 7 | Yan paneller + duyuru/galeri + editör + görsel yükleme | ✅ |
| 8 | Cila, mobil test | ⬜ |

---

## Açık işler

1. **Deniz Feneri oyunu** — tek gerçek eksik özellik.
2. **Instagram / Kitapyurdu adresleri** — `lib/baglantilar.ts`, kullanıcı verecek.
3. **Blog boş** — `prisma/seed.mjs` hazır, üretimde hiç çalıştırılmadı.
4. **Site adı tutarsız** — anasayfa "SONDÜŞ" diyor ama header logosu ve
   `<title>` hâlâ "websitesi". Kullanıcı sadece anasayfayı istemişti.
5. **Lint hataları** — `components/games/XoxCanvas.tsx` ve `KelimeOyunu.tsx`
   içinde 5 hata (effect içinde setState, immutability). Eskiden beri var.
6. **Yerel derleyici bozuk** — `@next/swc-darwin-arm64` yüklenemiyor, Next.js
   yavaş WASM yedeğine düşüyor. Üretimi etkilemiyor; `npm rebuild` ile düzelir.

---

## Bilinmesi gereken kararlar

- **`export const dynamic = "force-dynamic"` kök düzende.** Zorunlu: sol panel
  her sayfada veritabanı okuyor, yoksa Next.js sayfaları derleme anında
  donduruyor ve admin'den eklenen içerik siteye yansımıyordu. Bedeli: oyun
  sayfaları da statik servis edilmiyor.
- **İçerik HTML, sanitize ediliyor.** Yazan yalnız admin ama yapıştırılan
  metinle script taşınabilir ve veritabanına giren HTML her ziyaretçide çalışır.
  Beyaz liste `lib/icerik.ts` içinde.
- **Yükleme türü baytlardan doğrulanıyor** (`app/api/upload/route.ts`), tarayıcının
  bildirdiği MIME'a güvenilmiyor. 8 MB sınır, JPEG/PNG/GIF/WEBP.
- **Eski düz metin yazılar** hem editörde hem gösterimde paragraflara bölünür —
  içerikte etiket yoksa `\n\n` ile ayrılır.
- **Prisma 5**, v7 değil (v7 gereksiz adapter zorunluluğu getirdi).
- **`proxy.ts`** — Next.js 16'da `middleware.ts` bu ada dönüştü, `/admin` korumalı.
- **`--webpack` flag'i** `dev` ve `build` betiklerinde zorunlu.

---

## Sık kullanılan komutlar

```bash
cd /Users/kadir/web-sitesi

npm run dev                  # yerel geliştirme (Docker'sız)
docker compose up -d         # yerel Postgres ile birlikte
npm run build                # derleme
npx tsc --noEmit             # tip kontrolü (lint'ten daha temiz sinyal)

npx prisma migrate dev --name <ad>   # şema değişikliği (Neon'a gider!)
npx prisma studio                    # veriyi gözle

vercel deploy --prod --yes   # elle dağıtım (push zaten tetikliyor)
vercel env ls                # üretim değişkenleri
```

Neon CLI için: `export NEON_API_KEY=$(cat ~/.neon-key)` sonra `npx neon@latest …`

**Uyarı:** `.env` içindeki `DATABASE_URL` üretim veritabanını gösteriyor. Host'tan
çalıştırılan Prisma komutları doğrudan **canlı veriye** dokunur. Docker ile
çalışırken compose kendi yerel Postgres'ini dayattığı için uygulama etkilenmez.

---

## Oyun veri notları

- `lib/oyun-verisi.ts` — 20 yasaklı kelime + 50 Türkçe arka kapak metni, statik.
- XOX: 2 oyunculu yerel mod, Canvas buğu katmanı, Web Audio ile ses.
- Fener (yapılacak): Canvas harita, gemi, dönen fener ışığı, 3 seviye.
