import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Alert content
   */
  children: ReactNode
  /**
   * Alert variant
   * @default 'info'
   */
  variant?: 'info' | 'success' | 'warning' | 'error'
  /**
   * Alert title
   */
  title?: string
  /**
   * Show icon
   * @default true
   */
  showIcon?: boolean
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

/**
 * Alert component built on DaisyUI with icons
 *
 * @example
 * <Alert variant="success" title="Success!">
 *   Your changes have been saved.
 * </Alert>
 */
export function Alert({
  children,
  variant = 'info',
  title,
  showIcon = true,
  className,
  ...props
}: AlertProps) {
  const Icon = icons[variant]

  return (
    <div
      role="alert"
      className={cn(
        'alert',
        {
          'alert-info': variant === 'info',
          'alert-success': variant === 'success',
          'alert-warning': variant === 'warning',
          'alert-error': variant === 'error',
        },
        className
      )}
      {...props}
    >
      {showIcon && <Icon className="h-6 w-6" />}
      <div className="flex-1">
        {title && <h3 className="font-bold">{title}</h3>}
        <div className={title ? 'text-xs' : ''}>{children}</div>
      </div>
    </div>
  )
}
