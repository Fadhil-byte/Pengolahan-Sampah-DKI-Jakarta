import * as z from 'zod'

// ============================================================
// Soal 1 & 2: Validasi Register
// - Nama wajib diisi (min 2 karakter)
// - Email harus valid & unik (validasi format di Next.js, unique di Prisma/DB)
// - noHp wajib diisi & unik
// - NIK wajib diisi & unik
// - Password min 6 karakter
// ============================================================
export const RegisterFormSchema = z.object({
  nama: z
    .string()
    .min(2, { message: 'Nama minimal 2 karakter.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Masukkan email yang valid.' })
    .trim(),
  noHp: z
    .string()
    .min(10, { message: 'Nomor HP minimal 10 digit.' })
    .max(15, { message: 'Nomor HP maksimal 15 digit.' })
    .trim(),
  nik: z
    .string()
    .length(16, { message: 'NIK harus 16 digit.' })
    .trim(),
  password: z
    .string()
    .min(6, { message: 'Password minimal 6 karakter.' })
    .trim(),
})

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Masukkan email yang valid.' })
    .trim(),
  password: z
    .string()
    .min(1, { message: 'Password wajib diisi.' })
    .trim(),
})

// ============================================================
// Soal 3 & 5: Validasi Laporan
// - Berat sampah harus lebih dari 0 kg (Soal 5 point 1)
// - jenisSampahId dan wilayahId wajib dipilih (FK)
// - imageUrl wajib diisi (Soal 5 point 4: setiap laporan harus memiliki foto)
// ============================================================
export const LaporanFormSchema = z.object({
  jenisSampahId: z
    .string()
    .min(1, { message: 'Pilih jenis sampah.' }),
  berat: z
    .number({ message: 'Masukkan berat dalam kg.' })
    .positive({ message: 'Berat harus lebih dari 0 kg.' }),
  wilayahId: z
    .string()
    .min(1, { message: 'Pilih wilayah.' }),
  catatan: z.string().optional(),
  imageUrl: z
    .string()
    .min(1, { message: 'Setiap laporan harus memiliki foto.' }),
})

// Schema untuk edit laporan (imageUrl opsional karena foto lama masih ada)
export const EditLaporanFormSchema = z.object({
  jenisSampahId: z
    .string()
    .min(1, { message: 'Pilih jenis sampah.' }),
  berat: z
    .number({ message: 'Masukkan berat dalam kg.' })
    .positive({ message: 'Berat harus lebih dari 0 kg.' }),
  wilayahId: z
    .string()
    .min(1, { message: 'Pilih wilayah.' }),
  catatan: z.string().optional(),
  imageUrl: z.string().optional(),
})


export type RegisterFormState =
  | {
      errors?: {
        nama?: string[]
        email?: string[]
        noHp?: string[]
        nik?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type LaporanFormState =
  | {
      errors?: {
        jenisSampahId?: string[]
        berat?: string[]
        wilayahId?: string[]
        catatan?: string[]
        imageUrl?: string[]
      }
      message?: string
      success?: boolean
    }
  | undefined
