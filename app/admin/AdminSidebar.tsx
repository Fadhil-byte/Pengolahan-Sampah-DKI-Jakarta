'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import ThemeToggle from '@/app/components/ThemeToggle'

const navItems = [
  { href: '/admin', label: '📊 Dashboard', exact: true },
  { href: '/admin/laporan', label: '📋 Kelola Laporan', exact: false },
  { href: '/admin/artikel', label: '📰 Artikel', exact: false },
  { href: '/admin/rewards', label: '🎁 Rewards', exact: false },
  { href: '/admin/users', label: '👥 Pengguna', exact: false },
  { href: '/admin/master-data', label: '⚙️ Master Data', exact: false },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      maxHeight: '100vh',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>♻️</span>
          <span style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SampahKu
          </span>
        </div>
        <span style={{
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
        }}>
          ⚙️ Admin Panel
        </span>
      </div>

      {/* Nav Links */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: '8px', marginBottom: '8px' }}>
          Menu
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              marginBottom: '4px',
              color: isActive(item.href, item.exact) ? 'var(--primary)' : 'var(--foreground)',
              background: isActive(item.href, item.exact) ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
              borderLeft: isActive(item.href, item.exact) ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ThemeToggle />
        </div>
        <form action={logout}>
          <button type="submit" style={{
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
          }}>
            🚪 Keluar
          </button>
        </form>
      </div>
    </aside>
  )
}
