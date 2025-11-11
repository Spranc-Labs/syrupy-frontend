import { useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Edit, ExternalLink, Highlighter, Maximize2 } from 'lucide-react'
import { useState } from 'react'
import type { BrowserTab } from '@/entities/browsing-session'
import { HighlightsPanel } from '../components/HighlightsPanel'
import { ThumbnailImage } from '../components/ThumbnailImage'
import { WebPagePreview } from '../components/WebPagePreview'

export function BookmarkDetail() {
  const { bookmarkId } = useParams({ from: '/_authenticated/bookmarks/$bookmarkId' })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // TODO: Fetch bookmark data
  const bookmark: BrowserTab = {
    id: bookmarkId,
    title: 'A guide on system design',
    url: 'https://gyle.system.design',
    domain: 'gyle.system.design',
    preview: {
      image: null,
      description:
        'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken. Often you hear in a discussion "but that doesn\'t scale" as the magical word to end an argument.',
      site_name: null,
      favicon: null,
    },
  }

  const highlights = [
    {
      id: '1',
      text: 'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken. Often you hear in a discussion "but that doesn\'t scale" as the magical word to end an argument.',
      note: 'This is an additional notes. Can be linked anywhere and edit when clicked.',
    },
    {
      id: '2',
      text: 'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken. Often you hear in a discussion "but that doesn\'t scale" as the magical word to end an argument.',
      note: null,
    },
    {
      id: '3',
      text: 'Add your notes or highlight from preview',
      note: null,
    },
  ]

  const collection = 'Unsorted'

  return (
    <div className="flex h-screen flex-col bg-base-100">
      {/* Header Section - Collection Name */}
      <div className="mx-auto max-w-7xl px-6 py-2">
        <div>
          <h1 className="text-xl text-primary">{collection}</h1>
          <p className="text-sm text-text-tertiary">
            Bookmarks related to {collection.toLowerCase()} and lots of readings
          </p>
        </div>
      </div>

      {/* Bookmark Card */}
      <div className="bg-base-100">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-start gap-4">
            <ThumbnailImage item={bookmark} />

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline gap-2">
                <h3 className="truncate text-[14px] font-medium text-text-dark">
                  {bookmark.title || 'Untitled'}
                </h3>
                {bookmark.domain && (
                  <span className="flex-shrink-0 text-[10px] font-light text-text-tertiary">
                    {bookmark.domain}
                  </span>
                )}
              </div>
              {bookmark.preview?.description && (
                <p className="truncate text-[12px] text-text-tertiary">
                  {bookmark.preview.description}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons - Separate Row */}
          <div className="mt-3 flex items-center gap-1 border-t border-base-300 pt-3">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
              aria-label="Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
              aria-label="Previous bookmark"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
              aria-label="Next bookmark"
            >
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
              aria-label="Highlights"
            >
              <Highlighter className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
              aria-label="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="rounded p-2 text-text-quaternary transition-colors hover:bg-base-300 hover:text-text-secondary"
              aria-label="Links"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - 2 column layout (preview + highlights) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Center: Web Preview */}
        <div className="flex-1 overflow-hidden">
          <WebPagePreview url={bookmark.url} />
        </div>

        {/* Right: Highlights Panel */}
        {!isFullscreen && (
          <div className="w-[400px] overflow-hidden border-l border-base-300">
            <HighlightsPanel highlights={highlights} />
          </div>
        )}
      </div>
    </div>
  )
}
