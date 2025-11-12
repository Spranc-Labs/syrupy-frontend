import type React from 'react'

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  containerClassName?: string
}

export function StyledInput({
  label,
  containerClassName = '',
  className = '',
  ...props
}: StyledInputProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={props.id} className="mb-2 block font-medium text-[10px] text-text-dark">
          {label}
        </label>
      )}
      <input
        className={`h-7 w-full rounded border border-border bg-input-bg px-2 text-[14px] text-text-dark focus:border-primary focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
