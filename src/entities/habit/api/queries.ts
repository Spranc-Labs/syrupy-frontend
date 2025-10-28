import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Habit, HabitsResponse } from '../types'
import { habitKeys } from './keys'

async function fetchHabits(): Promise<Habit[]> {
  const response = await apiClient.get<HabitsResponse>('/habits')
  return response.data?.items || (Array.isArray(response.data) ? response.data : [])
}

async function fetchHabit(id: number): Promise<Habit> {
  const response = await apiClient.get<Habit>(`/habits/${id}`)
  if (!response.data) {
    throw new Error('No habit data returned')
  }
  return response.data
}

export function useHabits(options?: Omit<UseQueryOptions<Habit[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: habitKeys.lists(),
    queryFn: fetchHabits,
    staleTime: 30 * 1000,
    ...options,
  })
}

export function useHabit(
  id: number,
  options?: Omit<UseQueryOptions<Habit, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: habitKeys.detail(id),
    queryFn: () => fetchHabit(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}
