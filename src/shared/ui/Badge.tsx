import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Badge content
   */
  children: ReactNode
  /**
   * Badge variant
   * @default 'neutral'
   */
  variant?:
    | 'neutral'
    | 'primary'
    | 'secondary'
    | 'accent'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
  /**
   * Badge size
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Outline style
   * @default false
   */
  outline?: boolean
}

/**
 * Badge component built on DaisyUI
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" outline>Inactive</Badge>
 */
export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  outline = false,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        {
          'badge-neutral': variant === 'neutral',
          'badge-primary': variant === 'primary',
          'badge-secondary': variant === 'secondary',
          'badge-accent': variant === 'accent',
          'badge-info': variant === 'info',
          'badge-success': variant === 'success',
          'badge-warning': variant === 'warning',
          'badge-error': variant === 'error',
          'badge-xs': size === 'xs',
          'badge-sm': size === 'sm',
          'badge-md': size === 'md',
          'badge-lg': size === 'lg',
          'badge-outline': outline,
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
