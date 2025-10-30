import { type UseMutationOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { CreateJournalEntryInput, JournalEntry, UpdateJournalEntryInput } from '../types'
import { journalEntryKeys } from './keys'

async function createJournalEntry(data: CreateJournalEntryInput): Promise<JournalEntry> {
  const response = await apiClient.post<JournalEntry>('/journal_entries', data)
  if (!response.data) {
    throw new Error('No journal entry data returned')
  }
  return response.data
}

async function updateJournalEntry(
  id: number,
  data: UpdateJournalEntryInput
): Promise<JournalEntry> {
  const response = await apiClient.put<JournalEntry>(`/journal_entries/${id}`, data)
  if (!response.data) {
    throw new Error('No journal entry data returned')
  }
  return response.data
}

async function deleteJournalEntry(id: number): Promise<void> {
  await apiClient.delete(`/journal_entries/${id}`)
}

export function useCreateJournalEntry(
  options?: Omit<UseMutationOptions<JournalEntry, Error, CreateJournalEntryInput>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createJournalEntry,
    onSuccess: () => {
      // Invalidate and refetch journal entries list
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() })
    },
    ...options,
  })
}

export function useUpdateJournalEntry(
  options?: Omit<
    UseMutationOptions<
      JournalEntry,
      Error,
      { id: number; data: UpdateJournalEntryInput },
      { previous: JournalEntry | undefined }
    >,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation<
    JournalEntry,
    Error,
    { id: number; data: UpdateJournalEntryInput },
    { previous: JournalEntry | undefined }
  >({
    mutationFn: ({ id, data }) => updateJournalEntry(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: journalEntryKeys.detail(id) })

      // Snapshot the previous value
      const previous = queryClient.getQueryData<JournalEntry>(journalEntryKeys.detail(id))

      // Optimistically update (skip tags to avoid type issues)
      if (previous) {
        queryClient.setQueryData<JournalEntry>(journalEntryKeys.detail(id), {
          ...previous,
          title: data.title ?? previous.title,
          content: data.content ?? previous.content,
        })
      }

      return { previous }
    },
    onError: (_error, { id }, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(journalEntryKeys.detail(id), context.previous)
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Refetch on settle
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() })
    },
    ...options,
  })
}

export function useDeleteJournalEntry(
  options?: Omit<UseMutationOptions<void, Error, number>, 'mutationFn'>
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteJournalEntry,
    onSuccess: () => {
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: journalEntryKeys.lists() })
    },
    ...options,
  })
}
