import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { CreateHabitInput, Habit, UpdateHabitInput } from '../types'
import { habitKeys } from './keys'

async function createHabit(data: CreateHabitInput): Promise<Habit> {
  const response = await apiClient.post<Habit>('/habits', data)
  if (!response.data) {
    throw new Error('No habit data returned')
  }
  return response.data
}

async function updateHabit(id: number, data: UpdateHabitInput): Promise<Habit> {
  const response = await apiClient.put<Habit>(`/habits/${id}`, data)
  if (!response.data) {
    throw new Error('No habit data returned')
  }
  return response.data
}

async function deleteHabit(id: number): Promise<void> {
  await apiClient.delete(`/habits/${id}`)
}

export function useCreateHabit(
  options?: Omit<UseMutationOptions<Habit, Error, CreateHabitInput>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() })
    },
    ...options,
  })
}

export function useUpdateHabit(
  options?: Omit<
    UseMutationOptions<Habit, Error, { id: number; data: UpdateHabitInput }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateHabit(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: habitKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() })
    },
    ...options,
  })
}

export function useDeleteHabit(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() })
    },
    ...options,
  })
}
