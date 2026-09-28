import { getSession } from '@/app/lib/session'
import { prisma } from '@/app/lib/db'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminFooter from './AdminFooter'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  if (session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { nama: true },
  })

  const adminName = user?.nama || 'Petugas DLH'

  return (
    <div className="admin-layout-container">
      {/* Sidebar Navigasi Admin */}
      <AdminSidebar />

      {/* Area Konten Utama dengan Header dan Footer */}
      <div
        className="admin-content-area"
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Header Admin Panel */}
        <AdminHeader adminName={adminName} />

        {/* Konten Halaman Admin */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

        {/* Footer Admin Panel */}
        <AdminFooter />
      </div>
    </div>
  )
}
