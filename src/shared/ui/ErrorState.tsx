export interface ErrorStateProps {
  message?: string
  className?: string
}

export function ErrorState({
  message = 'An error occurred. Please try again.',
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`py-12 text-center ${className}`}>
      <p className="text-error">{message}</p>
    </div>
  )
}
