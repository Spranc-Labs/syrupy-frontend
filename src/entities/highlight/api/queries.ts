import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { CreateHighlightInput, Highlight, UpdateHighlightInput } from '../types'

// Fetch highlights for a bookmark
export async function fetchHighlights(bookmarkId: number): Promise<Highlight[]> {
  const response = await apiClient.get<Highlight[]>(`/highlights?bookmark_id=${bookmarkId}`)
  if (!response.data) {
    throw new Error('No highlights data returned')
  }
  return response.data
}

// Create a new highlight
export async function createHighlight(input: CreateHighlightInput): Promise<Highlight> {
  const response = await apiClient.post<Highlight>('/highlights', { highlight: input })
  if (!response.data) {
    throw new Error('No highlight data returned')
  }
  return response.data
}

// Update a highlight
export async function updateHighlight(id: number, input: UpdateHighlightInput): Promise<Highlight> {
  const response = await apiClient.put<Highlight>(`/highlights/${id}`, { highlight: input })
  if (!response.data) {
    throw new Error('No highlight data returned')
  }
  return response.data
}

// Delete a highlight
export async function deleteHighlight(id: number): Promise<void> {
  await apiClient.delete(`/highlights/${id}`)
}

// React Query Hooks

export function useHighlights(bookmarkId: number | undefined) {
  return useQuery({
    queryKey: ['highlights', bookmarkId],
    queryFn: async () => {
      console.log('[useHighlights] Fetching highlights for bookmark:', bookmarkId)
      const highlights = await fetchHighlights(bookmarkId!)
      console.log('[useHighlights] Fetched', highlights.length, 'highlights')
      return highlights
    },
    enabled: !!bookmarkId,
  })
}

export function useCreateHighlight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createHighlight,
    onSuccess: (newHighlight) => {
      console.log('[useCreateHighlight] Success! New highlight:', {
        id: newHighlight.id,
        bookmark_id: newHighlight.bookmark_id,
        text: newHighlight.exact_text.substring(0, 50),
      })
      console.log(
        '[useCreateHighlight] Invalidating queries for bookmark:',
        newHighlight.bookmark_id
      )
      // Invalidate and refetch highlights for this bookmark
      queryClient.invalidateQueries({ queryKey: ['highlights', newHighlight.bookmark_id] })

      // Log cache state after invalidation (small delay to see the result)
      setTimeout(() => {
        const cachedData = queryClient.getQueryData<Highlight[]>([
          'highlights',
          newHighlight.bookmark_id,
        ])
        console.log(
          '[useCreateHighlight] Cache after invalidation:',
          cachedData?.length,
          'highlights'
        )
      }, 100)
    },
  })
}

export function useUpdateHighlight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateHighlightInput }) =>
      updateHighlight(id, input),
    onSuccess: (updatedHighlight) => {
      queryClient.invalidateQueries({ queryKey: ['highlights', updatedHighlight.bookmark_id] })
    },
  })
}

export function useDeleteHighlight() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteHighlight,
    onSuccess: (_data, deletedId) => {
      console.log('[useDeleteHighlight] Success! Deleted highlight:', deletedId)
      console.log('[useDeleteHighlight] Invalidating all highlights queries')
      // Invalidate all highlights queries
      queryClient.invalidateQueries({ queryKey: ['highlights'] })
    },
  })
}
