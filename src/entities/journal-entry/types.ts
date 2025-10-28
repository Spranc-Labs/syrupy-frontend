export interface JournalEntry {
  id: number
  title: string
  content: string
  tags?: Tag[]
  created_at: string
  updated_at: string
  word_count?: number
  search_rank?: number
  formatted_date?: string
  // Analysis fields from API response
  'analyzed?'?: boolean
  analyzed?: boolean
  current_category?: string
  category_display?: string
  primary_emotion?: string
  primary_emotion_emoji?: string
  journal_label_analysis?: JournalLabelAnalysis
  emotion_label_analysis?: EmotionLabelAnalysis
}

export interface JournalLabelAnalysis {
  id: number
  analysis_model: string
  analyzed_at: string
  created_at: string
  model_version: string
  payload: { category: string }
  run_ms: number
  updated_at: string
}

export interface EmotionLabelAnalysis {
  id: number
  analysis_model: string
  analyzed_at: string
  created_at: string
  model_version: string
  payload: Record<string, number>
  run_ms: number
  top_emotion: string
  updated_at: string
}

export interface Tag {
  id: number
  name: string
  color: string
}

export interface CreateJournalEntryInput {
  title: string
  content: string
  tags?: number[] // Tag IDs
}

export interface UpdateJournalEntryInput {
  title?: string
  content?: string
  tags?: number[]
}

export interface JournalEntriesResponse {
  items?: JournalEntry[]
  total?: number
}

export interface SearchJournalEntriesResponse {
  items?: JournalEntry[]
  total?: number
}
