import { createFileRoute } from '@tanstack/react-router'
import { MoodLogs } from 'src/features/mood/pages/MoodLogs'

/**
 * Mood logs route
 */
export const Route = createFileRoute('/_authenticated/mood')({
  component: MoodLogs,
})
