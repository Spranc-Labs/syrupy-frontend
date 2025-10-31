import type React from 'react'

export interface SidebarSectionProps {
  title?: string
  children: React.ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {title && (
        <h3 className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}
