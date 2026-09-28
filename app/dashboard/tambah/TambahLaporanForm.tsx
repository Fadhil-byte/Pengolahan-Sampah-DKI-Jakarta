'use client'

import { createLaporan } from '@/app/actions/sampah'
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
  jenisList: { id: string; namaJenis: string }[]
  wilayahList: { id: string; namaWilayah: string }[]
}

export default function TambahLaporanForm({ jenisList, wilayahList }: Props) {
  const router = useRouter()
  const [selectedJenisId, setSelectedJenisId] = useState('')
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [fotoUrl, setFotoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFormAction(state: unknown, formData: FormData) {
    formData.set('jenisSampahId', selectedJenisId)
    if (fotoUrl) {
      formData.set('imageUrl', fotoUrl)
    }
    const result = await createLaporan(state as undefined, formData)
    if (result?.success) {
      router.push('/dashboard')
    }
    return result
  }

  const [state, action, pending] = useActionState(handleFormAction, undefined)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onload = (ev) => {
      setFotoPreview(ev.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
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
          ➕ Tambah Laporan Sampah
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Laporkan sampah yang telah dipilah untuk dijadwalkan penimbangan dan raih poin reward
        </p>
      </div>
        {/* Success Message */}
        {(state as { success?: boolean })?.success && (
          <div className="animate-fade-in" style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--primary-light)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: 'var(--primary-dark)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            ✅ {(state as { message?: string })?.message}
          </div>
        )}

        {/* Error Message */}
        {(state as { message?: string; success?: boolean })?.message && !(state as { success?: boolean })?.success && (
          <div className="animate-fade-in" style={{
            background: 'var(--danger-light)',
            border: '1px solid var(--danger)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: 'var(--danger)',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            ⚠️ {(state as { message?: string })?.message}
          </div>
        )}

        <form action={action}>
          {/* Section 1: Jenis Sampah (dari database) */}
          <div className="glass-card animate-fade-in stagger-1" style={{ opacity: 0, padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              🏷️ Jenis Sampah
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Pilih jenis sampah yang akan dilaporkan
            </p>

            {jenisList.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                ⚠️ Belum ada data jenis sampah. Hubungi admin untuk menambahkan.
              </p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
              }}>
                {jenisList.map((jenis) => {
                  const info = JENIS_ICONS[jenis.namaJenis] || { icon: '📦', desc: '' }
                  return (
                    <div
                      key={jenis.id}
                      className={`waste-type-option ${selectedJenisId === jenis.id ? 'selected' : ''}`}
                      onClick={() => setSelectedJenisId(jenis.id)}
                    >
                      <span className="icon">{info.icon}</span>
                      <span className="label">{jenis.namaJenis}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        {info.desc}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
            {(state as { errors?: { jenisSampahId?: string[] } })?.errors?.jenisSampahId && (
              <p className="form-error" style={{ marginTop: '12px' }}>
                {(state as { errors: { jenisSampahId: string[] } }).errors.jenisSampahId[0]}
              </p>
            )}
          </div>

          {/* Section 2: Detail */}
          <div className="glass-card animate-fade-in stagger-2" style={{ opacity: 0, padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              📝 Detail Laporan
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Lengkapi informasi berat dan wilayah
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Berat */}
              <div>
                <label htmlFor="berat" className="form-label">⚖️ Berat (kg)</label>
                <input
                  id="berat"
                  name="berat"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Contoh: 2.5"
                  className="form-input"
                  required
                />
                {(state as { errors?: { berat?: string[] } })?.errors?.berat && (
                  <p className="form-error">
                    {(state as { errors: { berat: string[] } }).errors.berat[0]}
                  </p>
                )}
              </div>

              {/* Wilayah (dari database) */}
              <div>
                <label htmlFor="wilayahId" className="form-label">📍 Wilayah</label>
                <select
                  id="wilayahId"
                  name="wilayahId"
                  className="form-select"
                  required
                  defaultValue=""
                >
                  <option value="" disabled>Pilih Wilayah</option>
                  {wilayahList.map((w) => (
                    <option key={w.id} value={w.id}>{w.namaWilayah}</option>
                  ))}
                </select>
                {(state as { errors?: { wilayahId?: string[] } })?.errors?.wilayahId && (
                  <p className="form-error">
                    {(state as { errors: { wilayahId: string[] } }).errors.wilayahId[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Catatan */}
            <div style={{ marginTop: '20px' }}>
              <label htmlFor="catatan" className="form-label">💬 Catatan (opsional)</label>
              <textarea
                id="catatan"
                name="catatan"
                rows={3}
                placeholder="Tambahkan catatan jika perlu..."
                className="form-input"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Section 3: Upload Foto Bukti */}
          <div className="glass-card animate-fade-in stagger-3" style={{ opacity: 0, padding: '28px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
              📸 Upload Foto Bukti <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>*wajib</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Upload foto sampah sebagai bukti (JPG, PNG, WebP, maks 5MB)
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {fotoPreview ? (
              <div style={{ position: 'relative' }}>
                <div style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '2px solid var(--primary-light)',
                  maxHeight: '300px',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoPreview}
                    alt="Preview foto sampah"
                    style={{
                      width: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: '12px',
                }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: uploading ? 'var(--warning)' : 'var(--primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                  }}>
                    {uploading ? '⏳ Mengupload...' : '✅ Foto berhasil diupload'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFotoPreview(null)
                      setFotoUrl(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="btn-danger"
                  >
                    🗑️ Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="upload-area"
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '12px', opacity: 0.7 }}>📸</div>
                <p style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--foreground)' }}>
                  Ambil Foto Langsung atau Pilih dari Galeri
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Format JPG, PNG, atau WebP (maksimal 5MB)
                </p>
              </div>
            )}

            {uploadError && (
              <p className="form-error" style={{ marginTop: '12px' }}>
                {uploadError}
              </p>
            )}
            {(state as { errors?: { imageUrl?: string[] } })?.errors?.imageUrl && (
              <p className="form-error" style={{ marginTop: '12px' }}>
                {(state as { errors: { imageUrl: string[] } }).errors.imageUrl[0]}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="animate-fade-in stagger-4" style={{ opacity: 0, display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
            <Link href="/dashboard" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Batal
            </Link>
            <button
              type="submit"
              disabled={pending || uploading || !selectedJenisId}
              className="btn-primary"
              style={{ padding: '14px 36px' }}
            >
              {pending ? (
                <>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                  Menyimpan...
                </>
              ) : (
                '💾 Simpan Laporan'
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
  )
}
