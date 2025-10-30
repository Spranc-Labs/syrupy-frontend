import { createFileRoute, redirect } from '@tanstack/react-router'

/**
 * Root index route - redirects to dashboard
 */
export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: '/dashboard' })
  },
})
