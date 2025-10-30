import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/shared/lib'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Card content
   */
  children: ReactNode
  /**
   * Card variant
   * @default 'normal'
   */
  variant?: 'normal' | 'bordered' | 'compact'
  /**
   * Image at the top of the card
   */
  imageSrc?: string
  /**
   * Card title
   */
  title?: string
  /**
   * Card actions (buttons, etc.)
   */
  actions?: ReactNode
}

/**
 * Card component built on DaisyUI
 *
 * @example
 * <Card title="Article Title" imageSrc="/image.jpg">
 *   <p>Article content goes here...</p>
 * </Card>
 */
export function Card({
  children,
  variant = 'normal',
  imageSrc,
  title,
  actions,
  className,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'card bg-base-100 shadow-xl',
        {
          'card-bordered': variant === 'bordered',
          'card-compact': variant === 'compact',
        },
        className
      )}
      {...props}
    >
      {imageSrc && (
        <figure>
          <img src={imageSrc} alt={title || 'Card image'} />
        </figure>
      )}
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        {children}
        {actions && <div className="card-actions justify-end">{actions}</div>}
      </div>
    </div>
  )
}
