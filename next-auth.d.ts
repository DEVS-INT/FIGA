import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    role?: string
  }
  
  interface Session {
    user?: DefaultSession['user'] & {
      id: string
      role?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: string
  }
}