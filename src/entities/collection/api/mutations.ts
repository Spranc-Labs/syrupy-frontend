import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { Collection, CollectionFormData } from '../types'
import { collectionKeys } from './keys'

async function createCollection(data: CollectionFormData): Promise<Collection> {
  const response = await apiClient.post<Collection>('/collections', { collection: data })
  if (!response.data) {
    throw new Error('No collection data returned')
  }
  return response.data
}

async function updateCollection(
  id: number,
  data: Partial<CollectionFormData>
): Promise<Collection> {
  const response = await apiClient.patch<Collection>(`/collections/${id}`, { collection: data })
  if (!response.data) {
    throw new Error('No collection data returned')
  }
  return response.data
}

async function deleteCollection(id: number): Promise<void> {
  await apiClient.delete(`/collections/${id}`)
}

export function useCreateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}

export function useUpdateCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CollectionFormData> }) =>
      updateCollection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(variables.id) })
    },
  })
}

export function useDeleteCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.lists() })
    },
  })
}
