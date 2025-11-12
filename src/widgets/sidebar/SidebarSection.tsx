import type React from 'react'

export interface SidebarSectionProps {
  title?: string
  children: React.ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {title && (
        <h3 className="mb-1.5 px-3 font-semibold text-text-tertiary text-xs uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}
