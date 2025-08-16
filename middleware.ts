import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Protect employer and employee (caregiver) pages by role
export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  const isEmployerArea = pathname.startsWith('/employer')
  const isEmployeeArea = pathname.startsWith('/caregiver')

  // Only guard specific areas
  if (!isEmployerArea && !isEmployeeArea) {
    return NextResponse.next()
  }

  // Read NextAuth JWT (requires NEXTAUTH_SECRET in env)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  // Not signed in → redirect to signin with callback
  if (!token) {
    const signInUrl = new URL('/signin', origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  // Role checks
  const role = (token as any)?.role as string | undefined

  if (isEmployerArea && role !== 'EMPLOYER') {
    const signInUrl = new URL('/signin', origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  if (isEmployeeArea && role !== 'EMPLOYEE') {
    const signInUrl = new URL('/signin', origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

// Run middleware only for these paths
export const config = {
  matcher: [
    '/employer/:path*',
    '/caregiver/:path*',
  ],
}
