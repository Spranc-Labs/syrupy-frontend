import { createFileRoute } from '@tanstack/react-router'
import { MoodLogs } from '@/features/mood-tracking/ui/MoodLogs'

/**
 * Mood logs route
 */
export const Route = createFileRoute('/_authenticated/mood')({
  component: MoodLogs,
})
