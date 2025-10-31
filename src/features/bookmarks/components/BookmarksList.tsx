import type React from 'react'
import type { BrowserTab } from '@/entities/browsing-session'
import { ThumbnailImage } from './ThumbnailImage'

interface BookmarksListProps {
  items: BrowserTab[]
  onAction?: (item: BrowserTab) => void
}

export const BookmarksList: React.FC<BookmarksListProps> = ({ items, onAction }) => {
  if (items.length === 0) {
    return null
  }

  return (
    <div className="divide-y divide-base-300">
      {items.map((item) => (
        <div key={item.id} className="group bg-base-100 transition-colors hover:bg-base-200">
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

            {/* Action Button */}
            <div className="flex flex-shrink-0 items-center gap-2">
              {onAction && (
                <button
                  type="button"
                  onClick={() => onAction(item)}
                  className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
                  aria-label="Copy link"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              )}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
                aria-label="Open link"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
