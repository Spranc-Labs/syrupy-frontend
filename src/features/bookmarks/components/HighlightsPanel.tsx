import { useState } from 'react'
import { ChevronUp, Download, HelpCircle } from 'react-feather'
import { Button, EmptyState, IconButton, PanelFooter, PanelHeader } from '@/shared/ui'
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
      <PanelHeader title="Highlights" onClose={onClose} closeAriaLabel="Close highlights" />

      {/* Highlights List */}
      <div
        className="flex-1 space-y-3 overflow-y-auto overflow-x-visible px-6 pt-2 pb-8"
        onScroll={handleScroll}
      >
        {highlights.length === 0 ? (
          <EmptyState
            size="sm"
            icon={<span />}
            title="No highlights yet"
            description="Start highlighting content from the preview"
          />
        ) : (
          highlights.map((highlight) => (
            <HighlightItem
              key={highlight.id}
              mode="display"
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
        <HighlightItem mode="create" onAdd={handleAdd} />
      </div>

      <PanelFooter
        leftContent={
          <span className="text-[10px] text-text-quaternary">{highlights.length} highlights</span>
        }
        rightContent={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={<Download />}>
              Export
            </Button>
            <IconButton icon={<HelpCircle />} size="sm" aria-label="Help" />
            <IconButton icon={<ChevronUp />} size="sm" aria-label="Collapse panel" />
          </div>
        }
      />
    </div>
  )
}
