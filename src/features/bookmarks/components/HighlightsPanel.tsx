import { useMemo, useState } from 'react'
import { Download, HelpCircle, Plus } from 'react-feather'
import type { Highlight } from '@/entities/highlight'
import {
  useCreateHighlight,
  useDeleteHighlight,
  useHighlights,
  useUpdateHighlight,
} from '@/entities/highlight'
import { Button, EmptyState, IconButton, PanelFooter, PanelHeader } from '@/shared/ui'
import { HighlightItem } from './HighlightItem'

// Helper: Detect if highlight is a standalone note (no position data)
function isStandaloneNote(highlight: Highlight): boolean {
  return (
    !highlight.prefix_text &&
    !highlight.suffix_text &&
    !highlight.start_offset &&
    !highlight.end_offset
  )
}

// Helper: Get display type for styling
function getHighlightType(highlight: Highlight): 'highlight' | 'note' {
  return isStandaloneNote(highlight) ? 'note' : 'highlight'
}

interface HighlightsPanelProps {
  bookmarkId: number
  pageUrl: string
  activeHighlightId: number | null
  onSetActiveHighlightId: (id: number | null) => void
  onClose: () => void
}

export function HighlightsPanel({
  bookmarkId,
  pageUrl,
  activeHighlightId,
  onSetActiveHighlightId,
  onClose,
}: HighlightsPanelProps) {
  const [editingHighlightId, setEditingHighlightId] = useState<number | null>(null)
  const [isCreatingNote, setIsCreatingNote] = useState(false)

  // Fetch highlights from API
  const { data: highlights = [], isLoading } = useHighlights(bookmarkId)
  const createHighlight = useCreateHighlight()
  const updateHighlight = useUpdateHighlight()
  const deleteHighlight = useDeleteHighlight()

  // Sort highlights by created_at ascending (oldest first)
  const sortedHighlights = useMemo(() => {
    return [...highlights].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )
  }, [highlights])

  const handleDelete = (id: number) => {
    deleteHighlight.mutate(id, {
      onSuccess: () => {
        onSetActiveHighlightId(null)
        setEditingHighlightId(null)
      },
    })
  }

  const handleScroll = () => {
    setEditingHighlightId(null)
  }

  const handleClear = (id: number) => {
    // "Clear" means remove the highlight border but keep as note
    // We delete the highlight - user can recreate as standalone note if needed
    deleteHighlight.mutate(id)
  }

  const handleUpdate = (id: number, text: string) => {
    // For standalone notes, update exact_text
    // For text highlights, this would update the note field
    const highlight = highlights.find((h) => h.id === id)
    if (!highlight) return

    if (isStandaloneNote(highlight)) {
      // Update the note content (stored in exact_text)
      updateHighlight.mutate({
        id,
        input: {
          exact_text: text,
        },
      })
    } else {
      // Update the annotation on highlighted text
      updateHighlight.mutate({
        id,
        input: {
          note: text,
        },
      })
    }
  }

  const handleAdd = (text: string) => {
    // Create standalone note (no position data)
    createHighlight.mutate(
      {
        bookmark_id: bookmarkId,
        exact_text: text,
        color: 'yellow',
        page_url: pageUrl,
        // Don't pass optional fields - they'll be undefined
      },
      {
        onSuccess: () => {
          setIsCreatingNote(false)
        },
      }
    )
  }
  if (isLoading) {
    return (
      <div className="flex h-full flex-col bg-base-100">
        <PanelHeader title="Highlights" onClose={onClose} closeAriaLabel="Close highlights" />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-text-tertiary">Loading highlights...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col bg-base-100">
      <PanelHeader title="Highlights" onClose={onClose} closeAriaLabel="Close highlights" />

      {/* Highlights List */}
      <div
        className="flex-1 space-y-3 overflow-y-auto overflow-x-visible px-6 pt-2 pb-8"
        onScroll={handleScroll}
      >
        {sortedHighlights.length === 0 && !isCreatingNote ? (
          <EmptyState
            size="sm"
            icon={<span />}
            title="No highlights yet"
            description="Start highlighting content from the preview"
          />
        ) : (
          <>
            {sortedHighlights.map((highlight) => (
              <HighlightItem
                key={highlight.id}
                mode="display"
                highlight={{
                  id: highlight.id.toString(),
                  text: highlight.exact_text,
                  note: highlight.note ?? null,
                  type: getHighlightType(highlight),
                }}
                onDelete={(id) => handleDelete(Number(id))}
                onClear={(id) => handleClear(Number(id))}
                onUpdate={(_id, text) => handleUpdate(highlight.id, text)}
                isActive={activeHighlightId === highlight.id}
                onSetActive={(id) => onSetActiveHighlightId(id ? Number(id) : null)}
                isEditing={editingHighlightId === highlight.id}
                onSetEditing={(id) => setEditingHighlightId(id ? Number(id) : null)}
              />
            ))}

            {/* Show create note input when user clicks "Add note" */}
            {isCreatingNote && (
              <HighlightItem
                mode="create"
                onAdd={handleAdd}
                onCancel={() => setIsCreatingNote(false)}
                autoExpand={true}
              />
            )}
          </>
        )}
      </div>

      <PanelFooter
        leftContent={
          <span className="text-[10px] text-text-quaternary">
            {sortedHighlights.length} {sortedHighlights.length === 1 ? 'item' : 'items'}
          </span>
        }
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Plus />}
              onClick={() => setIsCreatingNote(true)}
            >
              Add note
            </Button>
            <Button variant="outline" size="sm" icon={<Download />}>
              Export
            </Button>
            <IconButton icon={<HelpCircle />} size="sm" aria-label="Help" />
          </div>
        }
      />
    </div>
  )
}
