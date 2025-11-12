import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2 } from 'react-feather'
import { useActionMenuPosition, useAutoResizeTextarea, useClickOutside } from '@/shared/lib/hooks'
import { Button } from '@/shared/ui'

interface Highlight {
  id: string
  text: string
  note: string | null
  type?: 'highlight' | 'note'
}

interface HighlightItemProps {
  highlight: Highlight
  onDelete: (id: string) => void
  onClear: (id: string) => void
  onUpdate: (id: string, text: string) => void
  isActive: boolean
  onSetActive: (id: string | null) => void
  isEditing: boolean
  onSetEditing: (id: string | null) => void
}

export function HighlightItem({
  highlight,
  onDelete,
  onClear: _onClear,
  onUpdate,
  isActive,
  onSetActive,
  isEditing,
  onSetEditing,
}: HighlightItemProps) {
  const [editedText, setEditedText] = useState(highlight.text)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isHighlight = highlight.type !== 'note'

  const buttonPosition = useActionMenuPosition(containerRef, isActive || isEditing, [editedText])

  // Reset edited text when highlight text changes or when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      setEditedText(highlight.text)
    }
  }, [isEditing, highlight.text])

  // Auto-resize textarea to fit content
  useAutoResizeTextarea(textareaRef, editedText, isEditing)

  const handleSave = useCallback(() => {
    if (editedText.trim()) {
      onUpdate(highlight.id, editedText)
      onSetEditing(null)
    } else {
      // If empty, restore original text and exit edit mode
      setEditedText(highlight.text)
      onSetEditing(null)
    }
  }, [editedText, highlight.id, highlight.text, onUpdate, onSetEditing])

  // Handle click outside to close menu or save
  const handleClickOutside = useCallback(() => {
    if (isEditing) {
      handleSave()
    } else {
      onSetActive(null)
    }
  }, [isEditing, handleSave, onSetActive])

  useClickOutside(containerRef, handleClickOutside, isActive || isEditing)

  const handleCancel = () => {
    setEditedText(highlight.text)
    onSetEditing(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
      onSetActive(null)
    } else if (e.key === 'Enter' && !e.shiftKey && !isHighlight) {
      e.preventDefault()
      handleSave()
    }
  }

  const handleItemClick = () => {
    if (!isHighlight && !isEditing) {
      // Plain text notes: go directly to edit mode and show delete button
      onSetEditing(highlight.id)
      onSetActive(highlight.id)
    } else if (!isActive) {
      // Highlights: show delete button and close any editing
      onSetEditing(null)
      onSetActive(highlight.id)
    }
  }

  const actionMenu = (isActive || isEditing) && (
    <div
      className="fixed z-[9999] flex items-center gap-2 whitespace-nowrap opacity-100"
      style={{
        top: `${buttonPosition.top}px`,
        left: `${buttonPosition.left - 8}px`,
        transform: 'translate(-100%, -50%)',
      }}
    >
      <Button
        variant="outline"
        size="sm"
        icon={<Trash2 size={16} />}
        onClick={(e) => {
          e.stopPropagation()
          onDelete(highlight.id)
        }}
        className="bg-base-100"
      >
        Delete
      </Button>
    </div>
  )

  return (
    <>
      {/* Render action menu via portal */}
      {actionMenu && createPortal(actionMenu, document.body)}

      <div
        ref={containerRef}
        className={`relative py-2 pr-2 pl-4 ${isHighlight ? 'border-[#6F43FF] border-l-4' : ''}`}
        onClick={handleItemClick}
      >
        {/* Content */}
        <div>
          {isEditing ? (
            <textarea
              ref={textareaRef}
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              rows={1}
              className="!border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none active:!border-0 active:!outline-none active:!ring-0 active:!shadow-none w-full resize-none bg-transparent text-[#444444] text-sm leading-relaxed"
              style={{
                padding: 0,
                minHeight: 'auto',
                overflow: 'hidden',
                lineHeight: '1.625',
              }}
            />
          ) : (
            <p className="cursor-pointer whitespace-pre-wrap text-[#9F9F9F] text-sm leading-relaxed transition-colors hover:text-[#444444]">
              {highlight.note ? (
                <>
                  This is a{' '}
                  <button
                    type="button"
                    className="text-link hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    link
                  </button>
                  . Can be linked anywhere.
                </>
              ) : (
                highlight.text
              )}
            </p>
          )}
        </div>
      </div>
    </>
  )
}
