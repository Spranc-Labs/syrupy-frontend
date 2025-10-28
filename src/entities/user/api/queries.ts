import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import type { User } from '@/entities/user/types'
import { apiClient } from '@/shared/api'
import { userKeys } from './keys'

/**
 * Fetch current user
 */
async function fetchCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me')
  if (!response.data) {
    throw new Error('No user data returned')
  }
  return response.data
}

/**
 * Hook to get current user
 *
 * @example
 * const { data: user, isLoading, error } = useCurrentUser()
 */
export function useCurrentUser(options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: userKeys.current(),
    queryFn: fetchCurrentUser,
    ...options,
  })
}

/**
 * Fetch user by ID
 */
async function fetchUser(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`)
  if (!response.data) {
    throw new Error('No user data returned')
  }
  return response.data
}

/**
 * Hook to get user by ID
 *
 * @example
 * const { data: user, isLoading } = useUser(userId)
 */
export function useUser(id: string, options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
    ...options,
  })
}
