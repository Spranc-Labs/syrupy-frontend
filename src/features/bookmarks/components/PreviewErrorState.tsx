import { AlertCircle, ExternalLink } from 'react-feather'
import { Button } from '@/shared/ui'

interface PreviewErrorStateProps {
  onOpenInNewTab: () => void
}

export function PreviewErrorState({ onOpenInNewTab }: PreviewErrorStateProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <AlertCircle className="mb-2 h-16 w-16 text-text-tertiary" />
      <h3 className="mb-4 font-semibold text-base-content text-lg">Preview Not Available</h3>
      <p className="text-sm text-text-tertiary">This page cannot be displayed in the preview.</p>
      <p className="mt-2 text-text-quaternary text-xs">
        The site may use modern JavaScript modules that cannot be fully proxied,
        <br />
        or it may block embedding for security reasons.
      </p>
      <Button onClick={onOpenInNewTab} variant="outline" size="md" className="mt-4">
        <ExternalLink className="h-4 w-4" />
        Open in New Tab
      </Button>
    </div>
  )
}
