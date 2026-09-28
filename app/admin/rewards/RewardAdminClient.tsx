'use client'

import { useState, useTransition } from 'react'
import { createReward, deleteReward, updatePenukaranStatus } from '@/app/actions/reward'
import { useRouter } from 'next/navigation'

type Reward = {
  id: string
  namaReward: string
  deskripsi: string | null
  poinDibutuhkan: number
  stok: number
  createdAt: string
}

type Penukaran = {
  id: string
  poinDigunakan: number
  status: string
  tanggalTukar: string
  userName: string
  userEmail: string
  namaReward: string
}

const STATUS_PENUKARAN: Record<string, { label: string; icon: string; cls: string }> = {
  PENDING: { label: 'Diproses', icon: '⏳', cls: 'badge-pending' },
  COMPLETED: { label: 'Selesai', icon: '✅', cls: 'badge-verified' },
  CANCELLED: { label: 'Dibatalkan', icon: '❌', cls: 'badge-rejected' },
}

export default function RewardAdminClient({
  rewards,
  penukaranList,
  stats,
}: {
  rewards: Reward[]
  penukaranList: Penukaran[]
  stats: { totalReward: number; totalPenukaran: number; poinDiberikan: number }
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showAddForm, setShowAddForm] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [confirmModal, setConfirmModal] = useState<{ penukaran: Penukaran; action: 'COMPLETED' | 'CANCELLED' } | null>(null)
  const [deleteModal, setDeleteModal] = useState<Reward | null>(null)

  function handleAddReward(formData: FormData) {
    startTransition(async () => {
      const result = await createReward(formData)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Reward berhasil ditambahkan!' })
        setShowAddForm(false)
        router.refresh()
      }
      setTimeout(() => setMessage(null), 3000)
    })
  }

  function handleDeleteReward() {
    if (!deleteModal) return
    startTransition(async () => {
      const result = await deleteReward(deleteModal.id)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Reward berhasil dihapus!' })
      }
      setDeleteModal(null)
      router.refresh()
      setTimeout(() => setMessage(null), 3000)
    })
  }

  function handleUpdateStatus() {
    if (!confirmModal) return
    startTransition(async () => {
      const result = await updatePenukaranStatus(confirmModal.penukaran.id, confirmModal.action)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: `Status berhasil diubah ke ${confirmModal.action}!` })
      }
      setConfirmModal(null)
      router.refresh()
      setTimeout(() => setMessage(null), 3000)
    })
  }

  return (
    <div>
      {/* Alert Message */}
      {message && (
        <div className="animate-fade-in" style={{
          padding: '14px 20px',
          borderRadius: '12px',
          marginBottom: '20px',
          fontSize: '0.9rem',
          fontWeight: 600,
          background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? 'var(--primary)' : 'var(--danger)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
        }}>
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Reward', value: stats.totalReward, icon: '🎁', color: 'rgba(168, 85, 247, 0.12)' },
          { label: 'Total Penukaran', value: stats.totalPenukaran, icon: '🔄', color: 'rgba(59, 130, 246, 0.12)' },
          { label: 'Total Poin Diberikan', value: stats.poinDiberikan.toLocaleString('id-ID'), icon: '⭐', color: 'rgba(245, 158, 11, 0.12)' },
        ].map((s) => (
          <div key={s.label} className="stat-card">
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

      {/* Kelola Reward */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>🎁 Katalog Reward</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
          style={{ padding: '10px 20px', fontSize: '0.88rem' }}
        >
          {showAddForm ? '✕ Tutup' : '➕ Tambah Reward'}
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="glass-card animate-fade-in-scale" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>➕ Tambah Reward Baru</h3>
          <form action={handleAddReward}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Nama Reward *</label>
                <input name="namaReward" required className="form-input" placeholder="Contoh: Pulsa 10.000" />
              </div>
              <div>
                <label className="form-label">Poin Dibutuhkan *</label>
                <input name="poinDibutuhkan" type="number" required min="1" className="form-input" placeholder="100" />
              </div>
              <div>
                <label className="form-label">Stok *</label>
                <input name="stok" type="number" required min="0" className="form-input" placeholder="50" />
              </div>
              <div>
                <label className="form-label">URL Gambar (opsional)</label>
                <input name="imageUrl" className="form-input" placeholder="https://..." />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="form-label">Deskripsi (opsional)</label>
              <textarea name="deskripsi" rows={2} className="form-input" placeholder="Deskripsi reward..." style={{ resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={isPending} className="btn-primary" style={{ padding: '10px 24px' }}>
              {isPending ? '⏳ Menyimpan...' : '💾 Simpan Reward'}
            </button>
          </form>
        </div>
      )}

      {/* Reward Table */}
      <div style={{
        background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid var(--border)', marginBottom: '36px',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Reward</th>
                <th>Deskripsi</th>
                <th>Poin</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((r, idx) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700 }}>🎁 {r.namaReward}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '200px' }}>
                    {r.deskripsi || '-'}
                  </td>
                  <td style={{ fontWeight: 700 }}>⭐ {r.poinDibutuhkan.toLocaleString('id-ID')}</td>
                  <td>
                    <span style={{
                      fontWeight: 700,
                      color: r.stok > 0 ? 'var(--primary)' : 'var(--danger)',
                    }}>
                      {r.stok}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setDeleteModal(r)}
                      className="btn-danger"
                      style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {rewards.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    📭 Belum ada reward. Klik &quot;Tambah Reward&quot; untuk memulai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daftar Penukaran */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>🔄 Daftar Penukaran</h2>

      <div className="table-responsive-wrapper" style={{
        background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid var(--border)',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>User</th>
                <th>Reward</th>
                <th>Poin</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {penukaranList.map((p, idx) => {
                const cfg = STATUS_PENUKARAN[p.status] || STATUS_PENUKARAN.PENDING
                return (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.userName}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.userEmail}</div>
                    </td>
                    <td style={{ fontWeight: 600 }}>🎁 {p.namaReward}</td>
                    <td style={{ fontWeight: 700 }}>⭐ {p.poinDigunakan.toLocaleString('id-ID')}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(p.tanggalTukar).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>
                    </td>
                    <td>
                      {p.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setConfirmModal({ penukaran: p, action: 'COMPLETED' })}
                            style={{
                              padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem',
                              fontWeight: 600, cursor: 'pointer',
                              background: 'rgba(16, 185, 129, 0.12)', color: 'var(--primary)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            ✅ Selesai
                          </button>
                          <button
                            onClick={() => setConfirmModal({ penukaran: p, action: 'CANCELLED' })}
                            style={{
                              padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem',
                              fontWeight: 600, cursor: 'pointer',
                              background: 'rgba(239, 68, 68, 0.08)', color: 'var(--danger)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                            }}
                          >
                            ❌ Batalkan
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
              {penukaranList.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    📭 Belum ada penukaran reward
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}>
          <div className="glass-card animate-fade-in-scale" style={{ padding: '32px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '12px' }}>
              🗑️ Hapus Reward?
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Apakah Anda yakin ingin menghapus <strong>{deleteModal.namaReward}</strong>?
              Reward yang sudah pernah ditukarkan tidak dapat dihapus.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteModal(null)} className="btn-secondary" style={{ padding: '10px 20px' }}>
                Batal
              </button>
              <button onClick={handleDeleteReward} disabled={isPending} className="btn-danger" style={{ padding: '10px 20px' }}>
                {isPending ? '⏳ Menghapus...' : '🗑️ Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {confirmModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}>
          <div className="glass-card animate-fade-in-scale" style={{ padding: '32px', maxWidth: '440px', width: '90%' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '8px' }}>
              {confirmModal.action === 'COMPLETED' ? '✅ Selesaikan Penukaran' : '❌ Batalkan Penukaran'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
              Penukaran oleh <strong>{confirmModal.penukaran.userName}</strong>
            </p>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px' }}>
              🎁 {confirmModal.penukaran.namaReward} — ⭐ {confirmModal.penukaran.poinDigunakan} poin
            </p>
            {confirmModal.action === 'CANCELLED' && (
              <div style={{
                padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '0.85rem', color: 'var(--warning)',
              }}>
                ⚠️ Pembatalan akan mengembalikan poin dan menambah stok reward kembali.
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmModal(null)} className="btn-secondary" disabled={isPending} style={{ padding: '10px 20px' }}>
                Batal
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isPending}
                style={{
                  padding: '10px 20px', borderRadius: '12px', border: 'none',
                  fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem',
                  background: confirmModal.action === 'COMPLETED'
                    ? 'linear-gradient(135deg, var(--primary), var(--primary-light))'
                    : 'var(--danger)',
                  color: 'white', opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? '⏳ Memproses...' : confirmModal.action === 'COMPLETED' ? '✅ Konfirmasi Selesai' : '❌ Konfirmasi Batal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
