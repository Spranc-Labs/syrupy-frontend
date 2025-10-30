import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { MoodLog, MoodLogsResponse } from '../types'
import { moodLogKeys } from './keys'

async function fetchMoodLogs(): Promise<MoodLog[]> {
  const response = await apiClient.get<MoodLogsResponse>('/mood_logs')
  return response.data?.items || (Array.isArray(response.data) ? response.data : [])
}

async function fetchMoodLog(id: number): Promise<MoodLog> {
  const response = await apiClient.get<MoodLog>(`/mood_logs/${id}`)
  if (!response.data) {
    throw new Error('No mood log data returned')
  }
  return response.data
}

export function useMoodLogs(
  options?: Omit<UseQueryOptions<MoodLog[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: moodLogKeys.lists(),
    queryFn: fetchMoodLogs,
    staleTime: 30 * 1000,
    ...options,
  })
}

export function useMoodLog(
  id: number,
  options?: Omit<UseQueryOptions<MoodLog, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: moodLogKeys.detail(id),
    queryFn: () => fetchMoodLog(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
