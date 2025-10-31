import type React from 'react'
import { cn } from '@/shared/lib'
import { useSidebarStore } from '@/stores/useSidebarStore'
import { Sidebar } from '../sidebar'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { width, isResizing } = useSidebarStore()

  return (
    <div className="min-h-screen bg-base-100">
      <Sidebar />
      <main
        className={cn(
          'min-h-screen bg-base-100',
          !isResizing && 'transition-all duration-300',
          isResizing && 'pointer-events-none select-none'
        )}
        style={{ marginLeft: `${width}px` }}
      >
        {children}
      </main>
    </div>
  )
}
