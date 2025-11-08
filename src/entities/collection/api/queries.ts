import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { Collection } from '../types'
import { collectionKeys } from './keys'

async function fetchCollections(): Promise<Collection[]> {
  const response = await apiClient.get<Collection[]>('/collections')
  if (!response.data) {
    throw new Error('No collections data returned')
  }
  return response.data
}

async function fetchCollection(id: number): Promise<Collection> {
  const response = await apiClient.get<Collection>(`/collections/${id}`)
  if (!response.data) {
    throw new Error('No collection data returned')
  }
  return response.data
}

export function useCollections() {
  return useQuery({
    queryKey: collectionKeys.lists(),
    queryFn: fetchCollections,
    staleTime: 30 * 1000, // 30 seconds
  })
}

export function useCollection(id: number) {
  return useQuery({
    queryKey: collectionKeys.detail(id),
    queryFn: () => fetchCollection(id),
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  })
}
