import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { CreateGoalInput, Goal, UpdateGoalInput } from '../types'
import { goalKeys } from './keys'

async function createGoal(data: CreateGoalInput): Promise<Goal> {
  const response = await apiClient.post<Goal>('/goals', data)
  if (!response.data) {
    throw new Error('No goal data returned')
  }
  return response.data
}

async function updateGoal(id: number, data: UpdateGoalInput): Promise<Goal> {
  const response = await apiClient.put<Goal>(`/goals/${id}`, data)
  if (!response.data) {
    throw new Error('No goal data returned')
  }
  return response.data
}

async function deleteGoal(id: number): Promise<void> {
  await apiClient.delete(`/goals/${id}`)
}

export function useCreateGoal(
  options?: Omit<UseMutationOptions<Goal, Error, CreateGoalInput>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
    },
    ...options,
  })
}

export function useUpdateGoal(
  options?: Omit<
    UseMutationOptions<
      Goal,
      Error,
      { id: number; data: UpdateGoalInput },
      { previous: Goal | undefined }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<
    Goal,
    Error,
    { id: number; data: UpdateGoalInput },
    { previous: Goal | undefined }
  >({
    mutationFn: ({ id, data }) => updateGoal(id, data),
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: goalKeys.detail(id) })
      const previous = queryClient.getQueryData<Goal>(goalKeys.detail(id))
      return { previous }
    },
    onError: (_error, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(goalKeys.detail(id), context.previous)
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: goalKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
    },
    ...options,
  })
}

export function useDeleteGoal(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goalKeys.lists() })
    },
    ...options,
  })
}
