import { FileText } from 'lucide-react'

interface WebPagePreviewProps {
  url: string
}

export function WebPagePreview({ url }: WebPagePreviewProps) {
  return (
    <div className="flex h-full flex-col bg-base-100">
      {/* Preview Content */}
      <div className="relative flex flex-1 items-center justify-center bg-base-200">
        <div className="text-center">
          <FileText className="mx-auto mb-4 h-16 w-16 text-primary" />
          <h3 className="mb-2 text-lg font-semibold text-base-content">Web Page Live Preview</h3>
          <p className="text-sm text-text-tertiary">
            The live page content from <span className="font-medium">{new URL(url).hostname}</span>{' '}
            will appear here
          </p>
          <p className="mt-2 text-xs text-text-quaternary">
            This requires iframe integration with the bookmarked URL
          </p>
        </div>
      </div>
    </div>
  )
}
