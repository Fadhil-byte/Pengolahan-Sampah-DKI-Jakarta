import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import UsersClient from './UsersClient'

export default async function AdminUsersPage() {
  const session = await getSession()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { laporan: true } },
    },
  })

  const serialized = users.map((u) => ({
    id: u.id,
    nama: u.nama,
    email: u.email,
    noHp: u.noHp,
    nik: u.nik,
    role: u.role as 'USER' | 'ADMIN',
    createdAt: u.createdAt.toISOString(),
    totalLaporan: u._count.laporan,
  }))

  return (
    <main style={{ padding: '24px 16px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          👥 <span className="gradient-text">Manajemen Pengguna</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Kelola akun dan role seluruh pengguna sistem
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[
          { label: 'Total Pengguna', value: serialized.filter((u) => u.role === 'USER').length, icon: '👤' },
          { label: 'Admin', value: serialized.filter((u) => u.role === 'ADMIN').length, icon: '⚙️' },
          { label: 'Total Akun', value: serialized.length, icon: '👥' },
        ].map((s) => (
          <div key={s.label} className="stat-card" style={{ padding: '16px 20px', minWidth: '140px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UsersClient users={serialized} currentUserId={session?.userId || ''} />
    </main>
  )
}
