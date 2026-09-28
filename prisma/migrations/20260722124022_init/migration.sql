-- CreateEnum
CREATE TYPE "JenisSampah" AS ENUM ('ORGANIK', 'ANORGANIK', 'B3', 'RESIDU', 'PLASTIK');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LaporanSampah" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "jenisSampah" "JenisSampah" NOT NULL,
    "beratKg" DOUBLE PRECISION NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "fotoUrl" TEXT,
    "catatan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LaporanSampah_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "LaporanSampah" ADD CONSTRAINT "LaporanSampah_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
