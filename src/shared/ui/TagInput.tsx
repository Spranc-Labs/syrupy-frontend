import { useState } from 'react'

export interface TagInputProps {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
}

export function TagInput({ tags, onAdd, onRemove }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isInputVisible, setIsInputVisible] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      onAdd(inputValue.trim())
      setInputValue('')
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace when input is empty
      const lastTag = tags[tags.length - 1]
      if (lastTag) {
        onRemove(lastTag)
      }
    } else if (e.key === 'Escape') {
      setInputValue('')
      setIsInputVisible(false)
    }
  }

  const handleBlur = () => {
    if (!inputValue) {
      setIsInputVisible(false)
    }
  }

  const handleShowInput = () => {
    setIsInputVisible(true)
  }

  return (
    <div className="flex min-h-[40px] flex-wrap items-center gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex h-[24px] items-center gap-1 rounded border border-border bg-transparent px-2 text-[#6F43FF] text-xs"
        >
          {tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            className="ml-0.5 text-[14px] hover:text-error"
            aria-label={`Remove ${tag} tag`}
          >
            ×
          </button>
        </span>
      ))}
      {!isInputVisible ? (
        <button
          type="button"
          onClick={handleShowInput}
          className="text-text-tertiary text-xs hover:text-text-secondary"
        >
          Add more tags
        </button>
      ) : (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="h-[24px] w-[100px] rounded border border-border bg-transparent px-1 text-text-dark text-xs outline-none placeholder:text-text-tertiary focus:border-primary focus:outline-none focus:ring-0"
          placeholder="Add tag"
        />
      )}
    </div>
  )
}
