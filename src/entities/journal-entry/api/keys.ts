export const journalEntryKeys = {
  all: ['journal-entries'] as const,
  lists: () => [...journalEntryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...journalEntryKeys.lists(), filters] as const,
  details: () => [...journalEntryKeys.all, 'detail'] as const,
  detail: (id: number) => [...journalEntryKeys.details(), id] as const,
  search: (query: string) => [...journalEntryKeys.all, 'search', query] as const,
}
