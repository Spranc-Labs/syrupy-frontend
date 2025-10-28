import { createFileRoute, redirect } from '@tanstack/react-router'
import { Login as LoginPage } from '@/features/auth/pages/Login'
import { tokenStorage } from '@/shared/api'

type LoginSearch = {
  redirect?: string
}

/**
 * Login route
 */
export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      redirect: (search.redirect as string) || undefined,
    }
  },
  beforeLoad: () => {
    // If already logged in, redirect to dashboard
    const accessToken = tokenStorage.getAccessToken()
    if (accessToken) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginRoute,
})

function LoginRoute() {
  return <LoginPage />
}
