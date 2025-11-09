/**
 * Query key factory for hoarder tabs
 */

export const hoarderTabKeys = {
  all: ['hoarder-tabs'] as const,
  lists: () => [...hoarderTabKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...hoarderTabKeys.lists(), params] as const,
}
