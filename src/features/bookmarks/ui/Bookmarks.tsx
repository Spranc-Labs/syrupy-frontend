import { FileText, Link, Trash2 } from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/shared/api'

interface BookmarksResponse {
  items: Bookmark[]
  total?: number
}

interface Bookmark {
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

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchBookmarks = useCallback(async () => {
    try {
      const response = await apiClient.get<BookmarksResponse>('/bookmarks')
      console.log('Bookmarks API response:', response) // Debug log

      // Handle different response formats like other endpoints
      const bookmarksData =
        response.data?.items || (Array.isArray(response.data) ? response.data : [])

      console.log('Processed bookmarks data:', bookmarksData) // Debug log
      setBookmarks(bookmarksData)
    } catch (_error) {
      setBookmarks([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

  const handleDeleteBookmark = async (id: number) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) return

    try {
      await apiClient.delete(`/bookmarks/${id}`)
      setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== id))
    } catch (_error) {}
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-100">
        <div className="flex justify-center p-8 text-text-secondary">Loading bookmarks...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="mb-1 font-semibold text-2xl text-text-primary">All Bookmarks</h1>
          <p className="text-sm text-text-tertiary">
            {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </p>
        </div>

        {/* Bookmark List */}
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 flex justify-center text-text-quaternary">
                <Link className="h-16 w-16" />
              </div>
              <h3 className="mb-2 font-medium text-lg text-text-primary">No bookmarks yet</h3>
              <p className="text-text-secondary">Your bookmarks will appear here</p>
            </div>
          ) : (
            bookmarks
              .map((bookmark) => {
                // Safety check for malformed bookmark objects
                if (!bookmark || !bookmark.id || !bookmark.url) {
                  return null
                }

                return (
                  <div key={bookmark.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-2 font-medium text-lg text-text-primary">
                          {bookmark.title || 'Untitled'}
                        </h3>
                        {bookmark.domain && (
                          <span className="mb-2 block text-sm text-text-tertiary">
                            {bookmark.domain}
                          </span>
                        )}
                        <a
                          href={bookmark.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="break-all text-primary hover:underline"
                        >
                          {bookmark.url}
                        </a>
                        <div className="mt-3 flex items-center space-x-4 text-sm text-text-tertiary">
                          <span>Added {new Date(bookmark.created_at).toLocaleDateString()}</span>
                          {bookmark.has_content && (
                            <span className="flex items-center">
                              <FileText className="mr-1 h-4 w-4" />
                              Content saved
                            </span>
                          )}
                        </div>
                        {bookmark.tags && bookmark.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {bookmark.tags.map((tag) => (
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
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                          className="text-text-quaternary transition-colors hover:text-error"
                          aria-label="Delete bookmark"
                        >
                          <Trash2 className="h-5 w-5" />
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
