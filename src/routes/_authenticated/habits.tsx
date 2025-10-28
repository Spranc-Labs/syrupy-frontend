import { createFileRoute } from '@tanstack/react-router'
import { Habits } from 'src/features/habits/pages/Habits'

/**
 * Habits route
 */
export const Route = createFileRoute('/_authenticated/habits')({
  component: Habits,
})
