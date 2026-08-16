-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "baslik" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ozet" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "kapakGorsel" TEXT,
    "yayinda" BOOLEAN NOT NULL DEFAULT false,
    "olusturuldu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellendi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_slug_key" ON "Post"("slug");

-- CreateIndex
CREATE INDEX "Post_yayinda_olusturuldu_idx" ON "Post"("yayinda", "olusturuldu");
