import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/shared/api'

interface MoodLogsResponse {
  items: MoodLog[]
  total?: number
}

interface MoodLog {
  id: number
  rating: number
  notes: string
  logged_at: string
  created_at: string
}

export const MoodLogs: React.FC = () => {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMood, setEditingMood] = useState<MoodLog | null>(null)
  const [formData, setFormData] = useState({
    rating: 5,
    notes: '',
    logged_at: new Date().toISOString().split('T')[0],
  })
  const [error, setError] = useState('')

  const fetchMoodLogs = useCallback(async () => {
    try {
      const response = await apiClient.get<MoodLogsResponse>('/mood_logs')
      const moodLogsData =
        response.data?.items || (Array.isArray(response.data) ? response.data : [])
      setMoodLogs(moodLogsData)
    } catch (_error) {
      setError('Error fetching mood logs')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMoodLogs()
  }, [fetchMoodLogs])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const payload = { mood_log: formData }

      if (editingMood) {
        await apiClient.put(`/mood_logs/${editingMood.id}`, payload)
      } else {
        await apiClient.post('/mood_logs', payload)
      }

      await fetchMoodLogs()
      setIsFormOpen(false)
      setEditingMood(null)
      setFormData({
        rating: 5,
        notes: '',
        logged_at: new Date().toISOString().split('T')[0],
      })
    } catch (_error) {
      setError('Error saving mood log')
    }
  }

  const handleEdit = (mood: MoodLog) => {
    setEditingMood(mood)
    setFormData({
      rating: mood.rating,
      notes: mood.notes,
      logged_at: mood.logged_at
        ? mood.logged_at.split('T')[0]
        : new Date().toISOString().split('T')[0],
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this mood log?')) return

    try {
      await apiClient.delete(`/mood_logs/${id}`)
      await fetchMoodLogs()
    } catch (_error) {
      setError('Error deleting mood log')
    }
  }

  const openCreateForm = () => {
    setEditingMood(null)
    setFormData({
      rating: 5,
      notes: '',
      logged_at: new Date().toISOString().split('T')[0],
    })
    setIsFormOpen(true)
  }

  const getMoodEmoji = (value: number) => {
    if (value <= 2) return '😢'
    if (value <= 4) return '😕'
    if (value <= 6) return '😐'
    if (value <= 8) return '😊'
    return '😄'
  }

  const getMoodColor = (value: number) => {
    if (value <= 2) return 'text-red-700 bg-red-100'
    if (value <= 4) return 'text-orange-700 bg-orange-100'
    if (value <= 6) return 'text-yellow-700 bg-yellow-100'
    if (value <= 8) return 'text-green-700 bg-green-100'
    return 'text-blue-700 bg-blue-100'
  }

  if (isLoading)
    return (
      <div className="flex justify-center p-8 text-gray-600 dark:text-gray-400">Loading...</div>
    )

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900 dark:text-white">Mood Logs</h1>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          Log Mood
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {error}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 dark:bg-gray-800">
            <h2 className="mb-4 font-bold text-gray-900 text-xl dark:text-white">
              {editingMood ? 'Edit Mood Log' : 'New Mood Log'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Mood (1-10 scale)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    className="flex-1"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: Number.parseInt(e.target.value, 10) })
                    }
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getMoodEmoji(formData.rating)}</span>
                    <span className="font-medium">{formData.rating}/10</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Notes
                </label>
                <textarea
                  rows={4}
                  placeholder="How are you feeling? What happened today?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.logged_at}
                  onChange={(e) => setFormData({ ...formData, logged_at: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                >
                  {editingMood ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {moodLogs.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No mood logs yet. Log your first mood!
          </div>
        ) : (
          moodLogs.map((mood) => (
            <div
              key={mood.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{getMoodEmoji(mood.rating)}</span>
                  <div>
                    <span
                      className={`rounded-full px-2 py-1 font-medium text-xs ${getMoodColor(mood.rating)}`}
                    >
                      {mood.rating}/10
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(mood)}
                    className="text-indigo-600 text-sm hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mood.id)}
                    className="text-red-600 text-sm hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {mood.notes && <p className="mb-2 text-gray-700 dark:text-gray-300">{mood.notes}</p>}
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Logged: {new Date(mood.logged_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
