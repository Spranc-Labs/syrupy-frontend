# Quick Start Guide

## ✅ App is Running Successfully!

Your modernized frontend is now ready to use.

## 🚀 Start Development

```bash
npm run dev
```

The app will be available at: **http://localhost:5173** (or 5174 if 5173 is in use)

## 🛠️ Common Commands

### Development
```bash
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Lint and auto-fix with Biome
npm run type-check   # Check TypeScript types
npm run format       # Format code with Biome
```

### Testing
```bash
npm test             # Run tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:run     # Run tests once (CI mode)
npm run test:coverage # Generate coverage report
```

### Component Development
```bash
npm run storybook    # Launch Storybook on port 6006
```

### Code Generation
```bash
npm run generate              # Interactive generator menu
npm run generate:component    # Generate UI component
npm run generate:entity       # Generate entity with API hooks
npm run generate:route        # Generate new route
```

## 📁 Project Structure

```
src/
├── app/                    # Application initialization
│   ├── App.tsx            # Router setup
│   ├── main.tsx           # Entry point
│   └── providers/         # Global providers (Auth, Theme)
│
├── routes/                # TanStack Router pages
│   ├── __root.tsx        # Root layout
│   ├── _authenticated.tsx # Protected routes
│   ├── login.tsx
│   ├── register.tsx
│   └── _authenticated/   # Protected pages
│
├── widgets/               # Complex UI blocks
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   └── SettingsModal.tsx
│
├── features/              # Feature modules
│   ├── auth/
│   ├── dashboard/
│   ├── journal/
│   └── ...
│
├── entities/              # Business entities
│   └── user/
│
└── shared/                # Shared infrastructure
    ├── api/              # API client
    ├── ui/               # Design system
    └── lib/              # Utilities
```

## 🎨 Design System Components

All components are available with Storybook documentation:

```tsx
import { Button, Input, Card, Badge, Alert } from '@/shared/ui'

// Usage
<Button variant="primary" size="lg">Click me</Button>
<Input label="Email" error="Invalid email" />
<Card title="Card Title">Content</Card>
<Badge variant="success">New</Badge>
<Alert variant="info" title="Note">Important message</Alert>
```

## 🔧 Code Generation Examples

### Generate a UI Component
```bash
npm run generate:component
# Enter name: Modal
# Create Storybook stories? Yes
```

Creates:
- `src/shared/ui/Modal.tsx`
- `src/shared/ui/Modal.stories.tsx`
- Auto-adds export to `src/shared/ui/index.ts`

### Generate an Entity
```bash
npm run generate:entity
# Enter name: Post
```

Creates:
- `src/entities/post/types.ts`
- `src/entities/post/api/keys.ts`
- `src/entities/post/api/queries.ts`
- `src/entities/post/api/mutations.ts`

### Generate a Route
```bash
npm run generate:route
# Enter path: settings/profile
# Component name: SettingsProfile
```

Creates:
- `src/routes/_authenticated/settings.profile.tsx`

## 🔐 Path Aliases

Use these clean imports throughout your code:

```tsx
import { apiClient } from '@/shared/api'           // API client
import { Button } from '@/shared/ui'               // UI components
import { cn } from '@/shared/lib'                  // Utilities
import { useAuth } from '@/app/providers'          // Providers
import { Layout } from '@/widgets'                 // Widgets
import { Dashboard } from '@/features/dashboard'   // Features
import { useUser } from '@/entities/user'          // Entities
```

## 🐛 Troubleshooting

### Vite Import Error
If you see "Failed to resolve import" errors:

```bash
# Clear cache and restart
rm -rf node_modules/.vite dist
npm run dev
```

### Port Already in Use
Vite will automatically try another port (5174, 5175, etc.)

### TypeScript Errors
Some pre-existing TypeScript strict mode errors are expected. They don't prevent the app from running:
- Function hoisting issues
- Unused variables
- Type inference issues

These can be fixed gradually without affecting functionality.

### Route Not Found
If routes aren't working:
1. Check that `src/routeTree.gen.ts` exists
2. Restart the dev server to regenerate routes
3. Verify route file names follow TanStack Router conventions

## 📚 Tech Stack Reference

### Core
- **React 18** - UI library
- **TypeScript 5.9** - Type safety (strict mode)
- **Vite 6** - Build tool and dev server

### Routing & Data
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management

### Styling
- **Tailwind CSS** - Utility-first CSS
- **DaisyUI** - Component library with custom themes
- **clsx + tailwind-merge** - Class name utilities

### Development
- **Biome** - Fast linting and formatting
- **Vitest** - Fast unit testing
- **Testing Library** - Component testing
- **Storybook 8** - Component documentation

### Quality
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Plop.js** - Code generation

## 🎯 Next Steps

1. **Browse Storybook**: `npm run storybook`
2. **Generate your first component**: `npm run generate:component`
3. **Create a new entity**: `npm run generate:entity`
4. **Add a new route**: `npm run generate:route`
5. **Write tests**: Check `src/shared/lib/cn.test.ts` for examples

## 📖 Additional Documentation

- `FSD_MIGRATION.md` - Feature-Sliced Design architecture guide
- `API_PATTERNS.md` - API client usage patterns
- `.vscode/settings.json` - VSCode configuration
- `biome.json` - Linting and formatting rules

## 🆘 Need Help?

- **Vite**: https://vitejs.dev
- **TanStack Router**: https://tanstack.com/router
- **TanStack Query**: https://tanstack.com/query
- **DaisyUI**: https://daisyui.com
- **Biome**: https://biomejs.dev
- **FSD**: https://feature-sliced.design

---

**Status**: ✅ All systems operational
**Dev Server**: Ready at http://localhost:5173
**Storybook**: Available at http://localhost:6006
