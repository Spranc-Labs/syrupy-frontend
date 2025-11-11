import { useParams } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Edit, ExternalLink, Highlighter, Maximize2 } from 'lucide-react'
import { useState } from 'react'
import { HighlightsPanel } from '../components/HighlightsPanel'
import { WebPagePreview } from '../components/WebPagePreview'

export function BookmarkDetail() {
  const { bookmarkId } = useParams({ from: '/_authenticated/bookmarks/$bookmarkId' })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // TODO: Fetch bookmark data
  const bookmark = {
    id: bookmarkId,
    title: 'System Design',
    url: 'https://gyle.system.design',
    collection: 'Unsorted',
    highlights: [
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
    ],
  }

  return (
    <div className="flex h-screen flex-col bg-base-100">
      {/* Header */}
      <div className="border-b border-base-300 bg-base-100">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded p-2 text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-primary">{bookmark.title}</h1>
              <p className="text-sm text-text-tertiary">{new URL(bookmark.url).hostname}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="btn btn-ghost btn-sm gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              {!isFullscreen && <span className="hidden lg:inline">Fullscreen</span>}
            </button>

            <div className="badge badge-outline">{bookmark.collection}</div>

            <div className="flex gap-1">
              <button type="button" className="btn btn-ghost btn-sm" aria-label="Previous bookmark">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button type="button" className="btn btn-ghost btn-sm" aria-label="Next bookmark">
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <button type="button" className="btn btn-ghost btn-sm gap-2">
              <Highlighter className="h-4 w-4" />
              <span className="hidden lg:inline">Highlights</span>
            </button>

            <button type="button" className="btn btn-ghost btn-sm gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden lg:inline">Edit</span>
            </button>

            <button type="button" className="btn btn-ghost btn-sm gap-2">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden lg:inline">Links</span>
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
            <HighlightsPanel highlights={bookmark.highlights} />
          </div>
        )}
      </div>
    </div>
  )
}
