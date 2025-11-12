import { useState } from 'react'
import { Link as LinkIcon, Plus, X } from 'react-feather'
import type { BrowserTab } from '@/entities/browsing-session'
import { Button, IconButton } from '@/shared/ui'
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
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-lg font-semibold text-base-content">Linked Bookmarks</h2>
        <IconButton icon={<X />} size="sm" aria-label="Close links panel" onClick={onClose} />
      </div>

      {/* Add Link Input */}
      <div className="border-b border-base-300 px-6 py-3">
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
          <div className="px-6 py-8 text-center text-sm text-text-tertiary">
            No linked bookmarks yet. Add bookmarks that are related to this one.
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

      {/* Footer */}
      <div className="flex min-h-[52px] items-center justify-between border-t border-base-300 px-6 py-3">
        <span className="text-[10px]" style={{ color: '#BAB8B8' }}>
          {links.length} linked bookmark{links.length !== 1 ? 's' : ''}
        </span>
        <div />
      </div>
    </div>
  )
}
