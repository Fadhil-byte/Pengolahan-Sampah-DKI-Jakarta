'use client'

import { useState, useTransition } from 'react'
import { createJenisSampah, deleteJenisSampah, createWilayah, deleteWilayah } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

type JenisItem = { id: string; namaJenis: string; totalLaporan: number }
type WilayahItem = { id: string; namaWilayah: string; totalLaporan: number }

function MasterSection({
  title,
  items,
  placeholder,
  onAdd,
  onDelete,
  isPending,
}: {
  title: string
  items: { id: string; label: string; totalLaporan: number }[]
  placeholder: string
  onAdd: (name: string) => Promise<{ error?: string; success?: boolean } | undefined>
  onDelete: (id: string) => Promise<{ error?: string; success?: boolean } | undefined>
  isPending: boolean
}) {
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    const result = await onAdd(input.trim())
    if (result?.error) {
      setError(result.error)
    } else {
      setSuccess('Berhasil ditambahkan!')
      setInput('')
      setTimeout(() => setSuccess(null), 2500)
    }
  }

  return (
    <div className="glass-card animate-fade-in" style={{ opacity: 0, padding: '28px' }}>
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>{title}</h2>

      {/* Add Form */}
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="form-input"
          style={{ flex: 1 }}
          required
        />
        <button type="submit" disabled={isPending || !input.trim()} className="btn-primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
          ➕ Tambah
        </button>
      </form>

      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '12px', fontWeight: 500 }}>⚠️ {error}</p>}
      {success && <p style={{ color: 'var(--primary)', fontSize: '0.85rem', marginBottom: '12px', fontWeight: 500 }}>✅ {success}</p>}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
        {items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
            Belum ada data. Tambahkan yang pertama!
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.04)',
                border: '1px solid var(--border)',
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
                <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  ({item.totalLaporan} laporan)
                </span>
              </div>
              <button
                onClick={() => onDelete(item.id)}
                disabled={isPending || item.totalLaporan > 0}
                title={item.totalLaporan > 0 ? 'Tidak bisa dihapus karena sudah digunakan pada laporan' : 'Hapus'}
                style={{
                  padding: '5px 10px', borderRadius: '8px', border: 'none',
                  background: item.totalLaporan > 0 ? 'var(--border)' : 'var(--danger)',
                  color: item.totalLaporan > 0 ? 'var(--text-muted)' : 'white',
                  fontSize: '0.78rem', fontWeight: 600,
                  cursor: item.totalLaporan > 0 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function MasterDataClient({
  jenisList,
  wilayahList,
}: {
  jenisList: JenisItem[]
  wilayahList: WilayahItem[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleAddJenis(name: string) {
    let result: { error?: string; success?: boolean } | undefined
    await new Promise<void>((resolve) => {
      startTransition(async () => {
        result = await createJenisSampah(name)
        router.refresh()
        resolve()
      })
    })
    return result
  }

  async function handleDeleteJenis(id: string) {
    let result: { error?: string; success?: boolean } | undefined
    await new Promise<void>((resolve) => {
      startTransition(async () => {
        result = await deleteJenisSampah(id)
        router.refresh()
        resolve()
      })
    })
    return result
  }

  async function handleAddWilayah(name: string) {
    let result: { error?: string; success?: boolean } | undefined
    await new Promise<void>((resolve) => {
      startTransition(async () => {
        result = await createWilayah(name)
        router.refresh()
        resolve()
      })
    })
    return result
  }

  async function handleDeleteWilayah(id: string) {
    let result: { error?: string; success?: boolean } | undefined
    await new Promise<void>((resolve) => {
      startTransition(async () => {
        result = await deleteWilayah(id)
        router.refresh()
        resolve()
      })
    })
    return result
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
      <MasterSection
        title="🏷️ Jenis Sampah"
        items={jenisList.map((j) => ({ id: j.id, label: j.namaJenis, totalLaporan: j.totalLaporan }))}
        placeholder="Contoh: Elektronik"
        onAdd={handleAddJenis}
        onDelete={handleDeleteJenis}
        isPending={isPending}
      />
      <MasterSection
        title="📍 Wilayah / Kecamatan"
        items={wilayahList.map((w) => ({ id: w.id, label: w.namaWilayah, totalLaporan: w.totalLaporan }))}
        placeholder="Contoh: Menteng"
        onAdd={handleAddWilayah}
        onDelete={handleDeleteWilayah}
        isPending={isPending}
      />
    </div>
  )
}
