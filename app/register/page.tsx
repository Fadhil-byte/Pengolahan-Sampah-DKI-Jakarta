'use client'

import { register } from '@/app/actions/auth'
import { useActionState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/app/components/ThemeToggle'

export default function RegisterPage() {
  const [state, action, pending] = useActionState(register, undefined)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--background)',
      }}
    >
      {/* Top Header */}
      <header
        className="glass-card"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderRadius: 0,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: '1px solid var(--border)',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '60px',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.4rem' }}>🌱</span>
            <span
              style={{
                fontSize: '1.1rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              SampahKu
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="/" className="btn-secondary" style={{ textDecoration: 'none', padding: '6px 14px', fontSize: '0.82rem' }}>
              ← Beranda
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <div
        className="gradient-bg-hero"
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(24px, 5vw, 48px) clamp(16px, 4vw, 24px)',
          position: 'relative',
        }}
      >
        {/* Decorative floating elements */}
        <div style={{ position: 'fixed', top: '15%', left: '8%', fontSize: '3rem', opacity: 0.15 }} className="animate-float hide-on-mobile">🌱</div>
        <div style={{ position: 'fixed', top: '25%', right: '10%', fontSize: '2.5rem', opacity: 0.12, animationDelay: '1s' }} className="animate-float hide-on-mobile">🌏</div>
        <div style={{ position: 'fixed', bottom: '20%', left: '12%', fontSize: '2rem', opacity: 0.1, animationDelay: '2s' }} className="animate-float hide-on-mobile">♻️</div>
        <div style={{ position: 'fixed', bottom: '30%', right: '15%', fontSize: '2.5rem', opacity: 0.12, animationDelay: '0.5s' }} className="animate-float hide-on-mobile">🌿</div>

        <div
          className="glass-card animate-fade-in-scale"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: 'clamp(20px, 5vw, 40px)',
          }}
        >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌱</div>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}>
            Buat Akun Baru
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Bergabung untuk mengelola data sampah DKI Jakarta
          </p>
        </div>

        {/* Error Message */}
        {state?.message && (
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--danger-light)',
              border: '1px solid var(--danger)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '20px',
              color: 'var(--danger)',
              fontSize: '0.85rem',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ⚠️ {state.message}
          </div>
        )}

        {/* Form */}
        <form action={action}>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="nama" className="form-label">👤 Nama Lengkap</label>
            <input
              id="nama"
              name="nama"
              type="text"
              placeholder="Masukkan nama lengkap"
              className="form-input"
              required
            />
            {state?.errors?.nama && (
              <p className="form-error">{state.errors.nama[0]}</p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="nik" className="form-label">🪪 NIK (Nomor Induk Kependudukan)</label>
            <input
              id="nik"
              name="nik"
              type="text"
              placeholder="16 digit NIK"
              className="form-input"
              maxLength={16}
              required
            />
            {state?.errors?.nik && (
              <p className="form-error">{state.errors.nik[0]}</p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="email" className="form-label">📧 Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="contoh@email.com"
              className="form-input"
              required
            />
            {state?.errors?.email && (
              <p className="form-error">{state.errors.email[0]}</p>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="noHp" className="form-label">📱 Nomor HP</label>
            <input
              id="noHp"
              name="noHp"
              type="text"
              placeholder="08xxxxxxxxxx"
              className="form-input"
              required
            />
            {state?.errors?.noHp && (
              <p className="form-error">{state.errors.noHp[0]}</p>
            )}
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label htmlFor="password" className="form-label">🔒 Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Minimal 6 karakter"
              className="form-input"
              required
            />
            {state?.errors?.password && (
              <p className="form-error">{state.errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
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
                Mendaftar...
              </>
            ) : (
              'Daftar'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sudah punya akun?{' '}
            <Link
              href="/login"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Masuk
            </Link>
          </p>
        </div>
        </div>
      </div>

      {/* Auth Footer */}
      <footer
        style={{
          padding: '20px',
          textAlign: 'center',
          borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
        }}
      >
        © 2026 Pemerintah Provinsi DKI Jakarta — Dinas Lingkungan Hidup. Seluruh hak cipta dilindungi.
      </footer>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
