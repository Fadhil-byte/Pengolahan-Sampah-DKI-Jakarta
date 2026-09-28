import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { redirect, notFound } from 'next/navigation'
import EditLaporanForm from './EditLaporanForm'

export default async function EditLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }


  const laporan = await prisma.laporanSampah.findFirst({
    where: { id, userId: session.userId },
    include: { jenisSampah: true, wilayah: true, foto: true },
  })

  if (!laporan) notFound()

  // Hanya laporan PENDING yang bisa diedit
  if (laporan.status !== 'PENDING') {
    redirect('/dashboard')
  }

  const [jenisListRaw, wilayahListRaw] = await Promise.all([
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: 'asc' } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: 'asc' } }),
  ])

  return (
    <EditLaporanForm
      laporanId={id}
      defaultValues={{
        jenisSampahId: laporan.jenisSampahId,
        berat: laporan.berat,
        wilayahId: laporan.wilayahId,
        catatan: laporan.catatan || '',
        imageUrl: laporan.foto?.imageUrl || '',
      }}
      jenisList={jenisListRaw.map((j) => ({ id: j.id, namaJenis: j.namaJenis }))}
      wilayahList={wilayahListRaw.map((w) => ({ id: w.id, namaWilayah: w.namaWilayah }))}
    />
  )
}
