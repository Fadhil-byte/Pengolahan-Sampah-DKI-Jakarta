import { prisma } from '@/app/lib/db'
import VerifikasiClient from './VerifikasiClient'

export default async function AdminLaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; jenis?: string }>
}) {
  const { status, jenis } = await searchParams

  const where: Record<string, unknown> = {}
  if (status && ['PENDING', 'VERIFIED', 'REJECTED'].includes(status)) {
    where.status = status
  }
  if (jenis) {
    where.jenisSampahId = jenis
  }

  const [laporanList, jenisList, totalStats] = await Promise.all([
    prisma.laporanSampah.findMany({
      where,
      orderBy: { tanggalLapor: 'desc' },
      include: { user: true, jenisSampah: true, wilayah: true, foto: true },
    }),
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: 'asc' } }),
    prisma.laporanSampah.groupBy({
      by: ['status'],
      _count: { id: true },
    }),
  ])

  const statsMap = Object.fromEntries(totalStats.map((s) => [s.status, s._count.id]))

  const serialized = laporanList.map((l) => ({
    id: l.id,
    berat: l.berat,
    catatan: l.catatan,
    status: l.status,
    adminNote: l.adminNote,
    tanggalLapor: l.tanggalLapor.toISOString(),
    userName: l.user.nama,
    userEmail: l.user.email,
    namaJenis: l.jenisSampah.namaJenis,
    namaWilayah: l.wilayah.namaWilayah,
    fotoUrl: l.foto?.imageUrl || null,
  }))

  return (
    <main style={{ padding: '24px 16px', maxWidth: '1400px', margin: '0 auto' }}>
      <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          📋 <span className="gradient-text">Kelola Laporan</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Verifikasi dan kelola seluruh laporan sampah dari masyarakat
        </p>
      </div>

      {/* Mini Stats */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[
          { label: 'Semua', value: (statsMap.PENDING || 0) + (statsMap.VERIFIED || 0) + (statsMap.REJECTED || 0), href: '/admin/laporan', cls: '' },
          { label: '⏳ Pending', value: statsMap.PENDING || 0, href: '/admin/laporan?status=PENDING', cls: 'badge-pending' },
          { label: '✅ Disetujui', value: statsMap.VERIFIED || 0, href: '/admin/laporan?status=VERIFIED', cls: 'badge-verified' },
          { label: '❌ Ditolak', value: statsMap.REJECTED || 0, href: '/admin/laporan?status=REJECTED', cls: 'badge-rejected' },
        ].map((s) => (
          <a key={s.label} href={s.href} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px', borderRadius: '12px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)',
            transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>{s.value}</span>
            {s.label}
          </a>
        ))}
      </div>

      <VerifikasiClient
        laporanList={serialized}
        jenisList={jenisList.map((j) => ({ id: j.id, namaJenis: j.namaJenis }))}
        currentStatus={status}
        currentJenis={jenis}
      />
    </main>
  )
}
