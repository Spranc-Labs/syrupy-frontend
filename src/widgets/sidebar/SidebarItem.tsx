import { Link } from '@tanstack/react-router'
import type React from 'react'
import { cn } from '@/shared/lib'

export interface SidebarItemProps {
  label: string
  count?: number
  path: string
  isActive?: boolean
  icon?: React.ReactNode
}

export function SidebarItem({ label, count, path, isActive, icon }: SidebarItemProps) {
  return (
    <Link
      to={path}
      className={cn(
        'flex items-center justify-between rounded-lg px-3 py-1 text-sm transition-colors',
        isActive ? 'font-semibold text-primary' : 'text-text-dark hover:text-primary'
      )}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-text-tertiary">{icon}</span>}
        <span>{label}</span>
      </div>
      {count !== undefined && <span className="text-text-tertiary text-xs">{count}</span>}
    </Link>
  )
}
