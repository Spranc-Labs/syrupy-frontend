import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { Goal, GoalsResponse } from '../types'
import { goalKeys } from './keys'

async function fetchGoals(): Promise<Goal[]> {
  const response = await apiClient.get<GoalsResponse>('/goals')
  return response.data?.items || (Array.isArray(response.data) ? response.data : [])
}

async function fetchGoal(id: number): Promise<Goal> {
  const response = await apiClient.get<Goal>(`/goals/${id}`)
  if (!response.data) {
    throw new Error('No goal data returned')
  }
  return response.data
}

export function useGoals(options?: Omit<UseQueryOptions<Goal[], Error>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: goalKeys.lists(),
    queryFn: fetchGoals,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  })
}

export function useGoal(
  id: number,
  options?: Omit<UseQueryOptions<Goal, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: goalKeys.detail(id),
    queryFn: () => fetchGoal(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
