import { createFileRoute } from '@tanstack/react-router'
import { BookmarkDetail } from '@/features/bookmarks/ui/BookmarkDetail'

type BookmarkDetailSearch = {
  collection?: string
  collectionRoute?: string
  panel?: 'highlights' | 'edit' | 'links'
}

export const Route = createFileRoute('/_authenticated/bookmarks/$bookmarkId')({
  validateSearch: (search: Record<string, unknown>): BookmarkDetailSearch => ({
    collection: search.collection as string | undefined,
    collectionRoute: search.collectionRoute as string | undefined,
    panel: search.panel as 'highlights' | 'edit' | 'links' | undefined,
  }),
  component: BookmarkDetail,
})
