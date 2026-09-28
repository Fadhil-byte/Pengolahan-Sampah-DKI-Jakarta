'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  reset: () => void
  unstable_retry?: () => void
}) {
  useEffect(() => {
    console.error('Route segment error:', error)
  }, [error])

  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '480px',
        width: '100%',
        padding: '36px',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0,0,0,0.1))',
      }}>
        <div style={{ fontSize: '44px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--foreground)' }}>
          Terjadi Kesalahan
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
          {error.message || 'Halaman mengalami kendala saat memuat data.'}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => (unstable_retry ? unstable_retry() : reset())}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--primary, #16a34a)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Coba Lagi
          </button>
          <Link
            href="/dashboard"
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--foreground)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
