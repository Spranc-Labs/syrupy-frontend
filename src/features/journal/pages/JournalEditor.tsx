import { useNavigate, useParams } from '@tanstack/react-router'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/shared/api'

interface TagsResponse {
  items?: Tag[]
}

interface JournalEntry {
  id: number
  title: string
  content: string
  tags?: Tag[]
  created_at: string
  updated_at: string
  // Journal labeling fields
  current_category?: string
  category_display?: string
  primary_emotion?: string
  primary_emotion_emoji?: string
  analyzed?: boolean
}

interface Tag {
  id: number
  name: string
  color: string
}

export const JournalEditor: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/_authenticated/journal/$id/edit' })
  const isEditing = Boolean(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [newTagName, setNewTagName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [showTagInput, setShowTagInput] = useState(false)
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null)

  const fetchTags = useCallback(async () => {
    try {
      const response = await apiClient.get<TagsResponse>('/tags')
      const tagsData = response.data?.items || (Array.isArray(response.data) ? response.data : [])
      setAvailableTags(tagsData)
    } catch (_error) {}
  }, [])

  const fetchEntry = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    try {
      const response = await apiClient.get(`/journal_entries/${id}`)
      console.log(response, '++++ENTRY')
      // The response should contain the entry data directly for individual entries
      const entry = (response.data || response) as JournalEntry
      setTitle(entry.title)
      setContent(entry.content)
      setSelectedTags(entry.tags || [])
      setJournalEntry(entry)
    } catch (_error) {
      setError('Error fetching entry')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchTags()
    if (isEditing) {
      fetchEntry()
    }
  }, [fetchEntry, fetchTags, isEditing])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tag_ids: selectedTags.map((tag) => tag.id),
      }

      if (isEditing) {
        await apiClient.put(`/journal_entries/${id}`, payload)
      } else {
        await apiClient.post('/journal_entries', payload)
      }

      navigate({ to: '/journal' })
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to save entry'
      setError(`Error saving entry: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }

  const createTag = async () => {
    if (!newTagName.trim()) return

    try {
      const response = await apiClient.post('/tags', {
        name: newTagName.trim(),
        color: '#6366f1', // Default indigo color
      })

      const newTag = (response.data || response) as Tag
      setAvailableTags([...availableTags, newTag])
      setSelectedTags([...selectedTags, newTag])
      setNewTagName('')
      setShowTagInput(false)
    } catch (_error) {}
  }

  const toggleTag = (tag: Tag) => {
    const isSelected = selectedTags.some((t) => t.id === tag.id)
    if (isSelected) {
      setSelectedTags(selectedTags.filter((t) => t.id !== tag.id))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const formatText = (format: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)

    let formattedText = ''
    let newCursorPos = start

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`
        newCursorPos = selectedText ? end + 4 : start + 2
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        newCursorPos = selectedText ? end + 2 : start + 1
        break
      case 'bullet': {
        const lines = selectedText.split('\n')
        formattedText = lines.map((line) => (line.trim() ? `• ${line}` : line)).join('\n')
        newCursorPos = end + lines.filter((line) => line.trim()).length * 2
        break
      }
      default:
        return
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end)
    setContent(newContent)

    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8 text-gray-600 dark:text-gray-400">Loading...</div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => navigate({ to: '/journal' })}
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Journal
          </button>
          <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
            {isEditing ? 'Edit Entry' : 'New Entry'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !title.trim() || !content.trim()}
          className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="Entry title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-none bg-transparent font-bold text-3xl text-gray-900 placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
          />
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center space-x-2 border-gray-200 border-b py-2 dark:border-gray-700">
          <button
            onClick={() => formatText('bold')}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title="Bold"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 4a1 1 0 011-1h3a3 3 0 110 6H6v2h3a3 3 0 110 6H6a1 1 0 01-1-1V4zm2 1v4h2a1 1 0 100-2H7zm0 6v4h3a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => formatText('italic')}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title="Italic"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8 1a1 1 0 011 1v1h2a1 1 0 110 2h-.5l-1 8H11a1 1 0 110 2H9a1 1 0 01-1-1v-1H6a1 1 0 110-2h.5l1-8H7a1 1 0 110-2h1V2a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => formatText('bullet')}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            title="Bullet List"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content Editor */}
        <div>
          <textarea
            id="content-editor"
            placeholder="Start writing your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-96 w-full resize-none border-none bg-transparent text-gray-900 text-lg leading-relaxed placeholder-gray-500 outline-none dark:text-white dark:placeholder-gray-400"
            style={{ fontFamily: 'Georgia, serif' }}
          />
        </div>

        {/* Tags Section */}
        <div className="border-gray-200 border-t pt-6 dark:border-gray-700">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 text-lg dark:text-white">Tags</h3>
            <button
              onClick={() => setShowTagInput(!showTagInput)}
              className="font-medium text-indigo-600 text-sm hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              + Add Tag
            </button>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag.id}
                  style={{ backgroundColor: tag.color || '#6366f1' }} // Fallback to indigo
                  className="flex cursor-pointer items-center rounded-full px-3 py-1 text-sm text-white"
                  onClick={() => toggleTag(tag)}
                >
                  {tag.name}
                  <svg
                    className="ml-1 h-3 w-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
              ))}
              {showTagInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        createTag()
                      }
                    }}
                    placeholder="New tag name"
                    className="rounded-md border border-gray-300 bg-white px-3 py-1 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  />
                  <button
                    onClick={createTag}
                    className="rounded-md bg-indigo-500 px-3 py-1 text-sm text-white hover:bg-indigo-600"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowTagInput(false)}
                    className="text-gray-500 text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowTagInput(true)}
                  className="text-indigo-600 text-sm hover:underline dark:text-indigo-400"
                >
                  + Add Tag
                </button>
              )}
            </div>
          )}

          {/* Available Tags */}
          {availableTags.length > 0 && (
            <div>
              <p className="mb-2 text-gray-600 text-sm dark:text-gray-400">Available tags:</p>
              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter((tag) => !selectedTags.some((t) => t.id === tag.id))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag)}
                      className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 font-medium text-gray-700 text-sm hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {tag.name}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Mood & Category Display */}
        {isEditing && (journalEntry?.primary_emotion || journalEntry?.category_display) && (
          <div className="mb-6 flex items-center space-x-4 rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-800">
            {journalEntry.primary_emotion && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="mr-2 text-2xl">{journalEntry.primary_emotion_emoji}</span>
                <span className="font-medium">{journalEntry.primary_emotion}</span>
              </div>
            )}
            {journalEntry.category_display && (
              <div className="flex items-center text-gray-700 dark:text-gray-300">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5.98a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zm0 14h5.98a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">{journalEntry.category_display}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
