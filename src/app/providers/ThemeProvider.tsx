import type React from 'react'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

// Function to get system theme preference (outside component to avoid recreation)
const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to system
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('syrupy-theme') as Theme) || 'system'
    }
    return 'system'
  })

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Update actual theme based on current theme setting
  const updateActualTheme = useCallback(() => {
    let newActualTheme: 'light' | 'dark'

    if (theme === 'system') {
      newActualTheme = getSystemTheme()
    } else {
      newActualTheme = theme
    }

    setActualTheme(newActualTheme)

    // Update document class and data-theme for DaisyUI
    const root = document.documentElement
    if (newActualTheme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'heyho-dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'heyho')
    }
  }, [theme])

  useEffect(() => {
    updateActualTheme()

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => updateActualTheme()

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    return undefined
  }, [theme, updateActualTheme])

  // Persist theme to localStorage
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('syrupy-theme', newTheme)
  }

  const value: ThemeContextType = {
    theme,
    setTheme: handleSetTheme,
    actualTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
