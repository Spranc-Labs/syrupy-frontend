import { useParams, useRouter, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Edit, Edit2, ExternalLink, Folder, Maximize2 } from 'react-feather'
import type { BrowserTab } from '@/entities/browsing-session'
import { Button, IconButton } from '@/shared/ui'
import { EditPanel } from '../components/EditPanel'
import { HighlightsPanel } from '../components/HighlightsPanel'
import { LinksPanel } from '../components/LinksPanel'
import { ThumbnailImage } from '../components/ThumbnailImage'
import { WebPagePreview } from '../components/WebPagePreview'

type PanelType = 'highlights' | 'edit' | 'links' | null

export function BookmarkDetail() {
  const { bookmarkId } = useParams({ from: '/_authenticated/bookmarks/$bookmarkId' })
  const search = useSearch({ from: '/_authenticated/bookmarks/$bookmarkId' })
  const router = useRouter()
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Get bookmark from navigation state or use fallback data
  const stateBookmark = (router.state.location.state as { bookmark?: BrowserTab })?.bookmark
  const fallbackBookmark: BrowserTab = {
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
  const bookmark = stateBookmark || fallbackBookmark

  const [activePanel, setActivePanel] = useState<PanelType>(search.panel || 'highlights')

  const collection = search.collection || 'Unsorted'
  const collectionRoute = search.collectionRoute || '/bookmarks'

  const handleCollectionClick = () => {
    router.history.push(collectionRoute)
  }

  const highlights = [
    {
      id: '1',
      text: 'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken. Often you hear in a discussion "but that doesn\'t scale" as the magical word to end an argument.',
      note: 'This is an additional notes. Can be linked anywhere and edit when clicked.',
      type: 'highlight' as const,
    },
    {
      id: '2',
      text: 'This is an additional notes. Can be linked anywhere and edit when clicked.',
      note: null,
      type: 'note' as const,
    },
    {
      id: '3',
      text: 'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken. Often you hear in a discussion "but that doesn\'t scale" as the magical word to end an argument.',
      note: null,
      type: 'highlight' as const,
    },
  ]

  const linkedBookmarks: BrowserTab[] = [
    {
      id: 'linked-1',
      title: 'A guide on system design',
      url: 'https://guide.system.design',
      domain: 'guide.system.design',
      preview: {
        image: null,
        description:
          'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken.',
        site_name: null,
        favicon: null,
      },
    },
    {
      id: 'linked-2',
      title: 'A guide on system design',
      url: 'https://guide.system.design',
      domain: 'guide.system.design',
      preview: {
        image: null,
        description:
          'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken.',
        site_name: null,
        favicon: null,
      },
    },
    {
      id: 'linked-3',
      title: 'A guide on system design',
      url: 'https://guide.system.design',
      domain: 'guide.system.design',
      preview: {
        image: null,
        description:
          'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken.',
        site_name: null,
        favicon: null,
      },
    },
  ]

  return (
    <div className="flex h-screen flex-col bg-base-100">
      {/* Bookmark Card */}
      <div className="border-base-300 border-b bg-base-100">
        <div className="px-6 py-3">
          <div className="flex items-start gap-4">
            <ThumbnailImage item={bookmark} />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline gap-2">
                <h3 className="truncate font-medium text-text-dark">
                  {bookmark.title || 'Untitled'}
                </h3>
                {bookmark.domain && (
                  <span className="flex-shrink-0 font-light text-text-tertiary">
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
        </div>

        {/* Action Buttons - Separate Row */}
        <div className="flex items-center justify-between border-base-300 border-t px-6 py-3">
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Maximize2 />}
              onClick={() => setIsFullscreen(!isFullscreen)}
              size="sm"
              aria-label="Fullscreen"
            />

            <Button variant="outline" size="sm" icon={<Folder />} onClick={handleCollectionClick}>
              {collection}
            </Button>

            <IconButton icon={<ArrowLeft />} size="sm" aria-label="Previous bookmark" />
            <IconButton icon={<ArrowRight />} size="sm" aria-label="Next bookmark" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Edit2 />}
              active={activePanel === 'highlights'}
              onClick={() => setActivePanel(activePanel === 'highlights' ? null : 'highlights')}
            >
              Highlights
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Edit />}
              active={activePanel === 'edit'}
              onClick={() => setActivePanel(activePanel === 'edit' ? null : 'edit')}
            >
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<ExternalLink />}
              active={activePanel === 'links'}
              onClick={() => setActivePanel(activePanel === 'links' ? null : 'links')}
            >
              Links
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <WebPagePreview url={bookmark.url} />
        </div>

        {!isFullscreen && activePanel && (
          <div className="relative z-[100] h-full w-[400px] overflow-hidden border-base-300">
            {activePanel === 'highlights' && (
              <HighlightsPanel highlights={highlights} onClose={() => setActivePanel(null)} />
            )}
            {activePanel === 'edit' && (
              <EditPanel
                bookmark={bookmark}
                onClose={() => setActivePanel(null)}
                onFavorite={() => {
                  // TODO: Implement favorite functionality
                }}
                onDelete={() => {
                  // TODO: Implement delete functionality
                }}
              />
            )}
            {activePanel === 'links' && (
              <LinksPanel
                linkedBookmarks={linkedBookmarks}
                onClose={() => setActivePanel(null)}
                currentCollection={collection}
                currentCollectionRoute={collectionRoute}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
