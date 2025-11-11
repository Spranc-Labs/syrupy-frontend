import { Download, Link as LinkIcon } from 'lucide-react'

interface Highlight {
  id: string
  text: string
  note: string | null
}

interface HighlightsPanelProps {
  highlights: Highlight[]
}

export function HighlightsPanel({ highlights }: HighlightsPanelProps) {
  return (
    <div className="flex h-full flex-col bg-base-100">
      {/* Header */}
      <div className="border-b border-base-300 px-6 py-4">
        <h2 className="text-lg font-semibold text-base-content">Highlights</h2>
      </div>

      {/* Highlights List */}
      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
        {highlights.map((highlight) => (
          <div key={highlight.id} className="space-y-2">
            {/* Highlighted Text */}
            <div className="border-l-4 border-primary bg-primary/5 py-2 pl-4 pr-2">
              <p className="text-sm leading-relaxed text-base-content/80">{highlight.text}</p>
            </div>

            {/* Note (if exists) */}
            {highlight.note && (
              <div className="pl-4">
                <p className="text-sm text-text-tertiary">{highlight.note}</p>
                {highlight.note.includes('link') && (
                  <button
                    type="button"
                    className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <LinkIcon className="h-3 w-3" />
                    This is a link
                  </button>
                )}
              </div>
            )}

            {/* Empty note placeholder */}
            {!highlight.note && (
              <div className="pl-4">
                <button
                  type="button"
                  className="text-sm text-text-quaternary hover:text-text-tertiary"
                >
                  Add your notes or highlight from preview
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-base-300 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-text-tertiary">{highlights.length} highlights</span>
          <button
            type="button"
            className="btn btn-ghost btn-sm gap-2"
            aria-label="Export highlights"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>
    </div>
  )
}
