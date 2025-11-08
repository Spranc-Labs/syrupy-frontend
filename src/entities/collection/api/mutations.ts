import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { CollectionFormData, CollectionResponse } from '../types'
import { collectionKeys } from './keys'

async function createCollection(data: CollectionFormData): Promise<CollectionResponse> {
  return apiClient.post('/collections', { collection: data })
}

async function updateCollection(
  id: number,
  data: Partial<CollectionFormData>
): Promise<CollectionResponse> {
  return apiClient.patch(`/collections/${id}`, { collection: data })
}

async function deleteCollection(id: number): Promise<void> {
  return apiClient.delete(`/collections/${id}`)
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
