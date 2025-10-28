import { type UseQueryOptions, useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import type { JournalEntriesResponse, JournalEntry, SearchJournalEntriesResponse } from '../types'
import { journalEntryKeys } from './keys'

async function fetchJournalEntries(): Promise<JournalEntry[]> {
  const response = await apiClient.get<JournalEntriesResponse>('/journal_entries')
  return response.data?.items || (Array.isArray(response.data) ? response.data : [])
}

async function fetchJournalEntry(id: number): Promise<JournalEntry> {
  const response = await apiClient.get<JournalEntry>(`/journal_entries/${id}`)
  if (!response.data) {
    throw new Error('No journal entry data returned')
  }
  return response.data
}

async function searchJournalEntries(query: string): Promise<JournalEntry[]> {
  const response = await apiClient.get<SearchJournalEntriesResponse>('/journal_entries/search', {
    params: { q: query },
  })
  return response.data?.items || (Array.isArray(response.data) ? response.data : [])
}

export function useJournalEntries(
  options?: Omit<UseQueryOptions<JournalEntry[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: journalEntryKeys.lists(),
    queryFn: fetchJournalEntries,
    staleTime: 30 * 1000, // 30 seconds
    ...options,
  })
}

export function useJournalEntry(
  id: number,
  options?: Omit<UseQueryOptions<JournalEntry, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: journalEntryKeys.detail(id),
    queryFn: () => fetchJournalEntry(id),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

export function useSearchJournalEntries(
  query: string,
  options?: Omit<UseQueryOptions<JournalEntry[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: journalEntryKeys.search(query),
    queryFn: () => searchJournalEntries(query),
    enabled: Boolean(query.trim()),
    staleTime: 60 * 1000, // 1 minute
    ...options,
  })
}
