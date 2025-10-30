import type { InputHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Input label
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
   * Input size
   * @default 'md'
   */
  inputSize?: 'xs' | 'sm' | 'md' | 'lg'
  /**
   * Full width
   * @default false
   */
  fullWidth?: boolean
}

/**
 * Input component built on DaisyUI
 *
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * />
 */
export function Input({
  label,
  error,
  helperText,
  inputSize = 'md',
  fullWidth = false,
  className,
  ...props
}: InputProps) {
  return (
    <div className={cn('form-control', { 'w-full': fullWidth })}>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        className={cn(
          'input input-bordered',
          {
            'input-error': error,
            'input-xs': inputSize === 'xs',
            'input-sm': inputSize === 'sm',
            'input-md': inputSize === 'md',
            'input-lg': inputSize === 'lg',
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
      {helperText && !error && (
        <label className="label">
          <span className="label-text-alt">{helperText}</span>
        </label>
      )}
    </div>
  )
}
