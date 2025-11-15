import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Textarea label
   */
  label?: string
  /**
   * Error message
   */
  error?: string
  /**
   * Helper text
   */
  helperText?: string
  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean
  /**
   * Number of visible text rows
   * @default 3
   */
  rows?: number
}

/**
 * Textarea component matching Input component design
 *
 * @example
 * <Textarea
 *   label="Description"
 *   rows={4}
 *   error={errors.description}
 *   helperText="Enter a brief description"
 * />
 */
export function Textarea({
  label,
  error,
  helperText,
  fullWidth = false,
  rows = 3,
  className,
  ...props
}: TextareaProps) {
  return (
    <div className={cn({ 'w-full': fullWidth })}>
      {label && (
        <label htmlFor={props.id} className="mb-2 block font-medium text-[10px] text-text-dark">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full rounded border border-border bg-input-bg px-3 py-2 text-[14px] text-text-dark',
          'focus:border-primary focus:shadow-none focus:outline-none',
          'placeholder:text-text-tertiary',
          {
            'border-error focus:border-error': error,
          },
          className
        )}
        rows={rows}
        {...props}
      />
      {error && <p className="mt-1 text-[10px] text-error">{error}</p>}
      {helperText && !error && <p className="mt-1 text-[10px] text-text-tertiary">{helperText}</p>}
    </div>
  )
}
