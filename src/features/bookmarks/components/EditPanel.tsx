import { useState } from 'react'
import { Heart, Save, Trash2 } from 'react-feather'
import type { BrowserTab } from '@/entities/browsing-session'
import { Button, PanelFooter, PanelHeader } from '@/shared/ui'
import { StyledInput } from './StyledInput'
import { TagInput } from './TagInput'
import { ThumbnailImage } from './ThumbnailImage'

interface EditPanelProps {
  bookmark?: BrowserTab
  onClose: () => void
  onFavorite?: () => void
  onDelete?: () => void
}

export function EditPanel({ bookmark, onClose, onFavorite, onDelete }: EditPanelProps) {
  const [note, setNote] = useState('')
  const [collection, setCollection] = useState('Unsorted')
  const [tags, setTags] = useState<string[]>(['Productivity', 'Engineering'])
  const [url, setUrl] = useState(bookmark?.url ?? '')
  const [isFavorite, setIsFavorite] = useState(false)

  if (!bookmark) {
    return (
      <div className="flex h-full flex-col bg-base-100">
        <PanelHeader title="Edit bookmark" onClose={onClose} closeAriaLabel="Close edit panel" />
        <div className="flex flex-1 items-center justify-center px-6">
          <p className="text-sm text-text-tertiary">Bookmark not found</p>
        </div>
      </div>
    )
  }

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags((prev) => [...prev, tag])
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove))
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
    if (onFavorite) {
      onFavorite()
    }
  }

  return (
    <div className="flex h-full flex-col bg-base-100">
      <PanelHeader title="Edit bookmark" onClose={onClose} closeAriaLabel="Close edit panel" />

      <div className="flex-1 space-y-4 overflow-y-auto px-6 pt-4 pb-8">
        <div className="flex items-start gap-4">
          <ThumbnailImage item={bookmark} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-medium text-[14px] text-text-dark">
              {bookmark.title || 'Untitled'}
            </h3>
            {bookmark.preview?.description && (
              <p className="mt-1 line-clamp-2 text-[10px] text-text-tertiary">
                {bookmark.preview.description}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="note" className="mb-2 block font-medium text-[10px] text-text-dark">
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded border border-[#D9D9D9] bg-[#F9F9F9] px-3 py-2 text-[14px] text-text-dark focus:border-primary focus:outline-none"
            rows={3}
            placeholder="Supports rich text markdown."
          />
        </div>

        <div>
          <label htmlFor="collection" className="mb-2 block font-medium text-[10px] text-text-dark">
            Collection
          </label>
          <select
            id="collection"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="h-7 w-[40%] appearance-none rounded border border-[#D9D9D9] bg-[#F9F9F9] px-2 py-1 text-[14px] text-text-dark leading-none focus:border-primary focus:outline-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
            }}
          >
            <option>Unsorted</option>
            <option>Work</option>
            <option>Personal</option>
            <option>Research</option>
          </select>
        </div>

        <div>
          <label htmlFor="tags" className="mb-2 block font-medium text-[10px] text-text-dark">
            Tags
          </label>
          <TagInput tags={tags} onAdd={handleAddTag} onRemove={handleRemoveTag} />
        </div>

        <StyledInput
          id="url"
          type="url"
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      <PanelFooter
        leftContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Heart />}
              onClick={handleFavoriteToggle}
              active={isFavorite}
            >
              Favorite
            </Button>
            <Button variant="outline" size="sm" icon={<Trash2 />} onClick={onDelete}>
              Delete
            </Button>
          </div>
        }
        rightContent={
          <Button variant="outline" size="sm" icon={<Save />}>
            Save
          </Button>
        }
      />
    </div>
  )
}
