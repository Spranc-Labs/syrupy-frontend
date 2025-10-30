import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { BrowsingSessionsResponse } from '../types'
import { browsingSessionKeys } from './keys'

/**
 * Fetch browsing sessions from HeyHo
 */
async function fetchBrowsingSessions(limit?: number): Promise<BrowsingSessionsResponse> {
  const params: Record<string, number> = {}
  if (limit) {
    params.limit = limit
  }

  const response = await apiClient.get<BrowsingSessionsResponse>('/browsing_sessions', {
    params,
  })
  // Response is the data itself (not wrapped in .data field)
  return response as unknown as BrowsingSessionsResponse
}

/**
 * Hook to get browsing sessions from HeyHo
 * @param limit - Optional limit on number of tabs (undefined = all tabs)
 */
export function useBrowsingSessions(
  limit?: number,
  options?: Omit<UseQueryOptions<BrowsingSessionsResponse, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: browsingSessionKeys.list({ limit }),
    queryFn: () => fetchBrowsingSessions(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}
