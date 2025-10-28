# Codebase Style Guide for Syrupy Frontend

This guide maintains consistency with modern React, TypeScript, Vite, and FSD best practices.

## Table of Contents
- [React & TypeScript Best Practices](#react--typescript-best-practices)
- [Component Guidelines](#component-guidelines)
- [State Management](#state-management)
- [Routing with TanStack Router](#routing-with-tanstack-router)
- [Data Fetching with TanStack Query](#data-fetching-with-tanstack-query)
- [Styling with Tailwind & DaisyUI](#styling-with-tailwind--daisyui)
- [Feature-Sliced Design Architecture](#feature-sliced-design-architecture)
- [Testing Standards](#testing-standards)
- [Code Quality & Linting](#code-quality--linting)

---

## React & TypeScript Best Practices

### TypeScript Configuration
```typescript
// Use strict mode (already configured in tsconfig.json)
// - All strict flags enabled
// - noUnusedLocals, noUnusedParameters
// - noUncheckedIndexedAccess for safer array access

// Always use explicit types for function parameters and returns
function fetchUser(id: string): Promise<User> {
  return apiClient.get<User>(`/users/${id}`)
}

// Prefer type inference for simple cases
const userName = user.name // inferred as string
const count = 0 // inferred as number
```

### Function Components
```typescript
// Use function declarations for components (not arrow functions)
// This enables better hoisting and clearer stack traces
export function MyComponent({ title, onClose }: MyComponentProps) {
  return <div>{title}</div>
}

// Define props interface above component
interface MyComponentProps {
  title: string
  onClose: () => void
  className?: string
}

// Use React.FC sparingly - prefer explicit props typing
// Only use React.FC when you need to access children prop implicitly
export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>
}
```

### Hooks Best Practices
```typescript
// 1. ALWAYS define functions BEFORE using them in hooks
export function MyComponent() {
  // ❌ WRONG - function used before declaration
  useEffect(() => {
    fetchData()
  }, [fetchData])

  const fetchData = async () => { /* ... */ }

  // ✅ CORRECT - function declared first
  const fetchData = async () => { /* ... */ }

  useEffect(() => {
    fetchData()
  }, [fetchData])
}

// 2. Wrap functions in useCallback when used as dependencies
export function MyComponent() {
  const fetchData = useCallback(async () => {
    const data = await apiClient.get('/data')
    setData(data)
  }, []) // Add dependencies here

  useEffect(() => {
    fetchData()
  }, [fetchData]) // Now safe to use as dependency
}

// 3. Avoid stale closures - always include dependencies
useEffect(() => {
  const timer = setInterval(() => {
    console.log(count) // Include count in deps
  }, 1000)

  return () => clearInterval(timer)
}, [count]) // ✅ Include count

// 4. Return cleanup functions properly
useEffect(() => {
  const subscription = subscribe()

  return () => {
    subscription.unsubscribe()
  }
}, [])

// 5. For conditional returns, ensure all code paths return
useEffect(() => {
  if (!enabled) {
    return undefined // ✅ Explicit return
  }

  const cleanup = () => { /* ... */ }
  return cleanup
}, [enabled])
```

### Event Handlers
```typescript
// Name event handlers with "handle" prefix
function MyComponent() {
  const handleClick = () => {
    console.log('clicked')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // handle submit
  }

  return <button onClick={handleClick}>Click</button>
}

// Type events properly
type ButtonEvent = React.MouseEvent<HTMLButtonElement>
type FormEvent = React.FormEvent<HTMLFormElement>
type InputEvent = React.ChangeEvent<HTMLInputElement>
```

### Conditional Rendering
```typescript
// Use && for simple conditionals
{isLoading && <Spinner />}

// Use ternary for if/else
{isLoading ? <Spinner /> : <Content />}

// Use early returns for complex conditions
function MyComponent({ data }: Props) {
  if (!data) return <EmptyState />
  if (data.error) return <ErrorState error={data.error} />

  return <Content data={data} />
}
```

---

## Component Guidelines

### Component Structure
```typescript
// 1. Imports (grouped by source)
import type React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { Button, Card } from '@/shared/ui'
import { apiClient } from '@/shared/api'
import { cn } from '@/shared/lib'

// 2. Types/Interfaces
interface MyComponentProps {
  title: string
  optional?: boolean
}

interface User {
  id: string
  name: string
}

// 3. Component definition
export function MyComponent({ title, optional = false }: MyComponentProps) {
  // 3a. Hooks (in order: state, context, queries, effects)
  const [count, setCount] = useState(0)
  const { user } = useAuth()
  const { data } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })

  // 3b. Callbacks and memoized values
  const handleClick = useCallback(() => {
    setCount(c => c + 1)
  }, [])

  // 3c. Effects (after all other hooks)
  useEffect(() => {
    // side effect
  }, [])

  // 3d. Early returns
  if (!user) return <LoginPrompt />

  // 3e. Render
  return (
    <div>
      <h1>{title}</h1>
    </div>
  )
}

// 4. Helper functions (outside component)
function helperFunction(value: string): string {
  return value.toUpperCase()
}
```

### Component File Organization
```typescript
// shared/ui/Button.tsx - Simple component
export interface ButtonProps {
  // props
}

export function Button(props: ButtonProps) {
  // component
}

// features/dashboard/components/StatsCard.tsx - Feature component
import { Card } from '@/shared/ui'

interface StatsCardProps {
  // props
}

export function StatsCard(props: StatsCardProps) {
  // component
}
```

### Props Destructuring
```typescript
// ✅ CORRECT - Destructure in parameter
export function Button({ variant, size, children, ...props }: ButtonProps) {
  return <button className={cn(classes[variant], classes[size])} {...props}>
    {children}
  </button>
}

// ❌ WRONG - Destructure in body
export function Button(props: ButtonProps) {
  const { variant, size, children } = props
  return <button>{children}</button>
}
```

### Component Naming
```typescript
// Use PascalCase for components
export function UserProfile() {}
export function DashboardCard() {}

// Use camelCase for instances and props
const userProfile = <UserProfile />
const cardProps = { title: 'Hello' }

// Name handlers with "handle" prefix
const handleSubmit = () => {}
const handleClick = () => {}

// Name boolean props with "is", "has", "should" prefix
interface Props {
  isLoading: boolean
  hasError: boolean
  shouldUpdate: boolean
}
```

---

## State Management

### Local State (useState)
```typescript
// Use for simple component state
const [count, setCount] = useState(0)
const [isOpen, setIsOpen] = useState(false)

// Initialize with function for expensive computations
const [state, setState] = useState(() => {
  return expensiveComputation()
})

// Use functional updates for state based on previous value
setCount(prev => prev + 1) // ✅ CORRECT
setCount(count + 1)         // ❌ May be stale in callbacks
```

### Global State (Zustand)
```typescript
// stores/useThemeStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeStore {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  actualTheme: 'light' | 'dark'
  setActualTheme: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      actualTheme: 'light',
      setTheme: (theme) => set({ theme }),
      setActualTheme: (actualTheme) => set({ actualTheme }),
    }),
    { name: 'theme-storage' }
  )
)

// Usage in components
function MyComponent() {
  const theme = useThemeStore(state => state.theme) // ✅ Selector
  const { theme, setTheme } = useThemeStore()       // ✅ Multiple values
}
```

### Server State (TanStack Query)
```typescript
// Use for data fetching - covered in Data Fetching section
```

---

## Routing with TanStack Router

### Route File Structure
```typescript
// routes/index.tsx - Root index route
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return <h1>Home</h1>
}

// routes/_authenticated.tsx - Layout route
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const token = tokenStorage.getAccessToken()
    if (!token) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: () => <Layout><Outlet /></Layout>,
})

// routes/_authenticated/dashboard.tsx - Nested route
export const Route = createFileRoute('/_authenticated/dashboard')({
  component: Dashboard,
})
```

### Navigation
```typescript
import { Link, useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  // Use Link for declarative navigation
  return (
    <Link to="/dashboard">Dashboard</Link>
  )

  // Use navigate for imperative navigation
  const handleSuccess = () => {
    navigate({ to: '/dashboard' })
  }
}

// Type-safe navigation with params
<Link to="/users/$userId" params={{ userId: '123' }}>User</Link>

// With search params
<Link to="/search" search={{ q: 'react' }}>Search</Link>
```

### Route Params and Search
```typescript
// routes/_authenticated/users.$userId.tsx
import { createFileRoute } from '@tanstack/react-router'

type UserSearch = {
  tab?: 'profile' | 'settings'
}

export const Route = createFileRoute('/_authenticated/users/$userId')({
  validateSearch: (search: Record<string, unknown>): UserSearch => ({
    tab: (search.tab as UserSearch['tab']) || 'profile',
  }),
  component: UserPage,
})

function UserPage() {
  const { userId } = Route.useParams()
  const { tab } = Route.useSearch()

  return <div>User {userId} - Tab: {tab}</div>
}
```

---

## Data Fetching with TanStack Query

### Query Key Factory Pattern
```typescript
// entities/user/api/keys.ts
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

// Usage
queryClient.invalidateQueries({ queryKey: userKeys.detail('123') })
queryClient.invalidateQueries({ queryKey: userKeys.lists() })
```

### Query Hooks
```typescript
// entities/user/api/queries.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import { userKeys } from './keys'
import type { User } from '../types'

async function fetchUser(id: string): Promise<User> {
  const response = await apiClient.get<User>(`/users/${id}`)
  if (!response.data) {
    throw new Error('No user data returned')
  }
  return response.data
}

export function useUser(
  id: string,
  options?: Omit<UseQueryOptions<User, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
    enabled: Boolean(id), // Don't run if id is empty
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  })
}

// Usage in component
function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useUser(userId)

  if (isLoading) return <Spinner />
  if (error) return <ErrorMessage error={error} />
  if (!user) return <NotFound />

  return <div>{user.name}</div>
}
```

### Mutation Hooks with Optimistic Updates
```typescript
// entities/user/api/mutations.ts
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query'
import { apiClient } from '@/shared/api'
import { userKeys } from './keys'
import type { User, UpdateUserInput } from '../types'

async function updateUser(id: string, data: UpdateUserInput): Promise<User> {
  const response = await apiClient.put<User>(`/users/${id}`, data)
  if (!response.data) {
    throw new Error('No user data returned')
  }
  return response.data
}

export function useUpdateUser(
  options?: Omit<
    UseMutationOptions<User, Error, { id: string; data: UpdateUserInput }>,
    'mutationFn'
  >
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),

    // Optimistically update the cache
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: userKeys.detail(id) })

      // Snapshot the previous value
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
    onError: (_error, { id }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(userKeys.detail(id), context.previous)
      }
    },

    // Refetch on settle
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },

    ...options,
  })
}

// Usage in component
function EditProfile({ userId }: { userId: string }) {
  const updateUser = useUpdateUser()

  const handleSubmit = (data: UpdateUserInput) => {
    updateUser.mutate(
      { id: userId, data },
      {
        onSuccess: () => {
          toast.success('Profile updated!')
        },
        onError: (error) => {
          toast.error(`Failed to update: ${error.message}`)
        },
      }
    )
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

## Styling with Tailwind & DaisyUI

### Using the cn() Utility
```typescript
import { cn } from '@/shared/lib'

// Merge classes with proper precedence
<div className={cn(
  'base-class',
  condition && 'conditional-class',
  className // Allow override from props
)} />

// Example: Button component
export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'btn', // DaisyUI base class
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-lg': size === 'lg',
          'btn-sm': size === 'sm',
        },
        className // Props override
      )}
      {...props}
    />
  )
}
```

### DaisyUI Component Classes
```typescript
// Use DaisyUI classes for consistent styling
<button className="btn btn-primary">Button</button>
<input className="input input-bordered" />
<div className="card card-bordered">
  <div className="card-body">
    <h2 className="card-title">Title</h2>
  </div>
</div>
<div className="badge badge-primary">Badge</div>
<div className="alert alert-info">Alert</div>
```

### Dark Mode Support
```typescript
// All components should support dark mode via DaisyUI themes
// Use semantic color classes that adapt to theme
<div className="bg-base-100 text-base-content">
  Content adapts to theme
</div>

// Custom dark mode styles (use sparingly)
<div className="bg-white dark:bg-gray-800">
  Custom dark mode
</div>
```

### Responsive Design
```typescript
// Use Tailwind responsive prefixes
<div className="
  grid
  grid-cols-1        // Mobile: 1 column
  md:grid-cols-2     // Tablet: 2 columns
  lg:grid-cols-3     // Desktop: 3 columns
  xl:grid-cols-4     // Large: 4 columns
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Feature-Sliced Design Architecture

### Layer Structure
```
src/
├── app/              # Application initialization
│   ├── App.tsx
│   ├── main.tsx
│   └── providers/    # Global providers only
│
├── routes/           # TanStack Router pages
│
├── widgets/          # Complex UI blocks
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   └── index.ts
│
├── features/         # User-facing features
│   ├── auth/
│   │   ├── components/  # Feature components
│   │   └── pages/       # Feature pages
│   └── dashboard/
│
├── entities/         # Business entities
│   └── user/
│       ├── api/         # Data access layer
│       │   ├── keys.ts
│       │   ├── queries.ts
│       │   └── mutations.ts
│       └── types.ts
│
└── shared/           # Reusable code
    ├── api/          # API client
    ├── ui/           # Design system
    └── lib/          # Utilities
```

### Import Rules
```typescript
// ✅ CORRECT - Import from lower layers
// app/ can import from: widgets, features, entities, shared
import { Layout } from '@/widgets'
import { useAuth } from '@/features/auth'
import { useUser } from '@/entities/user'
import { Button } from '@/shared/ui'

// ❌ WRONG - Don't import from higher layers
// shared/ cannot import from entities, features, widgets, app
import { useUser } from '@/entities/user' // ❌ in shared/

// ❌ WRONG - Don't cross-import at same level
// features/auth cannot import from features/dashboard
import { Dashboard } from '@/features/dashboard' // ❌ in features/auth
```

### Entity Layer Pattern
```typescript
// entities/user/types.ts
export interface User {
  id: string
  email: string
  name: string
}

export interface CreateUserInput {
  email: string
  name: string
}

export interface UpdateUserInput {
  name?: string
}

// entities/user/api/keys.ts
export const userKeys = { /* query keys */ }

// entities/user/api/queries.ts
export function useUser(id: string) { /* ... */ }
export function useUsers() { /* ... */ }

// entities/user/api/mutations.ts
export function useCreateUser() { /* ... */ }
export function useUpdateUser() { /* ... */ }
export function useDeleteUser() { /* ... */ }

// entities/user/index.ts
export type { User, CreateUserInput, UpdateUserInput } from './types'
export { userKeys } from './api/keys'
export { useUser, useUsers } from './api/queries'
export { useCreateUser, useUpdateUser, useDeleteUser } from './api/mutations'
```

---

## Testing Standards

### Component Tests
```typescript
// MyComponent.test.tsx
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('calls onClick when button is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<MyComponent onClick={handleClick} />)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<MyComponent isLoading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
```

### Query Hook Tests
```typescript
// useUser.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi } from 'vitest'
import { useUser } from './queries'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useUser', () => {
  it('fetches user successfully', async () => {
    const { result } = renderHook(() => useUser('123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ id: '123', name: 'John' })
  })
})
```

### Utility Tests
```typescript
// cn.test.ts
import { describe, it, expect } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('foo', true && 'bar', false && 'baz')).toBe('foo bar')
  })

  it('deduplicates Tailwind classes', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })
})
```

---

## Code Quality & Linting

### Biome Configuration
```json
// biome.json
{
  "$schema": "https://biomejs.dev/schemas/2.3.1/schema.json",
  "formatter": {
    "enabled": true,
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

### Running Quality Checks
```bash
# Lint and auto-fix
npm run lint

# Type check
npm run type-check

# Run tests
npm test

# Full quality check
npm run lint && npm run type-check && npm test
```

### Pre-commit Hooks
```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "biome check --write --no-errors-on-unmatched",
      "vitest related --run --passWithNoTests"
    ]
  }
}
```

### Code Review Checklist
- [ ] All TypeScript errors resolved
- [ ] No unused variables or imports
- [ ] All hooks have correct dependencies
- [ ] Functions defined before use in hooks
- [ ] Proper error handling (try/catch, error boundaries)
- [ ] Loading and error states handled
- [ ] Responsive design tested
- [ ] Dark mode works correctly
- [ ] Accessibility attributes added (aria-label, role, etc.)
- [ ] Tests written for new functionality
- [ ] No console.log or debugger statements
- [ ] FSD import rules followed

---

## Common Patterns

### Error Handling
```typescript
// API calls with error handling
try {
  const data = await apiClient.get<User>('/users/123')
  return data
} catch (error) {
  if (error instanceof AuthenticationError) {
    // Handle auth error
    navigate({ to: '/login' })
  } else if (error instanceof ValidationError) {
    // Handle validation error
    setErrors(error.validationErrors)
  } else {
    // Handle generic error
    toast.error('An error occurred')
  }
  throw error
}

// React error boundaries for component errors
// app/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<Props, State> {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logError(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### Loading States
```typescript
function MyComponent() {
  const { data, isLoading, error } = useQuery({ /* ... */ })

  // Handle loading
  if (isLoading) {
    return <Spinner />
  }

  // Handle error
  if (error) {
    return <ErrorMessage error={error} />
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return <EmptyState />
  }

  // Render success state
  return <Content data={data} />
}
```

### Form Handling with React Hook Form
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email')}
        label="Email"
        error={errors.email?.message}
      />
      <Input
        {...register('password')}
        type="password"
        label="Password"
        error={errors.password?.message}
      />
      <Button type="submit">Login</Button>
    </form>
  )
}
```

---

## Performance Optimization

### Memoization
```typescript
import { memo, useMemo, useCallback } from 'react'

// Memoize expensive components
export const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  return <div>{/* render */}</div>
})

// Memoize expensive calculations
function MyComponent({ items }: { items: Item[] }) {
  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0)
  }, [items])

  return <div>Total: {total}</div>
}

// Memoize callbacks passed to children
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  return <Child onClick={handleClick} />
}
```

### Code Splitting
```typescript
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function MyComponent() {
  return (
    <Suspense fallback={<Spinner />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

---

## Accessibility

### ARIA Attributes
```typescript
// Add proper ARIA labels
<button aria-label="Close modal" onClick={onClose}>
  <XIcon />
</button>

// Use semantic HTML
<nav aria-label="Main navigation">
  <Link to="/home">Home</Link>
</nav>

// Add roles when needed
<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

### Keyboard Navigation
```typescript
function Modal({ isOpen, onClose }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }

    return undefined
  }, [isOpen, onClose])

  return <div>...</div>
}
```

---

## Key Principles

1. **Type Safety First** - Use TypeScript strictly, avoid `any`
2. **Function Hoisting** - Define functions before using in hooks
3. **Explicit Dependencies** - Always include hook dependencies
4. **FSD Architecture** - Follow layer import rules strictly
5. **Error Handling** - Handle loading, error, and empty states
6. **Accessibility** - Add ARIA labels and keyboard support
7. **Performance** - Memoize when needed, lazy load heavy components
8. **Testing** - Write tests for all new functionality
9. **Code Quality** - Run lint, type-check, and tests before commit
10. **Documentation** - Write clear comments for complex logic

---

## Tools & Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Quality
npm run lint            # Lint and auto-fix
npm run type-check      # Check TypeScript
npm test               # Run tests
npm run test:coverage  # Generate coverage

# Generation
npm run generate:component  # Generate UI component
npm run generate:entity     # Generate entity with API
npm run generate:route      # Generate route

# Storybook
npm run storybook           # Launch component docs
```

---

## Resources

- **React**: https://react.dev
- **TypeScript**: https://typescriptlang.org/docs
- **Vite**: https://vitejs.dev
- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query
- **Tailwind CSS**: https://tailwindcss.com
- **DaisyUI**: https://daisyui.com
- **Biome**: https://biomejs.dev
- **Vitest**: https://vitest.dev
- **Testing Library**: https://testing-library.com
- **FSD**: https://feature-sliced.design

---

**Last Updated**: 2025-10-28
**Version**: 1.0.0
