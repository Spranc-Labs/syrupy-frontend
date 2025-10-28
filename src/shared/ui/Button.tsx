import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The button content
   */
  children: ReactNode
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'neutral'
  /**
   * Button size
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean
  /**
   * Loading state
   * @default false
   */
  loading?: boolean
  /**
   * Outline style
   * @default false
   */
  outline?: boolean
}

/**
 * Button component built on DaisyUI
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  outline = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'btn',
        {
          'btn-primary': variant === 'primary',
          'btn-secondary': variant === 'secondary',
          'btn-accent': variant === 'accent',
          'btn-ghost': variant === 'ghost',
          'btn-link': variant === 'link',
          'btn-neutral': variant === 'neutral',
          'btn-xs': size === 'xs',
          'btn-sm': size === 'sm',
          'btn-md': size === 'md',
          'btn-lg': size === 'lg',
          'btn-block': fullWidth,
          'btn-outline': outline,
          loading: loading,
        },
        className
      )}
      {...props}
    >
      {loading ? <span className="loading loading-spinner" /> : children}
    </button>
  )
}
