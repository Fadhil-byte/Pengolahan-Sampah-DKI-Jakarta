'use client'

import { useState, useTransition } from 'react'
import { redeemReward } from '@/app/actions/reward'
import { useRouter } from 'next/navigation'

type Reward = {
  id: string
  namaReward: string
  deskripsi: string | null
  poinDibutuhkan: number
  stok: number
  imageUrl: string | null
}

type Penukaran = {
  id: string
  poinDigunakan: number
  status: string
  tanggalTukar: string
  namaReward: string
}

const STATUS_PENUKARAN: Record<string, { label: string; icon: string; cls: string }> = {
  PENDING: { label: 'Diproses', icon: '⏳', cls: 'badge-pending' },
  COMPLETED: { label: 'Selesai', icon: '✅', cls: 'badge-verified' },
  CANCELLED: { label: 'Dibatalkan', icon: '❌', cls: 'badge-rejected' },
}

const REWARD_ICONS: Record<string, string> = {
  'Pulsa': '📱',
  'E-Wallet': '💳',
  'Token': '⚡',
  'Sembako': '🛒',
  'Voucher': '🎫',
  'Tumbler': '🥤',
}

function getRewardIcon(name: string): string {
  for (const [key, icon] of Object.entries(REWARD_ICONS)) {
    if (name.includes(key)) return icon
  }
  return '🎁'
}

export default function RewardClient({
  rewards,
  penukaranList,
  userPoin,
}: {
  rewards: Reward[]
  penukaranList: Penukaran[]
  userPoin: number
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [modal, setModal] = useState<Reward | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleRedeem(reward: Reward) {
    setModal(reward)
    setMessage(null)
  }

  function confirmRedeem() {
    if (!modal) return
    startTransition(async () => {
      const result = await redeemReward(modal.id)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: result.message || 'Penukaran berhasil!' })
        setTimeout(() => {
          setModal(null)
          setMessage(null)
          router.refresh()
        }, 1500)
      }
    })
  }

  return (
    <div>
      {/* Poin Balance Card */}
      <div className="glass-card animate-fade-in" style={{
        padding: '28px 32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(16, 185, 129, 0.05))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
            Saldo Poin Anda
          </p>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            ⭐ <span className="gradient-text">{userPoin.toLocaleString('id-ID')}</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Dapatkan poin dengan melaporkan sampah yang diverifikasi (1 kg = 10 poin)
          </p>
        </div>
        <div style={{
          padding: '12px 20px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--primary)',
        }}>
          🏆 {penukaranList.filter((p) => p.status === 'COMPLETED').length} Penukaran Diterima
        </div>
      </div>

      {/* Katalog Reward */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>🎁 Katalog Reward</h2>

      {rewards.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎁</div>
          <p style={{ color: 'var(--text-muted)' }}>Belum ada reward yang tersedia saat ini.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px',
        }}>
          {rewards.map((reward, idx) => {
            const canRedeem = userPoin >= reward.poinDibutuhkan && reward.stok > 0
            const icon = getRewardIcon(reward.namaReward)
            return (
              <div
                key={reward.id}
                className={`reward-card animate-fade-in stagger-${Math.min(idx + 1, 5)}`}
                style={{ opacity: 0 }}
              >
                <div className="reward-card-header">
                  <span className="reward-card-icon">{icon}</span>
                  <div className="reward-card-poin">
                    ⭐ {reward.poinDibutuhkan.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="reward-card-body">
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>
                    {reward.namaReward}
                  </h3>
                  {reward.deskripsi && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: 1.5 }}>
                      {reward.deskripsi}
                    </p>
                  )}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto',
                  }}>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: reward.stok > 0 ? 'var(--primary)' : 'var(--danger)',
                    }}>
                      {reward.stok > 0 ? `📦 Stok: ${reward.stok}` : '❌ Habis'}
                    </span>
                    <button
                      onClick={() => handleRedeem(reward)}
                      disabled={!canRedeem}
                      className={canRedeem ? 'btn-primary' : 'btn-secondary'}
                      style={{
                        padding: '8px 18px',
                        fontSize: '0.82rem',
                        opacity: canRedeem ? 1 : 0.5,
                        cursor: canRedeem ? 'pointer' : 'not-allowed',
                      }}
                    >
                      {reward.stok <= 0 ? 'Habis' : userPoin < reward.poinDibutuhkan ? 'Poin Kurang' : '🔄 Tukar'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Riwayat Penukaran */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '20px' }}>📋 Riwayat Penukaran</h2>

      {penukaranList.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Belum ada riwayat penukaran.</p>
        </div>
      ) : (
        <div style={{
          background: 'var(--surface)',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Reward</th>
                  <th>Poin</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {penukaranList.map((p, idx) => {
                  const cfg = STATUS_PENUKARAN[p.status] || STATUS_PENUKARAN.PENDING
                  return (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>🎁 {p.namaReward}</td>
                      <td style={{ fontWeight: 600 }}>⭐ {p.poinDigunakan.toLocaleString('id-ID')}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(p.tanggalTukar).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td>
                        <span className={`badge ${cfg.cls}`}>{cfg.icon} {cfg.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          backdropFilter: 'blur(4px)',
        }}>
          <div className="glass-card animate-fade-in-scale" style={{ padding: '32px', maxWidth: '440px', width: '90%' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{getRewardIcon(modal.namaReward)}</div>
              <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '4px' }}>
                Tukar Reward?
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <strong>{modal.namaReward}</strong>
              </p>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid rgba(16, 185, 129, 0.15)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Poin Anda saat ini</span>
                <span style={{ fontWeight: 700 }}>⭐ {userPoin.toLocaleString('id-ID')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Poin dibutuhkan</span>
                <span style={{ fontWeight: 700, color: 'var(--danger)' }}>- ⭐ {modal.poinDibutuhkan.toLocaleString('id-ID')}</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span style={{ fontWeight: 700 }}>Sisa poin</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)' }}>
                  ⭐ {(userPoin - modal.poinDibutuhkan).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {message && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '0.88rem',
                fontWeight: 600,
                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: message.type === 'success' ? 'var(--primary)' : 'var(--danger)',
                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
              }}>
                {message.type === 'success' ? '✅' : '❌'} {message.text}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setModal(null); setMessage(null) }}
                className="btn-secondary"
                disabled={isPending}
                style={{ padding: '10px 20px' }}
              >
                Batal
              </button>
              <button
                onClick={confirmRedeem}
                disabled={isPending || message?.type === 'success'}
                className="btn-primary"
                style={{
                  padding: '10px 20px',
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? '⏳ Memproses...' : '🔄 Konfirmasi Tukar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
