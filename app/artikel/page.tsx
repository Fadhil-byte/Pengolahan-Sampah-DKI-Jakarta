import { prisma } from '@/app/lib/db'
import Link from 'next/link'
import ThemeToggle from '@/app/components/ThemeToggle'
import { getSession } from '@/app/lib/session'

export const metadata = {
  title: 'Artikel Edukasi Lingkungan — SampahKu DKI Jakarta',
  description: 'Baca artikel edukasi lingkungan, tips daur ulang, regulasi pengelolaan sampah DKI Jakarta, dan informasi Bank Sampah.',
}

export default async function ArtikelPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; q?: string }>
}) {
  const { kategori, q } = await searchParams
  const session = await getSession()

  const kategoriList = await prisma.kategoriArtikel.findMany({
    include: { _count: { select: { artikel: true } } },
    orderBy: { namaKategori: 'asc' },
  })

  // Build where clause
  const where: Record<string, unknown> = {}
  if (kategori) {
    where.kategoriId = kategori
  }
  if (q) {
    where.OR = [
      { judul: { contains: q, mode: 'insensitive' } },
      { ringkasan: { contains: q, mode: 'insensitive' } },
    ]
  }

  const artikelList = await prisma.artikelEdukasi.findMany({
    where,
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    include: {
      kategori: true,
      author: { select: { nama: true } },
    },
  })

  const featuredArtikel = artikelList.find((a) => a.isFeatured)
  const regularArtikel = artikelList.filter((a) => !a.isFeatured || a.id !== featuredArtikel?.id)

  // Kategori icon mapping
  const KATEGORI_ICONS: Record<string, string> = {
    'Regulasi & Kebijakan': '📜',
    'Bank Sampah': '🏦',
    'Daur Ulang & Inovasi': '♻️',
    'Tips Lingkungan': '💡',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Header / Nav */}
      <nav className="glass-card" style={{
        position: 'sticky', top: 0, zIndex: 50,
        borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none',
        borderBottom: '1px solid var(--border)', padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px',
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <span style={{ fontSize: '1.5rem' }}>♻️</span>
            <span style={{
              fontSize: '1.1rem', fontWeight: 800,
              background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>SampahKu</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ThemeToggle />
            {session ? (
              <Link href={session.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px' }}>
                {session.role === 'ADMIN' ? '⚙️ Admin' : '📊 Dashboard'}
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 20px' }}>Masuk</Link>
                <Link href="/register" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px' }}>Daftar</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Hero Section */}
        <div className="animate-fade-in" style={{ marginBottom: '36px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--border-strong)',
            borderRadius: '100px', padding: '6px 18px', fontSize: '0.82rem', fontWeight: 600,
            color: 'var(--primary-dark)', marginBottom: '16px',
          }}>
            📰 Artikel & Edukasi Lingkungan
          </div>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, marginBottom: '12px',
            letterSpacing: '-0.02em',
          }}>
            <span className="gradient-text">Berita & Edukasi</span> Lingkungan DKI Jakarta
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Informasi terkini seputar pengelolaan sampah, regulasi, inovasi daur ulang, dan tips menjaga lingkungan di DKI Jakarta.
          </p>

          {/* Search */}
          <form style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <div style={{ position: 'relative', maxWidth: '480px', width: '100%' }}>
              <input
                type="text"
                name="q"
                className="form-input"
                placeholder="🔍 Cari artikel..."
                defaultValue={q || ''}
                style={{ paddingRight: '100px' }}
              />
              {kategori && <input type="hidden" name="kategori" value={kategori} />}
              <button type="submit" className="btn-primary" style={{
                position: 'absolute', right: '4px', top: '4px', bottom: '4px',
                padding: '0 20px', fontSize: '0.85rem', borderRadius: '10px',
              }}>
                Cari
              </button>
            </div>
          </form>
        </div>

        {/* Kategori Pills */}
        <div className="animate-fade-in stagger-1" style={{ opacity: 0, display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '32px' }}>
          <Link
            href={q ? `/artikel?q=${q}` : '/artikel'}
            className={`category-pill ${!kategori ? 'active' : ''}`}
          >
            📋 Semua
          </Link>
          {kategoriList.map((k) => (
            <Link
              key={k.id}
              href={q ? `/artikel?kategori=${k.id}&q=${q}` : `/artikel?kategori=${k.id}`}
              className={`category-pill ${kategori === k.id ? 'active' : ''}`}
            >
              {KATEGORI_ICONS[k.namaKategori] || '📁'} {k.namaKategori} ({k._count.artikel})
            </Link>
          ))}
        </div>

        {/* Featured Article Hero */}
        {featuredArtikel && !kategori && !q && (
          <Link
            href={`/artikel/${featuredArtikel.slug}`}
            className="article-hero-card animate-fade-in stagger-2"
            style={{ opacity: 0, marginBottom: '36px' }}
          >
            <div style={{
              background: featuredArtikel.imageUrl
                ? `url(${featuredArtikel.imageUrl}) center/cover`
                : 'linear-gradient(135deg, rgba(5, 150, 105, 0.15), rgba(16, 185, 129, 0.1))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: '280px',
            }}>
              {!featuredArtikel.imageUrl && (
                <span style={{ fontSize: '5rem', opacity: 0.3 }}>📰</span>
              )}
            </div>
            <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-featured">⭐ Featured</span>
                <span className="badge badge-regulasi">{featuredArtikel.kategori.namaKategori}</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>
                {featuredArtikel.judul}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '16px' }}>
                {featuredArtikel.ringkasan}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <span>✍️ {featuredArtikel.author?.nama || 'Admin'}</span>
                <span>📅 {new Date(featuredArtikel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                <span>👁️ {featuredArtikel.viewsCount.toLocaleString('id-ID')} kali dibaca</span>
              </div>
            </div>
          </Link>
        )}

        {/* Article Grid */}
        {regularArtikel.length === 0 && !featuredArtikel ? (
          <div className="glass-card animate-fade-in stagger-3" style={{ opacity: 0, textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Belum Ada Artikel</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {q ? `Tidak ditemukan artikel untuk "${q}".` : 'Artikel edukasi akan segera hadir.'}
            </p>
          </div>
        ) : (
          <div className="animate-fade-in stagger-3" style={{
            opacity: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px',
          }}>
            {regularArtikel.map((artikel) => (
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
        )}
      </main>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © 2026 SampahKu — Sistem Pengelolaan Sampah DKI Jakarta
      </div>
    </div>
  )
}
