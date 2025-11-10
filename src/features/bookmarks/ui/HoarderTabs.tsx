import { Monitor } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useCreateBookmarkFromHoarderTab } from '@/entities/bookmark'
import type { BrowserTab } from '@/entities/browsing-session'
import { useHoarderTabs } from '@/entities/hoarder-tab'
import { useDismissPageVisit } from '@/entities/page-visit'
import type { BookmarkFormData } from '@/features/bookmarks/components/BookmarkForm'
import { BookmarkSavePanel } from '@/features/bookmarks/components/BookmarkSavePanel'
import { BookmarksList } from '@/features/bookmarks/components/BookmarksList'

export function HoarderTabs() {
  const [expandedTabId, setExpandedTabId] = useState<string | null>(null)

  const {
    data: hoarderTabs,
    isLoading,
    error,
  } = useHoarderTabs({
    limit: 1000,
  })

  const dismissPageVisit = useDismissPageVisit()
  const createBookmark = useCreateBookmarkFromHoarderTab()

  const browserTabs: (BrowserTab & { pageVisitId: string; id: string })[] =
    hoarderTabs?.map((tab) => ({
      id: tab.page_visit_id,
      url: tab.url,
      title: tab.title,
      domain: tab.domain,
      preview: {
        favicon: tab.favicon_url,
      },
      pageVisitId: tab.page_visit_id,
    })) || []

  const expandedTab = browserTabs.find((tab) => tab.id === expandedTabId)

  const handleBookmark = useCallback((item: BrowserTab) => {
    const tabWithId = item as BrowserTab & { pageVisitId: string }
    setExpandedTabId(tabWithId.pageVisitId)
  }, [])

  const handleSaveBookmark = useCallback(
    (data: BookmarkFormData) => {
      if (!expandedTab) return

      createBookmark.mutate(
        {
          bookmarkData: {
            url: expandedTab.url,
            title: data.title,
            description: data.description,
            collection_id: data.collection_id ?? undefined,
            metadata: { note: data.note },
            tag_names: data.tags,
            preview_image: expandedTab.preview?.image ?? undefined,
            preview_site_name: expandedTab.preview?.site_name ?? undefined,
            preview_description: expandedTab.preview?.description ?? undefined,
          },
          pageVisitId: expandedTab.pageVisitId,
        },
        {
          onSuccess: () => {
            setExpandedTabId(null)
          },
        }
      )
    },
    [expandedTab, createBookmark]
  )

  const handleCancelBookmark = useCallback(() => {
    setExpandedTabId(null)
  }, [])

  const handlePreview = useCallback((_item: BrowserTab) => {
    // TODO: Implement preview modal
  }, [])

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
        <div className="flex justify-center p-8 text-text-secondary">Loading hoarder tabs...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div>
          <h1 className="text-primary text-xl">Hoarder Tabs</h1>
          <p className="text-sm text-text-tertiary">
            Tabs detected as potential hoarder tabs from your browsing history
          </p>
        </div>
      </div>

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
        <>
          {expandedTabId && expandedTab && (
            <BookmarkSavePanel
              url={expandedTab.url}
              title={expandedTab.title}
              description={expandedTab.preview?.description}
              previewImage={expandedTab.preview?.image}
              siteName={expandedTab.preview?.site_name}
              onSave={handleSaveBookmark}
              onCancel={handleCancelBookmark}
              isSubmitting={createBookmark.isPending}
            />
          )}

          {!expandedTabId && (
            <BookmarksList
              items={browserTabs}
              onPreview={handlePreview}
              onEdit={handleBookmark}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  )
}
