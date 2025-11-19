import { useRouterState } from '@tanstack/react-router'
import type React from 'react'
import { useEffect } from 'react'
import { cn } from '@/shared/lib'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { Sidebar } from '../sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { width, isResizing, isCollapsed, setResizing } = useSidebarStore()
  const router = useRouterState()
  const isBookmarksPage = router.location.pathname.startsWith('/bookmarks')

  // When sidebar is hidden on any bookmark page, remove margin
  const mainMarginLeft = isCollapsed && isBookmarksPage ? 0 : width

  // Clear resize state and cursor when on bookmark page with collapsed sidebar
  useEffect(() => {
    if (isCollapsed && isBookmarksPage && isResizing) {
      setResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isCollapsed, isBookmarksPage, isResizing, setResizing])

  // Prevent resize blocking on bookmark pages when sidebar is hidden
  const shouldBlockResize = isResizing && !(isCollapsed && isBookmarksPage)

  return (
    <div className="min-h-screen bg-base-100">
      <Sidebar />
      <main
        className={cn(
          'min-h-screen bg-base-100',
          !shouldBlockResize && 'transition-all duration-300',
          shouldBlockResize && 'pointer-events-none select-none'
        )}
        style={{ marginLeft: `${mainMarginLeft}px` }}
      >
        {children}
      </main>
    </div>
  )
}
