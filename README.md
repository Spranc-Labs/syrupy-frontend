# Syrupy Frontend

Modern React frontend for the Syrupy journaling platform, built with TypeScript and Vite.

## 🛠️ Tech Stack

- **React 18** - UI library with hooks and concurrent features
- **TypeScript 5.9** - Type safety (strict mode)
- **Vite 6** - Fast build tool and dev server
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library with custom themes
- **Biome** - Fast linting and formatting
- **Vitest** - Fast unit testing
- **Storybook 8** - Component documentation

## 🚀 Quick Start

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production
npm run preview      # Preview production build
```

## 📝 Common Commands

### Development
```bash
npm run dev          # Start dev server with HMR
npm run lint         # Lint and auto-fix with Biome
npm run type-check   # Check TypeScript types
npm test             # Run tests with Vitest
npm run storybook    # Launch Storybook on port 6006
```

## 📁 Project Structure (FSD Architecture)

```
src/
├── app/                    # Application initialization
│   ├── App.tsx            # Router setup
│   └── providers/         # Global providers (Auth, Theme)
│
├── routes/                # TanStack Router pages
│   ├── __root.tsx         # Root layout
│   ├── _authenticated/    # Protected pages
│   ├── login.tsx
│   └── register.tsx
│
├── widgets/               # Complex UI blocks
│   ├── Layout.tsx
│   └── Navigation.tsx
│
├── features/              # Feature modules
│   ├── auth/
│   ├── dashboard/
│   └── journal/
│
├── entities/              # Business entities
│   └── user/
│       ├── api/          # API hooks
│       └── types.ts
│
└── shared/                # Shared infrastructure
    ├── api/              # API client
    ├── ui/               # Design system components
    └── lib/              # Utilities
```

## 🎨 Design System

All components available via Storybook:

```tsx
import { Button, Input, Card, Badge, Alert } from '@/shared/ui'

<Button variant="primary" size="lg">Click me</Button>
<Input label="Email" error="Invalid email" />
<Card title="Title">Content</Card>
```

## 🔐 Path Aliases

```tsx
import { apiClient } from '@/shared/api'           // API client
import { Button } from '@/shared/ui'               // UI components
import { cn } from '@/shared/lib'                  // Utilities
import { useAuth } from '@/app/providers'          // Providers
import { Layout } from '@/widgets'                 // Widgets
import { Dashboard } from '@/features/dashboard'   // Features
import { useUser } from '@/entities/user'          // Entities
```

## 📚 Documentation

- **CLAUDE.md** - Complete style guide and coding standards
- **FSD_MIGRATION.md** - Feature-Sliced Design architecture
- **API_PATTERNS.md** - API client usage patterns
- **Storybook** - Component documentation (`npm run storybook`) 