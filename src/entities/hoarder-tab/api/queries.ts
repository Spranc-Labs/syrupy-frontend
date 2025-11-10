import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { HoarderTab, HoarderTabsParams, HoarderTabsResponse } from '../types'
import { hoarderTabKeys } from './keys'

/**
 * Fetch hoarder tabs from sync-be pattern detection API
 */
async function fetchHoarderTabs(params?: HoarderTabsParams): Promise<HoarderTab[]> {
  const queryParams: Record<string, string | number | boolean | undefined> = {}

  if (params?.lookback_days) queryParams.lookback_days = params.lookback_days
  if (params?.min_score) queryParams.min_score = params.min_score
  if (params?.age_min) queryParams.age_min = params.age_min
  if (params?.domain) queryParams.domain = params.domain
  if (params?.exclude_domains) queryParams.exclude_domains = params.exclude_domains
  if (params?.limit) queryParams.limit = params.limit
  if (params?.sort_by) queryParams.sort_by = params.sort_by

  const response = await apiClient.get('/pattern_detections/hoarder_tabs', {
    params: queryParams,
  })

  // Validate response structure
  if ('success' in response && response.success && 'data' in response && response.data) {
    const data = response.data as HoarderTabsResponse['data']

    // Map backend response to frontend type (backend uses page_visit_id, frontend expects both id and page_visit_id)
    return data.hoarder_tabs.map((tab) => ({
      ...tab,
      id: tab.page_visit_id, // Map page_visit_id to id for compatibility
    }))
  }

  throw new Error('Failed to fetch hoarder tabs')
}

/**
 * Hook to fetch hoarder tabs
 * @param params - Optional filter parameters
 */
export function useHoarderTabs(
  params?: HoarderTabsParams,
  options?: Omit<UseQueryOptions<HoarderTab[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: hoarderTabKeys.list(params),
    queryFn: () => fetchHoarderTabs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  })
}
