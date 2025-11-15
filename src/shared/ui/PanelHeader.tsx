import { X } from 'react-feather'
import { IconButton } from './IconButton'

export interface PanelHeaderProps {
  title: string
  onClose: () => void
  closeAriaLabel?: string
}

export function PanelHeader({ title, onClose, closeAriaLabel }: PanelHeaderProps) {
  const ariaLabel = closeAriaLabel || `Close ${title.toLowerCase()}`

  return (
    <div className="flex items-center justify-between px-6 py-3">
      <h2 className="font-semibold text-base-content text-lg">{title}</h2>
      <IconButton icon={<X />} size="sm" aria-label={ariaLabel} onClick={onClose} />
    </div>
  )
}
