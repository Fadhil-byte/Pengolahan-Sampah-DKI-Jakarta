# BUKU PANDUAN PENGGUNA (USER MANUAL)
## Sistem Informasi dan Platform Pengolahan Sampah DKI Jakarta

---

### DAFTAR ISI
1. [Tentang Sistem](#1-tentang-sistem)
2. [Hak Akses & Peran Pengguna (Roles)](#2-hak-akses--peran-pengguna-roles)
3. [Panduan Pengguna Publik (Tamu / Pengunjung)](#3-panduan-pengguna-publik-tamu--pengunjung)
   - 3.1 [Melihat Beranda & Statistik](#31-melihat-beranda--statistik)
   - 3.2 [Membaca Artikel Edukasi 3R](#32-membaca-artikel-edukasi-3r)
   - 3.3 [Pendaftaran Akun Baru (Register)](#33-pendaftaran-akun-baru-register)
   - 3.4 [Masuk ke Sistem (Login)](#34-masuk-ke-sistem-login)
4. [Panduan Pengguna Warga (User Dashboard)](#4-panduan-pengguna-warga-user-dashboard)
   - 4.1 [Memahami Tampilan Dashboard](#41-memahami-tampilan-dashboard)
   - 4.2 [Langkah Menyetorkan / Melaporkan Sampah](#42-langkah-menyetorkan--melaporkan-sampah)
   - 4.3 [Memantau Status Laporan & Poin](#43-memantau-status-laporan--poin)
   - 4.4 [Mengubah (Edit) Data Laporan](#44-mengubah-edit-data-laporan)
   - 4.5 [Katalog & Penukaran Reward (Hadiah)](#45-katalog--penukaran-reward-hadiah)
   - 4.6 [Pengaturan Akun & Keamanan Kata Sandi](#46-pengaturan-akun--keamanan-kata-sandi)
5. [Panduan Administrator (Admin Panel)](#5-panduan-administrator-admin-panel)
   - 5.1 [Mengakses Panel Admin](#51-mengakses-panel-admin)
   - 5.2 [Dashboard Ringkasan & Monitoring Wilayah](#52-dashboard-ringkasan--monitoring-wilayah)
   - 5.3 [Verifikasi Setoran Sampah Warga](#53-verifikasi-setoran-sampah-warga)
   - 5.4 [Manajemen Master Data (Jenis Sampah & Wilayah)](#54-manajemen-master-data-jenis-sampah--wilayah)
   - 5.5 [Manajemen Hadiah (Reward Management)](#55-manajemen-hadiah-reward-management)
   - 5.6 [Manajemen Artikel Edukasi](#56-manajemen-artikel-edukasi)
   - 5.7 [Manajemen Data Pengguna (Users)](#57-manajemen-data-pengguna-users)
6. [Tanya Jawab Umum (FAQ) & Troubleshooting](#6-tanya-jawab-umum-faq--troubleshooting)

---

## 1. Tentang Sistem

**Platform Pengolahan Sampah DKI Jakarta** adalah sistem berbasis web yang dirancang untuk memfasilitasi partisipasi aktif masyarakat DKI Jakarta dalam pengelolaan, pemilahan, dan penyetoran sampah terpilah berbasis insentif (reward points).

Aplikasi ini mengintegrasikan peran warga, petugas operasional/admin, dan Dinas Lingkungan Hidup guna mewujudkan Jakarta Bersih dan sirkular ekonomi melalui prinsip **3R (Reduce, Reuse, Recycle)**.

---

## 2. Hak Akses & Peran Pengguna (Roles)

| Peran (Role) | Deskripsi | Akses Halaman |
|---|---|---|
| **Publik / Guest** | Pengunjung umum yang belum mendaftar atau login. | Beranda, Artikel Edukasi Lingkungan, Form Registrasi, Form Login. |
| **Warga (USER)** | Masyarakat yang memiliki akun terdaftar untuk menyetor sampah dan mengumpulkan poin. | Dashboard Warga, Form Setor Sampah, Riwayat Laporan, Katalog & Tukar Reward, Pengaturan Profil. |
| **Petugas / Admin (ADMIN)** | Tim verifikator dan pengelola operasional data persampahan. | Admin Dashboard, Verifikasi Laporan, Master Data Jenis Sampah & Wilayah, Kelola Hadiah, Kelola Artikel, Kelola Pengguna. |

---

## 3. Panduan Pengguna Publik (Tamu / Pengunjung)

### 3.1 Melihat Beranda & Statistik
1. Buka tautan situs di peramban web (browser).
2. Di halaman utama, Anda dapat melihat:
   - Visi dan misi pengelolaan sampah DKI Jakarta.
   - Peta & ringkasan wilayah layanan 5 Kota Administrasi & Kepulauan Seribu.
   - Cara kerja program: **Pilah Sampah $\rightarrow$ Setor & Lapor $\rightarrow$ Verifikasi Petugas $\rightarrow$ Dapatkan Poin $\rightarrow$ Tukar Hadiah**.

### 3.2 Membaca Artikel Edukasi 3R
1. Klik menu **"Artikel"** pada bilah navigasi (Navbar).
2. Pilih artikel edukasi yang ingin dibaca (misalnya tips memilah sampah organik, cara mendaur ulang plastik, penanganan limbah B3/elektronik).
3. Klik judul atau tombol **"Baca Selengkapnya"** untuk membaca isi artikel secara utuh.

### 3.3 Pendaftaran Akun Baru (Register)
1. Klik tombol **"Daftar"** di sudut kanan atas bilah navigasi.
2. Isi formulir pendaftaran:
   - **Nama Lengkap**: Sesuai KTP / identitas resmi.
   - **Alamat Email**: Email aktif yang dapat dihubungi.
   - **Nomor Telepon**: Nomor WhatsApp aktif.
   - **Kata Sandi**: Minimal 6 karakter aman.
3. Klik tombol **"Daftar Sekarang"**.
4. Sistem akan membuatkan akun secara otomatis dan mengarahkan Anda ke halaman login.

### 3.4 Masuk ke Sistem (Login)
1. Klik menu **"Masuk"**.
2. Masukkan **Email** dan **Kata Sandi** terdaftar.
3. Klik **"Masuk"**.
4. Jika kredensial cocok:
   - Pengguna dengan peran `USER` akan diarahkan ke `/dashboard`.
   - Pengguna dengan peran `ADMIN` akan diarahkan ke `/admin`.

---

## 4. Panduan Pengguna Warga (User Dashboard)

### 4.1 Memahami Tampilan Dashboard
Setelah login sebagai warga, Anda berada di halaman **Dashboard Utama**:
- **Kartu Ringkasan**:
  - **Saldo Poin Reward**: Total poin aktif yang dapat ditukarkan hadiah.
  - **Total Berat Sampah Disetor**: Akumulasi kilogram (kg) sampah yang berhasil didaur ulang.
  - **Status Laporan**: Jumlah laporan dengan status *Menunggu Verifikasi*, *Terverifikasi*, dan *Ditolak*.
- **Tabel Riwayat Laporan Terakhir**: Daftar transaksi penyetoran sampah lengkap dengan tanggal, jenis sampah, wilayah, dan status.

### 4.2 Langkah Menyetorkan / Melaporkan Sampah
1. Dari menu navigasi atau dashboard, klik tombol **"Setor Sampah"** atau **"+ Buat Laporan Baru"**.
2. Lengkapi formulir penyetoran:
   - **Kategori / Jenis Sampah**: Pilih kategori (misal: *Plastik PET/HDPE, Kertas/Karton, Logam/Kaleng, Minyak Jelantah, Elektronik/B3*).
   - **Estimasi Berat (Kg)**: Masukkan taksiran berat sampah dalam satuan kilogram.
   - **Wilayah / Kota Administrasi**: Pilih wilayah DKI Jakarta (misal: *Jakarta Selatan, Jakarta Pusat, dll*).
   - **Kecamatan**: Pilih kecamatan terkait lokasi penjemputan/setor.
   - **Alamat Lengkap / Titik Temu**: Masukkan rincian nama jalan, RT/RW, nomor rumah, atau patokan.
   - **Unggah Foto Bukti**: Lampirkan foto kondisi fisik sampah yang sudah dipilah rapi (format PNG/JPG).
   - **Catatan Tambahan (Opsional)**: Instruksi khusus untuk petugas (misal: "Sampah diletakkan di teras depan").
3. Tekan tombol **"Kirim Laporan"**.
4. Laporan Anda berhasil masuk ke antrean dengan status **PENDING** (Menunggu Verifikasi).

### 4.3 Memantau Status Laporan & Poin
Setiap laporan memiliki 3 kemungkinan status verifikasi:
1. **Menunggu (PENDING)**: Laporan telah diterima oleh sistem dan sedang menunggu giliran pengecekan/penimbangan oleh petugas.
2. **Terverifikasi (VERIFIED)**: Sampah telah diverifikasi fisik dan ditimbang oleh petugas. **Poin reward otomatis ditambahkan ke saldo akun Anda.**
3. **Ditolak (REJECTED)**: Laporan tidak memenuhi kriteria (misal: foto tidak jelas, sampah tercampur kotor, atau alamat fiktif). Alasan penolakan dapat dilihat pada detail laporan.

### 4.4 Mengubah (Edit) Data Laporan
- Warga hanya dapat mengubah detail laporan jika status laporan masih **PENDING**.
- Buka detail laporan, klik tombol **"Edit"**, perbarui data atau foto, lalu simpan perubahan.
- Laporan yang telah berstatus *VERIFIED* atau *REJECTED* terkunci demi integritas data audit.

### 4.5 Katalog & Penukaran Reward (Hadiah)
1. Klik menu **"Rewards"** pada bilah navigasi.
2. Anda akan melihat katalog hadiah yang tersedia (Voucher Belanja, Saldo E-Wallet/Gopay/OVO, Sembako, Komposter Mini, Tumbler Ramah Lingkungan).
3. Setiap hadiah menampilkan informasi:
   - Jumlah poin yang dibutuhkan.
   - Sisa kuota / stok hadiah yang tersedia.
4. Klik tombol **"Tukarkan Poin"** pada hadiah yang Anda pilih.
5. Konfirmasi penukaran. Poin Anda akan terpotong secara otomatis dan riwayat penukaran akan tercatat di daftar klaim.

### 4.6 Pengaturan Akun & Keamanan Kata Sandi
1. Klik menu **"Profil"**.
2. Anda dapat memperbarui informasi nama dan nomor telepon.
3. Untuk memperbarui keamanan:
   - Masukkan kata sandi saat ini.
   - Masukkan kata sandi baru (minimal 6 karakter).
   - Klik **"Simpan Perubahan"**.

---

## 5. Panduan Administrator (Admin Panel)

Portal Administrator dapat diakses melalui rute `/admin` oleh akun yang memiliki hak akses role `ADMIN`.

### 5.1 Mengakses Panel Admin
1. Pastikan Anda telah login menggunakan akun Admin.
2. Akses menu Admin melalui tombol **"Panel Admin"** di bilah atas.
3. Sidebar sebelah kiri menyediakan menu:
   - **Dashboard**: Ringkasan performa dan metrik.
   - **Verifikasi Laporan**: Validasi laporan sampah masuk.
   - **Master Data**: Konfigurasi jenis sampah & wilayah.
   - **Kelola Reward**: Katalog hadiah & penukaran warga.
   - **Artikel Edukasi**: Manajemen konten edukatif.
   - **Kelola Users**: Monitoring akun pengguna.

### 5.2 Dashboard Ringkasan & Monitoring Wilayah
- **Metrik Utama**: Total sampah terkelola (kg), total transaksi verifikasi, peredaran poin reward, dan jumlah warga aktif.
- **Peta/Statistik Sebaran Wilayah**: Memantau volume timbulan sampah per Kota Administrasi di DKI Jakarta untuk penentuan fokus operasional armada.

### 5.3 Verifikasi Setoran Sampah Warga
1. Masuk ke menu **"Verifikasi Laporan"**.
2. Filter laporan berdasarkan status `PENDING`.
3. Klik tombol **"Periksa"** pada salah satu laporan warga:
   - Periksa foto bukti sampah yang diunggah warga.
   - Periksa kesesuaian kategori sampah dan alamat penjemputan.
   - Masukkan **Berat Riil (kg)** hasil penimbangan lapangan oleh petugas.
4. Tentukan Keputusan:
   - **Setujui (Approve / Verifikasi)**: Sistem akan mengalikan berat riil dengan tarif poin jenis sampah tersebut, lalu mentransfer poin ke saldo warga secara instan.
   - **Tolak (Reject)**: Masukkan catatan alasan penolakan (misal: "Bukan jenis plastik terpilah").

### 5.4 Manajemen Master Data (Jenis Sampah & Wilayah)
1. **Jenis Sampah**:
   - Menambah kategori sampah baru (misal: *Aluminium, Kaca, Minyak Jelantah*).
   - Menetapkan **Nilai Poin per Kilogram** (misal: 1 kg Minyak Jelantah = 100 Poin).
   - Menonaktifkan jenis sampah yang sedang tidak menerima penyetoran.
2. **Data Wilayah**:
   - Memastikan kelengkapan data Kota dan Kecamatan di seluruh wilayah DKI Jakarta.

### 5.5 Manajemen Hadiah (Reward Management)
1. **Tambah / Edit Hadiah**:
   - Masukkan nama hadiah, deskripsi, harga poin, dan jumlah stok fisik yang tersedia.
2. **Proses Penukaran Reward Warga**:
   - Memeriksa antrean warga yang mengajukan penukaran poin.
   - Mengubah status penukaran menjadi *Diproses*, *Terkirim*, atau *Selesai*.

### 5.6 Manajemen Artikel Edukasi
1. Buka menu **"Artikel Edukasi"**.
2. Klik **"Tulis Artikel Baru"**.
3. Masukkan judul artikel, slug, kategori (Tips, Daur Ulang, Kebijakan), kutipan ringkas, dan isi lengkap artikel.
4. Klik **"Publikasikan"** agar artikel langsung muncul di halaman edukasi publik.

### 5.7 Manajemen Data Pengguna (Users)
1. Buka menu **"Kelola Pengguna"**.
2. Lihat daftar seluruh pengguna terdaftar beserta alamat email, tanggal bergabung, saldo poin, dan role.
3. Admin berwenang mengubah peran (*role*) akun dari `USER` menjadi `ADMIN` bagi staf operasional baru, atau menonaktifkan akun yang melanggar aturan.

---

## 6. Tanya Jawab Umum (FAQ) & Troubleshooting

**T: Berapa minimal berat sampah yang bisa dilaporkan?**  
J: Minimal penyetoran yang dianjurkan adalah 1 kg per jenis sampah agar efisien dalam proses penimbangan dan logistik.

**T: Berapa lama waktu yang dibutuhkan untuk proses verifikasi laporan?**  
J: Petugas memverifikasi laporan maksimal dalam 1 x 24 jam kerja sejak laporan disubmit.

**T: Kapan poin reward saya bertambah?**  
J: Poin otomatis bertambah ke saldo akun Anda sesaat setelah petugas mengubah status laporan menjadi `VERIFIED`.

**T: Mengapa foto saya gagal diunggah?**  
J: Pastikan foto berformat `.jpg`, `.jpeg`, `.png`, atau `.webp` dengan ukuran berkas maksimal 5 MB.

---
*Dokumen ini diterbitkan sebagai panduan resmi operasional Sistem Informasi Pengolahan Sampah DKI Jakarta.*
