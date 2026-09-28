import { prisma } from '@/app/lib/db'
import RewardAdminClient from './RewardAdminClient'

export default async function AdminRewardsPage() {
  let rewards = await prisma.reward.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Auto-seed if database has 0 rewards
  if (rewards.length === 0) {
    const defaultRewards = [
      { namaReward: 'Pulsa 10.000', deskripsi: 'Voucher pulsa all operator senilai Rp10.000', poinDibutuhkan: 100, stok: 50 },
      { namaReward: 'Saldo E-Wallet 25.000', deskripsi: 'Saldo GoPay/OVO/DANA senilai Rp25.000', poinDibutuhkan: 250, stok: 30 },
      { namaReward: 'Token Listrik 50.000', deskripsi: 'Token listrik PLN prabayar senilai Rp50.000', poinDibutuhkan: 500, stok: 20 },
      { namaReward: 'Paket Sembako', deskripsi: 'Paket sembako dasar (beras, minyak, gula)', poinDibutuhkan: 750, stok: 10 },
      { namaReward: 'Voucher Belanja 100.000', deskripsi: 'Voucher belanja supermarket senilai Rp100.000', poinDibutuhkan: 1000, stok: 5 },
      { namaReward: 'Tumbler Eco-Friendly', deskripsi: 'Tumbler stainless steel ramah lingkungan 500ml', poinDibutuhkan: 300, stok: 25 },
    ]
    await prisma.reward.createMany({ data: defaultRewards })
    rewards = await prisma.reward.findMany({ orderBy: { createdAt: 'desc' } })
  }

  const [penukaranList, poinStats] = await Promise.all([
    prisma.penukaranReward.findMany({
      orderBy: { tanggalTukar: 'desc' },
      include: { user: true, reward: true },
    }),
    prisma.penukaranReward.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { poinDigunakan: true },
      _count: { id: true },
    }),
  ])

  const serializedRewards = rewards.map((r) => ({
    id: r.id,
    namaReward: r.namaReward,
    deskripsi: r.deskripsi,
    poinDibutuhkan: r.poinDibutuhkan,
    stok: r.stok,
    createdAt: r.createdAt.toISOString(),
  }))

  const serializedPenukaran = penukaranList.map((p) => ({
    id: p.id,
    poinDigunakan: p.poinDigunakan,
    status: p.status,
    tanggalTukar: p.tanggalTukar.toISOString(),
    userName: p.user.nama,
    userEmail: p.user.email,
    namaReward: p.reward.namaReward,
  }))

  return (
    <main style={{ padding: '32px 28px' }}>
      <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          🎁 <span className="gradient-text">Kelola Rewards</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Kelola katalog hadiah dan penukaran poin pengguna
        </p>
      </div>

      <RewardAdminClient
        rewards={serializedRewards}
        penukaranList={serializedPenukaran}
        stats={{
          totalReward: rewards.length,
          totalPenukaran: poinStats._count.id,
          poinDiberikan: poinStats._sum.poinDigunakan || 0,
        }}
      />
    </main>
  )
}
