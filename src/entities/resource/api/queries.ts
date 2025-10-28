import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Resource, ResourcesResponse } from '../types'
import { resourceKeys } from './keys'

async function fetchResources(): Promise<Resource[]> {
  const response = await apiClient.get<ResourcesResponse>('/resources')
  return response.data?.items || (Array.isArray(response.data) ? response.data : [])
}

async function fetchResource(id: number): Promise<Resource> {
  const response = await apiClient.get<Resource>(`/resources/${id}`)
  if (!response.data) {
    throw new Error('No resource data returned')
  }
  return response.data
}

export function useResources(
  options?: Omit<UseQueryOptions<Resource[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: resourceKeys.lists(),
    queryFn: fetchResources,
    staleTime: 30 * 1000,
    ...options,
  })
}

export function useResource(
  id: number,
  options?: Omit<UseQueryOptions<Resource, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: resourceKeys.detail(id),
    queryFn: () => fetchResource(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
