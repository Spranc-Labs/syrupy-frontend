import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { hoarderTabKeys } from '@/entities/hoarder-tab'
import { apiClient } from '@/shared/api'

interface DismissParams {
  pageVisitId: string
  source?: 'hoarder_tabs' | 'research_sessions' | 'distraction_tabs' | 'bookmarks' | 'extension'
}

async function dismissPageVisit({ pageVisitId, source = 'hoarder_tabs' }: DismissParams) {
  return apiClient.post(`/page_visits/${pageVisitId}/dismiss`, { source })
}

type Context = { previousData: [readonly unknown[], unknown][] }

export function useDismissPageVisit(
  options?: Omit<UseMutationOptions<unknown, Error, DismissParams, Context>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dismissPageVisit,

    onMutate: async ({ pageVisitId }) => {
      await queryClient.cancelQueries({ queryKey: hoarderTabKeys.all })
      const previousData = queryClient.getQueriesData({ queryKey: hoarderTabKeys.all })

      queryClient.setQueriesData({ queryKey: hoarderTabKeys.all }, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.filter((tab: { page_visit_id: string }) => tab.page_visit_id !== pageVisitId)
      })

      return { previousData }
    },

    onError: (_error, _params, context) => {
      if (!context?.previousData) return
      for (const [queryKey, data] of context.previousData) {
        queryClient.setQueryData(queryKey, data)
      }
    },

    ...options,
  })
}
