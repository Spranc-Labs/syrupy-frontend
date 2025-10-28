import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { CreateMoodLogInput, MoodLog, UpdateMoodLogInput } from '../types'
import { moodLogKeys } from './keys'

async function createMoodLog(data: CreateMoodLogInput): Promise<MoodLog> {
  const response = await apiClient.post<MoodLog>('/mood_logs', data)
  if (!response.data) {
    throw new Error('No mood log data returned')
  }
  return response.data
}

async function updateMoodLog(id: number, data: UpdateMoodLogInput): Promise<MoodLog> {
  const response = await apiClient.put<MoodLog>(`/mood_logs/${id}`, data)
  if (!response.data) {
    throw new Error('No mood log data returned')
  }
  return response.data
}

async function deleteMoodLog(id: number): Promise<void> {
  await apiClient.delete(`/mood_logs/${id}`)
}

export function useCreateMoodLog(
  options?: Omit<UseMutationOptions<MoodLog, Error, CreateMoodLogInput>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moodLogKeys.lists() })
    },
    ...options,
  })
}

export function useUpdateMoodLog(
  options?: Omit<
    UseMutationOptions<MoodLog, Error, { id: number; data: UpdateMoodLogInput }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateMoodLog(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: moodLogKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: moodLogKeys.lists() })
    },
    ...options,
  })
}

export function useDeleteMoodLog(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: moodLogKeys.lists() })
    },
    ...options,
  })
}
