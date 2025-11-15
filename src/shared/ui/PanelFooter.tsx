import type React from 'react'

export interface PanelFooterProps {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  className?: string
}

export function PanelFooter({ leftContent, rightContent, className = '' }: PanelFooterProps) {
  return (
    <div
      className={`flex items-center justify-between border-base-300 border-t px-6 py-3 ${className}`}
    >
      {leftContent}
      {rightContent}
    </div>
  )
}
