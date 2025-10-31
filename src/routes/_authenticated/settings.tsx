import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/settings/ui/Settings'

/**
 * Settings route
 */
export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
})
