import type React from 'react'

export interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: {
    container: 'py-8',
    icon: 'h-12 w-12',
    title: 'text-base',
    description: 'text-sm',
  },
  md: {
    container: 'py-12',
    icon: 'h-16 w-16',
    title: 'text-lg',
    description: 'text-base',
  },
  lg: {
    container: 'py-16',
    icon: 'h-20 w-20',
    title: 'text-xl',
    description: 'text-lg',
  },
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  const sizes = sizeClasses[size]

  return (
    <div className={`text-center ${sizes.container} ${className}`}>
      <div className={`mb-4 flex justify-center text-text-quaternary ${sizes.icon}`}>{icon}</div>
      <h3 className={`mb-2 font-medium text-text-primary ${sizes.title}`}>{title}</h3>
      <p className={`text-text-secondary ${sizes.description}`}>{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
