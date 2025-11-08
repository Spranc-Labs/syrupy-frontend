import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { CollectionResponse, CollectionsResponse } from '../types'
import { collectionKeys } from './keys'

async function fetchCollections(): Promise<CollectionsResponse> {
  return apiClient.get('/collections')
}

async function fetchCollection(id: number): Promise<CollectionResponse> {
  return apiClient.get(`/collections/${id}`)
}

export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: fetchCollections,
    staleTime: 30 * 1000, // 30 seconds
    select: (response) => response.data,
  })
}

export function useCollection(id: number) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => fetchCollection(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
    select: (response) => response.data,
  })
}
