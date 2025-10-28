import { createFileRoute } from '@tanstack/react-router'
import { Goals } from 'src/features/goals/pages/Goals'

/**
 * Goals route
 */
export const Route = createFileRoute('/_authenticated/goals')({
  component: Goals,
})
