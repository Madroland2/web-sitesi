-- CreateTable
CREATE TABLE "Duyuru" (
    "id" SERIAL NOT NULL,
    "baslik" TEXT NOT NULL,
    "icerik" TEXT NOT NULL,
    "baglanti" TEXT,
    "yayinda" BOOLEAN NOT NULL DEFAULT true,
    "olusturuldu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellendi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Duyuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gorsel" (
    "id" SERIAL NOT NULL,
    "baslik" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altMetin" TEXT,
    "yayinda" BOOLEAN NOT NULL DEFAULT true,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "olusturuldu" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guncellendi" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gorsel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Duyuru_yayinda_olusturuldu_idx" ON "Duyuru"("yayinda", "olusturuldu");

-- CreateIndex
CREATE INDEX "Gorsel_yayinda_sira_idx" ON "Gorsel"("yayinda", "sira");
