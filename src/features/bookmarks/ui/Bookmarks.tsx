import { useCallback } from 'react'
import { Bookmark } from 'react-feather'
import { useBookmarks, useDeleteBookmark } from '@/entities/bookmark'
import type { BrowserTab } from '@/entities/browsing-session'
import { BookmarksList } from '@/features/bookmarks/components/BookmarksList'
import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/shared/ui'

interface BookmarkResponse {
  id: number
  url: string
  title?: string
  description?: string
  preview?: {
    image?: string
    site_name?: string
    description?: string
  }
  collection_id?: number
  metadata?: Record<string, unknown>
  tags?: Array<{ id: number; name: string; color: string }>
  created_at: string
  updated_at: string
}

// Helper to extract domain from URL
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return null
  }
}

// Map bookmark response to BrowserTab format
function mapBookmarkToBrowserTab(bookmark: BookmarkResponse): BrowserTab {
  return {
    id: bookmark.id,
    url: bookmark.url,
    title: bookmark.title || null,
    domain: extractDomain(bookmark.url),
    preview: {
      image: bookmark.preview?.image || null,
      // Use preview.description if available, otherwise fallback to root description
      description: bookmark.preview?.description || bookmark.description || null,
      site_name: bookmark.preview?.site_name || null,
    },
  }
}

interface BookmarksProps {
  collection?: string
  collectionRoute?: string
}

export function Bookmarks({
  collection = 'All Bookmarks',
  collectionRoute = '/bookmarks',
}: BookmarksProps = {}) {
  // Use TanStack Query hooks for data fetching
  const { data: bookmarksData = [], isLoading, error } = useBookmarks({ per_page: 1000 })
  const deleteBookmark = useDeleteBookmark()

  // Map bookmarks to BrowserTab format
  const bookmarks = bookmarksData.map(mapBookmarkToBrowserTab)

  const handlePreview = useCallback((_item: BrowserTab) => {
    // TODO: Implement preview modal
  }, [])

  const handleEdit = useCallback((_item: BrowserTab) => {
    // TODO: Implement edit modal
  }, [])

  const handleDelete = useCallback(
    async (item: BrowserTab) => {
      try {
        await deleteBookmark.mutateAsync(item.id as number)
      } catch (_err) {
        // TODO: Show error toast notification
      }
    },
    [deleteBookmark]
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <LoadingState message="Loading bookmarks..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <PageHeader title="All Bookmarks" description="Your saved bookmarks" />

      {/* Bookmark Content - Full Width */}
      {error ? (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <ErrorState message="Failed to load bookmarks. Please try again." />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <EmptyState
            icon={<Bookmark className="h-16 w-16" />}
            title="No bookmarks yet"
            description="Your bookmarks will appear here"
          />
        </div>
      ) : (
        <BookmarksList
          items={bookmarks}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
          navigateToDetail={true}
          collection={collection}
          collectionRoute={collectionRoute}
        />
      )}
    </div>
  )
}
