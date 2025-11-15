import { useNavigate } from '@tanstack/react-router'
import { useCallback } from 'react'
import { Monitor } from 'react-feather'
import type { BrowserTab } from '@/entities/browsing-session'
import { useHoarderTabs } from '@/entities/hoarder-tab'
import { useDismissPageVisit } from '@/entities/page-visit'
import { BookmarksList } from '@/features/bookmarks/components/BookmarksList'
import { EmptyState, ErrorState, LoadingState, PageHeader } from '@/shared/ui'

export function HoarderTabs() {
  const navigate = useNavigate()

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

  const handleNavigateToDetail = useCallback(
    (item: BrowserTab) => {
      navigate({
        to: '/bookmarks/$bookmarkId',
        params: { bookmarkId: String(item.id) },
        search: { collection: 'Hoarder Tabs', collectionRoute: '/bookmarks/hoarder-tabs' },
      })
    },
    [navigate]
  )

  const handleDelete = useCallback(
    (item: BrowserTab) => {
      const tabWithId = item as BrowserTab & { pageVisitId: string }
      dismissPageVisit.mutate({ pageVisitId: tabWithId.pageVisitId, source: 'hoarder_tabs' })
    },
    [dismissPageVisit]
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <LoadingState message="Loading hoarder tabs..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <PageHeader
        title="Hoarder Tabs"
        description="Tabs detected as potential hoarder tabs from your browsing history"
      />

      {/* Tab Content - Full Width */}
      {error ? (
        <div className="mx-auto max-w-7xl px-4">
          <ErrorState message="Failed to load hoarder tabs. Please try again." />
        </div>
      ) : browserTabs.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4">
          <EmptyState
            icon={<Monitor className="h-16 w-16" />}
            title="No hoarder tabs found"
            description="Tabs that may need attention will appear here based on age and usage patterns"
          />
        </div>
      ) : (
        <BookmarksList
          items={browserTabs}
          onPreview={handleNavigateToDetail}
          onEdit={handleNavigateToDetail}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
