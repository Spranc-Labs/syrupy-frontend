import { Eye, Pencil, Trash2 } from 'lucide-react'
import type React from 'react'
import type { BrowserTab } from '@/entities/browsing-session'
import { ThumbnailImage } from './ThumbnailImage'

interface BookmarksListProps {
  items: BrowserTab[]
  onPreview?: (item: BrowserTab) => void
  onEdit?: (item: BrowserTab) => void
  onDelete?: (item: BrowserTab) => void
  editIcon?: React.ReactNode
  editLabel?: string
  deleteIcon?: React.ReactNode
  deleteLabel?: string
}

export const BookmarksList: React.FC<BookmarksListProps> = ({
  items,
  onPreview,
  onEdit,
  onDelete,
  editIcon = <Pencil className="h-4 w-4" />,
  editLabel = 'Edit bookmark',
  deleteIcon = <Trash2 className="h-4 w-4" />,
  deleteLabel = 'Delete bookmark',
}) => {
  if (items.length === 0) {
    return null
  }

  const handleCardClick = (item: BrowserTab, e: React.MouseEvent) => {
    // Don't navigate if clicking on action buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const handleKeyDown = (item: BrowserTab, e: React.KeyboardEvent) => {
    // Activate on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="divide-y divide-base-300">
      {items.map((item) => (
        // biome-ignore lint/a11y/useSemanticElements: Card container with nested action buttons requires div with role="button"
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          className="group cursor-pointer bg-base-100 transition-colors hover:bg-base-200"
          onClick={(e) => handleCardClick(item, e)}
          onKeyDown={(e) => handleKeyDown(item, e)}
        >
          <div className="mx-auto flex max-w-7xl items-start gap-4 px-6 py-4">
            <ThumbnailImage item={item} />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline gap-2">
                <h3 className="truncate font-medium text-[14px] text-text-dark transition-colors group-hover:text-primary">
                  {item.title || 'Untitled'}
                </h3>
                {item.domain && (
                  <span className="flex-shrink-0 font-light text-[10px] text-text-tertiary">
                    {item.domain}
                  </span>
                )}
              </div>
              {item.preview?.description && (
                <p className="line-clamp-2 text-[12px] text-text-tertiary">
                  {item.preview.description}
                </p>
              )}
            </div>

            {/* Action Buttons - Only visible on hover */}
            <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {onPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPreview(item)
                  }}
                  className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
                  aria-label="Preview bookmark"
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit(item)
                  }}
                  className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
                  aria-label={editLabel}
                >
                  {editIcon}
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item)
                  }}
                  className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-error"
                  aria-label={deleteLabel}
                >
                  {deleteIcon}
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
