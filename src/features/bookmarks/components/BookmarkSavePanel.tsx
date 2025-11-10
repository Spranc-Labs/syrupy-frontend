import { X } from 'lucide-react'
import { useEffect } from 'react'
import { BookmarkForm, type BookmarkFormData } from './BookmarkForm'
import { ReaderModePreview } from './ReaderModePreview'

interface BookmarkSavePanelProps {
  url: string
  title?: string | null
  description?: string | null
  previewImage?: string | null
  siteName?: string | null
  onSave: (data: BookmarkFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function BookmarkSavePanel({
  url,
  title,
  description,
  previewImage,
  siteName,
  onSave,
  onCancel,
  isSubmitting,
}: BookmarkSavePanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        const form = document.getElementById('bookmark-title') as HTMLInputElement | null
        if (form?.value) {
          const formElement = form.form
          if (formElement) {
            formElement.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="bg-base-100">
      <div className="mx-auto max-w-7xl px-6 py-4">
        {/* Header with title and close button */}
        <div className="mb-6 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-base-content">{title || 'Untitled'}</h2>
            {description && <p className="mt-1 text-sm text-base-content/60">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="ml-4 flex-shrink-0 rounded p-2 text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
            disabled={isSubmitting}
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Two-column layout: 70% left, 30% right */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[70%_30%]">
          {/* Left: Preview (70%) */}
          <div className="h-[600px]">
            <ReaderModePreview
              url={url}
              title={title}
              description={description}
              previewImage={previewImage}
              siteName={siteName}
            />
          </div>

          {/* Right: Form (30%) */}
          <div className="flex flex-col">
            <BookmarkForm
              initialData={{
                title: title ?? '',
                description: description ?? '',
                note: '',
                collection_id: null,
                tags: [],
              }}
              onSubmit={onSave}
              onCancel={onCancel}
              isSubmitting={isSubmitting}
            />

            {/* Keyboard shortcuts hint */}
            <div className="mt-4 text-xs text-base-content/40">
              <kbd className="kbd kbd-xs">Esc</kbd> to cancel •{' '}
              <kbd className="kbd kbd-xs">Ctrl</kbd> + <kbd className="kbd kbd-xs">Enter</kbd> to
              save
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
