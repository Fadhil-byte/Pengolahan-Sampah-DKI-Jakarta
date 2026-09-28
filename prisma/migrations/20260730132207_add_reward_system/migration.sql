-- CreateEnum
CREATE TYPE "StatusPenukaran" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "poin" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Reward" (
    "id" TEXT NOT NULL,
    "namaReward" TEXT NOT NULL,
    "deskripsi" TEXT,
    "poinDibutuhkan" INTEGER NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PenukaranReward" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rewardId" TEXT NOT NULL,
    "poinDigunakan" INTEGER NOT NULL,
    "status" "StatusPenukaran" NOT NULL DEFAULT 'PENDING',
    "tanggalTukar" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PenukaranReward_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PenukaranReward" ADD CONSTRAINT "PenukaranReward_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PenukaranReward" ADD CONSTRAINT "PenukaranReward_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
