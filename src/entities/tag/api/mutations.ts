import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { CreateTagInput, Tag, UpdateTagInput } from '../types'
import { tagKeys } from './keys'

async function createTag(data: CreateTagInput): Promise<Tag> {
  const response = await apiClient.post<Tag>('/tags', data)
  if (!response.data) {
    throw new Error('No tag data returned')
  }
  return response.data
}

async function updateTag(id: number, data: UpdateTagInput): Promise<Tag> {
  const response = await apiClient.put<Tag>(`/tags/${id}`, data)
  if (!response.data) {
    throw new Error('No tag data returned')
  }
  return response.data
}

async function deleteTag(id: number): Promise<void> {
  await apiClient.delete(`/tags/${id}`)
}

export function useCreateTag(
  options?: Omit<UseMutationOptions<Tag, Error, CreateTagInput>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
    },
    ...options,
  })
}

export function useUpdateTag(
  options?: Omit<UseMutationOptions<Tag, Error, { id: number; data: UpdateTagInput }>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateTag(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: tagKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
    },
    ...options,
  })
}

export function useDeleteTag(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagKeys.lists() })
    },
    ...options,
  })
}
