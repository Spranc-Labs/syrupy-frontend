/**
 * Query keys for browsing sessions
 */
export const browsingSessionKeys = {
  all: ['browsing-sessions'] as const,
  lists: () => [...browsingSessionKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...browsingSessionKeys.lists(), filters] as const,
}
