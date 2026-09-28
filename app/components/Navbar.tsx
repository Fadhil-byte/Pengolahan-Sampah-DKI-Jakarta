'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import ThemeToggle from '@/app/components/ThemeToggle'

export default function Navbar({ userName, role }: { userName: string; role: 'USER' | 'ADMIN' }) {
  const pathname = usePathname()

  const navLinks = [
    { href: '/dashboard', label: '📊 Dashboard' },
    { href: '/dashboard/tambah', label: '➕ Tambah Laporan' },
    { href: '/dashboard/rewards', label: '🎁 Rewards' },
    { href: '/artikel', label: '📰 Artikel' },
    { href: '/dashboard/profil', label: '👤 Profil' },
  ]

  return (
    <nav className="glass-card animate-slide-down"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
      }}>
        {/* Logo */}
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>♻️</span>
          <span style={{
            fontSize: '1.1rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}>
            SampahKu
          </span>
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                color: pathname === link.href ? 'var(--primary)' : 'var(--text-muted)',
                background: pathname === link.href ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin Panel link jika role ADMIN */}
          {role === 'ADMIN' && (
            <Link
              href="/admin"
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                color: 'var(--warning)',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              ⚙️ Admin Panel
            </Link>
          )}
        </div>

        {/* User Info & Theme Toggle & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ThemeToggle />
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid var(--border)',
          }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {userName.charAt(0).toUpperCase()}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--foreground)' }}>
              {userName}
            </span>
          </div>
          <form action={logout}>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.85rem',
                fontWeight: 600,
                border: '1px solid var(--danger)',
                background: 'var(--danger-light)',
                color: 'var(--danger)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Keluar
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
