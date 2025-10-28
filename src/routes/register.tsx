import { createFileRoute, redirect } from '@tanstack/react-router'
import { Register as RegisterPage } from '@/features/auth/pages/Register'
import { tokenStorage } from '@/shared/api'

/**
 * Register route
 */
export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    // If already logged in, redirect to dashboard
    const accessToken = tokenStorage.getAccessToken()
    if (accessToken) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RegisterPage,
})
