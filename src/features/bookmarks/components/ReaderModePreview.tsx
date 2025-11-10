import { FileText } from 'lucide-react'

interface ReaderModePreviewProps {
  url: string
  title?: string | null
  description?: string | null
  previewImage?: string | null
  siteName?: string | null
}

export function ReaderModePreview({
  url,
  title,
  description,
  previewImage,
  siteName,
}: ReaderModePreviewProps) {
  const domain = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  })()

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-lg border border-base-300 bg-base-100">
      {previewImage ? (
        <div className="relative h-48 w-full flex-shrink-0">
          <img src={previewImage} alt={title ?? 'Preview'} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-48 w-full flex-shrink-0 items-center justify-center bg-base-200">
          <FileText className="h-12 w-12 text-base-content/20" />
        </div>
      )}

      <div className="flex-1 space-y-4 p-6">
        {siteName && (
          <div className="text-xs font-medium uppercase tracking-wide text-primary">{siteName}</div>
        )}

        {title && <h2 className="text-2xl font-semibold text-base-content">{title}</h2>}

        {description && (
          <p className="text-base leading-relaxed text-base-content/80">{description}</p>
        )}

        <div className="!mt-8 flex items-center gap-2 text-sm text-base-content/60">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
          <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {domain}
          </a>
        </div>

        {!title && !description && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="mb-4 h-16 w-16 text-base-content/20" />
            <p className="text-base-content/60">No preview content available</p>
            <p className="mt-1 text-sm text-base-content/40">
              The page metadata could not be extracted
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
