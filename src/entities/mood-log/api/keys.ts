export const moodLogKeys = {
  all: ['mood-logs'] as const,
  lists: () => [...moodLogKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...moodLogKeys.lists(), filters] as const,
  details: () => [...moodLogKeys.all, 'detail'] as const,
  detail: (id: number) => [...moodLogKeys.details(), id] as const,
}
