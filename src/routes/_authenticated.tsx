import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { tokenStorage } from '@/shared/api'
import { Layout } from '@/widgets'

/**
 * Authenticated layout route
 * All routes under this will require authentication
 */
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    // Check if user is authenticated
    const accessToken = tokenStorage.getAccessToken()

    if (!accessToken) {
      // Redirect to login with return URL
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
