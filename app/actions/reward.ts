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
// User: Tukar Poin dengan Reward
// - Cek saldo poin cukup
// - Cek stok reward tersedia
// - Kurangi poin & stok dalam satu transaksi
// ============================================================
export async function redeemReward(rewardId: string) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const [user, reward] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { poin: true } }),
    prisma.reward.findUnique({ where: { id: rewardId } }),
  ])

  if (!user) return { error: 'User tidak ditemukan.' }
  if (!reward) return { error: 'Reward tidak ditemukan.' }
  if (reward.stok <= 0) return { error: 'Stok reward sudah habis.' }
  if (user.poin < reward.poinDibutuhkan) {
    return { error: `Poin Anda tidak cukup. Dibutuhkan ${reward.poinDibutuhkan} poin, Anda memiliki ${user.poin} poin.` }
  }

  // Transactional: kurangi poin, kurangi stok, catat penukaran
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: session.userId },
      data: { poin: { decrement: reward.poinDibutuhkan } },
    })

    await tx.reward.update({
      where: { id: rewardId },
      data: { stok: { decrement: 1 } },
    })

    await tx.penukaranReward.create({
      data: {
        userId: session.userId,
        rewardId,
        poinDigunakan: reward.poinDibutuhkan,
        status: 'PENDING',
      },
    })
  })

  revalidatePath('/dashboard/rewards')
  revalidatePath('/dashboard')
  return { success: true, message: `Berhasil menukarkan ${reward.poinDibutuhkan} poin untuk "${reward.namaReward}"!` }
}

// ============================================================
// Admin: Update Status Penukaran
// ============================================================
export async function updatePenukaranStatus(
  penukaranId: string,
  status: 'COMPLETED' | 'CANCELLED'
) {
  await requireAdmin()

  const penukaran = await prisma.penukaranReward.findUnique({
    where: { id: penukaranId },
  })

  if (!penukaran) return { error: 'Penukaran tidak ditemukan.' }

  // Jika dibatalkan, kembalikan poin dan stok
  if (status === 'CANCELLED' && penukaran.status === 'PENDING') {
    await prisma.$transaction(async (tx) => {
      await tx.penukaranReward.update({
        where: { id: penukaranId },
        data: { status },
      })

      await tx.user.update({
        where: { id: penukaran.userId },
        data: { poin: { increment: penukaran.poinDigunakan } },
      })

      await tx.reward.update({
        where: { id: penukaran.rewardId },
        data: { stok: { increment: 1 } },
      })
    })
  } else {
    await prisma.penukaranReward.update({
      where: { id: penukaranId },
      data: { status },
    })
  }

  revalidatePath('/admin/rewards')
  revalidatePath('/dashboard/rewards')
  return { success: true }
}

// ============================================================
// Admin: CRUD Reward
// ============================================================
export async function createReward(formData: FormData) {
  await requireAdmin()

  const namaReward = formData.get('namaReward') as string
  const deskripsi = formData.get('deskripsi') as string
  const poinDibutuhkan = parseInt(formData.get('poinDibutuhkan') as string)
  const stok = parseInt(formData.get('stok') as string)
  const imageUrl = (formData.get('imageUrl') as string) || null

  if (!namaReward || !poinDibutuhkan || isNaN(poinDibutuhkan) || isNaN(stok)) {
    return { error: 'Data reward tidak lengkap.' }
  }

  await prisma.reward.create({
    data: {
      namaReward: namaReward.trim(),
      deskripsi: deskripsi?.trim() || null,
      poinDibutuhkan,
      stok: stok || 0,
      imageUrl,
    },
  })

  revalidatePath('/admin/rewards')
  return { success: true }
}

export async function updateReward(rewardId: string, formData: FormData) {
  await requireAdmin()

  const namaReward = formData.get('namaReward') as string
  const deskripsi = formData.get('deskripsi') as string
  const poinDibutuhkan = parseInt(formData.get('poinDibutuhkan') as string)
  const stok = parseInt(formData.get('stok') as string)
  const imageUrl = (formData.get('imageUrl') as string) || null

  if (!namaReward || !poinDibutuhkan || isNaN(poinDibutuhkan)) {
    return { error: 'Data reward tidak lengkap.' }
  }

  await prisma.reward.update({
    where: { id: rewardId },
    data: {
      namaReward: namaReward.trim(),
      deskripsi: deskripsi?.trim() || null,
      poinDibutuhkan,
      stok: isNaN(stok) ? undefined : stok,
      imageUrl,
    },
  })

  revalidatePath('/admin/rewards')
  return { success: true }
}

export async function deleteReward(rewardId: string) {
  await requireAdmin()

  try {
    await prisma.reward.delete({ where: { id: rewardId } })
  } catch {
    return { error: 'Tidak dapat menghapus reward yang sudah pernah ditukarkan.' }
  }

  revalidatePath('/admin/rewards')
  return { success: true }
}
