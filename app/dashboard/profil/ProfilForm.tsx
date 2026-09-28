'use client'

import { useState, useTransition } from 'react'

type User = {
  id: string
  nama: string
  email: string
  noHp: string
  nik: string
  role: string
  createdAt: string
}

async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  const res = await fetch('/api/profile/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, oldPassword, newPassword }),
  })
  return res.json()
}

export default function ProfilForm({ user }: { user: User }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const joinDate = new Date(user.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password baru minimal 6 karakter.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password tidak cocok.' })
      return
    }

    startTransition(async () => {
      const result = await changePassword(user.id, oldPassword, newPassword)
      if (result.success) {
        setMessage({ type: 'success', text: 'Password berhasil diubah!' })
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ type: 'error', text: result.error || 'Gagal mengubah password.' })
      }
    })
  }

  const infoFields = [
    { label: '👤 Nama Lengkap', value: user.nama },
    { label: '📧 Email', value: user.email },
    { label: '📱 Nomor HP', value: user.noHp },
    { label: '🪪 NIK', value: user.nik },
    { label: '🏷️ Role', value: user.role === 'ADMIN' ? '⚙️ Administrator' : '🧑‍💼 Pengguna' },
    { label: '📅 Bergabung Sejak', value: joinDate },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Info Card */}
      <div className="glass-card animate-fade-in stagger-1" style={{ opacity: 0, padding: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '20px' }}>
          📋 Informasi Akun
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}>
          {infoFields.map((field) => (
            <div
              key={field.label}
              style={{
                padding: '14px 16px',
                background: 'rgba(16, 185, 129, 0.04)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>
                {field.label}
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{field.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="glass-card animate-fade-in stagger-2" style={{ opacity: 0, padding: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
          🔐 Ganti Password
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Pastikan password baru minimal 6 karakter
        </p>

        {message && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: 500,
            fontSize: '0.9rem',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'var(--danger-light)',
            border: `1px solid ${message.type === 'success' ? 'var(--primary-light)' : 'var(--danger)'}`,
            color: message.type === 'success' ? 'var(--primary-dark)' : 'var(--danger)',
          }}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label className="form-label">Password Lama</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="form-input"
              placeholder="Masukkan password lama"
              required
            />
          </div>
          <div>
            <label className="form-label">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          <div>
            <label className="form-label">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Ulangi password baru"
              required
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary"
            >
              {isPending ? '⏳ Menyimpan...' : '🔐 Ubah Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
