import type { Role } from '@prisma/client'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string | null
      role: Role
      batchId?: string
    }
  }

  interface User {
    role: Role
    batchId?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    batchId?: string
  }
}
