export type KecamatanGroup = {
  kota: string
  kecamatan: string[]
}

export const KECAMATAN_DKI_JAKARTA: KecamatanGroup[] = [
  {
    kota: 'Jakarta Pusat',
    kecamatan: [
      'Tanah Abang',
      'Menteng',
      'Senen',
      'Johar Baru',
      'Cempaka Putih',
      'Kemayoran',
      'Sawah Besar',
      'Gambir',
    ],
  },
  {
    kota: 'Jakarta Utara',
    kecamatan: [
      'Penjaringan',
      'Pademangan',
      'Tanjung Priok',
      'Koja',
      'Kelapa Gading',
      'Cilincing',
    ],
  },
  {
    kota: 'Jakarta Barat',
    kecamatan: [
      'Kembangan',
      'Kebon Jeruk',
      'Palmerah',
      'Grogol Petamburan',
      'Tambora',
      'Taman Sari',
      'Cengkareng',
      'Kalideres',
    ],
  },
  {
    kota: 'Jakarta Selatan',
    kecamatan: [
      'Kebayoran Baru',
      'Kebayoran Lama',
      'Pesanggrahan',
      'Cilandak',
      'Pasar Minggu',
      'Jagakarsa',
      'Mampang Prapatan',
      'Pancoran',
      'Tebet',
      'Setiabudi',
    ],
  },
  {
    kota: 'Jakarta Timur',
    kecamatan: [
      'Matraman',
      'Pulo Gadung',
      'Jatinegara',
      'Duren Sawit',
      'Kramat Jati',
      'Makasar',
      'Pasar Rebo',
      'Ciracas',
      'Cipayung',
      'Cakung',
    ],
  },
  {
    kota: 'Kepulauan Seribu',
    kecamatan: [
      'Kepulauan Seribu Utara',
      'Kepulauan Seribu Selatan',
    ],
  },
]

export function getAllKecamatan(): string[] {
  return KECAMATAN_DKI_JAKARTA.flatMap((group) => group.kecamatan)
}
