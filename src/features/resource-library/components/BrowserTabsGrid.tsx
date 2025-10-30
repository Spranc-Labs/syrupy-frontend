import { useState } from 'react'
import type { BrowserTab } from '@/entities/browsing-session'
import { apiClient } from '@/shared/api'

export interface BrowserTabsGridProps {
  tabs: BrowserTab[]
  onAddToReadingList?: (tab: BrowserTab) => void
}

export function BrowserTabsGrid({ tabs, onAddToReadingList }: BrowserTabsGridProps) {
  const [addingTabs, setAddingTabs] = useState<Set<number>>(new Set())

  const handleAddToReadingList = async (tab: BrowserTab) => {
    if (addingTabs.has(tab.id)) return

    setAddingTabs((prev) => new Set(prev).add(tab.id))

    try {
      // Add tab to resources (reading list)
      await apiClient.post('/resources', {
        url: tab.url,
        title: tab.title,
      })

      // Call optional callback
      if (onAddToReadingList) {
        onAddToReadingList(tab)
      }

      // Show success feedback
      alert('Added to reading list!')
    } catch (_error) {
      alert('Failed to add to reading list. Please try again.')
    } finally {
      setAddingTabs((prev) => {
        const next = new Set(prev)
        next.delete(tab.id)
        return next
      })
    }
  }

  if (tabs.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-gray-400">
          <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
          No recommendations yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Smart tab recommendations from your HeyHo browsing will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tabs.map((tab) => {
        const isAdding = addingTabs.has(tab.id)
        const displayTitle = tab.title || tab.preview?.site_name || 'Untitled Tab'
        const previewImage = tab.preview?.image
        const favicon = tab.preview?.favicon
        const description = tab.preview?.description

        return (
          <div
            key={tab.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Preview Image */}
            {previewImage && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                <img
                  src={previewImage}
                  alt={displayTitle}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    // Hide image if it fails to load
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.style.display = 'none'
                    }
                  }}
                />
              </div>
            )}

            <div className="flex flex-1 flex-col p-4">
              <div className="mb-3 flex-1">
                {/* Domain with favicon */}
                {tab.domain && (
                  <div className="mb-2 flex items-center space-x-2">
                    {favicon && (
                      <img
                        src={favicon}
                        alt=""
                        className="h-4 w-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <span className="text-gray-500 text-sm dark:text-gray-400">{tab.domain}</span>
                  </div>
                )}

                {/* Title */}
                <h3 className="mb-2 line-clamp-2 font-medium text-gray-900 dark:text-white">
                  {displayTitle}
                </h3>

                {/* Description */}
                {description && (
                  <p className="mb-2 line-clamp-2 text-gray-600 text-sm dark:text-gray-400">
                    {description}
                  </p>
                )}

                {/* URL */}
                <a
                  href={tab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="line-clamp-1 block break-all text-indigo-600 text-sm hover:underline dark:text-indigo-400"
                >
                  {tab.url}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => window.open(tab.url, '_blank')}
                  className="text-gray-600 text-sm hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Open
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToReadingList(tab)}
                  disabled={isAdding}
                  className="flex items-center space-x-1 rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-sm text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isAdding ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span>Add to Reading List</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
