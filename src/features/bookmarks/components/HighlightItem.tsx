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

type HighlightItemMode = 'create' | 'display'

interface BaseProps {
  mode: HighlightItemMode
}

interface DisplayModeProps extends BaseProps {
  mode: 'display'
  highlight: Highlight
  onDelete: (id: string) => void
  onClear: (id: string) => void
  onUpdate: (id: string, text: string) => void
  isActive: boolean
  onSetActive: (id: string | null) => void
  isEditing: boolean
  onSetEditing: (id: string | null) => void
  onAdd?: never
  placeholder?: never
}

interface CreateModeProps extends BaseProps {
  mode: 'create'
  onAdd: (text: string) => void
  placeholder?: string
  highlight?: never
  onDelete?: never
  onClear?: never
  onUpdate?: never
  isActive?: never
  onSetActive?: never
  isEditing?: never
  onSetEditing?: never
}

type HighlightItemProps = DisplayModeProps | CreateModeProps

export function HighlightItem(props: HighlightItemProps) {
  const { mode } = props

  // Create mode: manage local state for new note
  const [isExpanded, setIsExpanded] = useState(false)
  const [noteText, setNoteText] = useState('')

  // Display mode: manage editing state
  const displayModeText = mode === 'display' ? props.highlight.text : ''
  const [editedText, setEditedText] = useState(displayModeText)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine which text and state to use based on mode
  const currentText = mode === 'create' ? noteText : editedText
  const isEditingOrExpanded = mode === 'create' ? isExpanded : (props.isEditing ?? false)
  const isActiveOrExpanded = mode === 'create' ? isExpanded : (props.isActive ?? false)
  const isHighlight = mode === 'display' ? props.highlight.type !== 'note' : false

  const buttonPosition = useActionMenuPosition(
    containerRef,
    isActiveOrExpanded || isEditingOrExpanded,
    [currentText]
  )

  // Reset edited text when highlight text changes or when exiting edit mode (display mode only)
  useEffect(() => {
    if (mode === 'display' && !props.isEditing) {
      setEditedText(props.highlight.text)
    }
  }, [mode, props])

  // Auto-resize textarea to fit content
  useAutoResizeTextarea(textareaRef, currentText, isEditingOrExpanded)

  // Auto-focus textarea when entering edit mode
  useEffect(() => {
    if (isEditingOrExpanded && textareaRef.current) {
      textareaRef.current.focus()
      // Move cursor to end
      const length = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(length, length)
    }
  }, [isEditingOrExpanded])

  const handleSave = useCallback(() => {
    if (mode === 'create') {
      // Create mode: add new note
      if (noteText.trim()) {
        props.onAdd(noteText)
        setNoteText('')
        setIsExpanded(false)
      } else {
        setNoteText('')
        setIsExpanded(false)
      }
    } else {
      // Display mode: update existing
      if (editedText.trim()) {
        props.onUpdate(props.highlight.id, editedText)
        props.onSetEditing(null)
      } else {
        // If empty, restore original text and exit edit mode
        setEditedText(props.highlight.text)
        props.onSetEditing(null)
      }
    }
  }, [mode, noteText, editedText, props])

  // Handle click outside to close menu or save
  const handleClickOutside = useCallback(() => {
    if (isEditingOrExpanded) {
      handleSave()
    } else if (mode === 'display') {
      props.onSetActive(null)
    }
  }, [isEditingOrExpanded, handleSave, mode, props])

  // Delay enabling click-outside to prevent immediate trigger when entering edit mode
  const [clickOutsideEnabled, setClickOutsideEnabled] = useState(false)

  useEffect(() => {
    if (isActiveOrExpanded || isEditingOrExpanded) {
      // Small delay to prevent the same click that activated from triggering clickOutside
      const timer = setTimeout(() => setClickOutsideEnabled(true), 10)
      return () => clearTimeout(timer)
    }
    setClickOutsideEnabled(false)
    return undefined
  }, [isActiveOrExpanded, isEditingOrExpanded])

  useClickOutside(containerRef, handleClickOutside, clickOutsideEnabled)

  const handleCancel = () => {
    if (mode === 'create') {
      setNoteText('')
      setIsExpanded(false)
    } else {
      setEditedText(props.highlight.text)
      props.onSetEditing(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
      if (mode === 'display') {
        props.onSetActive(null)
      }
    } else if (e.key === 'Enter' && !e.shiftKey && (mode === 'create' || !isHighlight)) {
      e.preventDefault()
      handleSave()
    }
  }

  const handleItemClick = () => {
    if (mode === 'create') {
      // Create mode: expand input
      setIsExpanded(true)
    } else if (!isHighlight && !props.isEditing) {
      // Plain text notes: go directly to edit mode and show delete button
      props.onSetEditing(props.highlight.id)
      props.onSetActive(props.highlight.id)
    } else if (!props.isActive) {
      // Highlights: show delete button and close any editing
      props.onSetEditing(null)
      props.onSetActive(props.highlight.id)
    }
  }

  const handleDelete = () => {
    if (mode === 'create') {
      setNoteText('')
      setIsExpanded(false)
    } else {
      props.onDelete(props.highlight.id)
    }
  }

  const actionMenu = (isActiveOrExpanded || isEditingOrExpanded) && (
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
          handleDelete()
        }}
        className="bg-base-100"
      >
        Delete
      </Button>
    </div>
  )

  // For create mode when not expanded, show collapsed state
  if (mode === 'create' && !isExpanded) {
    return (
      <div className="border-transparent border-l-4 py-2 pr-2 pl-4">
        <button
          type="button"
          className="cursor-pointer text-[#9F9F9F] text-sm leading-relaxed transition-colors hover:text-[#444444]"
          onClick={handleItemClick}
        >
          {props.placeholder || 'Add own notes or highlight from preview'}
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Render action menu via portal */}
      {actionMenu && createPortal(actionMenu, document.body)}

      <div
        ref={containerRef}
        className={`relative py-2 pr-2 pl-4 ${
          mode === 'create'
            ? 'border-transparent border-l-4'
            : isHighlight
              ? 'border-[#6F43FF] border-l-4'
              : ''
        }`}
      >
        {/* Content */}
        <div>
          {isEditingOrExpanded ? (
            <textarea
              ref={textareaRef}
              value={currentText}
              onChange={(e) => {
                if (mode === 'create') {
                  setNoteText(e.target.value)
                } else {
                  setEditedText(e.target.value)
                }
              }}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              placeholder={
                mode === 'create' ? props.placeholder || 'Type your note here...' : undefined
              }
              rows={1}
              className="!border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none active:!border-0 active:!outline-none active:!ring-0 active:!shadow-none w-full resize-none overflow-hidden bg-transparent text-[#444444] text-sm leading-relaxed placeholder:text-[#9F9F9F]"
              style={{
                padding: 0,
                lineHeight: '1.625',
              }}
            />
          ) : (
            <button
              type="button"
              onClick={handleItemClick}
              className="w-full cursor-pointer whitespace-pre-wrap text-left text-[#9F9F9F] text-sm leading-relaxed transition-colors hover:text-[#444444]"
            >
              {mode === 'display' ? props.highlight.text : ''}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
