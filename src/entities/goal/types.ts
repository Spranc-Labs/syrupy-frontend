export interface Goal {
  id: number
  title: string
  description: string
  target_date: string
  status: 'active' | 'completed' | 'paused' | 'archived'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at?: string
}

export interface CreateGoalInput {
  title: string
  description: string
  target_date: string
  status?: Goal['status']
  priority?: Goal['priority']
}

export interface UpdateGoalInput {
  title?: string
  description?: string
  target_date?: string
  status?: Goal['status']
  priority?: Goal['priority']
}

export interface GoalsResponse {
  items?: Goal[]
  total?: number
}
