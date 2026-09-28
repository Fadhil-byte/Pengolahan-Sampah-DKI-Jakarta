-- CreateTable
CREATE TABLE "KategoriArtikel" (
    "id" TEXT NOT NULL,
    "namaKategori" TEXT NOT NULL,
    "deskripsi" TEXT,

    CONSTRAINT "KategoriArtikel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtikelEdukasi" (
    "id" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "ringkasan" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "imageUrl" TEXT,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kategoriId" TEXT NOT NULL,
    "authorId" TEXT,
    "wilayahId" TEXT,

    CONSTRAINT "ArtikelEdukasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KategoriArtikel_namaKategori_key" ON "KategoriArtikel"("namaKategori");

-- CreateIndex
CREATE UNIQUE INDEX "ArtikelEdukasi_slug_key" ON "ArtikelEdukasi"("slug");

-- AddForeignKey
ALTER TABLE "ArtikelEdukasi" ADD CONSTRAINT "ArtikelEdukasi_kategoriId_fkey" FOREIGN KEY ("kategoriId") REFERENCES "KategoriArtikel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtikelEdukasi" ADD CONSTRAINT "ArtikelEdukasi_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtikelEdukasi" ADD CONSTRAINT "ArtikelEdukasi_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE SET NULL ON UPDATE CASCADE;
