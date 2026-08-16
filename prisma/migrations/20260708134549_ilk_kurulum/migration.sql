-- CreateTable
CREATE TABLE "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "baslik" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ozet" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "kapakGorsel" TEXT,
    "yayinda" BOOLEAN NOT NULL DEFAULT false,
    "olusturuldu" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellendi" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");
