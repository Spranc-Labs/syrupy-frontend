# API & TanStack Query Patterns

This document explains the patterns and best practices for working with APIs and data fetching in this application.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [API Client](#api-client)
3. [Error Handling](#error-handling)
4. [TanStack Query Patterns](#tanstack-query-patterns)
5. [Entity Structure](#entity-structure)
6. [Examples](#examples)

---

## Architecture Overview

We use a layered approach for API communication:

```
Components/Pages
      ↓
Entity Hooks (queries/mutations)
      ↓
API Client (shared/api)
      ↓
Backend API
```

**Benefits:**
- Type-safe end-to-end
- Centralized error handling
- Automatic retry logic
- Token refresh handling
- Request/response logging (dev only)
- Optimistic updates support

---

## API Client

Located in `src/shared/api/client.ts`

### Features

1. **Automatic Token Refresh**: Transparently refreshes expired tokens
2. **Error Classification**: Converts HTTP errors to typed error classes
3. **Request Logging**: Logs all requests in development
4. **Retry Logic**: Configurable retry with exponential backoff
5. **Timeout Support**: Prevents hanging requests
6. **Type Safety**: Full TypeScript generics

### Usage

```typescript
import { apiClient } from '@/shared/api'

// GET request
const response = await apiClient.get<User>('/users/123')
const user = response.data

// POST with body
const response = await apiClient.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
})

// With query params
const response = await apiClient.get<User[]>('/users', {
  params: { page: 1, limit: 10 },
})

// With retries and timeout
const response = await apiClient.get<User>('/users/123', {
  retries: 3,
  timeout: 5000,
})
```

### Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}
```

---

## Error Handling

We use typed error classes for better error handling:

### Error Classes

```typescript
import {
  ApiError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  ServerError,
  RateLimitError,
} from '@/shared/api'
```

### Handling Errors

```typescript
try {
  await apiClient.post('/users', data)
} catch (error) {
  if (error instanceof ValidationError) {
    // Show field-specific errors
    console.log(error.validationErrors)
  } else if (error instanceof AuthenticationError) {
    // Redirect to login
    navigate('/login')
  } else if (error instanceof RateLimitError) {
    // Show retry message
    console.log(`Retry after ${error.retryAfter} seconds`)
  } else {
    // Generic error handling
    toast.error(error.message)
  }
}
```

---

## TanStack Query Patterns

### Query Key Factory

Every entity should have a query key factory for consistency:

```typescript
// src/entities/{entity}/api/keys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Filters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
} as const
```

**Benefits:**
- Type-safe query keys
- Easy cache invalidation
- Prevents typos
- Centralized key management

### Query Hooks

Create custom hooks for each query:

```typescript
// src/entities/{entity}/api/queries.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import { userKeys } from './keys'
import type { User } from '../types'

async function fetchUser(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`)
  if (!response.data) throw new Error('No data returned')
  return response.data
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: Boolean(id),
  })
}
```

### Mutation Hooks with Optimistic Updates

```typescript
// src/entities/{entity}/api/mutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import { userKeys } from './keys'
import type { User, UpdateUserInput } from '../types'

async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  const response = await apiClient.put<User>(`/users/${id}`, data)
  if (!response.data) throw new Error('No data returned')
  return response.data
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      updateUser(id, data),

    // Optimistic update
    onMutate: async ({ id, data }) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })

      // Get current data
      const previous = queryClient.getQueryData<User>(userKeys.detail(id))

      // Optimistically update
      if (previous) {
        queryClient.setQueryData<User>(userKeys.detail(id), {
          ...previous,
          ...data,
        })
      }

      return { previous }
    },

    // Rollback on error
    onError: (_err, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.detail(id), context.previous)
      }
    },

    // Refetch on settle
    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
    },
  })
}
```

---

## Entity Structure

Each entity follows this structure (Feature-Sliced Design):

```
src/entities/{entity}/
├── api/
│   ├── index.ts         # Re-exports
│   ├── keys.ts          # Query key factory
│   ├── queries.ts       # Query hooks (GET)
│   └── mutations.ts     # Mutation hooks (POST/PUT/DELETE)
├── ui/                  # Entity-specific components (optional)
├── model/               # Local state/hooks (optional)
├── types.ts             # TypeScript types
└── index.ts             # Public API
```

**Example entities:**
- `user` - User management
- `journal` - Journal entries
- `goal` - Goals
- `habit` - Habits

---

## Examples

### Complete Entity Example

See `src/entities/user/` for a complete example including:
- ✅ Query key factory
- ✅ Query hooks with TypeScript
- ✅ Mutation hooks with optimistic updates
- ✅ Type definitions
- ✅ Error handling

### Using in Components

```typescript
import { useUser, useUpdateUser } from '@/entities/user'
import { Button } from '@/shared/ui'

function UserProfile({ userId }: { userId: string }) {
  // Query
  const { data: user, isLoading, error } = useUser(userId)

  // Mutation
  const updateUser = useUpdateUser()

  const handleUpdate = async () => {
    try {
      await updateUser.mutateAsync({
        id: userId,
        data: { name: 'New Name' },
      })
      toast.success('User updated!')
    } catch (error) {
      toast.error('Failed to update user')
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!user) return <div>User not found</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <Button onClick={handleUpdate} loading={updateUser.isPending}>
        Update Name
      </Button>
    </div>
  )
}
```

### Prefetching

```typescript
import { prefetchQuery } from '@/shared/api/query-client'
import { userKeys } from '@/entities/user'

// Prefetch on hover
<Link
  to={`/users/${userId}`}
  onMouseEnter={() => {
    prefetchQuery(userKeys.detail(userId), () => fetchUser(userId))
  }}
>
  View User
</Link>
```

### Cache Invalidation

```typescript
import { queryClient } from '@/shared/api/query-client'
import { userKeys } from '@/entities/user'

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: userKeys.all })

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })

// Invalidate all lists
queryClient.invalidateQueries({ queryKey: userKeys.lists() })
```

---

## Best Practices

### DO ✅

1. **Use query key factories** for all entities
2. **Extract fetch functions** from hooks (easier to test)
3. **Use optimistic updates** for better UX
4. **Handle loading and error states** in components
5. **Invalidate related queries** after mutations
6. **Use typed errors** for better error handling
7. **Enable queries conditionally** when dependencies are ready

### DON'T ❌

1. **Don't call `queryClient` directly in components** (use hooks)
2. **Don't skip error handling** (always handle errors gracefully)
3. **Don't fetch in `useEffect`** (use TanStack Query)
4. **Don't use `any` types** (leverage TypeScript)
5. **Don't retry mutations** without user confirmation
6. **Don't forget to clean up optimistic updates** on error

---

## Query Client Configuration

Located in `src/shared/api/query-client.ts`

### Global Defaults

```typescript
{
  queries: {
    staleTime: 5 * 60 * 1000,     // 5 minutes
    gcTime: 10 * 60 * 1000,       // 10 minutes
    retry: 2,                      // Retry twice
    refetchOnWindowFocus: false,   // Dev: false, Prod: true
  },
  mutations: {
    retry: false,                  // Never retry mutations
  },
}
```

### Custom Retry Logic

The query client automatically:
- **Never retries** on `401` (auth errors)
- **Never retries** on `4xx` (client errors)
- **Retries up to 2 times** on `5xx` (server errors)
- **Retries** on network errors

---

## Environment Variables

```env
VITE_API_URL=http://localhost:3000/api/v1
```

The API client automatically uses this for all requests.

---

## Testing

### Testing Query Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { useUser } from './queries'

test('fetches user', async () => {
  const { result } = renderHook(() => useUser('123'), {
    wrapper: QueryClientProvider,
  })

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(result.current.data?.name).toBe('John Doe')
})
```

### Testing Mutations

```typescript
test('updates user optimistically', async () => {
  const { result } = renderHook(() => useUpdateUser(), {
    wrapper: QueryClientProvider,
  })

  act(() => {
    result.current.mutate({ id: '123', data: { name: 'Jane' } })
  })

  // Check optimistic update
  expect(queryClient.getQueryData(userKeys.detail('123'))).toMatchObject({
    name: 'Jane',
  })
})
```

---

## Debugging

### Enable Query Devtools

Already configured in `App.tsx`:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<ReactQueryDevtools initialIsOpen={false} />
```

Access at: `http://localhost:5173` (bottom-right icon)

### Request Logging

All requests are logged in development:

```
[API] GET /users/123 - 200 { success: true, data: {...} }
[API] POST /users - 422 { success: false, errors: {...} }
```

---

## Migration Guide

### From Old API Client

**Before:**
```typescript
const response = await fetch('/api/users')
const data = await response.json()
```

**After:**
```typescript
const { data } = await apiClient.get<User[]>('/users')
```

### From useEffect to TanStack Query

**Before:**
```typescript
const [user, setUser] = useState<User>()
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch(`/api/users/${id}`)
    .then(r => r.json())
    .then(setUser)
    .finally(() => setLoading(false))
}, [id])
```

**After:**
```typescript
const { data: user, isLoading } = useUser(id)
```

---

## Additional Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
