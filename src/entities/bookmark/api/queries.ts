import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Bookmark, BookmarksResponse } from '../types'
import { bookmarkKeys } from './keys'

interface FetchBookmarksParams extends Record<string, string | number | boolean | undefined> {
  collection_id?: number
  tag?: string
  q?: string
  page?: number
  per_page?: number
}

async function fetchBookmarks(params: FetchBookmarksParams = {}): Promise<Bookmark[]> {
  const response = await apiClient.get<Bookmark[]>('/bookmarks', {
    params: params as Record<string, string | number | boolean | undefined>,
  })

  // Handle both wrapped and unwrapped responses
  if (Array.isArray(response)) {
    return response
  }

  const data = response as unknown as BookmarksResponse
  if (data.success && Array.isArray(data.data)) {
    return data.data
  }

  return []
}

async function fetchBookmark(id: number): Promise<Bookmark> {
  const response = await apiClient.get<Bookmark>(`/bookmarks/${id}`)

  if ('success' in response && response.success && 'data' in response && response.data) {
    return response.data as Bookmark
  }

  throw new Error('Failed to fetch bookmark')
}

async function fetchTrashBookmarks(): Promise<Bookmark[]> {
  const response = await apiClient.get<BookmarksResponse>('/bookmarks/trash')

  if (response.success && Array.isArray(response.data)) {
    return response.data
  }

  return []
}

export function useBookmarks(
  params: FetchBookmarksParams = {},
  options?: Omit<UseQueryOptions<Bookmark[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bookmarkKeys.list(params),
    queryFn: () => fetchBookmarks(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useBookmark(
  id: number,
  options?: Omit<UseQueryOptions<Bookmark, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bookmarkKeys.detail(id),
    queryFn: () => fetchBookmark(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

export function useTrashBookmarks(
  options?: Omit<UseQueryOptions<Bookmark[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: bookmarkKeys.trash(),
    queryFn: fetchTrashBookmarks,
    staleTime: 1 * 60 * 1000, // 1 minute (trash changes more frequently)
    ...options,
  })
}

interface IframeCheckResponse {
  success: boolean
  embeddable: boolean
  reason: string
  url: string
}

export async function checkIframeEmbeddable(url: string): Promise<IframeCheckResponse> {
  const response = await apiClient.post<IframeCheckResponse>('/bookmarks/check_iframe', {
    url,
  })

  // ApiClient wraps response, so we need to extract the actual response data
  // The backend returns the data directly, not wrapped in a data field
  return response as unknown as IframeCheckResponse
}
