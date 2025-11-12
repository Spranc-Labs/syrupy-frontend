import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trash2 } from 'react-feather'
import { Button } from '@/shared/ui'

interface AddNoteInputProps {
  onAdd: (text: string) => void
}

export function AddNoteInput({ onAdd }: AddNoteInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 })
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate button position when expanded
  useEffect(() => {
    if (isExpanded) {
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
  }, [isExpanded, noteText])

  // Auto-resize textarea to fit content
  useEffect(() => {
    if (textareaRef.current && isExpanded) {
      textareaRef.current.style.height = '0px'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`
    }
  }, [isExpanded, noteText])

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
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isExpanded &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleAdd()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded, handleAdd])

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
      <div className="border-l-4 border-base-300 py-2 pl-4 pr-2">
        <button
          type="button"
          className="cursor-pointer text-sm leading-relaxed text-[#9F9F9F] transition-colors hover:text-[#444444]"
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

      <div ref={containerRef} className="border-l-4 border-transparent py-2 pl-4 pr-2">
        <textarea
          ref={textareaRef}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your note here..."
          onClick={(e) => e.stopPropagation()}
          rows={1}
          className="w-full resize-none bg-transparent text-sm leading-relaxed text-[#444444] placeholder:text-[#9F9F9F] !border-0 !outline-none !ring-0 !shadow-none focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none active:!border-0 active:!outline-none active:!ring-0 active:!shadow-none"
          style={{
            padding: 0,
            minHeight: 'auto',
            overflow: 'hidden',
            lineHeight: '1.625',
          }}
          autoFocus
        />
      </div>
    </>
  )
}
