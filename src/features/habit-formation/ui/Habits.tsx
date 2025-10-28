import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/shared/api'

interface HabitsResponse {
  items: Habit[]
  total?: number
}

interface Habit {
  id: number
  name: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly'
  active: boolean
  created_at: string
}

export const Habits: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily' as Habit['frequency'],
    active: true,
  })
  const [error, setError] = useState('')

  const fetchHabits = useCallback(async () => {
    try {
      const response = await apiClient.get<HabitsResponse>('/habits')
      const habitsData = response.data?.items || (Array.isArray(response.data) ? response.data : [])
      setHabits(habitsData)
    } catch (_error) {
      setError('Error fetching habits')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHabits()
  }, [fetchHabits])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const payload = { habit: formData }

      if (editingHabit) {
        await apiClient.put(`/habits/${editingHabit.id}`, payload)
      } else {
        await apiClient.post('/habits', payload)
      }

      await fetchHabits()
      setIsFormOpen(false)
      setEditingHabit(null)
      setFormData({ name: '', description: '', frequency: 'daily', active: true })
    } catch (_error) {
      setError('Error saving habit')
    }
  }

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit)
    setFormData({
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
      active: habit.active,
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    try {
      await apiClient.delete(`/habits/${id}`)
      await fetchHabits()
    } catch (_error) {
      setError('Error deleting habit')
    }
  }

  const openCreateForm = () => {
    setEditingHabit(null)
    setFormData({ name: '', description: '', frequency: 'daily', active: true })
    setIsFormOpen(true)
  }

  const getActiveColor = (active: boolean) => {
    return active ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
  }

  const getFrequencyColor = (frequency: Habit['frequency']) => {
    switch (frequency) {
      case 'daily':
        return 'text-purple-700 bg-purple-100'
      case 'weekly':
        return 'text-indigo-700 bg-indigo-100'
      case 'monthly':
        return 'text-pink-700 bg-pink-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center p-8 text-gray-600 dark:text-gray-400">Loading...</div>
    )

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900 dark:text-white">Habits</h1>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          New Habit
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
              {editingHabit ? 'Edit Habit' : 'New Habit'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Frequency
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({ ...formData, frequency: e.target.value as Habit['frequency'] })
                  }
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Status
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.active ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.value === 'active' })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  {editingHabit ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {habits.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No habits yet. Create your first habit!
          </div>
        ) : (
          habits.map((habit) => (
            <div
              key={habit.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                  {habit.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${getFrequencyColor(habit.frequency)}`}
                  >
                    {habit.frequency}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${getActiveColor(habit.active)}`}
                  >
                    {habit.active ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => handleEdit(habit)}
                    className="text-indigo-600 text-sm hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-red-600 text-sm hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {habit.description && (
                <p className="mb-2 text-gray-700 dark:text-gray-300">{habit.description}</p>
              )}
              <p className="text-gray-500 text-sm dark:text-gray-400">
                Created: {new Date(habit.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
