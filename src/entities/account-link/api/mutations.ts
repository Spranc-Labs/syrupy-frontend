import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { HeyHoCallbackParams, HeyHoLinkResult, InitiateHeyHoLinkResponse } from '../types'
import { accountLinkKeys } from './keys'

/**
 * Initiate HeyHo OAuth flow - returns authorization URL
 */
async function initiateHeyHoLink(redirectUri?: string): Promise<InitiateHeyHoLinkResponse> {
  const response = await apiClient.post<InitiateHeyHoLinkResponse>('/account_links', {
    redirect_uri: redirectUri,
  })
  if (!response.data) {
    throw new Error('No data returned from API')
  }
  return response.data
}

/**
 * Exchange authorization code for HeyHo user link
 */
async function completeHeyHoLink(params: HeyHoCallbackParams): Promise<HeyHoLinkResult> {
  const response = await apiClient.post<HeyHoLinkResult>('/account_links/callback', params)
  if (!response.data) {
    throw new Error('No data returned from API')
  }
  return response.data
}

/**
 * Unlink HeyHo account
 */
async function unlinkHeyHoAccount(): Promise<HeyHoLinkResult> {
  const response = await apiClient.delete<HeyHoLinkResult>('/account_links')
  if (!response.data) {
    throw new Error('No data returned from API')
  }
  return response.data
}

/**
 * Hook to initiate HeyHo account linking
 */
export function useInitiateHeyHoLink(
  options?: Omit<
    UseMutationOptions<InitiateHeyHoLinkResponse, Error, string | undefined>,
    'mutationFn'
  >
) {
  return useMutation({
    mutationFn: initiateHeyHoLink,
    ...options,
  })
}

/**
 * Hook to complete HeyHo account linking (OAuth callback)
 */
export function useCompleteHeyHoLink(
  options?: Omit<UseMutationOptions<HeyHoLinkResult, Error, HeyHoCallbackParams>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: completeHeyHoLink,
    onSuccess: () => {
      // Invalidate status query to refetch
      queryClient.invalidateQueries({ queryKey: accountLinkKeys.status() })
    },
    ...options,
  })
}

/**
 * Hook to unlink HeyHo account
 */
export function useUnlinkHeyHoAccount(
  options?: Omit<UseMutationOptions<HeyHoLinkResult, Error>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: unlinkHeyHoAccount,
    onSuccess: () => {
      // Invalidate status query to refetch
      queryClient.invalidateQueries({ queryKey: accountLinkKeys.status() })
    },
    ...options,
  })
}
