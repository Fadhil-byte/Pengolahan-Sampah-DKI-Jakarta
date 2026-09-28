import { prisma } from '@/app/lib/db'
import { getSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import ProfilForm from './ProfilForm'

export default async function ProfilPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })

  if (!user) {
    redirect('/login')
  }


  const userData = {
    id: user.id,
    nama: user.nama,
    email: user.email,
    noHp: user.noHp,
    nik: user.nik,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
        <div className="animate-fade-in" style={{ marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, var(--primary-dark), var(--primary-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '6px',
          }}>
            👤 Profil Saya
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Informasi akun dan pengaturan keamanan
          </p>
        </div>

        <ProfilForm user={userData} />
      </main>
  )
}
