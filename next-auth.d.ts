import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  
  interface Session {
    user?: {
      role?: string
    } & DefaultSession['EMPLOYEE']
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}