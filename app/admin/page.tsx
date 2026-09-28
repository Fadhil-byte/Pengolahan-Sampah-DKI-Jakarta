import { prisma } from '@/app/lib/db'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const [
    totalLaporan,
    totalUser,
    pendingLaporan,
    verifiedLaporan,
    laporanTerbaru,
    beratResult,
    jenisStat,
    wilayahStat,
    totalPenukaran,
    poinResult,
  ] = await Promise.all([
    prisma.laporanSampah.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.laporanSampah.count({ where: { status: 'PENDING' } }),
    prisma.laporanSampah.count({ where: { status: 'VERIFIED' } }),
    prisma.laporanSampah.findMany({
      orderBy: { tanggalLapor: 'desc' },
      take: 8,
      include: { user: true, jenisSampah: true, wilayah: true },
    }),
    prisma.laporanSampah.aggregate({ _sum: { berat: true } }),
    prisma.laporanSampah.groupBy({
      by: ['jenisSampahId'],
      _count: { id: true },
      _sum: { berat: true },
      orderBy: { _sum: { berat: 'desc' } },
    }),
    prisma.laporanSampah.groupBy({
      by: ['wilayahId'],
      _sum: { berat: true },
      orderBy: { _sum: { berat: 'desc' } },
      take: 5,
    }),
    prisma.penukaranReward.count({ where: { status: 'COMPLETED' } }),
    prisma.user.aggregate({ _sum: { poin: true } }),
  ])

  const totalBerat = beratResult._sum.berat || 0

  // Resolve jenis names
  const jenisIds = jenisStat.map((j) => j.jenisSampahId)
  const jenisMap = await prisma.jenisSampah.findMany({ where: { id: { in: jenisIds } } })
  const jenisNameMap = Object.fromEntries(jenisMap.map((j) => [j.id, j.namaJenis]))

  // Resolve wilayah names
  const wilayahIds = wilayahStat.map((w) => w.wilayahId)
  const wilayahMap = await prisma.wilayah.findMany({ where: { id: { in: wilayahIds } } })
  const wilayahNameMap = Object.fromEntries(wilayahMap.map((w) => [w.id, w.namaWilayah]))

  const STATUS_CONFIG = {
    PENDING: { label: 'Pending', icon: '⏳', cls: 'badge-pending' },
    VERIFIED: { label: 'Disetujui', icon: '✅', cls: 'badge-verified' },
    REJECTED: { label: 'Ditolak', icon: '❌', cls: 'badge-rejected' },
  }

  const stats = [
    { label: 'Total Laporan', value: totalLaporan, icon: '📋', color: 'rgba(16, 185, 129, 0.12)' },
    { label: 'Total Berat (kg)', value: totalBerat.toFixed(1), icon: '⚖️', color: 'rgba(59, 130, 246, 0.12)' },
    { label: 'Menunggu Verifikasi', value: pendingLaporan, icon: '⏳', color: 'rgba(245, 158, 11, 0.12)' },
    { label: 'Total Pengguna', value: totalUser, icon: '👥', color: 'rgba(168, 85, 247, 0.12)' },
    { label: 'Laporan Disetujui', value: verifiedLaporan, icon: '✅', color: 'rgba(16, 185, 129, 0.12)' },
    { label: 'Total Penukaran', value: totalPenukaran, icon: '🎁', color: 'rgba(236, 72, 153, 0.12)' },
    { label: 'Poin Beredar', value: (poinResult._sum.poin || 0).toLocaleString('id-ID'), icon: '⭐', color: 'rgba(245, 158, 11, 0.12)' },
  ]

  return (
    <main style={{ padding: '32px 28px' }}>
      <div className="animate-fade-in" style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          📊 <span className="gradient-text">Dashboard Admin</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Ringkasan data sampah DKI Jakarta secara keseluruhan
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={s.label} className={`stat-card animate-fade-in stagger-${i + 1}`} style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Top Jenis Sampah */}
        <div className="glass-card animate-fade-in stagger-2" style={{ opacity: 0, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>🏷️ Distribusi Jenis Sampah</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {jenisStat.map((j) => {
              const nama = jenisNameMap[j.jenisSampahId] || 'Lainnya'
              const berat = j._sum.berat || 0
              const pct = totalBerat > 0 ? Math.round((berat / totalBerat) * 100) : 0
              return (
                <div key={j.jenisSampahId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.85rem', fontWeight: 600 }}>
                    <span>{nama}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{berat.toFixed(1)} kg ({pct}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', borderRadius: '10px', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Wilayah */}
        <div className="glass-card animate-fade-in stagger-3" style={{ opacity: 0, padding: '24px' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>📍 Top 5 Wilayah Terbanyak</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {wilayahStat.map((w, idx) => {
              const nama = wilayahNameMap[w.wilayahId] || '-'
              const berat = w._sum.berat || 0
              const pct = totalBerat > 0 ? Math.round((berat / totalBerat) * 100) : 0
              return (
                <div key={w.wilayahId} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800, flexShrink: 0,
                  }}>{idx + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span>{nama}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{berat.toFixed(1)} kg</span>
                    </div>
                    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, var(--accent), var(--primary))', borderRadius: '10px' }} />
                    </div>
                  </div>
                </div>
              )
            })}
            {wilayahStat.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>Belum ada data laporan.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Laporan */}
      <div className="animate-fade-in stagger-4" style={{ opacity: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📋 Laporan Terbaru</h2>
          <Link href="/admin/laporan" style={{
            fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none',
            padding: '6px 14px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)',
          }}>
            Lihat Semua →
          </Link>
        </div>
        <div style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pelapor</th>
                  <th>Jenis Sampah</th>
                  <th>Berat</th>
                  <th>Wilayah</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {laporanTerbaru.map((l) => {
                  const cfg = STATUS_CONFIG[l.status]
                  return (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.user.nama}</td>
                      <td>{l.jenisSampah.namaJenis}</td>
                      <td style={{ fontWeight: 600 }}>{l.berat} kg</td>
                      <td>{l.wilayah.namaWilayah}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(l.tanggalLapor).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>
                      </td>
                    </tr>
                  )
                })}
                {laporanTerbaru.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      📭 Belum ada laporan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
