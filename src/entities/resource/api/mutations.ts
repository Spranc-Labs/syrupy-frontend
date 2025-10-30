import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { CreateResourceInput, Resource, UpdateResourceInput } from '../types'
import { resourceKeys } from './keys'

async function createResource(data: CreateResourceInput): Promise<Resource> {
  const response = await apiClient.post<Resource>('/resources', data)
  if (!response.data) {
    throw new Error('No resource data returned')
  }
  return response.data
}

async function updateResource(id: number, data: UpdateResourceInput): Promise<Resource> {
  const response = await apiClient.put<Resource>(`/resources/${id}`, data)
  if (!response.data) {
    throw new Error('No resource data returned')
  }
  return response.data
}

async function deleteResource(id: number): Promise<void> {
  await apiClient.delete(`/resources/${id}`)
}

export function useCreateResource(
  options?: Omit<UseMutationOptions<Resource, Error, CreateResourceInput>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
    ...options,
  })
}

export function useUpdateResource(
  options?: Omit<
    UseMutationOptions<Resource, Error, { id: number; data: UpdateResourceInput }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateResource(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
    ...options,
  })
}

export function useDeleteResource(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resourceKeys.lists() })
    },
    ...options,
  })
}
