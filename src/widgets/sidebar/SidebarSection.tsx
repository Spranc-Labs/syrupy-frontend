import type React from 'react'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'react-feather'
import { IconButton } from '@/shared/ui'

export interface SidebarSectionProps {
  title?: string
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function SidebarSection({ title, children, defaultCollapsed = false }: SidebarSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col gap-0">
      {title && (
        <div
          className="group mb-0 flex min-h-[28px] w-full items-center justify-between px-3 py-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <h3 className="font-semibold text-text-tertiary text-xs uppercase tracking-wider transition-colors group-hover:text-text-dark">
            {title}
          </h3>
          {isHovered && (
            <IconButton
              icon={isCollapsed ? <ChevronRight /> : <ChevronDown />}
              onClick={() => setIsCollapsed(!isCollapsed)}
              size="xs"
              variant="outline"
              aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
            />
          )}
        </div>
      )}
      {!isCollapsed && <div className="flex flex-col gap-0">{children}</div>}
    </div>
  )
}
