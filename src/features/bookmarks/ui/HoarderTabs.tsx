import { Monitor } from 'lucide-react'
import { useCallback } from 'react'
import type { BrowserTab } from '@/entities/browsing-session'
import { useHoarderTabs } from '@/entities/hoarder-tab'
import { BookmarksList } from '@/features/bookmarks/components/BookmarksList'

export function HoarderTabs() {
  // Fetch hoarder tabs directly from sync-be pattern detection API
  const {
    data: hoarderTabs,
    isLoading,
    error,
  } = useHoarderTabs({
    limit: 1000,
  })

  // Map HoarderTab to BrowserTab format for BookmarksList
  const browserTabs: BrowserTab[] =
    hoarderTabs?.map((tab) => ({
      id: Number.parseInt(tab.id) || 0,
      url: tab.url,
      title: tab.title,
      domain: tab.domain,
      preview: {
        favicon: tab.favicon_url,
      },
    })) || []

  // Action handlers (placeholder implementations)
  const handlePreview = useCallback((_item: BrowserTab) => {
    // TODO: Implement preview modal
  }, [])

  const handleEdit = useCallback((_item: BrowserTab) => {
    // TODO: Implement edit modal
  }, [])

  const handleDelete = useCallback((_item: BrowserTab) => {
    // TODO: Implement dismiss/remove from hoarder tabs list
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="flex justify-center p-8 text-text-secondary">Loading hoarder tabs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section - Centered with padding */}
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div>
          <h1 className="text-primary text-xl">Hoarder Tabs</h1>
          <p className="text-sm text-text-tertiary">
            Tabs detected as potential hoarder tabs from your browsing history
          </p>
        </div>
      </div>

      {/* Tab Content - Full Width */}
      {error ? (
        <div className="mx-auto max-w-7xl px-4">
          <div className="py-12 text-center">
            <p className="text-error">Failed to load hoarder tabs. Please try again.</p>
          </div>
        </div>
      ) : browserTabs.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4">
          <div className="py-12 text-center">
            <div className="mb-4 flex justify-center text-text-quaternary">
              <Monitor className="h-16 w-16" />
            </div>
            <h3 className="mb-2 font-medium text-lg text-text-primary">No hoarder tabs found</h3>
            <p className="text-text-secondary">
              Tabs that may need attention will appear here based on age and usage patterns
            </p>
          </div>
        </div>
      ) : (
        <BookmarksList
          items={browserTabs}
          onPreview={handlePreview}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
