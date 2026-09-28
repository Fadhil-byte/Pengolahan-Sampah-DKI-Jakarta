import * as z from 'zod'

// ============================================================
// Skema Validasi Autentikasi Pengguna
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
// Skema Validasi Laporan Sampah
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
