'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import ThemeToggle from '@/app/components/ThemeToggle'

type NavbarProps = {
  userName?: string
  role?: 'USER' | 'ADMIN'
}

export default function Navbar({ userName, role }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isLoggedIn = Boolean(userName)

  const authNavLinks = [
    { href: '/dashboard', label: '📊 Dashboard', icon: '📊', shortLabel: 'Beranda' },
    { href: '/dashboard/tambah', label: '➕ Tambah Laporan', icon: '➕', shortLabel: 'Lapor' },
    { href: '/dashboard/rewards', label: '🎁 Rewards', icon: '🎁', shortLabel: 'Rewards' },
    { href: '/artikel', label: '📰 Artikel', icon: '📰', shortLabel: 'Artikel' },
    { href: '/dashboard/profil', label: '👤 Profil', icon: '👤', shortLabel: 'Profil' },
  ]

  const guestNavLinks = [
    { href: '/', label: '🏠 Beranda', icon: '🏠', shortLabel: 'Beranda' },
    { href: '/artikel', label: '📰 Artikel Edukasi', icon: '📰', shortLabel: 'Artikel' },
    { href: '/login', label: '🎁 Katalog Hadiah', icon: '🎁', shortLabel: 'Hadiah' },
  ]

  const guestBottomLinks = [
    { href: '/', label: '🏠 Beranda', icon: '🏠', shortLabel: 'Beranda' },
    { href: '/artikel', label: '📰 Artikel', icon: '📰', shortLabel: 'Artikel' },
    { href: '/login', label: '🔑 Masuk', icon: '🔑', shortLabel: 'Masuk' },
    { href: '/register', label: '🌱 Daftar', icon: '🌱', shortLabel: 'Daftar' },
  ]

  const navLinks = isLoggedIn ? authNavLinks : guestNavLinks
  const bottomNavLinks = isLoggedIn ? authNavLinks : guestBottomLinks

  function isLinkActive(href: string) {
    if (href === '/' || href === '/dashboard') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="glass-card animate-slide-down"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderRadius: 0,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: '1px solid var(--border)',
          padding: '0 16px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Logo */}
          <Link
            href={isLoggedIn ? '/dashboard' : '/'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>♻️</span>
            <span
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              SampahKu
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navLinks.map((link) => {
              const active = isLinkActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: active ? 'var(--primary)' : 'var(--text-muted)',
                    background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {link.label}
                </Link>
              )
            })}

            {isLoggedIn && role === 'ADMIN' && (
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

          {/* Desktop Right Actions */}
          <div className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ThemeToggle />

            {isLoggedIn && userName ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <span
                    style={{
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
                    }}
                  >
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
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link
                  href="/login"
                  className="btn-secondary"
                  style={{
                    textDecoration: 'none',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                  }}
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="btn-primary"
                  style={{
                    textDecoration: 'none',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                  }}
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Actions (Hamburger + Theme Toggle) */}
          <div className="hide-on-desktop" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                padding: '8px',
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--foreground)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '40px',
                minHeight: '40px',
              }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div
            className="animate-slide-down"
            style={{
              padding: '16px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {isLoggedIn && userName ? (
              <>
                {/* User Profile Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      }}
                    >
                      {userName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--foreground)' }}>
                        {userName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Role: {role || 'USER'}
                      </div>
                    </div>
                  </div>
                  {role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        color: 'var(--warning)',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      ⚙️ Admin
                    </Link>
                  )}
                </div>

                {/* Links List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {navLinks.map((link) => {
                    const active = isLinkActive(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: active ? 'var(--primary)' : 'var(--foreground)',
                          background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                          borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                        }}
                      >
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </div>

                {/* Logout button */}
                <form action={logout}>
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      border: '1px solid var(--danger)',
                      background: 'var(--danger-light)',
                      color: 'var(--danger)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    🚪 Keluar dari Akun
                  </button>
                </form>
              </>
            ) : (
              <>
                <div style={{ padding: '8px 4px' }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, marginBottom: '4px' }}>
                    🌱 SampahKu DKI Jakarta
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Sistem informasi dan partisipasi warga dalam pemilahan sampah
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {navLinks.map((link) => {
                    const active = isLinkActive(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderRadius: '10px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: active ? 'var(--primary)' : 'var(--foreground)',
                          background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                          borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                        }}
                      >
                        <span>{link.label}</span>
                      </Link>
                    )
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary"
                    style={{
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '10px',
                      fontSize: '0.88rem',
                    }}
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-primary"
                    style={{
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '10px',
                      fontSize: '0.88rem',
                    }}
                  >
                    Daftar
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar (Thumb-friendly App bar) */}
      <nav className="mobile-bottom-nav">
        {bottomNavLinks.map((link) => {
          const isActive = isLinkActive(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.shortLabel}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
