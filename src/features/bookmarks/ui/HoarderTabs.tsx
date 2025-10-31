import { Monitor } from 'lucide-react'
import type React from 'react'
import { useAccountLinkStatus } from '@/entities/account-link'
import { useBrowsingSessions } from '@/entities/browsing-session'
import { BookmarksList } from '@/features/bookmarks/components/BookmarksList'

export const HoarderTabs: React.FC = () => {
  // Check HeyHo account link status
  const { data: linkStatus, isLoading: isLoadingLinkStatus } = useAccountLinkStatus()

  // No limit - fetch all hoarder tabs (backend fetches from hoarder_tabs endpoint)
  const {
    data: browsingSessions,
    isLoading: isLoadingBrowserTabs,
    error: browserTabsError,
  } = useBrowsingSessions(undefined, {
    enabled: Boolean(linkStatus?.linked),
  })

  // Extract all tabs from sessions (backend returns hoarder tabs wrapped in sessions format)
  const allBrowserTabs =
    browsingSessions?.sessions?.flatMap((session) => session.research_session_tabs || []) || []

  // Combined loading state
  if (isLoadingLinkStatus) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="flex justify-center p-8 text-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header Section - Centered with padding */}
      <div className="mx-auto max-w-7xl px-6 py-3">
        <div>
          <h1 className="text-primary text-xl">Hoarder Tabs</h1>
          <p className="text-sm text-text-tertiary">Your browser tabs synced from HeyHo</p>
        </div>
      </div>

      {/* Tab Content - Full Width */}
      {linkStatus?.linked ? (
        isLoadingBrowserTabs ? (
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex justify-center p-8 text-text-secondary">
              Loading browser tabs...
            </div>
          </div>
        ) : browserTabsError ? (
          <div className="mx-auto max-w-7xl px-4">
            <div className="py-12 text-center">
              <p className="text-error">Failed to load browser tabs. Please try again.</p>
            </div>
          </div>
        ) : allBrowserTabs.length === 0 ? (
          <div className="mx-auto max-w-7xl px-4">
            <div className="py-12 text-center">
              <div className="mb-4 flex justify-center text-text-quaternary">
                <Monitor className="h-16 w-16" />
              </div>
              <h3 className="mb-2 font-medium text-lg text-text-primary">No tabs found</h3>
              <p className="text-text-secondary">Your synced browser tabs will appear here</p>
            </div>
          </div>
        ) : (
          <BookmarksList items={allBrowserTabs} />
        )
      ) : (
        <div className="mx-auto max-w-7xl px-4">
          <div className="py-12 text-center">
            <p className="text-text-secondary">
              Connect your HeyHo account to access your browser tabs
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
