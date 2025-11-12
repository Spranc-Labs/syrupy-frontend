export interface LoadingStateProps {
  message?: string
  className?: string
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
  return <div className={`flex justify-center p-8 text-text-secondary ${className}`}>{message}</div>
}
