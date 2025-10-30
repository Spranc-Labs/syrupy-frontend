export interface MoodLog {
  id: number
  rating: number
  notes: string
  logged_at: string
  created_at: string
  updated_at?: string
}

export interface CreateMoodLogInput {
  rating: number
  notes?: string
  logged_at?: string
}

export interface UpdateMoodLogInput {
  rating?: number
  notes?: string
  logged_at?: string
}

export interface MoodLogsResponse {
  items?: MoodLog[]
  total?: number
}
