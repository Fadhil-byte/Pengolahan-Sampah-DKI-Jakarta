import { prisma } from '@/app/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/app/components/ThemeToggle'
import { getSession } from '@/app/lib/session'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const artikel = await prisma.artikelEdukasi.findUnique({
    where: { slug },
    select: { judul: true, ringkasan: true },
  })
  if (!artikel) return { title: 'Artikel Tidak Ditemukan' }
  return {
    title: `${artikel.judul} — SampahKu`,
    description: artikel.ringkasan,
  }
}

export default async function ArtikelDetailPage({ params }: PageProps) {
  const { slug } = await params
  const session = await getSession()

  const artikel = await prisma.artikelEdukasi.findUnique({
    where: { slug },
    include: {
      kategori: true,
      author: { select: { nama: true } },
      wilayah: { select: { namaWilayah: true } },
    },
  })

  if (!artikel) {
    notFound()
  }

  // Increment view count
  await prisma.artikelEdukasi.update({
    where: { id: artikel.id },
    data: { viewsCount: { increment: 1 } },
  })

  // Related articles (same category, excluding current)
  const relatedArticles = await prisma.artikelEdukasi.findMany({
    where: {
      kategoriId: artikel.kategoriId,
      id: { not: artikel.id },
    },
    take: 4,
    orderBy: { viewsCount: 'desc' },
    include: { kategori: true },
  })

  // Kategori icon mapping
  const KATEGORI_ICONS: Record<string, string> = {
    'Regulasi & Kebijakan': '📜',
    'Bank Sampah': '🏦',
    'Daur Ulang & Inovasi': '♻️',
    'Tips Lingkungan': '💡',
  }

  // Simple paragraph renderer
  function renderKonten(konten: string) {
    return konten.split('\n\n').map((paragraph, i) => {
      const trimmed = paragraph.trim()
      if (!trimmed) return null

      // Check for heading (## or ###)
      if (trimmed.startsWith('### ')) {
        return <h3 key={i}>{trimmed.slice(4)}</h3>
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={i}>{trimmed.slice(3)}</h2>
      }

      // Check for blockquote
      if (trimmed.startsWith('> ')) {
        return <blockquote key={i}>{trimmed.slice(2)}</blockquote>
      }

      // Check for list items
      if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter(line => line.startsWith('- '))
        return (
          <ul key={i}>
            {items.map((item, j) => (
              <li key={j}>{item.slice(2)}</li>
            ))}
          </ul>
        )
      }

      return <p key={i}>{trimmed}</p>
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      {/* Header */}
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
            <Link href="/artikel" className="btn-secondary" style={{ textDecoration: 'none', padding: '8px 18px', fontSize: '0.85rem' }}>
              ← Semua Artikel
            </Link>
            <ThemeToggle />
            {session ? (
              <Link href={session.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px' }}>
                {session.role === 'ADMIN' ? '⚙️ Admin' : '📊 Dashboard'}
              </Link>
            ) : (
              <Link href="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 20px' }}>
                Masuk
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '36px' }}>
          {/* Article Content */}
          <article className="animate-fade-in">
            {/* Breadcrumb */}
            <div style={{ marginBottom: '20px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <Link href="/artikel" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Artikel</Link>
              <span style={{ margin: '0 8px' }}>›</span>
              <Link href={`/artikel?kategori=${artikel.kategoriId}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                {artikel.kategori.namaKategori}
              </Link>
              <span style={{ margin: '0 8px' }}>›</span>
              <span>{artikel.judul}</span>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <span className="badge badge-regulasi">
                {KATEGORI_ICONS[artikel.kategori.namaKategori] || '📁'} {artikel.kategori.namaKategori}
              </span>
              {artikel.isFeatured && <span className="badge badge-featured">⭐ Featured</span>}
              {artikel.wilayah && (
                <span className="badge" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#7c3aed' }}>
                  📍 {artikel.wilayah.namaWilayah}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 900, lineHeight: 1.25,
              marginBottom: '16px', letterSpacing: '-0.02em',
            }}>
              {artikel.judul}
            </h1>

            {/* Meta */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              marginBottom: '24px', fontSize: '0.85rem', color: 'var(--text-muted)',
              padding: '14px 0', borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.72rem', fontWeight: 700,
                }}>
                  {(artikel.author?.nama || 'A').charAt(0).toUpperCase()}
                </span>
                <strong style={{ color: 'var(--foreground)' }}>{artikel.author?.nama || 'Admin'}</strong>
              </span>
              <span>📅 {new Date(artikel.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>👁️ {(artikel.viewsCount + 1).toLocaleString('id-ID')} kali dibaca</span>
            </div>

            {/* Hero Image */}
            {artikel.imageUrl && (
              <div style={{
                borderRadius: '16px', overflow: 'hidden', marginBottom: '28px',
                border: '1px solid var(--border)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={artikel.imageUrl}
                  alt={artikel.judul}
                  style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            )}

            {/* Ringkasan */}
            <div style={{
              padding: '20px 24px', borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.15)',
              marginBottom: '28px', fontSize: '1.02rem', lineHeight: 1.7,
              fontWeight: 500, fontStyle: 'italic', color: 'var(--text-muted)',
            }}>
              💡 {artikel.ringkasan}
            </div>

            {/* Article Body */}
            <div className="article-content">
              {renderKonten(artikel.konten)}
            </div>

            {/* Share / Back */}
            <div style={{
              display: 'flex', gap: '12px', marginTop: '40px', paddingTop: '24px',
              borderTop: '1px solid var(--border)',
            }}>
              <Link href="/artikel" className="btn-secondary" style={{ textDecoration: 'none' }}>
                ← Kembali ke Artikel
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="animate-fade-in stagger-2" style={{ opacity: 0 }}>
            {/* Artikel Terkait */}
            <div className="glass-card" style={{ padding: '24px', position: 'sticky', top: '80px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '18px' }}>
                📚 Artikel Terkait
              </h3>
              {relatedArticles.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Belum ada artikel terkait.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/artikel/${related.slug}`}
                      style={{
                        display: 'block', textDecoration: 'none', color: 'inherit',
                        padding: '14px', borderRadius: '12px',
                        border: '1px solid var(--border)',
                        transition: 'all 0.2s',
                      }}
                    >
                      <h4 style={{
                        fontSize: '0.88rem', fontWeight: 600, marginBottom: '6px', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {related.judul}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span>👁️ {related.viewsCount.toLocaleString('id-ID')}</span>
                        <span>📅 {new Date(related.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Kategori */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>🏷️ Kategori</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* We'll need to pass kategori list, but for now use the current article's category */}
                  <Link
                    href={`/artikel?kategori=${artikel.kategoriId}`}
                    className="category-pill"
                    style={{ justifyContent: 'flex-start' }}
                  >
                    {KATEGORI_ICONS[artikel.kategori.namaKategori] || '📁'} {artikel.kategori.namaKategori}
                  </Link>
                  <Link href="/artikel" className="category-pill" style={{ justifyContent: 'flex-start' }}>
                    📋 Lihat Semua Artikel
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © 2026 SampahKu — Sistem Pengelolaan Sampah DKI Jakarta
      </div>
    </div>
  )
}
