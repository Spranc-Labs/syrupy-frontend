import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Tag, TagsResponse } from '../types'
import { tagKeys } from './keys'

async function fetchTags(): Promise<Tag[]> {
  const response = await apiClient.get<TagsResponse>('/tags')
  return response.data?.items || (Array.isArray(response.data) ? response.data : [])
}

async function fetchTag(id: number): Promise<Tag> {
  const response = await apiClient.get<Tag>(`/tags/${id}`)
  if (!response.data) {
    throw new Error('No tag data returned')
  }
  return response.data
}

export function useTags(options?: Omit<UseQueryOptions<Tag[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: tagKeys.lists(),
    queryFn: fetchTags,
    staleTime: 5 * 60 * 1000, // 5 minutes - tags don't change often
    ...options,
  })
}

export function useTag(
  id: number,
  options?: Omit<UseQueryOptions<Tag, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: tagKeys.detail(id),
    queryFn: () => fetchTag(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
