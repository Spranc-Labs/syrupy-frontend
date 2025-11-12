import { useState } from 'react'

interface TagInputProps {
  tags: string[]
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
  placeholder?: string
}

export function TagInput({ tags, onAdd, onRemove, placeholder = 'Add more tags' }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

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
    }
  }

  return (
    <div className="flex min-h-[28px] flex-wrap items-center gap-[2px] rounded border border-[#D9D9D9] bg-[#F9F9F9] px-2 py-1.5 focus-within:border-primary">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex h-[24px] items-center gap-1 rounded border border-[#D9D9D9] bg-transparent px-2 text-[#6F43FF] text-xs"
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
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-w-[120px] flex-1 border-none bg-transparent p-0 text-text-dark text-[12px] outline-none placeholder:text-text-tertiary focus:outline-none focus:ring-0"
        placeholder={tags.length === 0 ? placeholder : ''}
      />
    </div>
  )
}
