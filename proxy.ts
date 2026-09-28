import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { prisma } from '@/app/lib/db'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

const publicRoutes = ['/login', '/register', '/']
const publicPrefixes = ['/api/', '/uploads/']

async function verifySession(session: string | undefined) {
  if (!session) return null
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    if (!payload || typeof payload.userId !== 'string') {
      return null
    }

    // Verifikasi bahwa user benar-benar ada di database & ambil role terbarunya
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true },
    })

    if (!user) {
      return null
    }

    return { userId: user.id, role: user.role }
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
  const isPublicPrefix = publicPrefixes.some((prefix) => path.startsWith(prefix))
  const isAdminRoute = path.startsWith('/admin')

  if (isPublicPrefix) {
    return NextResponse.next()
  }

  const cookie = req.cookies.get('session')?.value
  const session = await verifySession(cookie)

  // Jika cookie ada tapi session invalid/user sudah dihapus dari DB
  if (cookie && !session) {
    if (!isPublicRoute) {
      const response = NextResponse.redirect(new URL('/login', req.nextUrl))
      response.cookies.delete('session')
      return response
    } else {
      const response = NextResponse.next()
      response.cookies.delete('session')
      return response
    }
  }

  // Route /admin/* hanya untuk ADMIN
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    if (session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    return NextResponse.next()
  }

  // Route privat selain admin (misal /dashboard) butuh session
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Jika sudah login dan mencoba akses /login atau /register
  if (isPublicRoute && session && path !== '/') {
    const dest = session.role === 'ADMIN' ? '/admin' : '/dashboard'
    return NextResponse.redirect(new URL(dest, req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
