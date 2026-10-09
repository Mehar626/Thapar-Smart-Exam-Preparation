import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Redirect root to dashboard
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Block non-moderators from /admin
    if (pathname.startsWith('/admin') && token?.role !== 'MODERATOR') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

export const config = {
  // Protect all routes except NextAuth API, static files, and login page
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)',
  ],
}
