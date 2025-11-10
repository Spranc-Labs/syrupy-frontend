import { type FormEvent, useState } from 'react'
import { useCollections } from '@/entities/collection'

export interface BookmarkFormData {
  title: string
  description: string
  note: string
  collection_id: number | null
  tags: string[]
}

interface BookmarkFormProps {
  initialData?: Partial<BookmarkFormData>
  onSubmit: (data: BookmarkFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function BookmarkForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: BookmarkFormProps) {
  const [formData, setFormData] = useState<BookmarkFormData>({
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    note: initialData?.note ?? '',
    collection_id: initialData?.collection_id ?? null,
    tags: initialData?.tags ?? [],
  })

  const { data: collections = [] } = useCollections()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)
    setFormData((prev) => ({ ...prev, tags }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label className="label" htmlFor="bookmark-title">
          <span className="label-text font-medium">Title</span>
          <span className="label-text-alt text-error">Required</span>
        </label>
        <input
          id="bookmark-title"
          type="text"
          className="input input-bordered w-full"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="bookmark-collection">
          <span className="label-text font-medium">Collection</span>
        </label>
        <select
          id="bookmark-collection"
          className="select select-bordered w-full"
          value={formData.collection_id ?? ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              collection_id: e.target.value ? Number(e.target.value) : null,
            }))
          }
          disabled={isSubmitting}
        >
          <option value="">Unsorted</option>
          {collections
            .filter((c) => c.name !== 'Trash')
            .map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.icon} {collection.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-control">
        <label className="label" htmlFor="bookmark-description">
          <span className="label-text font-medium">Description</span>
        </label>
        <input
          id="bookmark-description"
          type="text"
          className="input input-bordered w-full"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Brief description of this bookmark"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="bookmark-note">
          <span className="label-text font-medium">Note</span>
        </label>
        <textarea
          id="bookmark-note"
          className="textarea textarea-bordered w-full"
          rows={3}
          value={formData.note}
          onChange={(e) => setFormData((prev) => ({ ...prev, note: e.target.value }))}
          placeholder="Add personal notes or context"
          disabled={isSubmitting}
        />
      </div>

      <div className="form-control">
        <label className="label" htmlFor="bookmark-tags">
          <span className="label-text font-medium">Tags</span>
          <span className="label-text-alt">Comma-separated</span>
        </label>
        <input
          id="bookmark-tags"
          type="text"
          className="input input-bordered w-full"
          value={formData.tags.join(', ')}
          onChange={(e) => handleTagsChange(e.target.value)}
          placeholder="react, tutorial, frontend"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="btn btn-primary flex-1"
          disabled={isSubmitting || !formData.title}
        >
          {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Save Bookmark'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </button>
      </div>
    </form>
  )
}
