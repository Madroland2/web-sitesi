# Proje: Blog + 3 Oyunlu Web Sitesi

Bu dosya, Claude Code'un tokenı bitip konuşma kesildiğinde **kaldığın yerden devam etmek** için
yazılmıştır. Yeni bir konuşmada sadece şunu söyle:

> "web-sitesi projesine devam et, CLAUDE.md'yi oku"

---

## Projenin Özeti

Tek bir Next.js uygulaması içinde:
1. **Blog + Anasayfa** — yazı listesi, detay sayfası
2. **Admin Paneli** (`/admin`) — şifreli giriş, yazı ekle/düzenle/sil
3. **Oyun 1 — Buğulu Ayna XOX** — Canvas'ta buğu efektli tic-tac-toe
4. **Oyun 2 — Deniz Feneri ve Gemi** — kaçınma/navigasyon oyunu, 3 seviye
5. **Oyun 3 — Yasaklı Kelime Avı** — kitap arka kapağında yasaklı kelime var mı?

---

## Teknik Stack

| Katman | Seçim |
|--------|-------|
| Framework | Next.js 14 App Router |
| Veritabanı | SQLite + Prisma ORM |
| Auth | bcryptjs + iron-session (HTTP-only cookie) |
| Stil | Tailwind CSS |
| Oyunlar | HTML5 Canvas + React hooks (harici engine yok) |

### Renk Paleti
```
Arkaplan  : #0d1117
Yüzey     : #161b22
Kenarlık  : #30363d
Vurgu     : #58a6ff
Hata/Kırmızı : #f85149
Başarı/Yeşil : #3fb950
Metin Ana : #e6edf3
Metin İkil: #8b949e
```

### Güvenlik Notları
- Admin şifresi `.env.local`'de bcrypt hash olarak (`ADMIN_PASSWORD_HASH`)
- iron-session → AES-256 şifrelenmiş HTTP-only cookie
- `middleware.ts` → `/admin/**` her isteği doğrular
- Prisma → SQL injection riski yok

---

## Dosya Yapısı (hedef)

```
web-sitesi/
├── app/
│   ├── layout.tsx                  # Root layout (Header + Footer)
│   ├── globals.css
│   ├── page.tsx                    # Anasayfa — blog listesi
│   ├── blog/[slug]/page.tsx        # Blog detay
│   ├── oyunlar/
│   │   ├── page.tsx                # Oyunlar listesi
│   │   ├── xox/page.tsx
│   │   ├── fener/page.tsx
│   │   └── kelime/page.tsx
│   ├── admin/
│   │   ├── page.tsx                # Giriş formu
│   │   ├── dashboard/page.tsx
│   │   ├── yeni/page.tsx
│   │   └── duzenle/[id]/page.tsx
│   └── api/
│       ├── auth/login/route.ts
│       ├── auth/logout/route.ts
│       └── posts/
│           ├── route.ts            # GET liste, POST yeni
│           └── [id]/route.ts       # PUT güncelle, DELETE sil
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── BlogCard.tsx
│   ├── AdminGuard.tsx
│   └── games/
│       ├── XoxCanvas.tsx
│       ├── FenerCanvas.tsx
│       └── KelimeOyunu.tsx
├── lib/
│   ├── db.ts                       # Prisma client singleton
│   ├── auth.ts                     # iron-session config
│   └── oyun-verisi.ts              # 20 kelime + 50 metin (statik)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts                   # Route koruması
├── .env.local                      # SESSION_SECRET, ADMIN_PASSWORD_HASH
└── README.md
```

---

## Aşama Planı ve İlerleme Durumu

### ✅ = Tamamlandı | 🔄 = Devam ediyor | ⬜ = Başlanmadı

| # | Aşama | Durum | Notlar |
|---|-------|-------|--------|
| 1 | **İskelet + Tasarım** | ✅ | Next.js 16 + Prisma 5 + Tailwind v4 + Header/Footer |
| 2 | **Blog + Admin** | ✅ | Prisma SQLite, CRUD API, blog UI, admin paneli, auth |
| 3 | **Oyun 3 — Kelime Avı** | ✅ | 20 yasaklı kelime, 50 kitap metni, 8s sayaç, vurgulu geri bildirim |
| 4 | **Oyun 1 — Buğulu XOX** | ✅ | Canvas fog reveal, hover ghost, kazanan çizgisi, Web Audio, 2 oyunculu |
| 5 | **Oyun 2 — Deniz Feneri** | ⬜ | Canvas harita, gemi, fener, 3 seviye |
| 6 | **Cila + README** | ⬜ | Mobil test, hata, dokümantasyon |

---

## Önemli Teknik Notlar

- **Prisma**: v7 yerine v5 kullanılıyor (v7 SQLite için adapter zorunlu kıldı, gereksiz karmaşık)
- **Prisma import**: `@prisma/client` (klasik generator, `node_modules` içinde)
- **Next.js 16 + Tailwind v4**: CSS-first config (`@theme` bloku), `tailwind.config.ts` yok
- **proxy.ts**: Next.js 16'da `middleware.ts` → `proxy.ts` oldu (admin route koruması)
- **`npm run dev` ve `build`**: `--webpack` flag zorunlu (WASM binding sorunu)
- **Varsayılan admin şifresi**: `admin123` (.env.local'de ADMIN_PASSWORD_HASH)

## Kurulum Adımları (her şey sıfırdan)

```bash
cd /Users/kadir/web-sitesi

# 1. Bağımlılıkları yükle
npm install

# 2. Prisma veritabanını oluştur
npx prisma migrate dev --name init

# 3. .env.local dosyasını oluştur (örnek aşağıda)
# SESSION_SECRET=<en az 32 karakter rastgele string>
# ADMIN_PASSWORD_HASH=<bcryptjs ile üretilmiş hash>

# 4. Geliştirme sunucusunu başlat
npm run dev
```

---

## Devam Etme Talimatı (yeni konuşma için)

Yeni bir Claude Code konuşmasında şunu söyle:

```
/Users/kadir/web-sitesi klasöründeki projeye devam et.
CLAUDE.md dosyasını oku, hangi aşamada kaldığımıza bak
ve bir sonraki tamamlanmamış aşamadan başla.
```

Claude, CLAUDE.md'deki aşama tablosuna bakarak hangi aşamanın `⬜` olduğunu görecek
ve oradan devam edecek. Her aşama bittiğinde bu dosyadaki tabloyu `✅` olarak güncelleyecek.

---

## Oyun Veri Notları

- **Oyun 3 verisi** (`lib/oyun-verisi.ts`): 20 yasaklı kelime + 50 Türkçe kitap arka kapağı metni.
  Metinlerin ~%50'sinde yasaklı kelime var, ~%50'sinde yok. Hepsi statik veri, DB'ye gitmiyor.
- **Oyun 2 seviyeleri**: Seviye 1 (yavaş fener, az kara), Seviye 2 (orta), Seviye 3 (hızlı fener, çok kara).
- **Oyun 1**: 2 oyunculu yerel mod, kazanma/beraberlik kontrolü, Canvas üzerinde buğu katmanı.

---

## Önemli Kararlar ve Gerekçeler

1. **Tek admin kullanıcısı**: `User` tablosu yok, şifre `.env.local`'de hash olarak.
2. **Blog görseli URL ile**: Sunucu tarafı dosya yükleme yok (basitlik için).
3. **Blog içeriği Markdown**: Düz textarea, WYSIWYG editör eklenmedi.
4. **Ses efektleri Web Audio API**: Harici ses dosyası gerekmez.
