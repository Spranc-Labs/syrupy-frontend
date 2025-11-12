import { useState } from 'react'
import { ChevronUp, Download, HelpCircle, X } from 'react-feather'
import { Button, IconButton } from '@/shared/ui'
import { AddNoteInput } from './AddNoteInput'
import { HighlightItem } from './HighlightItem'

interface Highlight {
  id: string
  text: string
  note: string | null
  type?: 'highlight' | 'note' // highlight = purple border, note = no border
}

interface HighlightsPanelProps {
  highlights?: Highlight[]
  onClose: () => void
}

export function HighlightsPanel({
  highlights: initialHighlights = [],
  onClose,
}: HighlightsPanelProps) {
  const [highlights, setHighlights] = useState(initialHighlights)
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null)
  const [editingHighlightId, setEditingHighlightId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
    setActiveHighlightId(null)
    setEditingHighlightId(null)
  }

  const handleScroll = () => {
    setEditingHighlightId(null)
  }

  const handleClear = (id: string) => {
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, type: 'note' as const } : h)))
  }

  const handleUpdate = (id: string, text: string) => {
    setHighlights((prev) => prev.map((h) => (h.id === id ? { ...h, text } : h)))
  }

  const handleAdd = (text: string) => {
    const newNote: Highlight = {
      id: `temp-${Date.now()}`,
      text,
      note: null,
      type: 'note',
    }
    setHighlights((prev) => [...prev, newNote])
  }
  return (
    <div className="flex h-full flex-col bg-base-100">
      {/* Header - no bottom border */}
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-lg font-semibold text-base-content">Highlights</h2>
        <IconButton icon={<X />} size="sm" aria-label="Close highlights" onClick={onClose} />
      </div>

      {/* Highlights List */}
      <div
        className="flex-1 space-y-3 overflow-x-visible overflow-y-auto px-6 pb-8 pt-2"
        onScroll={handleScroll}
      >
        {highlights.length === 0 ? (
          <div className="py-8 text-center text-sm text-text-tertiary">
            No highlights yet. Start highlighting content from the preview.
          </div>
        ) : (
          highlights.map((highlight) => (
            <HighlightItem
              key={highlight.id}
              highlight={highlight}
              onDelete={handleDelete}
              onClear={handleClear}
              onUpdate={handleUpdate}
              isActive={activeHighlightId === highlight.id}
              onSetActive={setActiveHighlightId}
              isEditing={editingHighlightId === highlight.id}
              onSetEditing={setEditingHighlightId}
            />
          ))
        )}

        {/* Always show "Add note" at bottom */}
        <AddNoteInput onAdd={handleAdd} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-base-300 px-6 py-3">
        <span className="text-[10px]" style={{ color: '#BAB8B8' }}>
          {highlights.length} highlights
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download />}>
            Export
          </Button>
          <IconButton icon={<HelpCircle />} size="sm" aria-label="Help" />
          <IconButton icon={<ChevronUp />} size="sm" aria-label="Collapse panel" />
        </div>
      </div>
    </div>
  )
}
