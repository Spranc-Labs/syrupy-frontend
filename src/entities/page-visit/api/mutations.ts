import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { hoarderTabKeys } from '@/entities/hoarder-tab'
import { apiClient } from '@/shared/api'

interface DismissResponse {
  success: boolean
  message: string
  data?: {
    page_visit_id: string
    action_id: string
    source: string
    dismissed_at: string
  }
  errors?: string[]
}

interface DismissParams {
  pageVisitId: string
  source?: 'hoarder_tabs' | 'research_sessions' | 'distraction_tabs' | 'bookmarks' | 'extension'
}

/**
 * Dismiss a page visit from a specific detection pattern
 * @param pageVisitId - The page visit ID to dismiss
 * @param source - The context where the dismiss occurred (defaults to 'hoarder_tabs')
 */
async function dismissPageVisit({
  pageVisitId,
  source = 'hoarder_tabs',
}: DismissParams): Promise<DismissResponse> {
  const response = await apiClient.post(`/page_visits/${pageVisitId}/dismiss`, { source })

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
    UseMutationOptions<DismissResponse, Error, DismissParams, { previousData: unknown }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<DismissResponse, Error, DismissParams, { previousData: unknown }>({
    mutationFn: dismissPageVisit,

    // Optimistically remove from the list
    onMutate: async ({ pageVisitId }) => {
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
    onError: (_error, _params, context) => {
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
