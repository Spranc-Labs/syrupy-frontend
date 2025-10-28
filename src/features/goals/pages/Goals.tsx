import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@/shared/api'

interface GoalsResponse {
  items: Goal[]
  total?: number
}

interface Goal {
  id: number
  title: string
  description: string
  target_date: string
  status: 'active' | 'completed' | 'paused' | 'archived'
  priority: 'low' | 'medium' | 'high'
  created_at: string
}

export const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_date: '',
    status: 'active' as Goal['status'],
    priority: 'medium' as Goal['priority'],
  })
  const [error, setError] = useState('')

  const fetchGoals = useCallback(async () => {
    try {
      const response = await apiClient.get<GoalsResponse>('/goals')
      // Handle paginated response format or direct array
      const goalsData = response.data?.items || (Array.isArray(response.data) ? response.data : [])
      setGoals(goalsData)
    } catch (_error) {
      setError('Error fetching goals')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      if (editingGoal) {
        await apiClient.put(`/goals/${editingGoal.id}`, formData)
      } else {
        await apiClient.post('/goals', formData)
      }

      await fetchGoals()
      setIsFormOpen(false)
      setEditingGoal(null)
      setFormData({
        title: '',
        description: '',
        target_date: '',
        status: 'active',
        priority: 'medium',
      })
    } catch (_error) {
      setError('Error saving goal')
    }
  }

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description,
      target_date: goal.target_date ? (goal.target_date.split('T')[0] ?? '') : '',
      status: goal.status,
      priority: goal.priority,
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) return

    try {
      await apiClient.delete(`/goals/${id}`)
      await fetchGoals()
    } catch (_error) {
      setError('Error deleting goal')
    }
  }

  const openCreateForm = () => {
    setEditingGoal(null)
    setFormData({
      title: '',
      description: '',
      target_date: '',
      status: 'active',
      priority: 'medium',
    })
    setIsFormOpen(true)
  }

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-700 bg-green-100'
      case 'active':
        return 'text-blue-700 bg-blue-100'
      case 'paused':
        return 'text-yellow-700 bg-yellow-100'
      case 'archived':
        return 'text-gray-700 bg-gray-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-700 bg-red-100'
      case 'medium':
        return 'text-yellow-700 bg-yellow-100'
      case 'low':
        return 'text-green-700 bg-green-100'
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
        <h1 className="font-bold text-3xl text-gray-900 dark:text-white">Goals</h1>
        <button
          onClick={openCreateForm}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          New Goal
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
              {editingGoal ? 'Edit Goal' : 'New Goal'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Target Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Priority
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value as Goal['priority'] })
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300">
                  Status
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as Goal['status'] })
                  }
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="archived">Archived</option>
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
                  {editingGoal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {goals.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No goals yet. Create your first goal!
          </div>
        ) : (
          goals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                  {goal.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${getPriorityColor(goal.priority)}`}
                  >
                    {goal.priority}
                  </span>
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(goal.status)}`}
                  >
                    {goal.status}
                  </span>
                  <button
                    onClick={() => handleEdit(goal)}
                    className="text-indigo-600 text-sm hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-600 text-sm hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {goal.description && (
                <p className="mb-2 text-gray-700 dark:text-gray-300">{goal.description}</p>
              )}
              {goal.target_date && (
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  Target: {new Date(goal.target_date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
