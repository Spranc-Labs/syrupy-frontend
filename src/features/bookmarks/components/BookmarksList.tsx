import { useNavigate } from '@tanstack/react-router'
import type React from 'react'
import { Edit, Eye, Trash2 } from 'react-feather'
import type { BrowserTab } from '@/entities/browsing-session'
import { IconButton } from '@/shared/ui'
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
  navigateToDetail?: boolean
  collection?: string
  collectionRoute?: string
}

export const BookmarksList: React.FC<BookmarksListProps> = ({
  items,
  onPreview,
  onEdit,
  onDelete,
  editIcon = <Edit />,
  editLabel = 'Edit bookmark',
  deleteIcon = <Trash2 />,
  deleteLabel = 'Delete bookmark',
  navigateToDetail = false,
  collection,
  collectionRoute,
}) => {
  const navigate = useNavigate()

  if (items.length === 0) {
    return null
  }

  const handleCardClick = (item: BrowserTab, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return
    }

    window.open(item.url, '_blank', 'noopener,noreferrer')
  }

  const handleKeyDown = (item: BrowserTab, e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      window.open(item.url, '_blank', 'noopener,noreferrer')
    }
  }

  const handlePreviewClick = (item: BrowserTab) => {
    if (navigateToDetail) {
      navigate({
        to: '/bookmarks/$bookmarkId',
        params: { bookmarkId: String(item.id) },
        search: collection && collectionRoute ? { collection, collectionRoute } : undefined,
        // @ts-expect-error - TanStack Router doesn't type the state parameter, but it supports passing custom state
        state: { bookmark: item },
      })
    } else if (onPreview) {
      onPreview(item)
    }
  }

  const handleEditClick = (item: BrowserTab) => {
    if (navigateToDetail) {
      const searchParams =
        collection && collectionRoute
          ? { collection, collectionRoute, panel: 'edit' as const }
          : { panel: 'edit' as const }

      navigate({
        to: '/bookmarks/$bookmarkId',
        params: { bookmarkId: String(item.id) },
        search: searchParams,
        // @ts-expect-error - TanStack Router doesn't type the state parameter, but it supports passing custom state
        state: { bookmark: item },
      })
    } else if (onEdit) {
      onEdit(item)
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
            <div className="flex flex-shrink-0 items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              {(onPreview || navigateToDetail) && (
                <IconButton
                  icon={<Eye />}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePreviewClick(item)
                  }}
                  aria-label="Preview bookmark"
                />
              )}
              {(onEdit || navigateToDetail) && (
                <IconButton
                  icon={editIcon}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEditClick(item)
                  }}
                  aria-label={editLabel}
                />
              )}
              {onDelete && (
                <IconButton
                  icon={deleteIcon}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(item)
                  }}
                  aria-label={deleteLabel}
                  className="hover:text-error"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
