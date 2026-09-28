import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deleteLaporan } from '@/app/actions/sampah'

const STATUS_CONFIG = {
  PENDING: { label: 'Menunggu Verifikasi', icon: '⏳', cls: 'badge-pending' },
  VERIFIED: { label: 'Disetujui', icon: '✅', cls: 'badge-verified' },
  REJECTED: { label: 'Ditolak', icon: '❌', cls: 'badge-rejected' },
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  // Admin yang akses /dashboard diarahkan ke /admin
  if (session.role === 'ADMIN') {
    redirect('/admin')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, nama: true, email: true, role: true, poin: true },
  })

  if (!user) {
    redirect('/login')
  }


  // Fetch laporan and educational articles in parallel
  const [laporanList, latestArticles] = await Promise.all([
    prisma.laporanSampah.findMany({
      where: { userId: session.userId },
      orderBy: { tanggalLapor: 'desc' },
      include: {
        jenisSampah: true,
        wilayah: true,
        foto: true,
      },
    }),
    prisma.artikelEdukasi.findMany({
      take: 3,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      include: { kategori: true },
    }),
  ])

  // Calculate stats
  const totalLaporan = laporanList.length
  const totalBerat = laporanList.reduce((sum, l) => sum + l.berat, 0)
  const jenisCount = new Set(laporanList.map((l) => l.jenisSampah.namaJenis)).size
  const wilayahCount = new Set(laporanList.map((l) => l.wilayah.namaWilayah)).size
  const pendingCount = laporanList.filter((l) => l.status === 'PENDING').length
  const verifiedCount = laporanList.filter((l) => l.status === 'VERIFIED').length

  // Icons for jenis sampah display
  const JENIS_ICONS: Record<string, { icon: string; badge: string }> = {
    'Organik': { icon: '🌿', badge: 'badge-organik' },
    'Anorganik': { icon: '♻️', badge: 'badge-anorganik' },
    'B3': { icon: '☢️', badge: 'badge-b3' },
    'Residu': { icon: '🗑️', badge: 'badge-residu' },
    'Plastik': { icon: '🥤', badge: 'badge-plastik' },
  }

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Welcome Section */}
        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            <span className="gradient-text">Selamat Datang, {user.nama}!</span> 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Berikut ringkasan laporan sampah Anda
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}>
          <div className="stat-card animate-fade-in stagger-1" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>📋</div>
              <div>
                <div className="stat-value">{totalLaporan}</div>
                <div className="stat-label">Total Laporan</div>
              </div>
            </div>
          </div>

          <div className="stat-card animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.12)' }}>⚖️</div>
              <div>
                <div className="stat-value">{totalBerat.toFixed(1)}</div>
                <div className="stat-label">Total Berat (kg)</div>
              </div>
            </div>
          </div>

          <div className="stat-card animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>⏳</div>
              <div>
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-label">Menunggu Verifikasi</div>
              </div>
            </div>
          </div>

          <div className="stat-card animate-fade-in stagger-4" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>✅</div>
              <div>
                <div className="stat-value">{verifiedCount}</div>
                <div className="stat-label">Disetujui</div>
              </div>
            </div>
          </div>

          <div className="stat-card animate-fade-in stagger-5" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>⭐</div>
              <div>
                <div className="stat-value">{user.poin.toLocaleString('id-ID')}</div>
                <div className="stat-label">Total Poin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Second row stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '36px',
        }}>
          <div className="stat-card animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>🏷️</div>
              <div>
                <div className="stat-value">{jenisCount}</div>
                <div className="stat-label">Jenis Sampah</div>
              </div>
            </div>
          </div>
          <div className="stat-card animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.12)' }}>📍</div>
              <div>
                <div className="stat-value">{wilayahCount}</div>
                <div className="stat-label">Wilayah Dilaporkan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="animate-fade-in stagger-3" style={{ opacity: 0, marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>📊 Riwayat Laporan</h2>
          <Link href="/dashboard/tambah" className="btn-primary" style={{ textDecoration: 'none' }}>
            ➕ Tambah Laporan
          </Link>
        </div>

        {/* Table */}
        {laporanList.length === 0 ? (
          <div className="glass-card animate-fade-in stagger-4" style={{
            opacity: 0,
            textAlign: 'center',
            padding: '60px 24px',
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
              Belum Ada Laporan
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Mulai tambahkan laporan sampah pertama Anda!
            </p>
            <Link href="/dashboard/tambah" className="btn-primary" style={{ textDecoration: 'none' }}>
              ➕ Buat Laporan Pertama
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hide-on-mobile animate-fade-in stagger-4" style={{
              opacity: 0,
              background: 'var(--surface)',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
            }}>
              <div className="table-responsive-wrapper" style={{ border: 'none' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Jenis Sampah</th>
                      <th>Berat (kg)</th>
                      <th>Wilayah</th>
                      <th>Foto</th>
                      <th>Tanggal</th>
                      <th>Status</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {laporanList.map((laporan, index) => {
                      const jenisName = laporan.jenisSampah.namaJenis
                      const jenisInfo = JENIS_ICONS[jenisName] || { icon: '📦', badge: '' }
                      const statusCfg = STATUS_CONFIG[laporan.status]
                      const canEdit = laporan.status === 'PENDING'
                      const deleteAction = deleteLaporan.bind(null, laporan.id)
                      return (
                        <tr key={laporan.id}>
                          <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{index + 1}</td>
                          <td>
                            <span className={`badge ${jenisInfo.badge}`}>
                              {jenisInfo.icon} {jenisName}
                            </span>
                          </td>
                          <td style={{ fontWeight: 600 }}>{laporan.berat} kg</td>
                          <td>{laporan.wilayah.namaWilayah}</td>
                          <td>
                            {laporan.foto ? (
                              <a
                                href={laporan.foto.imageUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  color: 'var(--primary)',
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  fontSize: '0.85rem',
                                }}
                              >
                                📷 Lihat
                              </a>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>
                            )}
                          </td>
                          <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {new Date(laporan.tanggalLapor).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td>
                            <div>
                              <span className={`badge ${statusCfg.cls}`}>
                                {statusCfg.icon} {statusCfg.label}
                              </span>
                              {laporan.status === 'REJECTED' && laporan.adminNote && (
                                <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '4px', maxWidth: '160px' }}>
                                  📝 {laporan.adminNote}
                                </p>
                              )}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {canEdit && (
                                <Link
                                  href={`/dashboard/laporan/${laporan.id}/edit`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    color: 'var(--info)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  ✏️ Edit
                                </Link>
                              )}
                              <form action={deleteAction}>
                                <button type="submit" className="btn-danger" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                                  🗑️ Hapus
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card-based View */}
            <div className="hide-on-desktop animate-fade-in stagger-4" style={{ opacity: 0 }}>
              {laporanList.map((laporan) => {
                const jenisName = laporan.jenisSampah.namaJenis
                const jenisInfo = JENIS_ICONS[jenisName] || { icon: '📦', badge: '' }
                const statusCfg = STATUS_CONFIG[laporan.status]
                const canEdit = laporan.status === 'PENDING'
                const deleteAction = deleteLaporan.bind(null, laporan.id)
                return (
                  <div key={laporan.id} className="mobile-report-card">
                    <div className="mobile-report-card-header">
                      <span className={`badge ${jenisInfo.badge}`}>
                        {jenisInfo.icon} {jenisName}
                      </span>
                      <span className={`badge ${statusCfg.cls}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>

                    <div className="mobile-report-card-body">
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Berat Sampah</div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--foreground)' }}>
                          {laporan.berat} kg
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wilayah</div>
                        <div style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                          {laporan.wilayah.namaWilayah}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tanggal Lapor</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(laporan.tanggalLapor).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bukti Foto</div>
                        {laporan.foto ? (
                          <a
                            href={laporan.foto.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--primary)',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            📷 Lihat Foto
                          </a>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tidak ada</span>
                        )}
                      </div>
                    </div>

                    {laporan.catatan && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        💬 {laporan.catatan}
                      </div>
                    )}

                    {laporan.status === 'REJECTED' && laporan.adminNote && (
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'var(--danger-light)',
                        border: '1px solid var(--danger)',
                        color: 'var(--danger)',
                        fontSize: '0.8rem',
                      }}>
                        ⚠️ Catatan Petugas: {laporan.adminNote}
                      </div>
                    )}

                    <div className="mobile-report-card-actions">
                      {canEdit && (
                        <Link
                          href={`/dashboard/laporan/${laporan.id}/edit`}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: 'var(--info)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            textDecoration: 'none',
                          }}
                        >
                          ✏️ Edit
                        </Link>
                      )}
                      <form action={deleteAction}>
                        <button
                          type="submit"
                          className="btn-danger"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          🗑️ Hapus
                        </button>
                      </form>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Section Artikel Edukasi Lingkungan */}
        {latestArticles.length > 0 && (
          <div className="animate-fade-in" style={{ marginTop: '48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>
                  📰 <span className="gradient-text">Edukasi & Tips Lingkungan</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Panduan pilah sampah, informasi Bank Sampah, dan regulasi DKI Jakarta
                </p>
              </div>
              <Link
                href="/artikel"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  transition: 'all 0.2s',
                }}
              >
                Lihat Semua Artikel →
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {latestArticles.map((art) => (
                <Link
                  key={art.id}
                  href={`/artikel/${art.slug}`}
                  className="article-card"
                  style={{ textDecoration: 'none' }}
                >
                  <div className="article-card-image" style={{ height: '140px' }}>
                    <span>
                      {art.kategori.namaKategori.includes('Bank') ? '🏦' : art.kategori.namaKategori.includes('Daur') ? '♻️' : art.kategori.namaKategori.includes('Tips') ? '💡' : '📜'}
                    </span>
                  </div>
                  <div className="article-card-body" style={{ padding: '16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span className="badge badge-regulasi" style={{ fontSize: '0.7rem' }}>
                        {art.kategori.namaKategori}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.4, color: 'var(--foreground)' }}>
                      {art.judul}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {art.ringkasan}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
    </main>
  )
}
