export const bookmarkKeys = {
  all: ['bookmarks'] as const,
  lists: () => [...bookmarkKeys.all, 'list'] as const,
  list: (filters?: { collection_id?: number; tag?: string; q?: string }) =>
    [...bookmarkKeys.lists(), filters] as const,
  trash: () => [...bookmarkKeys.all, 'trash'] as const,
  details: () => [...bookmarkKeys.all, 'detail'] as const,
  detail: (id: number) => [...bookmarkKeys.details(), id] as const,
}
