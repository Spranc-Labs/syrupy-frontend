import { QueryClientProvider } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, ThemeProvider } from '@/app/providers'
import { queryClient } from '@/shared/api'
import { FullscreenSpinner } from '@/widgets'

/**
 * Root route - wraps the entire application
 * Provides: Theme, React Query, Auth, Toast notifications
 */
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<FullscreenSpinner isLoading={true} />}>
            <Outlet />
            <ToastContainer stacked theme="colored" position="top-right" className="!z-50" />
          </Suspense>
          {/* {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />} */}
          {/* {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-left" />} */}
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
