import { createFileRoute } from '@tanstack/react-router'
import { Goals } from '@/features/goal-tracking/ui/Goals'

/**
 * Goals route
 */
export const Route = createFileRoute('/_authenticated/goals')({
  component: Goals,
})
