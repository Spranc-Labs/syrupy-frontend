import { createFileRoute } from '@tanstack/react-router'
import { Dashboard } from '@/features/dashboard/ui/Dashboard'

/**
 * Dashboard route
 */
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})
