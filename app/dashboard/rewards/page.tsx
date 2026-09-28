import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import RewardClient from './RewardClient'

export default async function RewardsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.role === 'ADMIN') {
    redirect('/admin/rewards')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { nama: true, role: true, poin: true },
  })

  if (!user) {
    redirect('/login')
  }

  let rewards = await prisma.reward.findMany({
    orderBy: { poinDibutuhkan: 'asc' },
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
    rewards = await prisma.reward.findMany({ orderBy: { poinDibutuhkan: 'asc' } })
  }

  const penukaranList = await prisma.penukaranReward.findMany({
    where: { userId: session.userId },
    orderBy: { tanggalTukar: 'desc' },
    include: { reward: true },
  })

  const serializedPenukaran = penukaranList.map((p) => ({
    id: p.id,
    poinDigunakan: p.poinDigunakan,
    status: p.status,
    tanggalTukar: p.tanggalTukar.toISOString(),
    namaReward: p.reward.namaReward,
  }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar userName={user.nama} role={user.role} />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div className="animate-fade-in" style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            🎁 <span className="gradient-text">Rewards &amp; Hadiah</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Tukarkan poin Anda dengan berbagai hadiah menarik!
          </p>
        </div>

        <RewardClient
          rewards={rewards}
          penukaranList={serializedPenukaran}
          userPoin={user.poin}
        />
      </main>
    </div>
  )
}
