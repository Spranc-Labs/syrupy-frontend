# DaisyUI Theming Guide for Syrupy

Complete guide to configuring colors, typography, spacing, and themes in your Syrupy application.

---

## Table of Contents
1. [Current Theme Setup](#current-theme-setup)
2. [DaisyUI Color System](#daisyui-color-system)
3. [Typography Configuration](#typography-configuration)
4. [Spacing & Layout](#spacing--layout)
5. [Custom Theme Properties](#custom-theme-properties)
6. [Dark Mode](#dark-mode)
7. [Component Theming](#component-theming)
8. [Best Practices](#best-practices)

---

## Current Theme Setup

### Location: `tailwind.config.js`

Your app currently has **2 custom themes**:
- `heyho` - Light theme
- `heyho-dark` - Dark theme

```javascript
daisyui: {
  themes: [
    {
      heyho: { /* light theme colors */ },
      'heyho-dark': { /* dark theme colors */ }
    }
  ],
  darkTheme: 'heyho-dark',
}
```

---

## DaisyUI Color System

### Semantic Color Tokens

DaisyUI uses **semantic color names** that automatically work with components:

```javascript
// In tailwind.config.js
{
  heyho: {
    // 🎨 Brand Colors
    primary: '#3b82f6',           // Main brand color (buttons, links, active states)
    'primary-focus': '#2563eb',   // Hover/focus state
    'primary-content': '#ffffff', // Text on primary background

    // 🎨 Secondary Brand
    secondary: '#8b5cf6',
    'secondary-focus': '#7c3aed',
    'secondary-content': '#ffffff',

    // 🎨 Accent Color
    accent: '#10b981',
    'accent-focus': '#059669',
    'accent-content': '#ffffff',

    // 🎨 Neutral (UI elements)
    neutral: '#1f2937',           // Footers, secondary buttons
    'neutral-focus': '#111827',
    'neutral-content': '#ffffff',

    // 🎨 Base (Backgrounds)
    'base-100': '#ffffff',        // Page background
    'base-200': '#f9fafb',        // Slightly darker bg (cards, sections)
    'base-300': '#f3f4f6',        // Even darker (borders, dividers)
    'base-content': '#1f2937',    // Main text color

    // 🎨 Semantic States
    info: '#3b82f6',              // Informational messages
    success: '#10b981',           // Success messages
    warning: '#f59e0b',           // Warning messages
    error: '#ef4444',             // Error messages
  }
}
```

### How to Use These Colors

**In Components:**
```tsx
// DaisyUI classes automatically use theme colors
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<div className="bg-base-200">Background</div>
<p className="text-base-content">Text</p>
```

**In Custom Classes:**
```tsx
// Use theme colors in Tailwind
<div className="bg-primary text-primary-content">
  Custom themed div
</div>
```

---

## Typography Configuration

### Current Setup

Your typography is configured in **two places**:

#### 1. Tailwind Config (`tailwind.config.js`)

Add custom fonts and typography scales:

```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        // Custom sizes beyond Tailwind defaults
        'xxs': '0.625rem',     // 10px
        '2xs': '0.6875rem',    // 11px
        // ... Tailwind defaults (xs, sm, base, lg, xl, 2xl, etc.)
        '7xl': '5rem',         // 80px
        '8xl': '6rem',         // 96px
      },
      lineHeight: {
        'extra-tight': '1.1',
        'extra-loose': '2.5',
      },
      letterSpacing: {
        'extra-tight': '-0.05em',
        'extra-wide': '0.15em',
      },
    }
  }
}
```

#### 2. Global Styles (`index.css`)

Define base typography styles:

```css
@layer base {
  /* Default body typography */
  body {
    @apply text-base leading-relaxed;
    font-family: 'Inter', system-ui, sans-serif;
  }

  /* Headings */
  h1 {
    @apply text-4xl font-bold leading-tight tracking-tight;
  }

  h2 {
    @apply text-3xl font-semibold leading-tight;
  }

  h3 {
    @apply text-2xl font-semibold leading-snug;
  }

  h4 {
    @apply text-xl font-medium leading-snug;
  }

  /* Links */
  a {
    @apply text-primary hover:text-primary-focus transition-colors;
  }

  /* Code */
  code {
    @apply font-mono text-sm bg-base-200 px-1.5 py-0.5 rounded;
  }
}
```

### Typography Utilities

Create reusable text styles:

```css
@layer components {
  .heading-1 {
    @apply text-5xl font-bold tracking-tight text-base-content;
  }

  .heading-2 {
    @apply text-4xl font-semibold tracking-tight text-base-content;
  }

  .body-large {
    @apply text-lg leading-relaxed text-base-content;
  }

  .body-small {
    @apply text-sm leading-normal text-base-content/80;
  }

  .label {
    @apply text-xs font-medium uppercase tracking-wide text-base-content/70;
  }
}
```

---

## Spacing & Layout

### Tailwind Spacing Scale

Tailwind provides a comprehensive spacing scale (0-96):

```javascript
// In tailwind.config.js - extend with custom values
export default {
  theme: {
    extend: {
      spacing: {
        '128': '32rem',    // 512px
        '144': '36rem',    // 576px
        'sidebar': '256px', // Your sidebar width
        'header': '64px',   // Header height
      },
    }
  }
}
```

**Usage:**
```tsx
<div className="p-4">         {/* padding: 1rem (16px) */}
<div className="mt-8">        {/* margin-top: 2rem (32px) */}
<div className="space-y-6">  {/* vertical spacing between children */}
<div className="gap-4">      {/* gap in flex/grid */}
```

### Container & Max Widths

```javascript
// In tailwind.config.js
export default {
  theme: {
    extend: {
      maxWidth: {
        'prose': '65ch',        // Ideal reading width
        'content': '1280px',    // Content max width
        'sidebar': '400px',     // Sidebar max width
      },
      minWidth: {
        'sidebar': '220px',
      }
    }
  }
}
```

---

## Custom Theme Properties

### Adding Custom CSS Variables

You can add custom properties to your theme:

```javascript
// In tailwind.config.js
{
  heyho: {
    // ... existing colors

    // Custom properties
    '--rounded-box': '1rem',          // Border radius for cards/boxes
    '--rounded-btn': '0.5rem',        // Border radius for buttons
    '--rounded-badge': '1.9rem',      // Border radius for badges

    '--animation-btn': '0.25s',       // Button click animation
    '--animation-input': '0.2s',      // Input focus animation

    '--btn-focus-scale': '0.95',      // Button shrink on click
    '--border-btn': '1px',            // Button border width

    '--tab-border': '1px',            // Tab border
    '--tab-radius': '0.5rem',         // Tab border radius
  }
}
```

### Custom Color Palettes

Add your own color groups:

```javascript
// In tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          // ... up to 900
        },

        // Functional colors
        sidebar: {
          bg: '#1a1d20',
          hover: '#212529',
          active: '#343a40',
        },
      }
    }
  }
}
```

**Usage:**
```tsx
<div className="bg-brand-500 text-brand-50">
<aside className="bg-sidebar-bg hover:bg-sidebar-hover">
```

---

## Dark Mode

### How It Works in Your App

Your app uses **dual dark mode** setup:

```javascript
// tailwind.config.js
darkMode: ['class', '[data-theme="heyho-dark"]'],
```

This means dark mode triggers when:
1. `class="dark"` is on `<html>` element, OR
2. `data-theme="heyho-dark"` is on `<html>` element

### Dark Mode Color Strategy

**Light Theme (`heyho`):**
- Backgrounds: White → Gray (light to dark)
- Text: Dark → Light

**Dark Theme (`heyho-dark`):**
- Backgrounds: Dark → Darker
- Text: Light → Lighter
- Colors: Use **lighter shades** for better visibility

Example:
```javascript
// Light theme
primary: '#3b82f6',  // Blue 500

// Dark theme
primary: '#60a5fa',  // Blue 400 (lighter!)
```

### Dark Mode in Components

```tsx
// Manual dark mode classes
<div className="bg-white dark:bg-gray-800">
<p className="text-gray-900 dark:text-gray-100">

// DaisyUI semantic classes (auto-adapts!)
<div className="bg-base-100 text-base-content">
```

---

## Component Theming

### DaisyUI Component Classes

DaisyUI provides pre-styled components:

```tsx
// Buttons
<button className="btn">Default</button>
<button className="btn btn-primary">Primary</button>
<button className="btn btn-secondary">Secondary</button>
<button className="btn btn-ghost">Ghost</button>
<button className="btn btn-link">Link</button>

// Sizes
<button className="btn btn-xs">Tiny</button>
<button className="btn btn-sm">Small</button>
<button className="btn btn-md">Medium (default)</button>
<button className="btn btn-lg">Large</button>

// Cards
<div className="card">
  <div className="card-body">
    <h2 className="card-title">Card Title</h2>
    <p>Card content</p>
  </div>
</div>

// Badges
<span className="badge">Default</span>
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>

// Alerts
<div className="alert alert-info">
  <span>Info alert</span>
</div>
```

### Custom Component Styles

Define your own component styles in `index.css`:

```css
@layer components {
  /* Custom sidebar item */
  .sidebar-item {
    @apply flex items-center gap-2 px-3 py-2 rounded-lg
           text-base-content/70 hover:bg-base-200 hover:text-base-content
           transition-colors duration-200;
  }

  .sidebar-item-active {
    @apply bg-primary/10 text-primary font-medium;
  }

  /* Custom resource card */
  .resource-card {
    @apply bg-base-100 border border-base-300 rounded-xl p-6
           hover:shadow-lg hover:border-primary/50
           transition-all duration-300;
  }
}
```

---

## Best Practices

### 1. Use Semantic Colors

✅ **DO:**
```tsx
<button className="btn btn-primary">Save</button>
<div className="bg-base-100 text-base-content">
```

❌ **DON'T:**
```tsx
<button className="bg-blue-500 text-white">Save</button>
<div className="bg-white text-gray-900">
```

**Why:** Semantic colors automatically adapt to light/dark themes.

### 2. Consistent Spacing

Use Tailwind's spacing scale consistently:
```tsx
// Good: Uses scale (4, 6, 8)
<div className="space-y-4">
  <section className="p-6">
    <h2 className="mb-4">

// Bad: Random values
<div className="space-y-3.5">
  <section className="p-5.5">
    <h2 className="mb-3.5">
```

### 3. Component-First Approach

Create reusable components instead of repeating Tailwind classes:

```tsx
// ✅ Good
export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <button className="btn btn-primary" {...props}>
      {children}
    </button>
  )
}

// ❌ Bad - repeating everywhere
<button className="bg-primary text-primary-content px-4 py-2 rounded-lg hover:bg-primary-focus">
```

### 4. Theme Consistency

Keep your light and dark themes visually balanced:

```javascript
// Same structure, different values
{
  heyho: {
    primary: '#3b82f6',           // Blue 500
    'base-100': '#ffffff',        // White
  },
  'heyho-dark': {
    primary: '#60a5fa',           // Blue 400 (lighter for contrast)
    'base-100': '#1a1d20',        // Dark gray
  }
}
```

### 5. Accessibility

Ensure proper color contrast:

```javascript
// Check contrast ratios
{
  primary: '#3b82f6',
  'primary-content': '#ffffff',  // Must have 4.5:1 contrast minimum
}
```

Tools:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Coolors Contrast Checker](https://coolors.co/contrast-checker)

---

## Quick Reference

### Color Usage

| Purpose | Class | Example |
|---------|-------|---------|
| Primary action | `btn-primary` | Save button |
| Secondary action | `btn-secondary` | Cancel button |
| Page background | `bg-base-100` | Main wrapper |
| Card background | `bg-base-200` | Elevated surface |
| Borders | `border-base-300` | Dividers |
| Main text | `text-base-content` | Body text |
| Success state | `alert-success` | Form success |
| Error state | `alert-error` | Form error |

### Spacing

| Size | Class | Pixels |
|------|-------|--------|
| Extra small | `p-1` | 4px |
| Small | `p-2` | 8px |
| Medium | `p-4` | 16px |
| Large | `p-6` | 24px |
| Extra large | `p-8` | 32px |

### Typography

| Type | Classes | Use Case |
|------|---------|----------|
| H1 | `text-4xl font-bold` | Page titles |
| H2 | `text-3xl font-semibold` | Section titles |
| Body | `text-base` | Paragraphs |
| Small | `text-sm` | Labels, captions |
| Tiny | `text-xs` | Metadata |

---

## Modifying Your Theme

### To Change Colors:

1. Open `tailwind.config.js`
2. Find the theme you want to modify (`heyho` or `heyho-dark`)
3. Change the color values:

```javascript
{
  heyho: {
    primary: '#your-new-color',
    'primary-focus': '#your-new-hover-color',
  }
}
```

### To Add New Spacing:

```javascript
export default {
  theme: {
    extend: {
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      }
    }
  }
}
```

### To Add Custom Fonts:

1. Add fonts to your project (Google Fonts, local files, etc.)
2. Update config:

```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Your Font', 'fallback', 'sans-serif'],
      }
    }
  }
}
```

3. Import in `index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

---

## Resources

- **DaisyUI Docs**: https://daisyui.com/docs/themes/
- **Tailwind Colors**: https://tailwindcss.com/docs/customizing-colors
- **Tailwind Spacing**: https://tailwindcss.com/docs/customizing-spacing
- **Color Palette Generator**: https://uicolors.app/create
- **Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

**Happy Theming! 🎨**
