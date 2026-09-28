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
  // Seed KategoriArtikel
  const kategoriData = [
    { namaKategori: 'Regulasi & Kebijakan', deskripsi: 'Peraturan pemerintah terkait pengelolaan sampah DKI Jakarta' },
    { namaKategori: 'Bank Sampah', deskripsi: 'Informasi program Bank Sampah Unit di DKI Jakarta' },
    { namaKategori: 'Daur Ulang & Inovasi', deskripsi: 'Teknologi dan inovasi pengolahan sampah' },
    { namaKategori: 'Tips Lingkungan', deskripsi: 'Tips praktis menjaga lingkungan dan mengurangi sampah' },
  ]

  const kategoriMap = new Map<string, string>()
  for (const kat of kategoriData) {
    const k = await prisma.kategoriArtikel.upsert({
      where: { namaKategori: kat.namaKategori },
      update: {},
      create: kat,
    })
    kategoriMap.set(kat.namaKategori, k.id)
  }
  console.log('✅ Kategori Artikel seeded:', kategoriData.map((k) => k.namaKategori).join(', '))

  // Seed ArtikelEdukasi
  const artikelData = [
    {
      judul: 'Wajib Pilah Sampah dari Rumah: Implementasi Pergub DKI No. 77 Tahun 2020',
      slug: 'wajib-pilah-sampah-pergub-dki-77-2020',
      ringkasan: 'Pemerintah Provinsi DKI Jakarta mewajibkan seluruh warga memilah sampah organik dan anorganik dari tingkat rumah tangga sebelum diangkut ke TPS.',
      konten: `## Latar Belakang

Peraturan Gubernur DKI Jakarta Nomor 77 Tahun 2020 tentang Pengelolaan Sampah Lingkungan menjadi tonggak penting dalam upaya mengatasi permasalahan sampah di ibu kota. Regulasi ini mewajibkan seluruh warga Jakarta untuk memilah sampah dari sumbernya, yakni mulai dari tingkat rumah tangga, sebelum diangkut oleh petugas kebersihan ke Tempat Penampungan Sementara (TPS).

## Mengapa Pemilahan Penting?

Jakarta menghasilkan lebih dari 7.700 ton sampah per hari. Tanpa pemilahan yang baik, seluruh volume sampah ini berakhir di TPA Bantar Gebang yang kapasitasnya sudah sangat terbatas. Dengan memilah sampah, volume yang masuk ke TPA bisa dikurangi hingga 30-40%.

## Jenis Pemilahan yang Diwajibkan

- Sampah Organik: sisa makanan, daun, sayuran, buah busuk
- Sampah Anorganik: plastik, kertas, kaleng, botol kaca
- Sampah B3 (Bahan Berbahaya dan Beracun): baterai, lampu neon, obat kedaluwarsa
- Sampah Residu: popok bekas, pembalut, masker sekali pakai

## Sanksi Pelanggaran

Warga yang tidak mematuhi aturan pemilahan dapat dikenakan sanksi administratif berupa teguran tertulis, denda, hingga penghentian layanan pengangkutan sampah.

> Pemilahan sampah dari rumah adalah langkah kecil yang berdampak besar bagi Jakarta yang lebih bersih dan berkelanjutan.`,
      kategori: 'Regulasi & Kebijakan',
      isFeatured: true,
    },
    {
      judul: 'Mengenal Program Bank Sampah Unit (BSU) di Seluruh Kecamatan DKI Jakarta',
      slug: 'program-bank-sampah-unit-bsu-dki-jakarta',
      ringkasan: 'Bank Sampah Unit tersebar di setiap kecamatan DKI Jakarta sebagai solusi pengelolaan sampah berbasis masyarakat yang mengubah sampah menjadi nilai ekonomis.',
      konten: `## Apa Itu Bank Sampah Unit?

Bank Sampah Unit (BSU) adalah program pengelolaan sampah berbasis masyarakat yang memungkinkan warga untuk menyetorkan sampah anorganik yang sudah dipilah dan mendapatkan imbalan berupa uang atau poin. Program ini mirip dengan konsep menabung di bank, tetapi yang ditabung adalah sampah.

## Bagaimana Cara Kerjanya?

- Warga memilah dan membersihkan sampah anorganik di rumah
- Sampah dibawa ke BSU terdekat sesuai jadwal operasional
- Petugas BSU menimbang dan mencatat setoran sampah
- Nilai sampah dikonversi menjadi saldo tabungan warga
- Saldo bisa ditarik secara berkala atau digunakan untuk membayar kebutuhan

## Jenis Sampah yang Diterima

- Botol plastik PET (air mineral)
- Kardus dan kertas bekas
- Kaleng aluminium
- Botol kaca
- Minyak jelantah bekas
- Elektronik bekas (e-waste)

## Dampak Positif

Hingga saat ini, terdapat lebih dari 3.500 BSU yang tersebar di seluruh kecamatan DKI Jakarta. Program ini telah berhasil mengurangi volume sampah yang masuk ke TPA Bantar Gebang dan memberikan tambahan penghasilan bagi ribuan keluarga di Jakarta.

> Setiap kilogram sampah yang Anda setorkan ke Bank Sampah adalah kontribusi nyata untuk Jakarta yang lebih bersih.`,
      kategori: 'Bank Sampah',
      isFeatured: false,
    },
    {
      judul: 'Krisis Bantar Gebang: Solusi Teknologi RDF untuk Mengolah Sampah Jakarta',
      slug: 'krisis-bantar-gebang-solusi-teknologi-rdf',
      ringkasan: 'TPA Bantar Gebang yang menampung lebih dari 39 juta ton sampah kini mencari solusi melalui teknologi Refuse Derived Fuel (RDF) untuk mengubah sampah menjadi energi.',
      konten: `## Kondisi Terkini Bantar Gebang

TPA Bantar Gebang di Kota Bekasi telah beroperasi sejak tahun 1989 dan menjadi tempat pembuangan akhir bagi seluruh sampah DKI Jakarta. Dengan luas area 110 hektar, TPA ini menampung lebih dari 39 juta ton sampah dengan ketinggian tumpukan mencapai 30 meter di beberapa titik.

## Kapasitas yang Kian Menipis

Setiap hari, sekitar 7.700 ton sampah dari Jakarta diangkut ke Bantar Gebang menggunakan lebih dari 1.200 truk sampah. Para ahli memperkirakan TPA ini akan mencapai kapasitas maksimumnya dalam beberapa tahun ke depan jika tidak ada intervensi signifikan.

## Teknologi RDF sebagai Solusi

Refuse Derived Fuel (RDF) adalah teknologi yang mengolah sampah menjadi bahan bakar alternatif untuk industri semen dan pembangkit listrik.

> Teknologi RDF bukan hanya solusi untuk mengurangi timbunan sampah, tetapi juga mengubah masalah menjadi sumber energi terbarukan.`,
      kategori: 'Daur Ulang & Inovasi',
      isFeatured: false,
    },
    {
      judul: '10 Tips Mudah Mengurangi Sampah Plastik Sekali Pakai di Kehidupan Sehari-hari',
      slug: '10-tips-mengurangi-sampah-plastik-sekali-pakai',
      ringkasan: 'Panduan praktis bagi warga Jakarta untuk mengurangi penggunaan plastik sekali pakai dan beralih ke gaya hidup ramah lingkungan sehari-hari.',
      konten: `## Mengapa Harus Mengurangi Plastik?

Indonesia adalah penghasil sampah plastik laut terbesar kedua di dunia. Di Jakarta sendiri, sampah plastik menyumbang sekitar 14% dari total volume sampah harian.

## Tips Praktis

1. Bawa tas belanja kain sendiri
2. Gunakan tumbler dan botol minum isi ulang
3. Tolak sedotan dan alat makan plastik sekali pakai
4. Bawa wadah makanan saat membeli makanan bawa pulang
5. Kompos sisa makanan organik di rumah

> Setiap langkah kecil yang kita ambil hari ini menentukan kondisi lingkungan untuk generasi mendatang.`,
      kategori: 'Tips Lingkungan',
      isFeatured: false,
    },
    {
      judul: 'Polusi Udara Jakarta dan Hubungannya dengan Pengelolaan Sampah Terbuka',
      slug: 'polusi-udara-jakarta-pengelolaan-sampah-terbuka',
      ringkasan: 'Pembakaran dan penimbunan sampah terbuka di Jakarta berkontribusi signifikan terhadap polusi udara. Pengelolaan sampah yang baik adalah kunci udara bersih.',
      konten: `## Hubungan Sampah dan Polusi Udara

Pembakaran sampah secara terbuka menghasilkan gas berbahaya seperti dioksin, furan, dan partikel PM2.5 yang mencemari udara Jakarta. Pemilahan yang baik dan pengolahan yang ramah lingkungan dapat menekan polusi udara secara signifikan.`,
      kategori: 'Regulasi & Kebijakan',
      isFeatured: false,
    },
    {
      judul: 'Inovasi Daur Ulang Minyak Jelantah Menjadi Biodiesel di Jakarta',
      slug: 'inovasi-daur-ulang-minyak-jelantah-biodiesel-jakarta',
      ringkasan: 'Program pengumpulan minyak jelantah di Jakarta mengubah limbah dapur menjadi biodiesel ramah lingkungan, mengurangi pencemaran air dan mendukung energi terbarukan.',
      konten: `## Mengapa Minyak Jelantah Berbahaya?

Menuangkan minyak jelantah ke saluran air dapat menyumbat gorong-gorong dan mencemari badan air. Program konversi menjadi biodiesel menjadi solusi tepat guna yang ramah lingkungan dan bernilai ekonomis.`,
      kategori: 'Daur Ulang & Inovasi',
      isFeatured: false,
    },
  ]

  for (const art of artikelData) {
    const katId = kategoriMap.get(art.kategori)
    if (!katId) continue
    await prisma.artikelEdukasi.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        judul: art.judul,
        slug: art.slug,
        ringkasan: art.ringkasan,
        konten: art.konten,
        isFeatured: art.isFeatured,
        kategoriId: katId,
        viewsCount: Math.floor(Math.random() * 300) + 50,
      },
    })
  }
  console.log(`✅ Artikel Edukasi seeded: ${artikelData.length} items`)

  console.log('🎉 Seeding complete!')
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error('❌ Seed error:', e)
  process.exit(1)
})

