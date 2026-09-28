-- ============================================================
-- DATABASE TEMA SAMPAH (PENGELOLAAN SAMPAH)
-- File Export SQL untuk PHPMyAdmin / MySQL
-- Database Name: pengelolaan_sampah_db
-- ============================================================

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `FotoSampah`;
DROP TABLE IF EXISTS `LaporanSampah`;
DROP TABLE IF EXISTS `PenukaranReward`;
DROP TABLE IF EXISTS `Reward`;
DROP TABLE IF EXISTS `ArtikelEdukasi`;
DROP TABLE IF EXISTS `KategoriArtikel`;
DROP TABLE IF EXISTS `JenisSampah`;
DROP TABLE IF EXISTS `Wilayah`;
DROP TABLE IF EXISTS `User`;
SET FOREIGN_KEY_CHECKS=1;

-- ------------------------------------------------------------
-- 1. TABEL User
-- Menyimpan data pengguna aplikasi (Warga & Admin)
-- ------------------------------------------------------------
CREATE TABLE `User` (
  `id` VARCHAR(36) NOT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `noHp` VARCHAR(50) NOT NULL,
  `nik` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  `poin` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_unique` (`email`),
  UNIQUE KEY `User_noHp_unique` (`noHp`),
  UNIQUE KEY `User_nik_unique` (`nik`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. TABEL JenisSampah
-- Master data jenis sampah (Organik, Anorganik, B3, Daur Ulang)
-- ------------------------------------------------------------
CREATE TABLE `JenisSampah` (
  `id` VARCHAR(36) NOT NULL,
  `namaJenis` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `JenisSampah_namaJenis_unique` (`namaJenis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. TABEL Wilayah
-- Master data lokasi/wilayah pengumpulan sampah
-- ------------------------------------------------------------
CREATE TABLE `Wilayah` (
  `id` VARCHAR(36) NOT NULL,
  `namaWilayah` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Wilayah_namaWilayah_unique` (`namaWilayah`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. TABEL LaporanSampah (Relasi 1-to-N)
-- Satu User dapat membuat Banyak Laporan
-- Satu JenisSampah dapat digunakan di Banyak Laporan
-- Satu Wilayah dapat memiliki Banyak Laporan
-- ------------------------------------------------------------
CREATE TABLE `LaporanSampah` (
  `id` VARCHAR(36) NOT NULL,
  `berat` DOUBLE NOT NULL,
  `tanggalLapor` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `catatan` TEXT DEFAULT NULL,
  `status` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `adminNote` TEXT DEFAULT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `jenisSampahId` VARCHAR(36) NOT NULL,
  `wilayahId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `LaporanSampah_composite_unique` (`userId`, `jenisSampahId`, `wilayahId`, `tanggalLapor`),
  KEY `LaporanSampah_userId_idx` (`userId`),
  KEY `LaporanSampah_jenisSampahId_idx` (`jenisSampahId`),
  KEY `LaporanSampah_wilayahId_idx` (`wilayahId`),
  CONSTRAINT `fk_laporan_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_laporan_jenis` FOREIGN KEY (`jenisSampahId`) REFERENCES `JenisSampah` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_laporan_wilayah` FOREIGN KEY (`wilayahId`) REFERENCES `Wilayah` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. TABEL FotoSampah (Relasi 1-to-1)
-- UNIQUE pada `laporanId` menjamin relasi TEPAT 1-to-1 dengan LaporanSampah
-- ------------------------------------------------------------
CREATE TABLE `FotoSampah` (
  `id` VARCHAR(36) NOT NULL,
  `imageUrl` VARCHAR(255) NOT NULL,
  `laporanId` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `FotoSampah_laporanId_unique` (`laporanId`),
  CONSTRAINT `fk_foto_laporan` FOREIGN KEY (`laporanId`) REFERENCES `LaporanSampah` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. TABEL Reward
-- Katalog hadiah/voucher yang dapat ditukarkan dengan poin
-- ------------------------------------------------------------
CREATE TABLE `Reward` (
  `id` VARCHAR(36) NOT NULL,
  `namaReward` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  `poinDibutuhkan` INT NOT NULL,
  `stok` INT NOT NULL DEFAULT 0,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. TABEL PenukaranReward (Relasi Many-to-Many / Junction Table)
-- Menghubungkan N User dengan N Reward
-- ------------------------------------------------------------
CREATE TABLE `PenukaranReward` (
  `id` VARCHAR(36) NOT NULL,
  `userId` VARCHAR(36) NOT NULL,
  `rewardId` VARCHAR(36) NOT NULL,
  `poinDigunakan` INT NOT NULL,
  `status` ENUM('PENDING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `tanggalTukar` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `PenukaranReward_userId_idx` (`userId`),
  KEY `PenukaranReward_rewardId_idx` (`rewardId`),
  CONSTRAINT `fk_penukaran_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_penukaran_reward` FOREIGN KEY (`rewardId`) REFERENCES `Reward` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. TABEL KategoriArtikel
-- Master data kategori edukasi pengelolaan sampah
-- ------------------------------------------------------------
CREATE TABLE `KategoriArtikel` (
  `id` VARCHAR(36) NOT NULL,
  `namaKategori` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `KategoriArtikel_namaKategori_unique` (`namaKategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. TABEL ArtikelEdukasi (Relasi 1-to-N)
-- Satu KategoriArtikel memuat Banyak ArtikelEdukasi
-- ------------------------------------------------------------
CREATE TABLE `ArtikelEdukasi` (
  `id` VARCHAR(36) NOT NULL,
  `judul` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `ringkasan` TEXT NOT NULL,
  `konten` LONGTEXT NOT NULL,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `viewsCount` INT NOT NULL DEFAULT 0,
  `isFeatured` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `kategoriId` VARCHAR(36) NOT NULL,
  `authorId` VARCHAR(36) DEFAULT NULL,
  `wilayahId` VARCHAR(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ArtikelEdukasi_slug_unique` (`slug`),
  KEY `ArtikelEdukasi_kategoriId_idx` (`kategoriId`),
  KEY `ArtikelEdukasi_authorId_idx` (`authorId`),
  KEY `ArtikelEdukasi_wilayahId_idx` (`wilayahId`),
  CONSTRAINT `fk_artikel_kategori` FOREIGN KEY (`kategoriId`) REFERENCES `KategoriArtikel` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_artikel_author` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_artikel_wilayah` FOREIGN KEY (`wilayahId`) REFERENCES `Wilayah` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DUMMY SEED DATA
-- ============================================================

INSERT INTO `JenisSampah` (`id`, `namaJenis`) VALUES
('j1', 'Plastik Daur Ulang'),
('j2', 'Kertas & Karton'),
('j3', 'Organik Kompos'),
('j4', 'B3 (Bahan Berbahaya & Beracun)');

INSERT INTO `Wilayah` (`id`, `namaWilayah`) VALUES
('w1', 'Kecamatan Bandung Sektor 01'),
('w2', 'Kecamatan Bandung Sektor 02'),
('w3', 'Kecamatan Bandung Sektor 03');

INSERT INTO `User` (`id`, `nama`, `email`, `noHp`, `nik`, `password`, `role`, `poin`) VALUES
('u1', 'Budi Santoso', 'budi@example.com', '081234567890', '3273011234560001', '$2a$10$hashedpass', 'USER', 150),
('u2', 'Siti Rahma', 'siti@example.com', '081234567891', '3273011234560002', '$2a$10$hashedpass', 'USER', 300),
('admin1', 'Admin Pengelolaan', 'admin@example.com', '081234567899', '3273011234560000', '$2a$10$hashedpass', 'ADMIN', 0);

INSERT INTO `LaporanSampah` (`id`, `berat`, `tanggalLapor`, `catatan`, `status`, `userId`, `jenisSampahId`, `wilayahId`) VALUES
('lap1', 5.2, CURRENT_TIMESTAMP, 'Botol plastik benih dan bersih', 'VERIFIED', 'u1', 'j1', 'w1'),
('lap2', 12.0, CURRENT_TIMESTAMP, 'Kardus bekas kardus tv', 'VERIFIED', 'u2', 'j2', 'w2');

INSERT INTO `FotoSampah` (`id`, `imageUrl`, `laporanId`) VALUES
('foto1', '/uploads/laporan_budi_plastik.jpg', 'lap1'),
('foto2', '/uploads/laporan_siti_kardus.jpg', 'lap2');

INSERT INTO `Reward` (`id`, `namaReward`, `deskripsi`, `poinDibutuhkan`, `stok`, `imageUrl`) VALUES
('r1', 'Voucher E-Wallet Rp 25.000', 'Voucher saldo e-wallet GoPay/OVO/Dana', 100, 50, '/images/voucher25k.png'),
('r2', 'Sembako Beras 5kg', 'Beras kualitas super 5kg', 250, 20, '/images/beras5kg.png');

INSERT INTO `PenukaranReward` (`id`, `userId`, `rewardId`, `poinDigunakan`, `status`) VALUES
('pen1', 'u1', 'r1', 100, 'COMPLETED'),
('pen2', 'u2', 'r2', 250, 'PENDING');
