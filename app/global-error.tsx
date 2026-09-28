'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  reset: () => void
  unstable_retry?: () => void
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error)
  }, [error])

  return (
    <html lang="id">
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px',
          maxWidth: '500px',
          background: 'rgba(30, 41, 59, 0.7)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
            Terjadi Kesalahan Sistem
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.5 }}>
            {error.message || 'Terjadi kesalahan tidak terduga pada aplikasi.'}
          </p>
          <button
            onClick={() => (unstable_retry ? unstable_retry() : reset())}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#16a34a',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Muat Ulang Halaman
          </button>
        </div>
      </body>
    </html>
  )
}
