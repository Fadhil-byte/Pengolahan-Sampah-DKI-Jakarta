import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  })
  const prisma = new PrismaClient({ adapter })

  console.log('🌱 Seeding database...')

  // Seed JenisSampah
  const jenisData = ['Organik', 'Anorganik', 'B3', 'Residu', 'Plastik']
  for (const namaJenis of jenisData) {
    await prisma.jenisSampah.upsert({
      where: { namaJenis },
      update: {},
      create: { namaJenis },
    })
  }
  console.log('✅ Jenis Sampah seeded:', jenisData.join(', '))

  // Seed Wilayah (Kecamatan DKI Jakarta)
  const wilayahData = [
    // Jakarta Pusat
    'Tanah Abang', 'Menteng', 'Senen', 'Johar Baru',
    'Cempaka Putih', 'Kemayoran', 'Sawah Besar', 'Gambir',
    // Jakarta Utara
    'Penjaringan', 'Pademangan', 'Tanjung Priok',
    'Koja', 'Kelapa Gading', 'Cilincing',
    // Jakarta Barat
    'Kembangan', 'Kebon Jeruk', 'Palmerah', 'Grogol Petamburan',
    'Tambora', 'Taman Sari', 'Cengkareng', 'Kalideres',
    // Jakarta Selatan
    'Kebayoran Baru', 'Kebayoran Lama', 'Pesanggrahan', 'Cilandak',
    'Pasar Minggu', 'Jagakarsa', 'Mampang Prapatan', 'Pancoran',
    'Tebet', 'Setiabudi',
    // Jakarta Timur
    'Matraman', 'Pulo Gadung', 'Jatinegara', 'Duren Sawit',
    'Kramat Jati', 'Makasar', 'Pasar Rebo', 'Ciracas',
    'Cipayung', 'Cakung',
    // Kepulauan Seribu
    'Kepulauan Seribu Utara', 'Kepulauan Seribu Selatan',
  ]

  for (const namaWilayah of wilayahData) {
    await prisma.wilayah.upsert({
      where: { namaWilayah },
      update: {},
      create: { namaWilayah },
    })
  }
  console.log(`✅ Wilayah seeded: ${wilayahData.length} kecamatan`)

  // Seed Initial Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sampahku.id' },
    update: { role: 'ADMIN' },
    create: {
      nama: 'Administrator DLH',
      email: 'admin@sampahku.id',
      noHp: '081234567890',
      nik: '3171010101010001',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created: admin@sampahku.id (Password: admin123)')

  // Seed Initial Demo User
  const userPassword = await bcrypt.hash('user123', 10)
  await prisma.user.upsert({
    where: { email: 'user@sampahku.id' },
    update: {},
    create: {
      nama: 'Budi Santoso',
      email: 'user@sampahku.id',
      noHp: '081987654321',
      nik: '3171010101010002',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('✅ Demo user created: user@sampahku.id (Password: user123)')

  // Seed Reward (Katalog Hadiah)
  const rewardData = [
    { namaReward: 'Pulsa 10.000', deskripsi: 'Voucher pulsa all operator senilai Rp10.000', poinDibutuhkan: 100, stok: 50, imageUrl: null },
    { namaReward: 'Saldo E-Wallet 25.000', deskripsi: 'Saldo GoPay/OVO/DANA senilai Rp25.000', poinDibutuhkan: 250, stok: 30, imageUrl: null },
    { namaReward: 'Token Listrik 50.000', deskripsi: 'Token listrik PLN prabayar senilai Rp50.000', poinDibutuhkan: 500, stok: 20, imageUrl: null },
    { namaReward: 'Paket Sembako', deskripsi: 'Paket sembako dasar (beras, minyak, gula)', poinDibutuhkan: 750, stok: 10, imageUrl: null },
    { namaReward: 'Voucher Belanja 100.000', deskripsi: 'Voucher belanja supermarket senilai Rp100.000', poinDibutuhkan: 1000, stok: 5, imageUrl: null },
    { namaReward: 'Tumbler Eco-Friendly', deskripsi: 'Tumbler stainless steel ramah lingkungan 500ml', poinDibutuhkan: 300, stok: 25, imageUrl: null },
  ]

  for (const reward of rewardData) {
    const existing = await prisma.reward.findFirst({
      where: { namaReward: reward.namaReward },
    })
    if (!existing) {
      await prisma.reward.create({ data: reward })
    } else {
      await prisma.reward.update({
        where: { id: existing.id },
        data: {
          stok: reward.stok,
          poinDibutuhkan: reward.poinDibutuhkan,
          deskripsi: reward.deskripsi,
        },
      })
    }
  }
  console.log(`✅ Rewards seeded: ${rewardData.length} items`)

  console.log('🎉 Seeding complete!')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('❌ Seed error:', e)
  process.exit(1)
})

