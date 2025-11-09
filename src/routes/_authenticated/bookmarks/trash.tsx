import { createFileRoute } from '@tanstack/react-router'
import { Trash } from '@/features/bookmarks/ui/Trash'

/**
 * Trash bookmarks route
 */
export const Route = createFileRoute('/_authenticated/bookmarks/trash')({
  component: Trash,
})
