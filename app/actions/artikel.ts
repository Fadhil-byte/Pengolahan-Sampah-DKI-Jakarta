'use server'

import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// ============================================================
// Helper: Require Admin
// ============================================================
async function requireAdmin() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }
  return session
}

// ============================================================
// Helper: Generate slug dari judul
// ============================================================
function generateSlug(judul: string): string {
  return judul
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ============================================================
// Admin: CRUD Kategori Artikel
// ============================================================

export async function createKategoriArtikel(namaKategori: string, deskripsi?: string) {
  await requireAdmin()

  if (!namaKategori || namaKategori.trim() === '') {
    return { error: 'Nama kategori tidak boleh kosong.' }
  }

  const existing = await prisma.kategoriArtikel.findUnique({
    where: { namaKategori: namaKategori.trim() },
  })
  if (existing) {
    return { error: 'Kategori sudah ada.' }
  }

  await prisma.kategoriArtikel.create({
    data: {
      namaKategori: namaKategori.trim(),
      deskripsi: deskripsi?.trim() || null,
    },
  })

  revalidatePath('/admin/artikel')
  return { success: true }
}

export async function deleteKategoriArtikel(id: string) {
  await requireAdmin()

  try {
    await prisma.kategoriArtikel.delete({ where: { id } })
  } catch {
    return { error: 'Tidak dapat menghapus kategori yang masih memiliki artikel.' }
  }

  revalidatePath('/admin/artikel')
  return { success: true }
}

// ============================================================
// Admin: CRUD Artikel Edukasi
// ============================================================

export async function createArtikel(formData: FormData) {
  const session = await requireAdmin()

  const judul = formData.get('judul') as string
  const ringkasan = formData.get('ringkasan') as string
  const konten = formData.get('konten') as string
  const kategoriId = formData.get('kategoriId') as string
  const wilayahId = (formData.get('wilayahId') as string) || null
  const imageUrl = (formData.get('imageUrl') as string) || null
  const isFeatured = formData.get('isFeatured') === 'true'

  if (!judul || !ringkasan || !konten || !kategoriId) {
    return { error: 'Judul, ringkasan, konten, dan kategori wajib diisi.' }
  }

  // Generate unique slug
  let slug = generateSlug(judul)
  const existingSlug = await prisma.artikelEdukasi.findUnique({ where: { slug } })
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`
  }

  await prisma.artikelEdukasi.create({
    data: {
      judul: judul.trim(),
      slug,
      ringkasan: ringkasan.trim(),
      konten: konten.trim(),
      kategoriId,
      authorId: session.userId,
      wilayahId: wilayahId || null,
      imageUrl: imageUrl?.trim() || null,
      isFeatured,
    },
  })

  revalidatePath('/admin/artikel')
  revalidatePath('/artikel')
  return { success: true }
}

export async function updateArtikel(artikelId: string, formData: FormData) {
  await requireAdmin()

  const judul = formData.get('judul') as string
  const ringkasan = formData.get('ringkasan') as string
  const konten = formData.get('konten') as string
  const kategoriId = formData.get('kategoriId') as string
  const wilayahId = (formData.get('wilayahId') as string) || null
  const imageUrl = (formData.get('imageUrl') as string) || null
  const isFeatured = formData.get('isFeatured') === 'true'

  if (!judul || !ringkasan || !konten || !kategoriId) {
    return { error: 'Judul, ringkasan, konten, dan kategori wajib diisi.' }
  }

  const existing = await prisma.artikelEdukasi.findUnique({ where: { id: artikelId } })
  if (!existing) {
    return { error: 'Artikel tidak ditemukan.' }
  }

  // Only regenerate slug if judul changed
  let slug = existing.slug
  if (judul.trim() !== existing.judul) {
    slug = generateSlug(judul)
    const slugConflict = await prisma.artikelEdukasi.findUnique({ where: { slug } })
    if (slugConflict && slugConflict.id !== artikelId) {
      slug = `${slug}-${Date.now().toString(36)}`
    }
  }

  await prisma.artikelEdukasi.update({
    where: { id: artikelId },
    data: {
      judul: judul.trim(),
      slug,
      ringkasan: ringkasan.trim(),
      konten: konten.trim(),
      kategoriId,
      wilayahId: wilayahId || null,
      imageUrl: imageUrl?.trim() || null,
      isFeatured,
    },
  })

  revalidatePath('/admin/artikel')
  revalidatePath('/artikel')
  revalidatePath(`/artikel/${slug}`)
  return { success: true }
}

export async function deleteArtikel(artikelId: string) {
  await requireAdmin()

  const artikel = await prisma.artikelEdukasi.findUnique({ where: { id: artikelId } })
  if (!artikel) {
    return { error: 'Artikel tidak ditemukan.' }
  }

  await prisma.artikelEdukasi.delete({ where: { id: artikelId } })

  revalidatePath('/admin/artikel')
  revalidatePath('/artikel')
  return { success: true }
}

export async function toggleFeatured(artikelId: string) {
  await requireAdmin()

  const artikel = await prisma.artikelEdukasi.findUnique({ where: { id: artikelId } })
  if (!artikel) {
    return { error: 'Artikel tidak ditemukan.' }
  }

  await prisma.artikelEdukasi.update({
    where: { id: artikelId },
    data: { isFeatured: !artikel.isFeatured },
  })

  revalidatePath('/admin/artikel')
  revalidatePath('/artikel')
  return { success: true }
}
