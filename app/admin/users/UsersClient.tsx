'use client'

import { useState, useTransition } from 'react'
import { updateUserRole, deleteUser } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  nama: string
  email: string
  noHp: string
  nik: string
  role: 'USER' | 'ADMIN'
  createdAt: string
  totalLaporan: number
}

export default function UsersClient({ users, currentUserId }: { users: User[]; currentUserId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteModal, setDeleteModal] = useState<User | null>(null)
  const [search, setSearch] = useState('')

  const filtered = users.filter(
    (u) =>
      u.nama.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.nik.includes(search)
  )

  function handleRoleChange(userId: string, newRole: 'USER' | 'ADMIN') {
    startTransition(async () => {
      await updateUserRole(userId, newRole)
      router.refresh()
    })
  }

  function handleDelete() {
    if (!deleteModal) return
    startTransition(async () => {
      await deleteUser(deleteModal.id)
      setDeleteModal(null)
      router.refresh()
    })
  }

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Cari nama, email, atau NIK..."
          className="form-input"
          style={{ maxWidth: '400px' }}
        />
      </div>

      <div className="table-responsive-wrapper" style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Email</th>
                <th>NIK</th>
                <th>No HP</th>
                <th>Role</th>
                <th>Laporan</th>
                <th>Bergabung</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{idx + 1}</td>
                  <td style={{ fontWeight: 700 }}>
                    {u.nama}
                    {u.id === currentUserId && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--primary)', marginLeft: '6px', fontWeight: 600 }}>(Anda)</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{u.nik}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.noHp}</td>
                  <td>
                    <span className={`badge ${u.role === 'ADMIN' ? 'badge-b3' : 'badge-organik'}`}>
                      {u.role === 'ADMIN' ? '⚙️ Admin' : '👤 User'}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{u.totalLaporan}</td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    {u.id !== currentUserId ? (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => handleRoleChange(u.id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          disabled={isPending}
                          style={{
                            padding: '5px 10px', borderRadius: '8px', fontSize: '0.78rem',
                            fontWeight: 600, border: '1px solid var(--border-strong)',
                            background: 'rgba(16, 185, 129, 0.08)', color: 'var(--primary)',
                            cursor: 'pointer', whiteSpace: 'nowrap',
                          }}
                        >
                          {u.role === 'ADMIN' ? '👤 Jadi User' : '⚙️ Jadi Admin'}
                        </button>
                        <button
                          onClick={() => setDeleteModal(u)}
                          disabled={isPending}
                          className="btn-danger"
                          style={{ padding: '5px 10px', fontSize: '0.78rem' }}
                        >
                          🗑️
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    👤 Tidak ada pengguna ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, backdropFilter: 'blur(4px)' }}>
          <div className="glass-card animate-fade-in-scale" style={{ padding: '32px', maxWidth: '400px', width: '90%' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '10px' }}>⚠️ Hapus Pengguna</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
              Anda akan menghapus akun <strong>{deleteModal.nama}</strong> ({deleteModal.email}).
            </p>
            <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '24px', fontWeight: 500 }}>
              Semua laporan yang dibuat pengguna ini juga akan terhapus secara permanen!
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteModal(null)} className="btn-secondary" disabled={isPending} style={{ padding: '10px 20px' }}>Batal</button>
              <button onClick={handleDelete} disabled={isPending} className="btn-danger" style={{ padding: '10px 20px' }}>
                {isPending ? '⏳ Menghapus...' : '🗑️ Hapus Permanen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
