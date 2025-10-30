import { Link } from '@tanstack/react-router'
import type React from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { apiClient } from '@/shared/api'

interface JournalEntry {
  id: number
  title: string
  content: string
  tags?: Tag[]
  created_at: string
  updated_at: string
  word_count?: number
  search_rank?: number
  formatted_date?: string
  // Analysis fields from API response
  'analyzed?'?: boolean
  analyzed?: boolean
  current_category?: string
  category_display?: string
  primary_emotion?: string
  primary_emotion_emoji?: string
  journal_label_analysis?: {
    id: number
    analysis_model: string
    analyzed_at: string
    created_at: string
    model_version: string
    payload: { category: string }
    run_ms: number
    updated_at: string
  }
  emotion_label_analysis?: {
    id: number
    analysis_model: string
    analyzed_at: string
    created_at: string
    model_version: string
    payload: Record<string, number>
    run_ms: number
    top_emotion: string
    updated_at: string
  }
}

interface Tag {
  id: number
  name: string
  color: string
}

interface JournalEntriesResponse {
  items?: JournalEntry[]
}

interface TagsResponse {
  items?: Tag[]
}

export const JournalEntries: React.FC = () => {
  const [allEntries, setAllEntries] = useState<JournalEntry[]>([])
  const [searchResults, setSearchResults] = useState<JournalEntry[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')

  // Get the current entries to display (either all entries or search results)
  const displayEntries = useMemo(() => {
    let entries = searchQuery.trim() ? searchResults : allEntries

    // Apply tag filtering on frontend
    if (selectedTag) {
      entries = entries.filter((entry: JournalEntry) =>
        entry.tags?.some((tag) => tag.name === selectedTag)
      )
    }

    return entries
  }, [allEntries, searchResults, searchQuery, selectedTag])

  const fetchAllEntries = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await apiClient.get<JournalEntriesResponse>('/journal_entries')
      const entries = response.data?.items || (Array.isArray(response.data) ? response.data : [])
      setAllEntries(entries)
    } catch (_error) {
      setError('Error fetching entries')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const performSearch = useCallback(async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const params = new URLSearchParams()
      params.append('q', searchQuery.trim())

      const response = await apiClient.get<JournalEntriesResponse>(`/journal_entries?${params}`)
      const entries = response.data?.items || (Array.isArray(response.data) ? response.data : [])
      setSearchResults(entries)
    } catch (_error) {
      setError('Error searching entries')
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  const fetchTags = useCallback(async () => {
    try {
      const response = await apiClient.get<TagsResponse>('/tags')
      const tagsData = response.data?.items || (Array.isArray(response.data) ? response.data : [])
      setAvailableTags(tagsData)
    } catch (_error) {}
  }, [])

  useEffect(() => {
    fetchTags()
    fetchAllEntries()
  }, [fetchAllEntries, fetchTags])

  useEffect(() => {
    // Only perform search if there's a query, otherwise show all entries
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch()
      }, 300)
      return () => clearTimeout(timeoutId)
    }
    // Clear search results immediately when query is empty
    setSearchResults([])
    setIsSearching(false)
    return undefined
  }, [searchQuery, performSearch])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      await apiClient.delete(`/journal_entries/${id}`)

      // Remove from both allEntries and searchResults
      setAllEntries((prev) => prev.filter((entry) => entry.id !== id))
      setSearchResults((prev) => prev.filter((entry) => entry.id !== id))
    } catch (_error) {
      setError('Error deleting entry')
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSelectedTag('')
    // No need to refetch - displayEntries will automatically switch to allEntries
  }

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content
    return `${content.substring(0, maxLength)}...`
  }

  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text

    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0)
    let highlightedText = text

    terms.forEach((term) => {
      const regex = new RegExp(`(${term})`, 'gi')
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>'
      )
    })

    return highlightedText
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getSearchResultsText = () => {
    const count = displayEntries.length
    const hasSearch = searchQuery.trim() || selectedTag

    if (!hasSearch) {
      return `${count} ${count === 1 ? 'entry' : 'entries'}`
    }

    let text = `${count} ${count === 1 ? 'result' : 'results'}`
    if (searchQuery.trim()) {
      text += ` for "${searchQuery}"`
    }
    if (selectedTag) {
      text += ` tagged with "${selectedTag}"`
    }
    return text
  }

  if (isLoading)
    return (
      <div className="flex justify-center p-8 text-gray-600 dark:text-gray-400">Loading...</div>
    )

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-2 font-bold text-3xl text-gray-900 dark:text-white">Journal Entries</h1>
          <p className="text-gray-600 dark:text-gray-400">{getSearchResultsText()}</p>
        </div>
        <Link
          to="/journal/new"
          className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 sm:mt-0"
        >
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Entry
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <svg
              className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            {isSearching && (
              <div className="-translate-y-1/2 absolute top-1/2 right-3 transform">
                <svg className="h-4 w-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
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
              </div>
            )}
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">All tags</option>
            {availableTags.map((tag) => (
              <option key={tag.id} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
        {(searchQuery || selectedTag) && (
          <button
            onClick={handleClearSearch}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            Clear
          </button>
        )}
      </div>

      {/* Entries Grid */}
      <div className="space-y-6">
        {displayEntries.length === 0 ? (
          <div className="py-12 text-center">
            {allEntries.length === 0 ? (
              <div>
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
                  No journal entries yet
                </h3>
                <p className="mb-4 text-gray-500 dark:text-gray-400">
                  Start your journaling journey by creating your first entry.
                </p>
                <Link
                  to="/journal/new"
                  className="rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
                >
                  Create First Entry
                </Link>
              </div>
            ) : (
              <div>
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <h3 className="mb-2 font-medium text-gray-900 text-lg dark:text-white">
                  No results found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </div>
        ) : (
          displayEntries.map((entry) => (
            <article
              key={entry.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="mb-2 font-semibold text-gray-900 text-xl dark:text-white">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerms(entry.title, searchQuery),
                      }}
                    />
                  </h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 text-sm dark:text-gray-400">
                    <span>{formatDate(entry.created_at)}</span>
                    {entry.word_count && <span>{entry.word_count} words</span>}
                    {entry.search_rank && searchQuery && (
                      <span className="rounded bg-indigo-100 px-2 py-1 text-indigo-800 text-xs dark:bg-indigo-900 dark:text-indigo-200">
                        Relevance: {Math.round(entry.search_rank)}
                      </span>
                    )}
                    {/* Mood */}
                    {entry.primary_emotion_emoji && entry.primary_emotion && (
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{entry.primary_emotion_emoji}</span>
                        <span className="text-gray-600 text-sm capitalize dark:text-gray-400">
                          {entry.primary_emotion}
                        </span>
                      </div>
                    )}
                    {/* Category */}
                    {entry.category_display && (
                      <div className="flex items-center space-x-1">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 text-xs dark:bg-blue-900 dark:text-blue-200">
                          {entry.category_display}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  <Link
                    to="/journal/$id/edit"
                    params={{ id: entry.id.toString() }}
                    className="font-medium text-indigo-600 text-sm hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="font-medium text-red-600 text-sm hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="prose prose-gray dark:prose-invert mb-4 max-w-none">
                <p
                  className="text-gray-700 leading-relaxed dark:text-gray-300"
                  dangerouslySetInnerHTML={{
                    __html: highlightSearchTerms(truncateContent(entry.content), searchQuery),
                  }}
                />
              </div>

              {/* Tags and Emotions */}
              {((entry.tags && entry.tags.length > 0) ||
                (entry.emotion_label_analysis?.payload &&
                  Object.keys(entry.emotion_label_analysis.payload).length > 0)) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tags?.map((tag) => (
                    <span
                      key={tag.id}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
                        selectedTag === tag.name
                          ? 'bg-indigo-200 text-indigo-900 dark:bg-indigo-800 dark:text-indigo-100'
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
                      }`}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightSearchTerms(tag.name, searchQuery),
                        }}
                      />
                    </span>
                  ))}
                  {entry.emotion_label_analysis?.payload &&
                    Object.entries(entry.emotion_label_analysis.payload)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([emotion, score]) => (
                        <span
                          key={emotion}
                          className="rounded-full bg-gray-100 px-2 py-1 text-gray-700 text-xs dark:bg-gray-700 dark:text-gray-300"
                        >
                          {emotion} {(score * 100).toFixed(0)}%
                        </span>
                      ))}
                </div>
              )}

              {/* Journal Labels */}
              {(entry.analyzed || entry['analyzed?']) && (
                <div className="mt-4 border-gray-200 border-t pt-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 text-sm dark:text-white">
                      Journal Labels
                    </h4>
                    <div className="flex items-center gap-3">
                      {/* Dominant Emotion */}
                      {entry.primary_emotion_emoji && entry.primary_emotion && (
                        <div className="flex items-center space-x-2 rounded-full bg-gray-100 px-2 py-1 dark:bg-gray-800">
                          <span className="text-sm">{entry.primary_emotion_emoji}</span>
                          <span className="font-medium text-gray-600 text-xs dark:text-gray-300">
                            {entry.primary_emotion}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
