export interface Habit {
  id: number
  name: string
  description: string
  frequency: 'daily' | 'weekly' | 'monthly'
  active: boolean
  created_at: string
  updated_at?: string
}

export interface CreateHabitInput {
  name: string
  description: string
  frequency: Habit['frequency']
  active?: boolean
}

export interface UpdateHabitInput {
  name?: string
  description?: string
  frequency?: Habit['frequency']
  active?: boolean
}

export interface HabitsResponse {
  items?: Habit[]
  total?: number
}
