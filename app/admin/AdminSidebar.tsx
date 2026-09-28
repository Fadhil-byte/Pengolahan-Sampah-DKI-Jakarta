'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import ThemeToggle from '@/app/components/ThemeToggle'

const navItems = [
  { href: '/admin', label: '📊 Dashboard', exact: true },
  { href: '/admin/laporan', label: '📋 Kelola Laporan', exact: false },
  { href: '/admin/artikel', label: '📰 Artikel Edukasi', exact: false },
  { href: '/admin/rewards', label: '🎁 Hadiah & Rewards', exact: false },
  { href: '/admin/users', label: '👥 Manajemen Pengguna', exact: false },
  { href: '/admin/master-data', label: '⚙️ Master Data', exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const renderSidebarContent = (onLinkClick?: () => void) => (
    <>
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>♻️</span>
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
          </div>
          {onLinkClick && (
            <button
              onClick={onLinkClick}
              aria-label="Tutup Menu"
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
            >
              ✕
            </button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'rgba(245, 158, 11, 0.15)',
              color: 'var(--warning)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            ⚙️ Panel DLH Jakarta
          </span>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            paddingLeft: '8px',
            marginBottom: '8px',
          }}
        >
          Menu Utama
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                marginBottom: '4px',
                color: active ? 'var(--primary)' : 'var(--foreground)',
                background: active ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                borderLeft: active ? '3px solid var(--primary)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}
            >
              {item.label}
            </Link>
          )
        })}

        <div style={{ margin: '16px 8px', borderTop: '1px solid var(--border)' }} />

        <Link
          href="/dashboard"
          onClick={onLinkClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            color: 'var(--text-muted)',
            background: 'transparent',
            transition: 'all 0.2s',
          }}
        >
          ← Ke Tampilan Warga
        </Link>
      </nav>

      {/* Sidebar Footer */}
      <div
        style={{
          padding: '16px 12px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ThemeToggle />
        </div>
        <form action={logout}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              border: '1px solid var(--danger)',
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s',
            }}
          >
            🚪 Keluar
          </button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="admin-sidebar-desktop">{renderSidebarContent()}</aside>

      {/* Mobile Sticky Header */}
      <header className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Buka Menu Admin"
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
            ☰
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem' }}>♻️</span>
            <span
              style={{
                fontSize: '1.05rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Admin Panel
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ThemeToggle />
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div
          className="drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Mobile Offcanvas Drawer */}
      <aside
        className="admin-sidebar-drawer"
        style={{
          transform: mobileDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {renderSidebarContent(() => setMobileDrawerOpen(false))}
      </aside>
    </>
  )
}
