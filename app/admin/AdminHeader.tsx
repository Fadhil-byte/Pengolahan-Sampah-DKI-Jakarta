'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/app/components/ThemeToggle'
import { logout } from '@/app/actions/auth'

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/admin': { title: 'Dashboard Utama', subtitle: 'Ringkasan statistik dan metrik sampah ibu kota' },
  '/admin/laporan': { title: 'Kelola Laporan', subtitle: 'Verifikasi timbangan riil dan status laporan warga' },
  '/admin/artikel': { title: 'Artikel Edukasi', subtitle: 'Publikasi berita, regulasi, dan materi edukasi lingkungan' },
  '/admin/rewards': { title: 'Hadiah & Rewards', subtitle: 'Manajemen katalog voucher dan penukaran poin warga' },
  '/admin/users': { title: 'Manajemen Pengguna', subtitle: 'Daftar akun warga dan pengaturan hak akses petugas' },
  '/admin/master-data': { title: 'Master Data', subtitle: 'Konfigurasi jenis sampah, poin per kg, dan wilayah dinas' },
}

export default function AdminHeader({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  // Match the page info
  const matchedKey = Object.keys(PAGE_TITLES).find(key => 
    key === pathname || (key !== '/admin' && pathname.startsWith(key))
  )
  const pageInfo = matchedKey ? PAGE_TITLES[matchedKey] : { title: 'Panel Administrasi', subtitle: 'Sistem Informasi Pengelolaan Sampah DKI Jakarta' }

  return (
    <header
      className="glass-card admin-header"
      style={{
        borderRadius: 0,
        borderTop: 'none',
        borderLeft: 'none',
        borderRight: 'none',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        background: 'var(--surface-glass)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '64px',
          gap: '16px',
        }}
      >
        {/* Left: Breadcrumbs & Current Page Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 600 }}>Panel Petugas</span>
            <span>/</span>
            <span style={{ color: 'var(--primary-dark)', fontWeight: 700 }}>{pageInfo.title}</span>
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--foreground)' }}>
            {pageInfo.title}
          </div>
        </div>

        {/* Right: Actions, Switch to User View, Profile, Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Status Badge */}
          <div
            className="hide-on-mobile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '100px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--primary-dark)',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
            <span>DLH Aktif</span>
          </div>

          {/* Switch to Citizen View */}
          <Link
            href="/dashboard"
            className="btn-secondary hide-on-mobile"
            style={{
              textDecoration: 'none',
              padding: '6px 12px',
              fontSize: '0.8rem',
              fontWeight: 600,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🌐</span>
            <span>Tinjau Web Warga</span>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Admin Profile Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              borderRadius: '10px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
              }}
            >
              {(adminName.charAt(0) || 'A').toUpperCase()}
            </div>
            <div className="hide-on-mobile" style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', lineHeight: 1.2 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--foreground)' }}>
                {adminName}
              </span>
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: '#7c3aed' }}>
                ADMIN DLH
              </span>
            </div>
          </div>

          {/* Logout Action */}
          <form action={logout}>
            <button
              type="submit"
              title="Keluar dari Panel Admin"
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--danger)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s',
              }}
            >
              <span>🚪</span>
              <span className="hide-on-mobile">Keluar</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
