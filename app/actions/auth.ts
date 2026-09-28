'use server'

import { prisma } from '@/app/lib/db'
import { RegisterFormSchema, LoginFormSchema } from '@/app/lib/definitions'
import type { RegisterFormState, LoginFormState } from '@/app/lib/definitions'
import { createSession, deleteSession } from '@/app/lib/session'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

export async function register(
  state: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const validatedFields = RegisterFormSchema.safeParse({
    nama: formData.get('nama'),
    email: formData.get('email'),
    noHp: formData.get('noHp'),
    nik: formData.get('nik'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { nama, email, noHp, nik, password } = validatedFields.data

  // Check if email, NIK, or noHp already exists in a single query
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { nik }, { noHp }],
    },
  })

  if (existingUser) {
    if (existingUser.email === email) {
      return { message: 'Email sudah terdaftar. Silakan gunakan email lain.' }
    }
    if (existingUser.nik === nik) {
      return { message: 'NIK sudah terdaftar. Silakan periksa kembali.' }
    }
    if (existingUser.noHp === noHp) {
      return { message: 'Nomor HP sudah terdaftar. Silakan gunakan nomor lain.' }
    }
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user (default role: USER)
  const user = await prisma.user.create({
    data: {
      nama,
      email,
      noHp,
      nik,
      password: hashedPassword,
      role: 'USER',
    },
  })

  if (!user) {
    return {
      message: 'Terjadi kesalahan saat membuat akun.',
    }
  }

  // Create session and redirect
  await createSession(user.id, user.role)
  redirect('/dashboard')
}

export async function login(
  state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password } = validatedFields.data

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return {
      message: 'Email atau password salah.',
    }
  }

  // Verify password
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return {
      message: 'Email atau password salah.',
    }
  }

  // Create session with role and redirect based on role
  await createSession(user.id, user.role)

  if (user.role === 'ADMIN') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
