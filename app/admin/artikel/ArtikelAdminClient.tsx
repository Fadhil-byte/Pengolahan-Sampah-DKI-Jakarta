'use client'

import { useState } from 'react'
import {
  createArtikel,
  updateArtikel,
  deleteArtikel,
  toggleFeatured,
  createKategoriArtikel,
  deleteKategoriArtikel,
} from '@/app/actions/artikel'

type Artikel = {
  id: string
  judul: string
  slug: string
  ringkasan: string
  konten: string
  imageUrl: string | null
  viewsCount: number
  isFeatured: boolean
  createdAt: string
  kategoriNama: string
  kategoriId: string
  authorNama: string | null
  wilayahNama: string | null
  wilayahId: string | null
}

type Kategori = {
  id: string
  namaKategori: string
  deskripsi: string | null
  _count: number
}

type Wilayah = {
  id: string
  namaWilayah: string
}

type Props = {
  artikelList: Artikel[]
  kategoriList: Kategori[]
  wilayahList: Wilayah[]
  stats: {
    totalArtikel: number
    totalViews: number
    totalKategori: number
    totalFeatured: number
  }
}

export default function ArtikelAdminClient({ artikelList, kategoriList, wilayahList, stats }: Props) {
  const [activeTab, setActiveTab] = useState<'list' | 'form' | 'kategori'>('list')
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingArtikel, setEditingArtikel] = useState<Artikel | null>(null)

  // Filter articles
  const filtered = artikelList.filter((a) => {
    const matchSearch =
      a.judul.toLowerCase().includes(search.toLowerCase()) ||
      a.ringkasan.toLowerCase().includes(search.toLowerCase())
    const matchKategori = !filterKategori || a.kategoriId === filterKategori
    return matchSearch && matchKategori
  })

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  async function handleSubmitArtikel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      let result
      if (editingArtikel) {
        result = await updateArtikel(editingArtikel.id, formData)
      } else {
        result = await createArtikel(formData)
      }

      if (result.error) {
        showMessage('error', result.error)
      } else {
        showMessage('success', editingArtikel ? 'Artikel berhasil diupdate!' : 'Artikel berhasil dibuat!')
        form.reset()
        setEditingArtikel(null)
        setActiveTab('list')
      }
    } catch {
      showMessage('error', 'Terjadi kesalahan.')
    }
    setLoading(false)
  }

  async function handleDeleteArtikel(id: string, judul: string) {
    if (!confirm(`Hapus artikel "${judul}"?`)) return
    setLoading(true)
    const result = await deleteArtikel(id)
    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', 'Artikel berhasil dihapus!')
    }
    setLoading(false)
  }

  async function handleToggleFeatured(id: string) {
    setLoading(true)
    await toggleFeatured(id)
    setLoading(false)
  }

  async function handleCreateKategori(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    const nama = formData.get('namaKategori') as string
    const deskripsi = formData.get('deskripsi') as string

    const result = await createKategoriArtikel(nama, deskripsi)
    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', 'Kategori berhasil ditambahkan!')
      form.reset()
    }
    setLoading(false)
  }

  async function handleDeleteKategori(id: string, nama: string) {
    if (!confirm(`Hapus kategori "${nama}"?`)) return
    setLoading(true)
    const result = await deleteKategoriArtikel(id)
    if (result.error) {
      showMessage('error', result.error)
    } else {
      showMessage('success', 'Kategori berhasil dihapus!')
    }
    setLoading(false)
  }

  function startEdit(artikel: Artikel) {
    setEditingArtikel(artikel)
    setActiveTab('form')
  }

  const statCards = [
    { label: 'Total Artikel', value: stats.totalArtikel, icon: '📰', color: 'rgba(16, 185, 129, 0.12)' },
    { label: 'Total Dibaca', value: stats.totalViews.toLocaleString('id-ID'), icon: '👁️', color: 'rgba(59, 130, 246, 0.12)' },
    { label: 'Kategori', value: stats.totalKategori, icon: '🏷️', color: 'rgba(168, 85, 247, 0.12)' },
    { label: 'Featured', value: stats.totalFeatured, icon: '⭐', color: 'rgba(245, 158, 11, 0.12)' },
  ]

  return (
    <div>
      {/* Message */}
      {message && (
        <div
          className="animate-slide-down"
          style={{
            padding: '12px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            fontWeight: 600,
            fontSize: '0.9rem',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: message.type === 'success' ? 'var(--primary)' : 'var(--danger)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          }}
        >
          {message.type === 'success' ? '✅' : '❌'} {message.text}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((s) => (
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {[
          { key: 'list' as const, label: '📋 Daftar Artikel', count: artikelList.length },
          { key: 'form' as const, label: editingArtikel ? '✏️ Edit Artikel' : '➕ Tambah Artikel' },
          { key: 'kategori' as const, label: '🏷️ Kategori', count: kategoriList.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              if (tab.key !== 'form') setEditingArtikel(null)
              setActiveTab(tab.key)
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '1px solid',
              borderColor: activeTab === tab.key ? 'var(--primary)' : 'var(--border)',
              background: activeTab === tab.key ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)',
              color: activeTab === tab.key ? 'var(--primary)' : 'var(--foreground)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label} {tab.count !== undefined && <span style={{ opacity: 0.7 }}>({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* TAB: Daftar Artikel */}
      {activeTab === 'list' && (
        <div className="animate-fade-in">
          {/* Search + Filter */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <select
              className="form-select"
              value={filterKategori}
              onChange={(e) => setFilterKategori(e.target.value)}
              style={{ maxWidth: '220px' }}
            >
              <option value="">Semua Kategori</option>
              {kategoriList.map((k) => (
                <option key={k.id} value={k.id}>{k.namaKategori}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="glass-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Belum Ada Artikel</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                Mulai buat artikel edukasi lingkungan!
              </p>
              <button className="btn-primary" onClick={() => setActiveTab('form')}>
                ➕ Buat Artikel Pertama
              </button>
            </div>
          ) : (
            <div style={{ background: 'var(--surface)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Author</th>
                      <th>Views</th>
                      <th>Featured</th>
                      <th>Tanggal</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((artikel) => (
                      <tr key={artikel.id}>
                        <td>
                          <div style={{ maxWidth: '250px' }}>
                            <div style={{ fontWeight: 600, marginBottom: '2px' }}>{artikel.judul}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/{artikel.slug}</div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-regulasi">{artikel.kategoriNama}</span>
                        </td>
                        <td style={{ fontSize: '0.85rem' }}>{artikel.authorNama || '-'}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                            {artikel.viewsCount.toLocaleString('id-ID')}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleToggleFeatured(artikel.id)}
                            disabled={loading}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              fontSize: '1.2rem',
                              opacity: loading ? 0.5 : 1,
                            }}
                            title={artikel.isFeatured ? 'Hapus dari featured' : 'Jadikan featured'}
                          >
                            {artikel.isFeatured ? '⭐' : '☆'}
                          </button>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {new Date(artikel.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => startEdit(artikel)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: 'var(--info)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="btn-danger"
                              onClick={() => handleDeleteArtikel(artikel.id, artikel.judul)}
                              disabled={loading}
                              style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                            >
                              🗑️ Hapus
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: Form Artikel */}
      {activeTab === 'form' && (
        <div className="animate-fade-in">
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '24px' }}>
              {editingArtikel ? '✏️ Edit Artikel' : '📝 Buat Artikel Baru'}
            </h2>

            <form onSubmit={handleSubmitArtikel}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Judul */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Judul Artikel *</label>
                  <input
                    type="text"
                    name="judul"
                    className="form-input"
                    placeholder="Contoh: Implementasi Pergub DKI No. 77 Tahun 2020"
                    defaultValue={editingArtikel?.judul || ''}
                    required
                  />
                </div>

                {/* Kategori */}
                <div>
                  <label className="form-label">Kategori *</label>
                  <select name="kategoriId" className="form-select" defaultValue={editingArtikel?.kategoriId || ''} required>
                    <option value="">Pilih Kategori</option>
                    {kategoriList.map((k) => (
                      <option key={k.id} value={k.id}>{k.namaKategori}</option>
                    ))}
                  </select>
                </div>

                {/* Wilayah (opsional) */}
                <div>
                  <label className="form-label">Wilayah Terkait (Opsional)</label>
                  <select name="wilayahId" className="form-select" defaultValue={editingArtikel?.wilayahId || ''}>
                    <option value="">Semua Wilayah</option>
                    {wilayahList.map((w) => (
                      <option key={w.id} value={w.id}>{w.namaWilayah}</option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="form-label">URL Gambar (Opsional)</label>
                  <input
                    type="url"
                    name="imageUrl"
                    className="form-input"
                    placeholder="https://example.com/image.jpg"
                    defaultValue={editingArtikel?.imageUrl || ''}
                  />
                </div>

                {/* Featured */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Featured?</label>
                  <select name="isFeatured" className="form-select" style={{ maxWidth: '120px' }} defaultValue={editingArtikel?.isFeatured ? 'true' : 'false'}>
                    <option value="false">Tidak</option>
                    <option value="true">Ya</option>
                  </select>
                </div>

                {/* Ringkasan */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Ringkasan *</label>
                  <textarea
                    name="ringkasan"
                    className="form-input"
                    placeholder="Ringkasan singkat artikel (akan tampil di card preview)"
                    rows={3}
                    defaultValue={editingArtikel?.ringkasan || ''}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Konten */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Konten Artikel *</label>
                  <textarea
                    name="konten"
                    className="form-input"
                    placeholder="Tulis konten artikel lengkap di sini..."
                    rows={12}
                    defaultValue={editingArtikel?.konten || ''}
                    required
                    style={{ resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? '⏳ Menyimpan...' : editingArtikel ? '💾 Update Artikel' : '📤 Publikasikan'}
                </button>
                {editingArtikel && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingArtikel(null)
                      setActiveTab('list')
                    }}
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB: Kategori */}
      {activeTab === 'kategori' && (
        <div className="animate-fade-in">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Form Tambah Kategori */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>➕ Tambah Kategori</h2>
              <form onSubmit={handleCreateKategori}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label">Nama Kategori *</label>
                  <input
                    type="text"
                    name="namaKategori"
                    className="form-input"
                    placeholder="Contoh: Tips Lingkungan"
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Deskripsi (Opsional)</label>
                  <input
                    type="text"
                    name="deskripsi"
                    className="form-input"
                    placeholder="Deskripsi singkat kategori"
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? '⏳ ...' : '➕ Tambah'}
                </button>
              </form>
            </div>

            {/* Daftar Kategori */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px' }}>📋 Daftar Kategori</h2>
              {kategoriList.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '24px' }}>
                  Belum ada kategori.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {kategoriList.map((k) => (
                    <div
                      key={k.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{k.namaKategori}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {k._count} artikel{k.deskripsi ? ` · ${k.deskripsi}` : ''}
                        </div>
                      </div>
                      <button
                        className="btn-danger"
                        onClick={() => handleDeleteKategori(k.id, k.namaKategori)}
                        disabled={loading || k._count > 0}
                        style={{
                          fontSize: '0.78rem',
                          padding: '5px 10px',
                          opacity: k._count > 0 ? 0.4 : 1,
                        }}
                        title={k._count > 0 ? 'Tidak bisa hapus, kategori masih memiliki artikel' : 'Hapus kategori'}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
