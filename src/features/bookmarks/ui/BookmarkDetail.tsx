import { useParams, useRouter, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Edit,
  Edit2,
  ExternalLink,
  Folder,
  Maximize2,
  Menu,
} from 'react-feather'
import type { BrowserTab } from '@/entities/browsing-session'
import { Button, IconButton } from '@/shared/ui'
import { useSidebarStore } from '@/stores/useSidebarStore'
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
  const { isCollapsed, toggleCollapsed, setCollapsed } = useSidebarStore()

  // Store state before fullscreen to restore later
  const [beforeFullscreenState, setBeforeFullscreenState] = useState<{
    panel: PanelType
    sidebarCollapsed: boolean
  } | null>(null)

  const handleFullscreenToggle = () => {
    const newFullscreenState = !isFullscreen
    setIsFullscreen(newFullscreenState)

    if (newFullscreenState) {
      // Entering fullscreen: save current state, then close panel and collapse sidebar
      setBeforeFullscreenState({
        panel: activePanel,
        sidebarCollapsed: isCollapsed,
      })
      setActivePanel(null)
      setCollapsed(true)
    } else {
      // Exiting fullscreen: restore previous state and uncollapse sidebar if it's collapsed
      if (beforeFullscreenState) {
        setActivePanel(beforeFullscreenState.panel)
        // Always uncollapse sidebar when exiting fullscreen
        setCollapsed(false)
      }
    }
  }

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
  const [activeHighlightId, setActiveHighlightId] = useState<number | null>(null)

  // Exit fullscreen when a panel is opened
  const handlePanelChange = (panel: PanelType) => {
    setActivePanel(panel)
    if (panel !== null && isFullscreen) {
      setIsFullscreen(false)
    }
  }

  const collection = search.collection || 'Unsorted'
  const collectionRoute = search.collectionRoute || '/bookmarks'

  const handleCollectionClick = () => {
    router.history.push(collectionRoute)
  }

  // Mock highlights data removed - now using real API in HighlightsPanel

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
          <div className="flex items-center gap-4">
            {isCollapsed && (
              <IconButton
                icon={<Menu />}
                onClick={toggleCollapsed}
                size="lg"
                variant="outline"
                aria-label="Open menu"
              />
            )}
            <ThumbnailImage item={bookmark} />

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-baseline gap-2">
                <h3 className="truncate font-medium text-text-dark">
                  {bookmark.title || 'Untitled'}
                </h3>
                {bookmark.domain && (
                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 font-light text-text-tertiary transition-colors hover:text-secondary"
                  >
                    {bookmark.domain}
                  </a>
                )}
              </div>
              {bookmark.preview?.description && (
                <p className="truncate text-[12px] text-text-tertiary">
                  {bookmark.preview.description}
                </p>
              )}
            </div>

            <IconButton
              icon={<ExternalLink />}
              onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
              size="sm"
              variant="outline"
              aria-label="Open in new tab"
            />
          </div>
        </div>

        {/* Action Buttons - Separate Row */}
        <div className="flex items-center justify-between border-base-300 border-t px-6 py-3">
          <div className="flex items-center gap-2">
            <IconButton
              icon={<Maximize2 />}
              onClick={handleFullscreenToggle}
              size="sm"
              aria-label="Fullscreen"
              className={isFullscreen ? 'text-secondary' : ''}
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
              onClick={() => handlePanelChange(activePanel === 'highlights' ? null : 'highlights')}
            >
              Highlights
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<Edit />}
              active={activePanel === 'edit'}
              onClick={() => handlePanelChange(activePanel === 'edit' ? null : 'edit')}
            >
              Edit
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={<ExternalLink />}
              active={activePanel === 'links'}
              onClick={() => handlePanelChange(activePanel === 'links' ? null : 'links')}
            >
              Links
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <WebPagePreview
            url={bookmark.url}
            bookmarkId={Number(bookmark.id)}
            highlightIdToScrollTo={activeHighlightId}
          />
        </div>

        {!isFullscreen && activePanel && (
          <div className="relative z-[100] h-full w-[400px] overflow-hidden border-base-300 border-l">
            {activePanel === 'highlights' && (
              <HighlightsPanel
                bookmarkId={Number(bookmarkId)}
                pageUrl={bookmark.url}
                activeHighlightId={activeHighlightId}
                onSetActiveHighlightId={setActiveHighlightId}
                onClose={() => handlePanelChange(null)}
              />
            )}
            {activePanel === 'edit' && (
              <EditPanel
                bookmark={bookmark}
                onClose={() => handlePanelChange(null)}
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
                onClose={() => handlePanelChange(null)}
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
