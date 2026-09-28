import Link from 'next/link'

export default function AdminFooter() {
  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        padding: '24px',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Institution Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🏛️</span>
            <div>
              <strong style={{ color: 'var(--foreground)' }}>
                Dinas Lingkungan Hidup Provinsi DKI Jakarta
              </strong>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Portal Operasional Verifikasi Timbangan &amp; Manajemen Data Sampah
              </div>
            </div>
          </div>

          {/* System & DB Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              PostgreSQL Terkoneksi
            </span>
            <span>•</span>
            <span>Versi Sistem 2.4.0</span>
            <span>•</span>
            <Link href="/dashboard" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
              Pratinjau Dashboard Warga →
            </Link>
          </div>
        </div>

        {/* Audit & Legal Subtext */}
        <div
          style={{
            paddingTop: '12px',
            borderTop: '1px dashed var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            fontSize: '0.74rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            🔒 Akses Terbatas: Hanya untuk staf dan petugas resmi Pemerintah Provinsi DKI Jakarta.
          </div>
          <div>
            © 2026 Pemerintah Provinsi DKI Jakarta. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </div>
    </footer>
  )
}
