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

export function useDismissPageVisit(
  options?: Omit<
    UseMutationOptions<DismissResponse, Error, DismissParams, { previousData: unknown }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<DismissResponse, Error, DismissParams, { previousData: unknown }>({
    mutationFn: dismissPageVisit,

    onMutate: async ({ pageVisitId }) => {
      await queryClient.cancelQueries({ queryKey: hoarderTabKeys.all })
      const previousData = queryClient.getQueriesData({ queryKey: hoarderTabKeys.all })

      queryClient.setQueriesData(
        { queryKey: hoarderTabKeys.all },
        (old: Array<{ page_visit_id: string }> | undefined) => {
          if (!old || !Array.isArray(old)) return old
          return old.filter((tab) => tab.page_visit_id !== pageVisitId)
        }
      )

      return { previousData }
    },

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
