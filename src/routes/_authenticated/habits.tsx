import { createFileRoute } from '@tanstack/react-router'
import { Habits } from '@/features/habit-formation/ui/Habits'

/**
 * Habits route
 */
export const Route = createFileRoute('/_authenticated/habits')({
  component: Habits,
})
