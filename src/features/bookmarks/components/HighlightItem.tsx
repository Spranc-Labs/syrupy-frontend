import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2 } from 'react-feather'
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
  onClear,
  onUpdate,
  isActive,
  onSetActive,
  isEditing,
  onSetEditing,
}: HighlightItemProps) {
  const [editedText, setEditedText] = useState(highlight.text)
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isHighlight = highlight.type !== 'note'

  // Reset edited text when highlight text changes or when exiting edit mode
  useEffect(() => {
    if (!isEditing) {
      setEditedText(highlight.text)
    }
  }, [isEditing, highlight.text])

  // Calculate button position when active or editing
  useEffect(() => {
    if (isActive || isEditing) {
      // Use requestAnimationFrame to ensure DOM has updated
      const updatePosition = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          setButtonPosition({
            top: rect.top + rect.height / 2,
            left: rect.left,
          })
        }
      }

      // Initial position
      requestAnimationFrame(updatePosition)

      // Also update on any layout changes
      const rafId = requestAnimationFrame(() => {
        requestAnimationFrame(updatePosition)
      })

      return () => cancelAnimationFrame(rafId)
    }
  }, [isActive, isEditing, editedText])

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (textareaRef.current && isEditing) {
      // Reset height to get accurate scrollHeight
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }, [isEditing, editedText])

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
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isEditing) {
          handleSave()
        } else {
          onSetActive(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isEditing, isActive, onSetActive, handleSave])

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
        style={{ backgroundColor: '#F6F6F6' }}
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
        className={`relative py-2 pl-4 pr-2 ${isHighlight ? 'border-l-4 border-[#6F43FF]' : ''}`}
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
              className="w-full resize-none bg-transparent text-sm leading-relaxed text-[#444444] !border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none active:!border-0 active:!outline-none active:!ring-0 active:!shadow-none"
              style={{
                padding: 0,
                minHeight: 'auto',
                overflow: 'hidden',
                lineHeight: '1.625',
              }}
              autoFocus
            />
          ) : (
            <p className="cursor-pointer whitespace-pre-wrap text-sm leading-relaxed text-[#9F9F9F] transition-colors hover:text-[#444444]">
              {highlight.note ? (
                <>
                  This is a{' '}
                  <button
                    type="button"
                    className="hover:underline"
                    style={{ color: '#6F43FF' }}
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
