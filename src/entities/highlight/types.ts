export interface Highlight {
  id: number
  bookmark_id: number
  user_id: number
  exact_text: string
  prefix_text?: string | null
  suffix_text?: string | null
  start_offset?: number | null
  end_offset?: number | null
  color: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
  note?: string | null
  page_url: string
  created_at: string
  updated_at: string
}

export interface CreateHighlightInput {
  bookmark_id: number
  exact_text: string
  prefix_text?: string
  suffix_text?: string
  start_offset?: number
  end_offset?: number
  color?: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
  note?: string
  page_url: string
}

export interface UpdateHighlightInput {
  exact_text?: string // For updating standalone note content
  color?: 'yellow' | 'green' | 'blue' | 'pink' | 'purple'
  note?: string // For updating highlight annotations
}
