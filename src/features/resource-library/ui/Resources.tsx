import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/shared/api'

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

  const handleDeleteResource = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return

    try {
      await apiClient.delete(`/resources/${id}`)
      setResources((prev) => prev.filter((resource) => resource.id !== id))
    } catch (_error) {}
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: 'bg-warning/10 text-warning',
        text: 'Pending',
      },
      processed: {
        color: 'bg-success/10 text-success',
        text: 'Processed',
      },
      failed: {
        color: 'bg-error/10 text-error',
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
      <div className="min-h-screen bg-base-100">
        <div className="flex justify-center p-8 text-text-secondary">Loading resources...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="mb-1 font-semibold text-2xl text-text-primary">All Bookmarks</h1>
          <p className="text-sm text-text-tertiary">
            {resources.length} {resources.length === 1 ? 'bookmark' : 'bookmarks'}
          </p>
        </div>

        {/* Resource List */}
        <div className="space-y-3">
          {resources.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-text-quaternary">
                <svg
                  className="mx-auto h-16 w-16"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-label="Empty state icon"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-medium text-lg text-text-primary">No bookmarks yet</h3>
              <p className="text-text-secondary">Your bookmarks will appear here</p>
            </div>
          ) : (
            resources
              .map((resource) => {
                // Safety check for malformed resource objects
                if (!resource || !resource.id || !resource.url) {
                  return null
                }

                return (
                  <div key={resource.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center space-x-2">
                          {getStatusBadge(resource.status)}
                          {resource.domain && (
                            <span className="text-sm text-text-tertiary">{resource.domain}</span>
                          )}
                        </div>
                        <h3 className="mb-2 font-medium text-lg text-text-primary">
                          {resource.title || 'Untitled'}
                        </h3>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-primary hover:underline"
                        >
                          {resource.url}
                        </a>
                        <div className="mt-3 flex items-center space-x-4 text-sm text-text-tertiary">
                          <span>Added {new Date(resource.created_at).toLocaleDateString()}</span>
                          {resource.has_content && (
                            <span className="flex items-center">
                              <svg
                                className="mr-1 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-label="Content saved icon"
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
                          type="button"
                          onClick={() => handleDeleteResource(resource.id)}
                          className="text-text-quaternary transition-colors hover:text-error"
                          aria-label="Delete resource"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-label="Delete icon"
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
      </div>
    </div>
  )
}
