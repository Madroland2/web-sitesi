# Edebiyat Blogu + 3 Oyun

Edebiyat temalı kişisel site: blog, şifre korumalı yönetim paneli ve tarayıcıda
çalışan üç küçük oyun. Tek bir Next.js uygulaması, harici oyun motoru yok —
oyunlar HTML5 Canvas ve React hook'larıyla yazıldı.

## İçindekiler

| Bölüm | Yol | Açıklama |
|---|---|---|
| Blog | `/` | Yazı listesi ve detay sayfaları |
| Yönetim | `/admin` | Şifreli giriş; yazı ekleme, düzenleme, silme |
| Buğulu Ayna XOX | `/oyunlar` | Canvas üzerinde buğu efektli tic-tac-toe |
| Deniz Feneri ve Gemi | `/oyunlar` | Üç seviyeli kaçınma ve navigasyon oyunu |
| Yasaklı Kelime Avı | `/oyunlar` | Kitap arka kapağında yasaklı kelime var mı? |

## Teknik yapı

| Katman | Seçim |
|---|---|
| Framework | Next.js 16 (App Router) |
| Dil | TypeScript |
| Veritabanı | PostgreSQL + Prisma ORM |
| Oturum | iron-session (AES-256, HTTP-only çerez) |
| Parola | bcryptjs |
| Stil | Tailwind CSS v4 |
| Oyunlar | HTML5 Canvas + React |

Yönetim paneline gelen her istek `middleware.ts` üzerinden doğrulanır. Parola
veritabanında değil, ortam değişkeninde bcrypt özeti olarak tutulur.

## Yerel geliştirme

Docker ile (veritabanı dahil, önerilen):

```bash
cp .env.example .env.local   # SESSION_SECRET ve ADMIN_PASSWORD_HASH doldurun
docker compose up -d
```

Uygulama http://localhost:3000 adresinde açılır. PostgreSQL host tarafında
5433 portuna bağlanır (5432 başka bir projede kullanıldığı için).

Docker'sız çalıştırmak isterseniz kendi PostgreSQL örneğinizi kurup
`DATABASE_URL` değerini `.env.local` içinde tanımlayın, sonra:

```bash
npm install
npx prisma migrate deploy
npm run dev
```

## Ortam değişkenleri

`.env.example` dosyası şablon olarak izlenir; gerçek değerler `.env.local`
içinde tutulur ve sürüm kontrolüne **girmez**.

| Değişken | Ne işe yarar |
|---|---|
| `DATABASE_URL` | PostgreSQL bağlantı dizesi |
| `SESSION_SECRET` | Oturum çerezini şifreler, en az 32 karakter |
| `ADMIN_PASSWORD_HASH` | Yönetici parolasının bcrypt özeti |

Üretmek için:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "require('bcryptjs').hash('PAROLANIZ',12).then(h=>console.log(h))"
```

## Dağıtım

Uygulama sunucu tarafında çalışır (oturum, API rotaları, veritabanı), bu yüzden
statik barındırmaya uygun değildir — GitHub Pages ile yayınlanamaz. Vercel gibi
bir Node ortamı ve ayrı bir PostgreSQL örneği (Neon, Supabase, Vercel Postgres)
gerekir.

Sunucusuz ortamlarda bağlantı havuzlayan (pooled) veritabanı adresini kullanın;
her istek yeni bağlantı açarsa havuz hızla tükenir.

## Lisans

Kişisel proje, belirlenmiş bir lisansı yok.
