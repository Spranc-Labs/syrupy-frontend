import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Icon to display
   */
  icon: ReactNode
  /**
   * Button visual variant
   * @default 'outline'
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline'
  /**
   * Button size - sets both width and height
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Loading state
   * @default false
   */
  loading?: boolean
}

const sizeClasses = {
  xs: 'h-[18px] w-[18px]',
  sm: 'h-[24px] w-[24px]',
  md: 'h-[32px] w-[32px]',
  lg: 'h-[40px] w-[40px]',
}

const iconSizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

/**
 * IconButton component for icon-only buttons
 * Optimized for square buttons with consistent sizing
 *
 * @example
 * <IconButton icon={<Edit />} variant="outline" size="sm" aria-label="Edit" />
 *
 * @example
 * <IconButton icon={<Trash />} variant="ghost" size="md" aria-label="Delete" />
 */
export function IconButton({
  icon,
  variant = 'outline',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        'flex items-center justify-center rounded transition-colors',
        sizeClasses[size],
        {
          'border border-[#D9D9D9] bg-transparent text-[#444444] hover:bg-base-200 hover:text-primary':
            variant === 'outline',
          'bg-primary text-primary-content hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-content hover:bg-secondary/90': variant === 'secondary',
          'bg-accent text-accent-content hover:bg-accent/90': variant === 'accent',
          'bg-transparent hover:bg-base-200': variant === 'ghost',
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="loading loading-spinner loading-xs" />
      ) : (
        <span className={cn('flex items-center justify-center', iconSizeClasses[size])}>
          {icon}
        </span>
      )}
    </button>
  )
}
