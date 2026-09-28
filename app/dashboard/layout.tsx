import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/db'
import { redirect } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  // Ambil data terbaru pengguna untuk nama & role di header
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { nama: true, role: true },
  })

  const userName = user?.nama || 'Pengguna'
  const role = user?.role || session.role || 'USER'

  return (
    <div
      className="has-mobile-bottom-nav"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'var(--background)',
      }}
    >
      {/* Header Utama Pengguna */}
      <Navbar userName={userName} role={role} />

      {/* Konten Halaman */}
      <div style={{ flex: 1 }}>
        {children}
      </div>

      {/* Footer Utama Pengguna */}
      <Footer />
    </div>
  )
}
