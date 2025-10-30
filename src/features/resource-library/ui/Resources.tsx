import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useAccountLinkStatus } from '@/entities/account-link'
import { useBrowsingSessions } from '@/entities/browsing-session'
import { ConnectHeyHoBanner, HeyHoConnectionStatus } from '@/features/heyho-connection'
import { apiClient } from '@/shared/api'
import { BrowserTabsGrid } from '../components/BrowserTabsGrid'
import type { ResourceTab } from '../components/ResourceTabs'
import { ResourceTabs } from '../components/ResourceTabs'

interface ResourcesResponse {
  items: Resource[]
  total?: number
}

interface Resource {
  id: number
  url: string
  title?: string
  status: 'pending' | 'processed' | 'failed'
  domain?: string
  has_content: boolean
  created_at: string
  updated_at: string
  tags?: Tag[]
}

interface Tag {
  id: number
  name: string
  color: string
}

export const Resources: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newResourceUrl, setNewResourceUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<ResourceTab>('reading-list')

  // HeyHo account link status
  const { data: linkStatus } = useAccountLinkStatus()

  // Fetch browsing sessions (HeyHo tabs) only if linked
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

  const fetchResources = useCallback(async () => {
    try {
      const response = await apiClient.get<ResourcesResponse>('/resources')
      console.log('Resources API response:', response) // Debug log

      // Handle different response formats like other endpoints
      const resourcesData =
        response.data?.items || (Array.isArray(response.data) ? response.data : [])

      console.log('Processed resources data:', resourcesData) // Debug log
      setResources(resourcesData)
    } catch (_error) {
      setResources([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResources()
  }, [fetchResources])

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newResourceUrl.trim()) return

    setIsSubmitting(true)
    try {
      const response = await apiClient.post('/resources', {
        url: newResourceUrl.trim(),
      })

      console.log('Add resource API response:', response) // Debug log

      // Handle the response format properly
      const newResource = response.data as Resource
      console.log('New resource:', newResource) // Debug log

      // Validate the new resource has required properties
      if (newResource?.id && newResource.url) {
        setResources((prev: Resource[]) => [newResource, ...prev])
        setNewResourceUrl('')
        setShowAddForm(false)
      } else {
      }
    } catch (_error) {
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      await apiClient.delete(`/resources/${id}`)
      setResources((prev) => prev.filter((resource) => resource.id !== id))
    } catch (_error) {}
  }

  const filteredResources = resources.filter(
    (resource) =>
      resource.url?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      resource.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false ||
      resource.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false
  )

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        text: 'Pending',
      },
      processed: {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        text: 'Processed',
      },
      failed: {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        text: 'Failed',
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${config.color}`}
      >
        {config.text}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 text-gray-600 dark:text-gray-400">
        Loading resources...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="mb-2 font-bold text-3xl text-gray-900 dark:text-white">My Resources</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Save articles, links, and resources for future reference
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Add Resource
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* HeyHo Connection */}
      {linkStatus?.linked ? <HeyHoConnectionStatus status={linkStatus} /> : <ConnectHeyHoBanner />}

      {/* Tabs - Only show if HeyHo is linked */}
      {linkStatus?.linked && (
        <ResourceTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabCounts={{
            heyhoTabs: allBrowserTabs.length,
            readingList: resources.length,
          }}
        />
      )}

      {/* Add Resource Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 font-semibold text-gray-900 text-xl dark:text-white">
              Add New Resource
            </h2>
            <form onSubmit={handleAddResource}>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  URL
                </label>
                <input
                  type="url"
                  value={newResourceUrl}
                  onChange={(e) => setNewResourceUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="rounded-lg px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'heyho-tabs' ? (
          /* HeyHo Browser Tabs */
          isLoadingBrowserTabs ? (
            <div className="flex justify-center p-8 text-gray-600 dark:text-gray-400">
              Loading browser tabs...
            </div>
          ) : browserTabsError ? (
            <div className="py-12 text-center">
              <p className="text-red-600 dark:text-red-400">
                Failed to load browser tabs. Please try again.
              </p>
            </div>
          ) : (
            <BrowserTabsGrid tabs={allBrowserTabs} onAddToReadingList={() => fetchResources()} />
          )
        ) : (
          /* Reading List */
          <div className="space-y-4">
            {filteredResources.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-gray-400">
                  <svg
                    className="mx-auto h-16 w-16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
                  No resources yet
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-400">
                  Start building your personal library by adding your first resource
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Add Your First Resource
                </button>
              </div>
            ) : (
              filteredResources
                .map((resource) => {
                  // Safety check for malformed resource objects
                  if (!resource || !resource.id || !resource.url) {
                    return null
                  }

                  return (
                    <div
                      key={resource.id}
                      className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center space-x-2">
                            {getStatusBadge(resource.status)}
                            {resource.domain && (
                              <span className="text-gray-500 text-sm dark:text-gray-400">
                                {resource.domain}
                              </span>
                            )}
                          </div>
                          <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
                            {resource.title || 'Untitled'}
                          </h3>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="break-all text-indigo-600 hover:underline dark:text-indigo-400"
                          >
                            {resource.url}
                          </a>
                          <div className="mt-3 flex items-center space-x-4 text-gray-500 text-sm dark:text-gray-400">
                            <span>Added {new Date(resource.created_at).toLocaleDateString()}</span>
                            {resource.has_content && (
                              <span className="flex items-center">
                                <svg
                                  className="mr-1 h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                Content saved
                              </span>
                            )}
                          </div>
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {resource.tags.map((tag) => (
                                <span
                                  key={tag.id}
                                  className="inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs"
                                  style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                                >
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-gray-400 transition-colors hover:text-red-600 dark:hover:text-red-400"
                          >
                            <svg
                              className="h-5 w-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
                .filter(Boolean) // Remove any null entries
            )}
          </div>
        )}
      </div>
    </div>
  )
}
