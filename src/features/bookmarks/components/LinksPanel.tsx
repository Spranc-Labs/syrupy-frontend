import { useState } from 'react'
import { Link as LinkIcon, Plus } from 'react-feather'
import type { BrowserTab } from '@/entities/browsing-session'
import { Button, EmptyState, PanelFooter, PanelHeader } from '@/shared/ui'
import { BookmarksList } from './BookmarksList'
import { StyledInput } from './StyledInput'

interface LinksPanelProps {
  linkedBookmarks?: BrowserTab[]
  onClose: () => void
  currentCollection?: string
  currentCollectionRoute?: string
}

export function LinksPanel({
  linkedBookmarks: initialLinks = [],
  onClose,
  currentCollection,
  currentCollectionRoute,
}: LinksPanelProps) {
  const [links, setLinks] = useState<BrowserTab[]>(initialLinks)
  const [newLinkUrl, setNewLinkUrl] = useState('')

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return

    // TODO: Implement actual link addition with proper bookmark data
    const newLink: BrowserTab = {
      id: `temp-${Date.now()}`,
      title: 'A guide on system design',
      url: newLinkUrl,
      domain: 'guide.system.design',
      preview: {
        image: null,
        description:
          'Scalability is frequently used as a magic incantation to indicate that something is badly designed or broken.',
        site_name: null,
        favicon: null,
      },
    }
    setLinks((prev) => [...prev, newLink])
    setNewLinkUrl('')
  }

  const handleUnlink = (item: BrowserTab) => {
    setLinks((prev) => prev.filter((link) => link.id !== item.id))
  }

  return (
    <div className="flex h-full flex-col bg-base-100">
      <PanelHeader title="Linked Bookmarks" onClose={onClose} closeAriaLabel="Close links panel" />

      {/* Add Link Input */}
      <div className="border-base-300 border-b px-6 py-3">
        <div className="flex items-end gap-2">
          <StyledInput
            type="url"
            value={newLinkUrl}
            onChange={(e) => setNewLinkUrl(e.target.value)}
            placeholder="Add related link URL..."
            className="flex-1"
            containerClassName="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddLink()
              }
            }}
          />
          <Button variant="outline" size="sm" icon={<Plus />} onClick={handleAddLink}>
            Add
          </Button>
        </div>
      </div>

      {/* Links List */}
      <div className="flex-1 overflow-y-auto">
        {links.length === 0 ? (
          <div className="px-6">
            <EmptyState
              size="sm"
              icon={<span />}
              title="No linked bookmarks yet"
              description="Add bookmarks that are related to this one"
            />
          </div>
        ) : (
          <BookmarksList
            items={links}
            navigateToDetail={true}
            onDelete={handleUnlink}
            deleteIcon={<LinkIcon />}
            deleteLabel="Unlink bookmark"
            collection={currentCollection}
            collectionRoute={currentCollectionRoute}
          />
        )}
      </div>

      <PanelFooter
        className="min-h-[52px]"
        leftContent={
          <span className="text-[10px] text-text-quaternary">
            {links.length} linked bookmark{links.length !== 1 ? 's' : ''}
          </span>
        }
        rightContent={<div />}
      />
    </div>
  )
}
