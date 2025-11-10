import { Monitor } from 'lucide-react'
import { useCallback } from 'react'
import type { BrowserTab } from '@/entities/browsing-session'
import { useHoarderTabs } from '@/entities/hoarder-tab'
import { useDismissPageVisit } from '@/entities/page-visit'
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

  // Dismiss mutation
  const dismissPageVisit = useDismissPageVisit()

  // Map HoarderTab to BrowserTab format for BookmarksList
  // Use page_visit_id as string ID (BookmarksList uses it as React key)
  const browserTabs: (BrowserTab & { pageVisitId: string; id: string })[] =
    hoarderTabs?.map((tab) => ({
      id: tab.page_visit_id, // Use page_visit_id as the unique string ID
      url: tab.url,
      title: tab.title,
      domain: tab.domain,
      preview: {
        favicon: tab.favicon_url,
      },
      pageVisitId: tab.page_visit_id, // Also keep for API calls
    })) || []

  // Action handlers (placeholder implementations)
  const handlePreview = useCallback((_item: BrowserTab) => {
    // TODO: Implement preview modal
  }, [])

  const handleEdit = useCallback((_item: BrowserTab) => {
    // TODO: Implement edit modal
  }, [])

  const handleDelete = useCallback(
    (item: BrowserTab) => {
      // Cast to our extended type to access pageVisitId
      const tabWithId = item as BrowserTab & { pageVisitId: string }

      // Dismiss the tab using the page visit ID
      dismissPageVisit.mutate(tabWithId.pageVisitId, {
        onError: (_error) => {
          // TODO: Show toast notification for error
        },
      })
    },
    [dismissPageVisit]
  )

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
