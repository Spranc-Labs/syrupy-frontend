import { useCallback } from 'react'
import { Bookmark } from 'react-feather'
import { useBookmarks, useDeleteBookmark } from '@/entities/bookmark'
import type { BrowserTab } from '@/entities/browsing-session'
import { BookmarksList } from '@/features/bookmarks/components/BookmarksList'

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
        <div className="flex justify-center p-8 text-text-secondary">Loading bookmarks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section - Centered with padding */}
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div>
          <h1 className="text-primary text-xl">All Bookmarks</h1>
          <p className="text-sm text-text-tertiary">Your saved bookmarks</p>
        </div>
      </div>

      {/* Bookmark Content - Full Width */}
      {error ? (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-error">Failed to load bookmarks. Please try again.</p>
          </div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center text-text-quaternary">
              <Bookmark className="h-16 w-16" />
            </div>
            <h3 className="mb-2 font-medium text-lg text-text-primary">No bookmarks yet</h3>
            <p className="text-text-secondary">Your bookmarks will appear here</p>
          </div>
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
