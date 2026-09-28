import { prisma } from '@/app/lib/db'
import ArtikelAdminClient from './ArtikelAdminClient'

export default async function AdminArtikelPage() {
  // Auto-seed kategori if none exist
  let kategoriList = await prisma.kategoriArtikel.findMany({
    include: { _count: { select: { artikel: true } } },
    orderBy: { namaKategori: 'asc' },
  })

  if (kategoriList.length === 0) {
    const defaultKategori = [
      { namaKategori: 'Regulasi & Kebijakan', deskripsi: 'Peraturan pemerintah terkait pengelolaan sampah DKI Jakarta' },
      { namaKategori: 'Bank Sampah', deskripsi: 'Informasi program Bank Sampah Unit di DKI Jakarta' },
      { namaKategori: 'Daur Ulang & Inovasi', deskripsi: 'Teknologi dan inovasi pengolahan sampah' },
      { namaKategori: 'Tips Lingkungan', deskripsi: 'Tips praktis menjaga lingkungan dan mengurangi sampah' },
    ]
    await prisma.kategoriArtikel.createMany({ data: defaultKategori })
    kategoriList = await prisma.kategoriArtikel.findMany({
      include: { _count: { select: { artikel: true } } },
      orderBy: { namaKategori: 'asc' },
    })
  }

  const artikelList = await prisma.artikelEdukasi.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      kategori: true,
      author: { select: { nama: true } },
      wilayah: { select: { namaWilayah: true } },
    },
  })

  const wilayahList = await prisma.wilayah.findMany({
    orderBy: { namaWilayah: 'asc' },
  })

  // Stats
  const totalViews = artikelList.reduce((sum, a) => sum + a.viewsCount, 0)
  const totalFeatured = artikelList.filter((a) => a.isFeatured).length

  const serializedArtikel = artikelList.map((a) => ({
    id: a.id,
    judul: a.judul,
    slug: a.slug,
    ringkasan: a.ringkasan,
    konten: a.konten,
    imageUrl: a.imageUrl,
    viewsCount: a.viewsCount,
    isFeatured: a.isFeatured,
    createdAt: a.createdAt.toISOString(),
    kategoriNama: a.kategori.namaKategori,
    kategoriId: a.kategoriId,
    authorNama: a.author?.nama || null,
    wilayahNama: a.wilayah?.namaWilayah || null,
    wilayahId: a.wilayahId,
  }))

  const serializedKategori = kategoriList.map((k) => ({
    id: k.id,
    namaKategori: k.namaKategori,
    deskripsi: k.deskripsi,
    _count: k._count.artikel,
  }))

  const serializedWilayah = wilayahList.map((w) => ({
    id: w.id,
    namaWilayah: w.namaWilayah,
  }))

  return (
    <main style={{ padding: '32px 28px' }}>
      <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          📰 <span className="gradient-text">Kelola Artikel</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Kelola artikel edukasi lingkungan DKI Jakarta
        </p>
      </div>

      <ArtikelAdminClient
        artikelList={serializedArtikel}
        kategoriList={serializedKategori}
        wilayahList={serializedWilayah}
        stats={{
          totalArtikel: artikelList.length,
          totalViews,
          totalKategori: kategoriList.length,
          totalFeatured,
        }}
      />
    </main>
  )
}
