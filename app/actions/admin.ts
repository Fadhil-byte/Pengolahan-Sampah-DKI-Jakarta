'use server'

import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }
  return session
}

// ============================================================
// Manajemen Pengguna
// ============================================================

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN') {
  await requireAdmin()

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  })

  revalidatePath('/admin/users')
}

export async function deleteUser(userId: string) {
  await requireAdmin()

  await prisma.user.delete({
    where: { id: userId },
  })

  revalidatePath('/admin/users')
}

// ============================================================
// Kelola Master Data: Jenis Sampah
// ============================================================

export async function createJenisSampah(namaJenis: string) {
  await requireAdmin()

  if (!namaJenis || namaJenis.trim() === '') {
    return { error: 'Nama jenis sampah tidak boleh kosong.' }
  }

  const existing = await prisma.jenisSampah.findUnique({
    where: { namaJenis: namaJenis.trim() },
  })
  if (existing) {
    return { error: 'Jenis sampah sudah ada.' }
  }

  await prisma.jenisSampah.create({
    data: { namaJenis: namaJenis.trim() },
  })

  revalidatePath('/admin/master-data')
  return { success: true }
}

export async function deleteJenisSampah(id: string) {
  await requireAdmin()

  try {
    await prisma.jenisSampah.delete({ where: { id } })
  } catch {
    return { error: 'Tidak dapat menghapus jenis sampah yang sudah digunakan pada laporan.' }
  }

  revalidatePath('/admin/master-data')
  return { success: true }
}

// ============================================================
// Kelola Master Data: Wilayah
// ============================================================

export async function createWilayah(namaWilayah: string) {
  await requireAdmin()

  if (!namaWilayah || namaWilayah.trim() === '') {
    return { error: 'Nama wilayah tidak boleh kosong.' }
  }

  const existing = await prisma.wilayah.findUnique({
    where: { namaWilayah: namaWilayah.trim() },
  })
  if (existing) {
    return { error: 'Wilayah sudah ada.' }
  }

  await prisma.wilayah.create({
    data: { namaWilayah: namaWilayah.trim() },
  })

  revalidatePath('/admin/master-data')
  return { success: true }
}

export async function deleteWilayah(id: string) {
  await requireAdmin()

  try {
    await prisma.wilayah.delete({ where: { id } })
  } catch {
    return { error: 'Tidak dapat menghapus wilayah yang sudah digunakan pada laporan.' }
  }

  revalidatePath('/admin/master-data')
  return { success: true }
}
