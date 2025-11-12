import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2 } from 'react-feather'
import { useActionMenuPosition, useAutoResizeTextarea, useClickOutside } from '@/shared/lib/hooks'
import { Button } from '@/shared/ui'

interface AddNoteInputProps {
  onAdd: (text: string) => void
}

export function AddNoteInput({ onAdd }: AddNoteInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [noteText, setNoteText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const buttonPosition = useActionMenuPosition(containerRef, isExpanded, [noteText])

  // Auto-resize textarea to fit content
  useAutoResizeTextarea(textareaRef, noteText, isExpanded)

  const handleAdd = useCallback(() => {
    if (noteText.trim()) {
      onAdd(noteText)
      setNoteText('')
      setIsExpanded(false)
    } else {
      setNoteText('')
      setIsExpanded(false)
    }
  }, [noteText, onAdd])

  // Handle click outside to save
  useClickOutside(containerRef, handleAdd, isExpanded)

  const handleCancel = () => {
    setNoteText('')
    setIsExpanded(false)
  }

  const handleDelete = () => {
    setNoteText('')
    setIsExpanded(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    } else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAdd()
    }
  }

  const actionMenu = isExpanded && (
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
        style={{ backgroundColor: '#F6F6F6' }}
      >
        Delete
      </Button>
    </div>
  )

  if (!isExpanded) {
    return (
      <div className="border-base-300 border-l-4 py-2 pr-2 pl-4">
        <button
          type="button"
          className="cursor-pointer text-[#9F9F9F] text-sm leading-relaxed transition-colors hover:text-[#444444]"
          onClick={() => setIsExpanded(true)}
        >
          Add own notes or highlight from preview
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Render action menu via portal */}
      {actionMenu && createPortal(actionMenu, document.body)}

      <div ref={containerRef} className="border-transparent border-l-4 py-2 pr-2 pl-4">
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your note here..."
          onClick={(e) => e.stopPropagation()}
          rows={1}
          className="!border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none active:!border-0 active:!outline-none active:!ring-0 active:!shadow-none w-full resize-none bg-transparent text-[#444444] text-sm leading-relaxed placeholder:text-[#9F9F9F]"
          style={{
            padding: 0,
            minHeight: 'auto',
            overflow: 'hidden',
            lineHeight: '1.625',
          }}
        />
      </div>
    </>
  )
}
