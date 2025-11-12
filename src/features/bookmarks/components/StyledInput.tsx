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
        <label htmlFor={props.id} className="mb-2 block text-[10px] font-medium text-text-dark">
          {label}
        </label>
      )}
      <input
        className={`h-7 w-full rounded border border-[#D9D9D9] bg-[#F9F9F9] px-2 text-[14px] text-text-dark focus:border-primary focus:outline-none ${className}`}
        {...props}
      />
    </div>
  )
}
