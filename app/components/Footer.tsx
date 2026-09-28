import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        marginTop: 'auto',
        color: 'var(--foreground)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '48px 24px 24px',
        }}
      >
        {/* Main Footer Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '36px',
            marginBottom: '36px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>♻️</span>
              <span
                style={{
                  fontSize: '1.25rem',
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
            </div>
            <p
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.88rem',
                lineHeight: 1.6,
                marginBottom: '16px',
              }}
            >
              Platform digital pengelolaan dan sensus sampah DKI Jakarta untuk mendukung pemilahan dari sumber, penguatan Bank Sampah, dan ekonomi sirkular ramah lingkungan.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>🏛️ Dinas Lingkungan Hidup DKI Jakarta</span>
            </div>
          </div>

          {/* Navigasi Warga */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: '16px',
                color: 'var(--foreground)',
              }}
            >
              🧭 Navigasi Warga
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  📊 Dashboard Warga
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tambah" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  ➕ Setor &amp; Lapor Sampah
                </Link>
              </li>
              <li>
                <Link href="/dashboard/rewards" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  🎁 Katalog Hadiah Poin
                </Link>
              </li>
              <li>
                <Link href="/artikel" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  📰 Berita &amp; Artikel Edukasi
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profil" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem', transition: 'color 0.2s' }}>
                  👤 Akun &amp; Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Edukasi & Regulasi */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: '16px',
                color: 'var(--foreground)',
              }}
            >
              📜 Regulasi &amp; Edukasi
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>
                <Link href="/artikel" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  ⚖️ Pergub DKI No. 77 / 2020
                </Link>
              </li>
              <li>
                <Link href="/artikel" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  🏦 Panduan Bank Sampah Unit (BSU)
                </Link>
              </li>
              <li>
                <Link href="/artikel" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  🌱 Tips Pemilahan Sampah Rumah Tangga
                </Link>
              </li>
              <li>
                <Link href="/artikel" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  🔄 Inovasi Daur Ulang &amp; Kompos
                </Link>
              </li>
            </ul>
          </div>

          {/* Layanan Dukungan */}
          <div>
            <h4
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: '16px',
                color: 'var(--foreground)',
              }}
            >
              📞 Layanan Bantuan
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <div>
                <strong>Layanan Darurat:</strong>
                <div>📞 Call Center 112 DKI Jakarta</div>
              </div>
              <div>
                <strong>Dinas Lingkungan Hidup:</strong>
                <div>📍 Jl. Mandala V No.67, Cililitan, Kramat Jati, Jakarta Timur</div>
              </div>
              <div style={{ marginTop: '4px' }}>
                <span className="badge badge-regulasi" style={{ fontSize: '0.75rem' }}>
                  🟢 Layanan Aktif 24/7
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div
          style={{
            paddingTop: '24px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © 2026 <strong>SampahKu</strong> — Pemerintah Provinsi DKI Jakarta. Seluruh hak cipta dilindungi.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Beranda
            </Link>
            <span>•</span>
            <Link href="/artikel" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Artikel
            </Link>
            <span>•</span>
            <Link href="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
