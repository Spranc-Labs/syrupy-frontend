import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { hoarderTabKeys } from '@/entities/hoarder-tab'
import { apiClient } from '@/shared/api'

interface DismissResponse {
  success: boolean
  message: string
  data?: {
    page_visit_id: string
    action_id: string
    dismissed_at: string
  }
  errors?: string[]
}

/**
 * Dismiss a page visit (hoarder tab)
 */
async function dismissPageVisit(pageVisitId: string): Promise<DismissResponse> {
  const response = await apiClient.post(`/page_visits/${pageVisitId}/dismiss`)

  if ('success' in response && response.success) {
    return response as DismissResponse
  }

  throw new Error('Failed to dismiss page visit')
}

/**
 * Hook to dismiss a page visit
 * Includes optimistic updates to remove from hoarder tabs list
 */
export function useDismissPageVisit(
  options?: Omit<
    UseMutationOptions<DismissResponse, Error, string, { previousData: unknown }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<DismissResponse, Error, string, { previousData: unknown }>({
    mutationFn: dismissPageVisit,

    // Optimistically remove from the list
    onMutate: async (pageVisitId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: hoarderTabKeys.all })

      // Snapshot current data
      const previousData = queryClient.getQueriesData({ queryKey: hoarderTabKeys.all })

      // Optimistically remove the dismissed tab from all hoarder tab queries
      queryClient.setQueriesData(
        { queryKey: hoarderTabKeys.all },
        (old: Array<{ page_visit_id: string }> | undefined) => {
          if (!old || !Array.isArray(old)) return old
          return old.filter((tab) => tab.page_visit_id !== pageVisitId)
        }
      )

      return { previousData }
    },

    // Rollback on error
    onError: (_error, _pageVisitId, context) => {
      if (context?.previousData && Array.isArray(context.previousData)) {
        for (const [queryKey, data] of context.previousData as [
          queryKey: unknown[],
          data: unknown,
        ][]) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },

    ...options,
  })
}
