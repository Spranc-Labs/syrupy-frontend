import { QueryClient } from '@tanstack/react-query'
import { ApiError, AuthenticationError } from './errors'

const IS_DEV = import.meta.env.DEV

/**
 * Enhanced Query Client with error handling and optimized defaults
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        if (error instanceof AuthenticationError) {
          return false
        }
        // Don't retry on 4xx errors (client errors)
        if (
          error instanceof ApiError &&
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          return false
        }
        // Retry up to 2 times for other errors
        return failureCount < 2
      },

      // Performance optimizations
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - unused data cached (formerly cacheTime)
      refetchOnWindowFocus: !IS_DEV, // Disable in dev for better DX
      refetchOnReconnect: true,
      refetchOnMount: true,

      // Error handling
      throwOnError: false, // Handle errors in components via error state
    },
    mutations: {
      // Don't retry mutations by default (unsafe)
      retry: false,

      // Error handling
      throwOnError: false,

      // Global mutation callbacks
      onError: (_error) => {
        if (IS_DEV) {
        }
      },
    },
  },
})

/**
 * Invalidate all queries for an entity
 */
export function invalidateEntity(entityKey: string[]) {
  return queryClient.invalidateQueries({ queryKey: entityKey })
}

/**
 * Clear all query cache
 */
export function clearQueryCache() {
  queryClient.clear()
}

/**
 * Prefetch a query
 */
export function prefetchQuery<T>(
  queryKey: unknown[],
  queryFn: () => Promise<T>,
  staleTime = 5 * 60 * 1000
) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime,
  })
}
