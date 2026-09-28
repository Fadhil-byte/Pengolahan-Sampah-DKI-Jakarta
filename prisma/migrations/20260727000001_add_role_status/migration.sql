-- Recreate enums and tables from scratch based on current schema.prisma
-- This migration replaces the old schema entirely

-- Drop old tables and types if they exist
DROP TABLE IF EXISTS "LaporanSampah" CASCADE;
DROP TABLE IF EXISTS "FotoSampah" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "JenisSampah" CASCADE;
DROP TABLE IF EXISTS "Wilayah" CASCADE;
DROP TYPE IF EXISTS "JenisSampah";
DROP TYPE IF EXISTS "Role";
DROP TYPE IF EXISTS "StatusLaporan";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatusLaporan" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateTable: User
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "noHp" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable: JenisSampah
CREATE TABLE "JenisSampah" (
    "id" TEXT NOT NULL,
    "namaJenis" TEXT NOT NULL,

    CONSTRAINT "JenisSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Wilayah
CREATE TABLE "Wilayah" (
    "id" TEXT NOT NULL,
    "namaWilayah" TEXT NOT NULL,

    CONSTRAINT "Wilayah_pkey" PRIMARY KEY ("id")
);

-- CreateTable: LaporanSampah
CREATE TABLE "LaporanSampah" (
    "id" TEXT NOT NULL,
    "berat" DOUBLE PRECISION NOT NULL,
    "tanggalLapor" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "catatan" TEXT,
    "status" "StatusLaporan" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "userId" TEXT NOT NULL,
    "jenisSampahId" TEXT NOT NULL,
    "wilayahId" TEXT NOT NULL,

    CONSTRAINT "LaporanSampah_pkey" PRIMARY KEY ("id")
);

-- CreateTable: FotoSampah
CREATE TABLE "FotoSampah" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "laporanId" TEXT NOT NULL,

    CONSTRAINT "FotoSampah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unique constraints
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_noHp_key" ON "User"("noHp");
CREATE UNIQUE INDEX "User_nik_key" ON "User"("nik");
CREATE UNIQUE INDEX "JenisSampah_namaJenis_key" ON "JenisSampah"("namaJenis");
CREATE UNIQUE INDEX "Wilayah_namaWilayah_key" ON "Wilayah"("namaWilayah");
CREATE UNIQUE INDEX "LaporanSampah_userId_jenisSampahId_wilayahId_tanggalLapor_key" ON "LaporanSampah"("userId", "jenisSampahId", "wilayahId", "tanggalLapor");
CREATE UNIQUE INDEX "FotoSampah_laporanId_key" ON "FotoSampah"("laporanId");

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_jenisSampahId_fkey" FOREIGN KEY ("jenisSampahId") REFERENCES "JenisSampah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_wilayahId_fkey" FOREIGN KEY ("wilayahId") REFERENCES "Wilayah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FotoSampah" ADD CONSTRAINT "FotoSampah_laporanId_fkey" FOREIGN KEY ("laporanId") REFERENCES "LaporanSampah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
