/**
 * Auth configuration — NextAuth options.
 *
 * Design for extensibility:
 *   DEV_AUTH=true  → Credentials provider (mock login, any @thapar.edu email)
 *   Production     → Add GoogleProvider below; remove CredentialsProvider.
 *                    The session shape (role, batchId) remains unchanged.
 *
 * To add Google SSO later:
 *   1. npm install @auth/core
 *   2. Add GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET to .env
 *   3. Import GoogleProvider and push to providers array
 *   4. Add domain restriction: { hd: 'thapar.edu' } in authorization params
 *   5. Remove CredentialsProvider if desired
 *   No other code changes required.
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import type { Role } from '@prisma/client'

export const authOptions: NextAuthOptions = {
  // Use JWT sessions (stateless — no sessions table needed)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    // ── Mock Credentials (DEV_AUTH=true) ─────────────────────────────────
    // Replace / supplement with GoogleProvider for production.
    CredentialsProvider({
      name: 'TIET Email',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@thapar.edu' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Only allow @thapar.edu addresses
        if (!credentials.email.toLowerCase().endsWith('@thapar.edu')) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { batch: true },
        })

        if (!user) return null

        // DEV_AUTH: skip password verification (any password works)
        // PROD: always verify hash
        const isDev = process.env.DEV_AUTH === 'true'
        if (!isDev) {
          const valid = await bcrypt.compare(
            credentials.password,
            user.passwordHash ?? ''
          )
          if (!valid) return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          batchId: user.batchId ?? undefined,
        }
      },
    }),

    // ── Google SSO (production — uncomment when ready) ────────────────────
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   authorization: {
    //     params: { hd: 'thapar.edu' }, // Restrict to @thapar.edu domain
    //   },
    // }),
  ],

  callbacks: {
    // Persist role and batchId in the JWT so Server Components can read them
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role: Role }).role
        token.batchId = (user as { batchId?: string }).batchId
      }
      return token
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as Role
        session.user.batchId = token.batchId as string | undefined
      }
      return session
    },
  },
}
