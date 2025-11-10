import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { hoarderTabKeys } from '@/entities/hoarder-tab'
import { apiClient } from '@/shared/api'
import type {
  Bookmark,
  CreateBookmarkInput,
  MoveBookmarkInput,
  UpdateBookmarkInput,
} from '../types'
import { bookmarkKeys } from './keys'

async function createBookmark(data: CreateBookmarkInput): Promise<Bookmark> {
  const response = await apiClient.post<Bookmark>('/bookmarks', { bookmark: data })

  if ('success' in response && response.success && 'data' in response && response.data) {
    return response.data as Bookmark
  }

  throw new Error('Failed to create bookmark')
}

async function updateBookmark(id: number, data: UpdateBookmarkInput): Promise<Bookmark> {
  const response = await apiClient.put<Bookmark>(`/bookmarks/${id}`, { bookmark: data })

  if ('success' in response && response.success && 'data' in response && response.data) {
    return response.data as Bookmark
  }

  throw new Error('Failed to update bookmark')
}

async function deleteBookmark(id: number): Promise<void> {
  const response = await apiClient.delete<void>(`/bookmarks/${id}`)

  if ('success' in response && !response.success) {
    throw new Error((response as { message?: string }).message || 'Failed to delete bookmark')
  }
}

async function moveBookmark(id: number, data: MoveBookmarkInput): Promise<Bookmark> {
  const response = await apiClient.post<Bookmark>(`/bookmarks/${id}/move`, data)

  if ('success' in response && response.success && 'data' in response && response.data) {
    return response.data as Bookmark
  }

  throw new Error('Failed to move bookmark')
}

async function restoreBookmark(id: number): Promise<Bookmark> {
  const response = await apiClient.post<Bookmark>(`/bookmarks/${id}/restore`)

  if ('success' in response && response.success && 'data' in response && response.data) {
    return response.data as Bookmark
  }

  throw new Error('Failed to restore bookmark')
}

export function useCreateBookmark(
  options?: Omit<UseMutationOptions<Bookmark, Error, CreateBookmarkInput>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createBookmark,
    onSuccess: () => {
      // Invalidate all bookmark lists
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() })
    },
    ...options,
  })
}

export function useUpdateBookmark(
  options?: Omit<
    UseMutationOptions<
      Bookmark,
      Error,
      { id: number; data: UpdateBookmarkInput },
      { previous: Bookmark | undefined }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateBookmark(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.detail(id) })

      // Snapshot the previous value
      const previous = queryClient.getQueryData<Bookmark>(bookmarkKeys.detail(id))

      // Optimistically update
      if (previous) {
        queryClient.setQueryData<Bookmark>(bookmarkKeys.detail(id), {
          ...previous,
          ...data,
        })
      }

      return { previous }
    },
    onError: (_error, { id }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(bookmarkKeys.detail(id), context.previous)
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() })
    },
    ...options,
  })
}

export function useDeleteBookmark(
  options?: Omit<
    UseMutationOptions<void, Error, number, { previousLists: [readonly unknown[], unknown][] }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteBookmark,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.lists() })

      // Snapshot previous lists
      const previousLists = queryClient.getQueriesData({ queryKey: bookmarkKeys.lists() })

      // Optimistically remove bookmark from all lists
      queryClient.setQueriesData<Bookmark[]>({ queryKey: bookmarkKeys.lists() }, (old) => {
        if (!old) return old
        return old.filter((bookmark) => bookmark.id !== id)
      })

      return { previousLists }
    },
    onError: (_error, _id, context) => {
      // Rollback on error
      if (context?.previousLists) {
        for (const [queryKey, data] of context.previousLists) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() })
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.trash() })
    },
    ...options,
  })
}

export function useMoveBookmark(
  options?: Omit<
    UseMutationOptions<Bookmark, Error, { id: number; data: MoveBookmarkInput }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => moveBookmark(id, data),
    onSuccess: () => {
      // Invalidate all bookmark lists
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() })
    },
    ...options,
  })
}

export function useRestoreBookmark(
  options?: Omit<
    UseMutationOptions<Bookmark, Error, number, { previousTrash: Bookmark[] | undefined }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: restoreBookmark,
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.trash() })

      // Snapshot previous trash list
      const previousTrash = queryClient.getQueryData<Bookmark[]>(bookmarkKeys.trash())

      // Optimistically remove from trash
      queryClient.setQueryData<Bookmark[]>(bookmarkKeys.trash(), (old) => {
        if (!old) return old
        return old.filter((bookmark) => bookmark.id !== id)
      })

      return { previousTrash }
    },
    onError: (_error, _id, context) => {
      // Rollback on error
      if (context?.previousTrash) {
        queryClient.setQueryData(bookmarkKeys.trash(), context.previousTrash)
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.trash() })
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() })
    },
    ...options,
  })
}

export function useCreateBookmarkFromHoarderTab(
  options?: Omit<
    UseMutationOptions<Bookmark, Error, { bookmarkData: CreateBookmarkInput; pageVisitId: string }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ bookmarkData }) => createBookmark(bookmarkData),
    onSuccess: (_data, { pageVisitId }) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.lists() })
      queryClient.setQueriesData({ queryKey: hoarderTabKeys.all }, (old: unknown) => {
        if (!Array.isArray(old)) return old
        return old.filter((tab: { page_visit_id: string }) => tab.page_visit_id !== pageVisitId)
      })
    },
    ...options,
  })
}
