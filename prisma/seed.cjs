// Seed script using raw pg (no TypeScript compilation needed)
require('dotenv/config')
const { Client } = require('pg')
const { randomUUID } = require('crypto')

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  console.log('🌱 Seeding database...')

  // Seed JenisSampah
  const jenisData = ['Organik', 'Anorganik', 'B3', 'Residu', 'Plastik']
  for (const namaJenis of jenisData) {
    await client.query(
      `INSERT INTO "JenisSampah" (id, "namaJenis")
       VALUES ($1, $2)
       ON CONFLICT ("namaJenis") DO NOTHING`,
      [randomUUID(), namaJenis]
    )
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
    await client.query(
      `INSERT INTO "Wilayah" (id, "namaWilayah")
       VALUES ($1, $2)
       ON CONFLICT ("namaWilayah") DO NOTHING`,
      [randomUUID(), namaWilayah]
    )
  }
  console.log(`✅ Wilayah seeded: ${wilayahData.length} kecamatan`)

  // Seed KategoriArtikel
  const kategoriData = [
    { nama: 'Regulasi & Kebijakan', deskripsi: 'Peraturan pemerintah terkait pengelolaan sampah DKI Jakarta' },
    { nama: 'Bank Sampah', deskripsi: 'Informasi program Bank Sampah Unit di DKI Jakarta' },
    { nama: 'Daur Ulang & Inovasi', deskripsi: 'Teknologi dan inovasi pengolahan sampah' },
    { nama: 'Tips Lingkungan', deskripsi: 'Tips praktis menjaga lingkungan dan mengurangi sampah' },
  ]

  const kategoriIds = {}
  for (const kat of kategoriData) {
    const id = randomUUID()
    await client.query(
      `INSERT INTO "KategoriArtikel" (id, "namaKategori", deskripsi)
       VALUES ($1, $2, $3)
       ON CONFLICT ("namaKategori") DO NOTHING`,
      [id, kat.nama, kat.deskripsi]
    )
    // Get the actual ID (might exist already)
    const res = await client.query(
      `SELECT id FROM "KategoriArtikel" WHERE "namaKategori" = $1`,
      [kat.nama]
    )
    kategoriIds[kat.nama] = res.rows[0].id
  }
  console.log('✅ Kategori Artikel seeded:', kategoriData.map(k => k.nama).join(', '))

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

Refuse Derived Fuel (RDF) adalah teknologi yang mengolah sampah menjadi bahan bakar alternatif untuk industri semen dan pembangkit listrik. Proses ini meliputi:

- Pemilahan sampah yang bisa diolah
- Pengeringan untuk mengurangi kadar air
- Pencacahan menjadi ukuran seragam
- Pemadatan menjadi pelet bahan bakar

## Implementasi di Jakarta

Pemerintah DKI Jakarta telah menginisiasi pembangunan fasilitas pengolahan RDF di area Bantar Gebang dengan kapasitas pengolahan 2.000 ton per hari. Fasilitas ini diharapkan dapat mengurangi volume sampah yang ditimbun secara signifikan.

> Teknologi RDF bukan hanya solusi untuk mengurangi timbunan sampah, tetapi juga mengubah masalah menjadi sumber energi terbarukan.`,
      kategori: 'Daur Ulang & Inovasi',
      isFeatured: false,
    },
    {
      judul: '10 Tips Mudah Mengurangi Sampah Plastik Sekali Pakai di Kehidupan Sehari-hari',
      slug: '10-tips-mengurangi-sampah-plastik-sekali-pakai',
      ringkasan: 'Panduan praktis bagi warga Jakarta untuk mengurangi penggunaan plastik sekali pakai dan beralih ke gaya hidup ramah lingkungan sehari-hari.',
      konten: `## Mengapa Harus Mengurangi Plastik?

Indonesia adalah penghasil sampah plastik laut terbesar kedua di dunia. Di Jakarta sendiri, sampah plastik menyumbang sekitar 14% dari total volume sampah harian. Plastik sekali pakai membutuhkan waktu 400-1.000 tahun untuk terurai secara alami.

## 10 Tips Praktis

### 1. Bawa Tas Belanja Sendiri
Selalu siapkan tas belanja kain yang bisa dilipat di dalam tas Anda. Satu tas kain bisa menggantikan ratusan kantong plastik dalam setahun.

### 2. Gunakan Tumbler dan Botol Minum
Investasikan pada tumbler dan botol minum berkualitas. Selain ramah lingkungan, ini juga menghemat pengeluaran Anda.

### 3. Tolak Sedotan Plastik
Minum langsung dari gelas atau gunakan sedotan stainless steel dan bambu yang bisa dicuci ulang.

### 4. Bawa Wadah Makanan Sendiri
Saat membeli makanan takeaway, gunakan wadah makanan sendiri untuk menghindari kemasan styrofoam.

### 5. Pilih Produk Refill
Banyak toko di Jakarta kini menyediakan layanan refill untuk sabun, detergen, dan produk pembersih lainnya.

### 6. Kompos Sisa Makanan
Ubah sisa makanan menjadi kompos yang bisa digunakan untuk menyuburkan tanaman.

### 7. Pilih Produk dengan Kemasan Minimal
Saat berbelanja, pilih produk dengan kemasan yang bisa didaur ulang atau tanpa kemasan berlebih.

### 8. Manfaatkan Bank Sampah
Setorkan sampah anorganik ke Bank Sampah Unit terdekat untuk mendapat nilai ekonomis.

### 9. Ajak Keluarga dan Tetangga
Gerakan mengurangi plastik akan lebih efektif jika dilakukan bersama-sama dalam komunitas.

### 10. Edukasi Anak Sejak Dini
Ajarkan anak-anak tentang pentingnya menjaga lingkungan dan mengurangi sampah plastik.

> Setiap langkah kecil yang kita ambil hari ini menentukan kondisi lingkungan untuk generasi mendatang.`,
      kategori: 'Tips Lingkungan',
      isFeatured: false,
    },
    {
      judul: 'Polusi Udara Jakarta dan Hubungannya dengan Pengelolaan Sampah Terbuka',
      slug: 'polusi-udara-jakarta-pengelolaan-sampah-terbuka',
      ringkasan: 'Pembakaran dan penimbunan sampah terbuka di Jakarta berkontribusi signifikan terhadap polusi udara. Pengelolaan sampah yang baik adalah kunci udara bersih.',
      konten: `## Jakarta dan Masalah Polusi Udara

Jakarta secara konsisten masuk dalam daftar kota dengan kualitas udara terburuk di dunia. Indeks Kualitas Udara (AQI) Jakarta sering kali berada di level tidak sehat, terutama pada musim kemarau. Salah satu kontributor utama polusi udara ini adalah pengelolaan sampah yang tidak tepat.

## Dampak Pembakaran Sampah Terbuka

Pembakaran sampah di ruang terbuka masih menjadi praktik umum di beberapa wilayah Jakarta, terutama di area permukiman padat. Praktik ini menghasilkan berbagai polutan berbahaya, termasuk karbon monoksida, partikel halus PM2.5, dioksin, dan furan yang sangat berbahaya bagi kesehatan.

## Gas Metana dari TPA

Timbunan sampah organik di TPA Bantar Gebang menghasilkan gas metana dalam jumlah besar. Gas metana memiliki efek pemanasan global 25 kali lebih kuat dibandingkan karbondioksida. Selain itu, bau tidak sedap dari TPA mempengaruhi kualitas hidup warga sekitar.

## Solusi yang Bisa Dilakukan

- Pemilahan sampah dari sumber untuk mengurangi volume di TPA
- Pengomposan sampah organik di tingkat rumah tangga dan komunitas
- Penerapan teknologi waste-to-energy yang ramah lingkungan
- Peningkatan cakupan pengangkutan sampah oleh Dinas Lingkungan Hidup
- Penegakan hukum terhadap praktik pembakaran sampah ilegal

> Udara bersih Jakarta dimulai dari bagaimana kita mengelola sampah. Setiap sampah yang dipilah dan tidak dibakar adalah napas segar bagi ibu kota.`,
      kategori: 'Regulasi & Kebijakan',
      isFeatured: false,
    },
    {
      judul: 'Inovasi Daur Ulang Minyak Jelantah Menjadi Biodiesel di Jakarta',
      slug: 'inovasi-daur-ulang-minyak-jelantah-biodiesel-jakarta',
      ringkasan: 'Program pengumpulan minyak jelantah di Jakarta mengubah limbah dapur menjadi biodiesel ramah lingkungan, mengurangi pencemaran air dan mendukung energi terbarukan.',
      konten: `## Masalah Minyak Jelantah di Jakarta

Minyak goreng bekas atau jelantah adalah salah satu limbah rumah tangga yang sering diabaikan. Di Jakarta, diperkirakan ribuan liter minyak jelantah dibuang ke saluran air setiap hari, menyebabkan penyumbatan drainase dan pencemaran sungai.

## Program Pengumpulan Minyak Jelantah

Dinas Lingkungan Hidup DKI Jakarta bersama beberapa startup lingkungan telah menginisiasi program pengumpulan minyak jelantah dari rumah tangga, restoran, dan pedagang kaki lima. Warga bisa menyetorkan minyak jelantah ke titik-titik pengumpulan yang tersebar di setiap kelurahan.

## Proses Pengolahan Menjadi Biodiesel

- Pengumpulan minyak jelantah dari berbagai sumber
- Penyaringan untuk menghilangkan sisa makanan
- Proses transesterifikasi untuk mengubah minyak menjadi biodiesel
- Pengujian kualitas sesuai standar SNI
- Distribusi sebagai bahan bakar campuran untuk kendaraan dan mesin industri

## Manfaat Lingkungan dan Ekonomi

Setiap liter minyak jelantah yang didaur ulang mencegah pencemaran hingga 1.000 liter air bersih. Program ini juga menciptakan lapangan kerja baru dan mengurangi ketergantungan pada bahan bakar fosil.

## Cara Berpartisipasi

Warga Jakarta bisa mulai berpartisipasi dengan langkah sederhana: kumpulkan minyak goreng bekas dalam botol bekas, bawa ke Bank Sampah Unit atau titik pengumpulan terdekat, dan dapatkan poin atau insentif sebagai imbalannya.

> Jangan buang minyak jelantah ke saluran air. Setorkan ke Bank Sampah dan jadikan bagian dari solusi energi terbarukan Jakarta.`,
      kategori: 'Daur Ulang & Inovasi',
      isFeatured: false,
    },
  ]

  for (const art of artikelData) {
    const katId = kategoriIds[art.kategori]
    if (!katId) continue
    await client.query(
      `INSERT INTO "ArtikelEdukasi" (id, judul, slug, ringkasan, konten, "imageUrl", "viewsCount", "isFeatured", "createdAt", "updatedAt", "kategoriId", "authorId", "wilayahId")
       VALUES ($1, $2, $3, $4, $5, NULL, $6, $7, NOW(), NOW(), $8, NULL, NULL)
       ON CONFLICT (slug) DO NOTHING`,
      [
        randomUUID(),
        art.judul,
        art.slug,
        art.ringkasan,
        art.konten,
        Math.floor(Math.random() * 500) + 50,
        art.isFeatured,
        katId,
      ]
    )
  }
  console.log(`✅ Artikel Edukasi seeded: ${artikelData.length} artikel`)

  await client.end()
  console.log('🎉 Seeding complete!')
}

main().catch((e) => {
  console.error('❌ Seed error:', e)
  process.exit(1)
})
