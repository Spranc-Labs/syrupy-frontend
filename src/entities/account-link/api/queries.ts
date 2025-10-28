import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { HeyHoAccountStatus } from '../types'
import { accountLinkKeys } from './keys'

/**
 * Fetch HeyHo account link status
 */
async function fetchAccountLinkStatus(): Promise<HeyHoAccountStatus> {
  const response = await apiClient.get<HeyHoAccountStatus>('/account_links/status')
  return response as HeyHoAccountStatus
}

/**
 * Hook to get HeyHo account link status
 */
export function useAccountLinkStatus(
  options?: Omit<UseQueryOptions<HeyHoAccountStatus, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: accountLinkKeys.status(),
    queryFn: fetchAccountLinkStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}
