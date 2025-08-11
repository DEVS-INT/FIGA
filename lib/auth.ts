export interface User {
  id: string
  email: string
  name: string
  role: 'jobseeker' | 'employer' | 'admin'
  avatar?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export const demoCredentials = [
  { 
    email: 'jobseeker@demo.com', 
    password: 'demo123', 
    role: 'jobseeker' as const,
    name: 'Maria Rodriguez',
    id: '1'
  },
  { 
    email: 'employer@demo.com', 
    password: 'demo123', 
    role: 'employer' as const,
    name: 'Golden Years Care',
    id: '2'
  },
  { 
    email: 'admin@demo.com', 
    password: 'admin123', 
    role: 'admin' as const,
    name: 'System Administrator',
    id: '3'
  }
]

export function validateCredentials(email: string, password: string): User | null {
  const user = demoCredentials.find(cred => cred.email === email && cred.password === password)
  if (user) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  }
  return null
}

export function getDashboardRoute(role: string): string {
  // Since dashboards are removed, redirect all users to home page
  return '/'
}
