'use client'

import { updateLaporan } from '@/app/actions/sampah'
import { useActionState, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const JENIS_ICONS: Record<string, { icon: string; desc: string }> = {
  'Organik': { icon: '🌿', desc: 'Sisa makanan, daun, kayu' },
  'Anorganik': { icon: '♻️', desc: 'Kaleng, kaca, logam' },
  'B3': { icon: '☢️', desc: 'Baterai, obat, kimia' },
  'Residu': { icon: '🗑️', desc: 'Popok, pembalut, puntung' },
  'Plastik': { icon: '🥤', desc: 'Botol, kantong, kemasan' },
}

type Props = {
  laporanId: string
  defaultValues: {
    jenisSampahId: string
    berat: number
    wilayahId: string
    catatan: string
    imageUrl: string
  }
  jenisList: { id: string; namaJenis: string }[]
  wilayahList: { id: string; namaWilayah: string }[]
}

export default function EditLaporanForm({ laporanId, defaultValues, jenisList, wilayahList }: Props) {
  const router = useRouter()
  const [selectedJenisId, setSelectedJenisId] = useState(defaultValues.jenisSampahId)
  const [fotoPreview, setFotoPreview] = useState<string | null>(defaultValues.imageUrl || null)
  const [fotoUrl, setFotoUrl] = useState<string | null>(defaultValues.imageUrl || null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFormAction(state: unknown, formData: FormData) {
    formData.set('jenisSampahId', selectedJenisId)
    if (fotoUrl) {
      formData.set('imageUrl', fotoUrl)
    }
    const result = await updateLaporan(laporanId, state as undefined, formData)
    if (result?.success) {
      router.push('/dashboard')
    }
    return result
  }

  const [state, action, pending] = useActionState(handleFormAction, undefined)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setUploading(true)
    setUploadError(null)
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      })
      let data: { url?: string; error?: string } | null = null
      try {
        data = (await res.json()) as { url?: string; error?: string }
      } catch {
        // Ignored: empty or non-JSON response body
      }

      if (res.ok && data?.url) {
        setFotoUrl(data.url)
      } else {
        setUploadError(data?.error || `Gagal upload foto (HTTP ${res.status}).`)
        setFotoPreview(null)
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal upload foto.'
      setUploadError(errorMsg)
      setFotoPreview(null)
    } finally {
      setUploading(false)
    }
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
      <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '6px',
          }}
        >
          ✏️ Edit Laporan Sampah
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Perbarui rincian jenis sampah, estimasi berat, lokasi wilayah, atau foto bukti sebelum diverifikasi petugas.
        </p>
      </div>
        {(state as { message?: string; success?: boolean })?.message && !(state as { success?: boolean })?.success && (
          <div className="animate-fade-in" style={{ background: 'var(--danger-light)', border: '1px solid var(--danger)', borderRadius: '12px', padding: '16px', marginBottom: '24px', color: 'var(--danger)', fontWeight: 500 }}>
            ⚠️ {(state as { message?: string }).message}
          </div>
        )}

        <form action={action}>
          {/* Jenis Sampah */}
          <div className="glass-card animate-fade-in stagger-1" style={{ opacity: 0, padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>🏷️ Jenis Sampah</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              {jenisList.map((jenis) => {
                const info = JENIS_ICONS[jenis.namaJenis] || { icon: '📦', desc: '' }
                return (
                  <div key={jenis.id} className={`waste-type-option ${selectedJenisId === jenis.id ? 'selected' : ''}`} onClick={() => setSelectedJenisId(jenis.id)}>
                    <span className="icon">{info.icon}</span>
                    <span className="label">{jenis.namaJenis}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{info.desc}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Detail */}
          <div className="glass-card animate-fade-in stagger-2" style={{ opacity: 0, padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>📝 Detail Laporan</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label htmlFor="berat" className="form-label">⚖️ Berat (kg)</label>
                <input id="berat" name="berat" type="number" step="0.1" min="0.1" className="form-input" defaultValue={defaultValues.berat} required />
              </div>
              <div>
                <label htmlFor="wilayahId" className="form-label">📍 Wilayah</label>
                <select id="wilayahId" name="wilayahId" className="form-select" defaultValue={defaultValues.wilayahId} required>
                  {wilayahList.map((w) => (
                    <option key={w.id} value={w.id}>{w.namaWilayah}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginTop: '20px' }}>
              <label htmlFor="catatan" className="form-label">💬 Catatan (opsional)</label>
              <textarea id="catatan" name="catatan" rows={3} className="form-input" defaultValue={defaultValues.catatan} style={{ resize: 'vertical' }} />
            </div>
          </div>

          {/* Foto */}
          <div className="glass-card animate-fade-in stagger-3" style={{ opacity: 0, padding: '28px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>📸 Foto Bukti</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Biarkan kosong jika tidak ingin mengganti foto</p>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} style={{ display: 'none' }} />
            {fotoPreview ? (
              <div>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '2px solid var(--primary-light)', maxHeight: '260px' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fotoPreview} alt="Preview" style={{ width: '100%', maxHeight: '260px', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ color: uploading ? 'var(--warning)' : 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>
                    {uploading ? '⏳ Mengupload...' : '✅ Foto siap'}
                  </span>
                  <button type="button" onClick={() => { setFotoPreview(null); setFotoUrl(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="btn-danger">🗑️ Hapus</button>
                </div>
              </div>
            ) : (
              <div className="upload-area" onClick={() => fileInputRef.current?.click()}>
                <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.6 }}>📷</div>
                <p style={{ fontWeight: 600, marginBottom: '4px' }}>Klik untuk ganti foto</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>JPG, PNG, WebP - maks 5MB</p>
              </div>
            )}
            {uploadError && <p className="form-error" style={{ marginTop: '8px' }}>{uploadError}</p>}
          </div>

          <div className="animate-fade-in stagger-4" style={{ opacity: 0, display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>Batal</Link>
            <button type="submit" disabled={pending || uploading} className="btn-primary" style={{ padding: '14px 36px' }}>
              {pending ? '⏳ Menyimpan...' : '💾 Simpan Perubahan'}
            </button>
          </div>
        </form>
      </main>
  )
}
