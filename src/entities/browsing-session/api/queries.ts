import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { BrowsingSessionsResponse } from '../types'
import { browsingSessionKeys } from './keys'

/**
 * Fetch browsing sessions (hoarder tabs) from sync-be API
 */
async function fetchBrowsingSessions(limit?: number): Promise<BrowsingSessionsResponse> {
  const params: Record<string, number> = {}
  if (limit) {
    params.limit = limit
  }

  const response = await apiClient.get('/pattern_detections/hoarder_tabs', {
    params,
  })

  // Backend response format: { success: true, data: { summary, hoarder_tabs, count } }
  if ('success' in response && response.success && 'data' in response && response.data) {
    const { hoarder_tabs, count } = response.data as { hoarder_tabs: unknown[]; count: number }

    // Map to frontend format
    return {
      sessions: hoarder_tabs,
      count,
    } as unknown as BrowsingSessionsResponse
  }

  throw new Error('Failed to fetch browsing sessions')
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
