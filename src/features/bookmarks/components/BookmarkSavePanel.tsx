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
    <div className="animate-in slide-in-from-top-4 mx-auto max-w-7xl px-6 py-4 duration-300">
      <div className="overflow-hidden rounded-lg border border-base-300 bg-base-100 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-300 bg-base-200/50 px-6 py-4">
          <div>
            <h3 className="font-semibold text-base-content text-lg">Save Bookmark</h3>
            <p className="text-base-content/60 text-sm">Add this page to your collection</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-circle btn-ghost btn-sm"
            disabled={isSubmitting}
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
          {/* Left: Preview */}
          <div className="h-[600px]">
            <ReaderModePreview
              url={url}
              title={title}
              description={description}
              previewImage={previewImage}
              siteName={siteName}
            />
          </div>

          {/* Right: Form */}
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
