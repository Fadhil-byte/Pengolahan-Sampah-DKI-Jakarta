'use server'

import { prisma } from '@/app/lib/db'
import { LaporanFormSchema, EditLaporanFormSchema } from '@/app/lib/definitions'
import type { LaporanFormState } from '@/app/lib/definitions'
import { getSession } from '@/app/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ============================================================
// Pembuatan Laporan Sampah Baru Beserta Bukti Foto
// ============================================================
export async function createLaporan(
  state: LaporanFormState,
  formData: FormData
): Promise<LaporanFormState> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const validatedFields = LaporanFormSchema.safeParse({
    jenisSampahId: formData.get('jenisSampahId'),
    berat: parseFloat(formData.get('berat') as string),
    wilayahId: formData.get('wilayahId'),
    catatan: formData.get('catatan') || undefined,
    imageUrl: formData.get('imageUrl') || '',
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { jenisSampahId, berat, wilayahId, catatan, imageUrl } = validatedFields.data

  try {
    // Simpan laporan beserta bukti foto secara relasional
    await prisma.laporanSampah.create({
      data: {
        userId: session.userId,
        jenisSampahId,
        berat,
        wilayahId,
        catatan: catatan || null,
        status: 'PENDING',
        foto: {
          create: {
            imageUrl,
          },
        },
      },
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Laporan berhasil ditambahkan! Menunggu verifikasi admin.' }
  } catch (error: unknown) {
    // Handle Prisma unique constraint violation (composite unique)
    const prismaError = error as { code?: string }
    if (prismaError?.code === 'P2002') {
      return {
        message: 'Anda sudah membuat laporan untuk jenis sampah ini di wilayah dan tanggal yang sama.',
      }
    }
    return {
      message: 'Terjadi kesalahan saat menyimpan laporan.',
    }
  }
}

// ============================================================
// Update Laporan (hanya jika status masih PENDING)
// ============================================================
export async function updateLaporan(
  id: string,
  state: LaporanFormState,
  formData: FormData
): Promise<LaporanFormState> {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  // Pastikan laporan milik user dan masih PENDING
  const laporan = await prisma.laporanSampah.findFirst({
    where: { id, userId: session.userId },
  })

  if (!laporan) {
    return { message: 'Laporan tidak ditemukan.' }
  }
  if (laporan.status !== 'PENDING') {
    return { message: 'Laporan yang sudah diverifikasi tidak dapat diedit.' }
  }

  const validatedFields = EditLaporanFormSchema.safeParse({
    jenisSampahId: formData.get('jenisSampahId'),
    berat: parseFloat(formData.get('berat') as string),
    wilayahId: formData.get('wilayahId'),
    catatan: formData.get('catatan') || undefined,
    imageUrl: formData.get('imageUrl') || undefined,
  })

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors }
  }

  const { jenisSampahId, berat, wilayahId, catatan, imageUrl } = validatedFields.data

  try {
    await prisma.laporanSampah.update({
      where: { id, userId: session.userId },
      data: {
        jenisSampahId,
        berat,
        wilayahId,
        catatan: catatan || null,
        ...(imageUrl && {
          foto: {
            upsert: {
              create: { imageUrl },
              update: { imageUrl },
            },
          },
        }),
      },
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Laporan berhasil diperbarui!' }
  } catch (error: unknown) {
    const prismaError = error as { code?: string }
    if (prismaError?.code === 'P2002') {
      return {
        message: 'Anda sudah membuat laporan untuk jenis sampah ini di wilayah dan tanggal yang sama.',
      }
    }
    return { message: 'Terjadi kesalahan saat memperbarui laporan.' }
  }
}

export async function deleteLaporan(id: string) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  // FotoSampah will be cascade-deleted because of onDelete: Cascade
  await prisma.laporanSampah.delete({
    where: {
      id,
      userId: session.userId,
    },
  })

  revalidatePath('/dashboard')
}

// ============================================================
// Admin: Verifikasi Laporan (Approve / Reject)
// - Jika VERIFIED: otomatis tambahkan poin ke user (1 kg = 10 poin)
// ============================================================
export async function verifyLaporan(
  id: string,
  status: 'VERIFIED' | 'REJECTED',
  adminNote?: string
) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  // Ambil data laporan untuk menghitung poin
  const laporan = await prisma.laporanSampah.findUnique({
    where: { id },
    select: { userId: true, berat: true, status: true },
  })

  if (!laporan) return

  // Update status laporan dan berikan poin jika diverifikasi
  await prisma.$transaction(async (tx) => {
    await tx.laporanSampah.update({
      where: { id },
      data: {
        status,
        adminNote: adminNote || null,
      },
    })

    if (status === 'VERIFIED' && laporan.status !== 'VERIFIED') {
      // Hitung poin: 1 kg = 10 poin
      const poinTambahan = Math.floor(laporan.berat * 10)
      await tx.user.update({
        where: { id: laporan.userId },
        data: { poin: { increment: poinTambahan } },
      })
    }
  })

  revalidatePath('/admin/laporan')
  revalidatePath('/dashboard')
}
