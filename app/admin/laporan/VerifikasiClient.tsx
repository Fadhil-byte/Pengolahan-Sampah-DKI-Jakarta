'use client'

import { useState, useTransition } from 'react'
import { verifyLaporan } from '@/app/actions/sampah'
import { useRouter } from 'next/navigation'

type Laporan = {
  id: string
  berat: number
  catatan: string | null
  status: string
  adminNote: string | null
  tanggalLapor: string
  userName: string
  userEmail: string
  namaJenis: string
  namaWilayah: string
  fotoUrl: string | null
}

const STATUS_CONFIG: Record<string, { label: string; icon: string; cls: string }> = {
  PENDING: { label: 'Pending', icon: '⏳', cls: 'badge-pending' },
  VERIFIED: { label: 'Disetujui', icon: '✅', cls: 'badge-verified' },
  REJECTED: { label: 'Ditolak', icon: '❌', cls: 'badge-rejected' },
}

export default function VerifikasiClient({
  laporanList,
  jenisList,
  currentStatus,
  currentJenis,
}: {
  laporanList: Laporan[]
  jenisList: { id: string; namaJenis: string }[]
  currentStatus?: string
  currentJenis?: string
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modal, setModal] = useState<{ laporan: Laporan; action: 'VERIFIED' | 'REJECTED' } | null>(null)
  const [adminNote, setAdminNote] = useState('')

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(window.location.search)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/laporan?${params.toString()}`)
  }

  function handleVerify(laporan: Laporan, action: 'VERIFIED' | 'REJECTED') {
    setModal({ laporan, action })
    setAdminNote('')
  }

  function confirmVerify() {
    if (!modal) return
    startTransition(async () => {
      await verifyLaporan(modal.laporan.id, modal.action, adminNote || undefined)
      setModal(null)
      router.refresh()
    })
  }

  return (
    <div>
      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '180px' }}
          value={currentJenis || ''}
          onChange={(e) => handleFilter('jenis', e.target.value)}
        >
          <option value="">Semua Jenis Sampah</option>
          {jenisList.map((j) => (
            <option key={j.id} value={j.id}>{j.namaJenis}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Pelapor</th>
                <th>Jenis</th>
                <th>Berat</th>
                <th>Wilayah</th>
                <th>Foto</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporanList.map((l, idx) => {
                const cfg = STATUS_CONFIG[l.status]
                return (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{l.userName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{l.userEmail}</div>
                    </td>
                    <td>{l.namaJenis}</td>
                    <td style={{ fontWeight: 600 }}>{l.berat} kg</td>
                    <td>{l.namaWilayah}</td>
                    <td>
                      {l.fotoUrl ? (
                        <a href={l.fotoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}>
                          📷 Lihat
                        </a>
                      ) : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>-</span>}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(l.tanggalLapor).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>
                      {l.adminNote && (
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '3px', maxWidth: '120px' }}>
                          📝 {l.adminNote}
                        </p>
                      )}
                    </td>
                    <td>
                      {l.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleVerify(l, 'VERIFIED')}
                            style={{
                              padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem',
                              fontWeight: 600, cursor: 'pointer',
                              background: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            } as React.CSSProperties}
                          >
                            ✅ Setujui
                          </button>
                          <button
                            onClick={() => handleVerify(l, 'REJECTED')}
                            style={{
                              padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem',
                              fontWeight: 600, border: '1px solid rgba(239, 68, 68, 0.3)',
                              cursor: 'pointer', background: 'rgba(239, 68, 68, 0.08)',
                              color: 'var(--danger)',
                            } as React.CSSProperties}
                          >
                            ❌ Tolak
                          </button>
                        </div>
                      )}
                      {l.status !== 'PENDING' && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {laporanList.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    📭 Tidak ada laporan ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}>
          <div className="glass-card animate-fade-in-scale" style={{ padding: '32px', maxWidth: '440px', width: '90%' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px' }}>
              {modal.action === 'VERIFIED' ? '✅ Setujui Laporan' : '❌ Tolak Laporan'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Laporan dari <strong>{modal.laporan.userName}</strong> — {modal.laporan.namaJenis} ({modal.laporan.berat} kg)
            </p>

            {modal.action === 'REJECTED' && (
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">📝 Alasan Penolakan (wajib)</label>
                <textarea
                  rows={3}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Contoh: Foto tidak jelas / Berat tidak wajar..."
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModal(null)}
                className="btn-secondary"
                disabled={isPending}
                style={{ padding: '10px 20px' }}
              >
                Batal
              </button>
              <button
                onClick={confirmVerify}
                disabled={isPending || (modal.action === 'REJECTED' && !adminNote.trim())}
                style={{
                  padding: '10px 20px', borderRadius: '12px', border: 'none',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                  background: modal.action === 'VERIFIED'
                    ? 'linear-gradient(135deg, var(--primary), var(--primary-light))'
                    : 'var(--danger)',
                  color: 'white', opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? '⏳ Memproses...' : modal.action === 'VERIFIED' ? '✅ Konfirmasi Setujui' : '❌ Konfirmasi Tolak'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
