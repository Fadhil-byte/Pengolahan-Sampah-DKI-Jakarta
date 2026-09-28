'use client'

import { login } from '@/app/actions/auth'
import { useActionState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div
      className="gradient-bg-hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {/* Decorative floating elements */}
      <div style={{ position: 'fixed', top: '10%', left: '8%', fontSize: '3rem', opacity: 0.15 }} className="animate-float">🌿</div>
      <div style={{ position: 'fixed', top: '20%', right: '12%', fontSize: '2.5rem', opacity: 0.12, animationDelay: '1s' }} className="animate-float">♻️</div>
      <div style={{ position: 'fixed', bottom: '15%', left: '15%', fontSize: '2rem', opacity: 0.1, animationDelay: '2s' }} className="animate-float">🌍</div>
      <div style={{ position: 'fixed', bottom: '25%', right: '8%', fontSize: '2.5rem', opacity: 0.12, animationDelay: '0.5s' }} className="animate-float">🍃</div>

      <div
        className="glass-card animate-fade-in-scale"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>♻️</div>
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
            SampahKu
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sistem Pengelolaan Sampah DKI Jakarta
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

          <div style={{ marginBottom: '28px' }}>
            <label htmlFor="password" className="form-label">🔒 Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Masukkan password"
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
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        {/* Register Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Belum punya akun?{' '}
            <Link
              href="/register"
              style={{
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
