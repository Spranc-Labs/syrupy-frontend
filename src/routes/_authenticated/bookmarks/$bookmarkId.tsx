import { createFileRoute } from '@tanstack/react-router'
import { BookmarkDetail } from '@/features/bookmarks/ui/BookmarkDetail'

export const Route = createFileRoute('/_authenticated/bookmarks/$bookmarkId')({
  component: BookmarkDetail,
})
