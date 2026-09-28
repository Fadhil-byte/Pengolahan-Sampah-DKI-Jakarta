import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/app/components/ThemeToggle'

export default async function HomePage() {
  const session = await getSession()
  if (session) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    })
    if (user) {
      const dest = user.role === 'ADMIN' ? '/admin' : '/dashboard'
      redirect(dest)
    }
  }

  // Fetch latest articles for homepage preview
  const latestArticles = await prisma.artikelEdukasi.findMany({
    take: 3,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: { kategori: true },
  })

  const KATEGORI_ICONS: Record<string, string> = {
    'Regulasi & Kebijakan': '📜',
    'Bank Sampah': '🏦',
    'Daur Ulang & Inovasi': '♻️',
    'Tips Lingkungan': '💡',
  }

  return (
    <div className="gradient-bg-hero" style={{ minHeight: '100vh' }}>
      {/* Decorative floating elements */}
      <div style={{ position: 'fixed', top: '8%', left: '6%', fontSize: '4rem', opacity: 0.12 }} className="animate-float">🌿</div>
      <div style={{ position: 'fixed', top: '15%', right: '10%', fontSize: '3rem', opacity: 0.1, animationDelay: '1s' }} className="animate-float">♻️</div>
      <div style={{ position: 'fixed', bottom: '20%', left: '12%', fontSize: '3.5rem', opacity: 0.1, animationDelay: '1.5s' }} className="animate-float">🌍</div>
      <div style={{ position: 'fixed', bottom: '10%', right: '8%', fontSize: '3rem', opacity: 0.1, animationDelay: '0.5s' }} className="animate-float">🍃</div>
      <div style={{ position: 'fixed', top: '50%', left: '3%', fontSize: '2.5rem', opacity: 0.08, animationDelay: '2s' }} className="animate-float">🌱</div>
      <div style={{ position: 'fixed', top: '40%', right: '5%', fontSize: '2rem', opacity: 0.08, animationDelay: '2.5s' }} className="animate-float">🥤</div>

      {/* Top Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>♻️</span>
          <span style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            SampahKu
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/artikel" style={{
            padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600,
            textDecoration: 'none', color: 'var(--primary)',
            background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--border)',
            transition: 'all 0.2s',
          }}>
            📰 Artikel
          </Link>
          <ThemeToggle />
          <Link href="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '10px 24px' }}>
            Masuk
          </Link>
          <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 24px' }}>
            Daftar
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px 60px',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--border-strong)',
            borderRadius: '100px',
            padding: '8px 20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--primary-dark)',
            marginBottom: '24px',
          }}>
            🏛️ Sistem Pengelolaan Sampah DKI Jakarta
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.03em',
          }}>
            <span style={{
              background: 'linear-gradient(135deg, var(--primary-dark), var(--primary), var(--accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Kelola Sampah,
            </span>
            <br />
            <span style={{ color: 'var(--foreground)' }}>
              Selamatkan Jakarta
            </span>
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            maxWidth: '580px',
            margin: '0 auto 36px',
          }}>
            Laporkan dan kelola data sampah di wilayah Anda. Pilih jenis sampah,
            upload bukti foto, dan bantu sensus pengelolaan sampah DKI Jakarta.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{
              textDecoration: 'none',
              padding: '16px 36px',
              fontSize: '1.05rem',
            }}>
              🚀 Mulai Sekarang
            </Link>
            <Link href="/login" className="btn-secondary" style={{
              textDecoration: 'none',
              padding: '16px 36px',
              fontSize: '1.05rem',
            }}>
              Sudah Punya Akun
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="animate-fade-in stagger-2" style={{
          opacity: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          width: '100%',
          marginTop: '60px',
        }}>
          {[
            { icon: '🏷️', title: '5 Jenis Sampah', desc: 'Organik, Anorganik, B3, Residu, dan Plastik' },
            { icon: '📸', title: 'Upload Foto', desc: 'Bukti visual untuk setiap laporan sampah' },
            { icon: '📍', title: '44 Kecamatan', desc: 'Seluruh wilayah DKI Jakarta tercakup' },
            { icon: '⚖️', title: 'Data Berat', desc: 'Pencatatan berat sampah dalam kilogram' },
          ].map((feature, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{feature.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Artikel Preview Section */}
      {latestArticles.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 60px' }}>
          <div className="animate-fade-in stagger-3" style={{ opacity: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>
                  📰 <span className="gradient-text">Artikel Terbaru</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Edukasi lingkungan dan informasi pengelolaan sampah DKI Jakarta
                </p>
              </div>
              <Link href="/artikel" style={{
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none',
                padding: '8px 18px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)', transition: 'all 0.2s',
              }}>
                Lihat Semua →
              </Link>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {latestArticles.map((artikel) => (
                <Link
                  key={artikel.id}
                  href={`/artikel/${artikel.slug}`}
                  className="article-card"
                >
                  <div className="article-card-image">
                    {artikel.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={artikel.imageUrl} alt={artikel.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span>{KATEGORI_ICONS[artikel.kategori.namaKategori] || '📰'}</span>
                    )}
                  </div>
                  <div className="article-card-body">
                    <div style={{ marginBottom: '10px' }}>
                      <span className="badge badge-regulasi" style={{ fontSize: '0.72rem' }}>
                        {artikel.kategori.namaKategori}
                      </span>
                      {artikel.isFeatured && (
                        <span className="badge badge-featured" style={{ fontSize: '0.72rem', marginLeft: '6px' }}>
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                    <h3>{artikel.judul}</h3>
                    <p>{artikel.ringkasan}</p>
                  </div>
                  <div className="article-card-footer">
                    <span>📅 {new Date(artikel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>👁️ {artikel.viewsCount.toLocaleString('id-ID')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
      }}>
        © 2026 SampahKu — Sistem Pengelolaan Sampah DKI Jakarta
      </div>
    </div>
  )
}

