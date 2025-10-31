import { createFileRoute } from '@tanstack/react-router'
import { Bookmarks } from '@/features/bookmarks/ui/Bookmarks'

/**
 * Bookmarks route
 */
export const Route = createFileRoute('/_authenticated/bookmarks/')({
  component: Bookmarks,
})
