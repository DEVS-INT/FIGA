import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  const isEmployerArea = pathname.startsWith('/employer')
  const isEmployeeArea = pathname.startsWith('/caregiver')
  const isStaffArea = pathname.startsWith('/staff')
  const isAdminArea = pathname.startsWith('/admin') 

  if (!isEmployerArea && !isEmployeeArea && !isStaffArea && !isAdminArea) {
    return NextResponse.next()
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  if (!token) {
    const signInUrl = new URL('/signin', origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

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

  if (isStaffArea && role !== 'STAFF') {
    const signInUrl = new URL('/signin', origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  if (isAdminArea && role !== 'ADMIN') {
    const signInUrl = new URL('/signin', origin)
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/employer/:path*',
    '/caregiver/:path*',
    '/staff/:path*',
    '/admin/:path*',
  ],
}
