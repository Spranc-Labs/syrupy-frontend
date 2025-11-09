import { RotateCcw, Trash2, X } from 'lucide-react'
import { useCallback } from 'react'
import { useDeleteBookmark, useRestoreBookmark, useTrashBookmarks } from '@/entities/bookmark'
import type { BrowserTab } from '@/entities/browsing-session'
import { BookmarksList } from '@/features/bookmarks/components/BookmarksList'

// Helper to extract domain from URL
function extractDomain(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname
  } catch {
    return null
  }
}

// Map bookmark to BrowserTab format
function mapBookmarkToBrowserTab(bookmark: {
  id: number
  url: string
  title?: string
  description?: string
  preview?: {
    image?: string
    site_name?: string
    description?: string
  }
}): BrowserTab {
  return {
    id: bookmark.id,
    url: bookmark.url,
    title: bookmark.title || null,
    domain: extractDomain(bookmark.url),
    preview: {
      image: bookmark.preview?.image || null,
      description: bookmark.preview?.description || bookmark.description || null,
      site_name: bookmark.preview?.site_name || null,
    },
  }
}

export function Trash() {
  // Use TanStack Query hooks for data fetching
  const { data: trashData = [], isLoading, error } = useTrashBookmarks()
  const restoreBookmark = useRestoreBookmark()
  const deleteBookmark = useDeleteBookmark()

  // Map bookmarks to BrowserTab format
  const bookmarks = trashData.map(mapBookmarkToBrowserTab)

  const handleRestore = useCallback(
    async (item: BrowserTab) => {
      try {
        await restoreBookmark.mutateAsync(item.id)
      } catch (_err) {
        // TODO: Show error toast notification
      }
    },
    [restoreBookmark]
  )

  const handlePermanentDelete = useCallback(
    async (item: BrowserTab) => {
      try {
        await deleteBookmark.mutateAsync(item.id)
      } catch (_err) {
        // TODO: Show error toast notification
      }
    },
    [deleteBookmark]
  )

  const handlePreview = useCallback((_item: BrowserTab) => {
    // TODO: Implement preview modal
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="flex justify-center p-8 text-text-secondary">Loading trash...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section */}
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-error" />
            <h1 className="text-primary text-xl">Trash</h1>
          </div>
          <p className="text-sm text-text-tertiary">
            Deleted bookmarks • Items in trash can be restored or permanently deleted
          </p>
        </div>
      </div>

      {/* Trash Content */}
      {error ? (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="text-center">
            <p className="text-error">Failed to load trash. Please try again.</p>
          </div>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center text-text-quaternary">
              <Trash2 className="h-16 w-16" />
            </div>
            <h3 className="mb-2 font-medium text-lg text-text-primary">Trash is empty</h3>
            <p className="text-text-secondary">Deleted bookmarks will appear here</p>
          </div>
        </div>
      ) : (
        <BookmarksList
          items={bookmarks}
          onPreview={handlePreview}
          onEdit={handleRestore}
          onDelete={handlePermanentDelete}
          // Override button icons/labels for trash context
          editIcon={<RotateCcw className="h-4 w-4" />}
          editLabel="Restore"
          deleteIcon={<X className="h-4 w-4" />}
          deleteLabel="Delete permanently"
        />
      )}
    </div>
  )
}
