import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import TambahLaporanForm from './TambahLaporanForm'

export default async function TambahLaporanPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }


  // Fetch JenisSampah & Wilayah from database
  const [jenisListRaw, wilayahListRaw] = await Promise.all([
    prisma.jenisSampah.findMany({ orderBy: { namaJenis: 'asc' } }),
    prisma.wilayah.findMany({ orderBy: { namaWilayah: 'asc' } }),
  ])

  // Serialize to plain objects for client component
  const jenisList = jenisListRaw.map((j) => ({ id: j.id, namaJenis: j.namaJenis }))
  const wilayahList = wilayahListRaw.map((w) => ({ id: w.id, namaWilayah: w.namaWilayah }))

  return <TambahLaporanForm jenisList={jenisList} wilayahList={wilayahList} />
}
