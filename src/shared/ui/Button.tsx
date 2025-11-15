import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The button content
   */
  children?: ReactNode
  /**
   * Icon to display before the text
   */
  icon?: ReactNode
  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'neutral' | 'outline'
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
   * Active state - applies primary color to outline variant
   * @default false
   */
  active?: boolean
}

/**
 * Button component built on DaisyUI with icon support
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 *
 * @example
 * <Button variant="outline" size="sm" icon={<Edit />}>
 *   Edit
 * </Button>
 */
export function Button({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  active = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  // Custom outline variant styling
  const isOutlineVariant = variant === 'outline'
  const isSmallSize = size === 'sm'

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        // Base button styles - only use DaisyUI if not outline variant
        !isOutlineVariant && 'btn',
        !isOutlineVariant && {
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
          loading: loading,
        },
        // Custom outline variant with exact Figma specs
        isOutlineVariant && [
          'flex items-center rounded border border-[#D9D9D9] bg-transparent transition-colors',
          // Active state: #6F43FF text/icon color, border stays same
          active ? 'text-[#6F43FF]' : 'text-[#444444]',
          'hover:bg-base-200',
          isSmallSize && 'h-[24px] gap-1 px-2 text-xs',
          !isSmallSize && 'h-auto gap-2 px-4 py-2',
        ],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="loading loading-spinner" />
      ) : (
        <>
          {icon && <span className="flex h-3.5 w-3.5 items-center">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}
