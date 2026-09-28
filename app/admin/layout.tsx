import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

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


  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      <AdminSidebar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </div>
    </div>
  )
}
