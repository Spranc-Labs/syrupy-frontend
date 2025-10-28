import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from 'src/features/dashboard/pages/Dashboard'

/**
 * Dashboard route
 */
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})
