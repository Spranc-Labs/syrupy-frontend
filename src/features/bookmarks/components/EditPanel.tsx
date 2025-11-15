import { useForm } from '@tanstack/react-form'
import { Heart, Save, Trash2 } from 'react-feather'
import { type BookmarkFormData, bookmarkFormSchema } from '@/entities/bookmark'
import type { BrowserTab } from '@/entities/browsing-session'
import { Button, Input, PanelFooter, PanelHeader, TagInput, Textarea } from '@/shared/ui'
import { ThumbnailImage } from './ThumbnailImage'

interface EditPanelProps {
  bookmark?: BrowserTab
  onClose: () => void
  onFavorite?: () => void
  onDelete?: () => void
}

export function EditPanel({ bookmark, onClose, onFavorite, onDelete }: EditPanelProps) {
  const form = useForm({
    defaultValues: {
      title: bookmark?.title ?? '',
      description: bookmark?.preview?.description ?? '',
      note: '',
      collection: 'Unsorted',
      tags: ['Productivity', 'Engineering'],
      url: bookmark?.url ?? '',
      isFavorite: false,
    } as BookmarkFormData,
    validators: {
      onChange: bookmarkFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value)
      // TODO: Implement actual save logic
    },
  })

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <div className="flex h-full flex-col bg-base-100">
      <PanelHeader title="Edit bookmark" onClose={onClose} closeAriaLabel="Close edit panel" />

      <div className="flex-1 space-y-4 overflow-y-auto px-6 pt-4 pb-8">
        <div className="flex items-start gap-4">
          <ThumbnailImage item={bookmark} />
          <div className="min-w-0 flex-1">
            <form.Field name="title">
              {(field) => (
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur()
                    }
                  }}
                  placeholder="Untitled"
                  className="w-full truncate border-none bg-transparent p-0 font-medium text-[14px] text-text-dark outline-none placeholder:text-text-tertiary focus:outline-none"
                />
              )}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <textarea
                  value={field.state.value ?? ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  placeholder="Add description..."
                  className="mt-1 w-full resize-none border-none bg-transparent p-0 text-[12px] text-text-tertiary leading-tight outline-none placeholder:text-text-tertiary focus:outline-none"
                />
              )}
            </form.Field>
          </div>
        </div>

        <form.Field name="note">
          {(field) => (
            <Textarea
              id="note"
              label="Note"
              value={field.state.value ?? ''}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={3}
              placeholder="Supports rich text markdown."
              fullWidth
            />
          )}
        </form.Field>

        <form.Field name="collection">
          {(field) => (
            <div>
              <label
                htmlFor="collection"
                className="mb-2 block font-medium text-[10px] text-text-dark"
              >
                Collection
              </label>
              <select
                id="collection"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className="h-7 w-[40%] appearance-none rounded border border-border bg-input-bg px-2 py-1 text-[14px] text-text-dark leading-none focus:border-primary focus:shadow-none focus:outline-none"
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
          )}
        </form.Field>

        <form.Field name="tags">
          {(field) => (
            <div>
              <label htmlFor="tags" className="mb-2 block font-medium text-[10px] text-text-dark">
                Tags
              </label>
              <TagInput
                tags={field.state.value}
                onAdd={(tag) => {
                  if (!field.state.value.includes(tag)) {
                    field.handleChange([...field.state.value, tag])
                  }
                }}
                onRemove={(tagToRemove) => {
                  field.handleChange(field.state.value.filter((tag) => tag !== tagToRemove))
                }}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="url">
          {(field) => (
            <Input
              id="url"
              type="url"
              label="URL"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="https://example.com"
              fullWidth
              className="h-7 rounded border border-border bg-input-bg px-2 text-[14px] text-text-dark focus:border-primary focus:shadow-none focus:outline-none"
            />
          )}
        </form.Field>
      </div>

      <form.Field name="isFavorite">
        {(favoriteField) => (
          <PanelFooter
            leftContent={
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Heart />}
                  onClick={() => {
                    favoriteField.handleChange((prev) => !prev)
                    if (onFavorite) {
                      onFavorite()
                    }
                  }}
                  active={favoriteField.state.value}
                >
                  Favorite
                </Button>
                <Button variant="outline" size="sm" icon={<Trash2 />} onClick={onDelete}>
                  Delete
                </Button>
              </div>
            }
            rightContent={
              <Button variant="outline" size="sm" icon={<Save />} onClick={handleSubmit}>
                Save
              </Button>
            }
          />
        )}
      </form.Field>
    </div>
  )
}
