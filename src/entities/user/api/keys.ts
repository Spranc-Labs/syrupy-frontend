/**
 * Query key factory for user entity
 *
 * This pattern ensures type-safe, consistent query keys across the app
 * and makes invalidation easier.
 *
 * @example
 * // Use in query
 * useQuery({ queryKey: userKeys.detail(userId), ... })
 *
 * // Invalidate all user queries
 * queryClient.invalidateQueries({ queryKey: userKeys.all })
 *
 * // Invalidate specific user
 * queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
 */
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  current: () => [...userKeys.all, 'current'] as const,
} as const
