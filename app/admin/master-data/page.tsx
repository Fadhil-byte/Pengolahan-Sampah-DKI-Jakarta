import { prisma } from '@/app/lib/db'
import MasterDataClient from './MasterDataClient'

export default async function MasterDataPage() {
  const [jenisList, wilayahList] = await Promise.all([
    prisma.jenisSampah.findMany({
      orderBy: { namaJenis: 'asc' },
      include: { _count: { select: { laporan: true } } },
    }),
    prisma.wilayah.findMany({
      orderBy: { namaWilayah: 'asc' },
      include: { _count: { select: { laporan: true } } },
    }),
  ])

  return (
    <main style={{ padding: '32px 28px' }}>
      <div className="animate-fade-in" style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          ⚙️ <span className="gradient-text">Kelola Master Data</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Kelola jenis sampah dan wilayah kecamatan yang tersedia di sistem
        </p>
      </div>

      <MasterDataClient
        jenisList={jenisList.map((j) => ({ id: j.id, namaJenis: j.namaJenis, totalLaporan: j._count.laporan }))}
        wilayahList={wilayahList.map((w) => ({ id: w.id, namaWilayah: w.namaWilayah, totalLaporan: w._count.laporan }))}
      />
    </main>
  )
}
