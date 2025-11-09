/**
 * HoarderTab entity types
 * Represents tabs detected as "hoarder tabs" by the sync-be pattern detection
 */

export interface HoarderTab {
  id: string
  url: string
  title: string | null
  domain: string
  favicon_url?: string
  opened_at: string
  last_accessed_at?: string
  age_days: number
  hoarder_score: number
  value_rank?: number
  tags?: string[]
}

export interface HoarderTabsResponse {
  success: boolean
  data: {
    hoarder_tabs: HoarderTab[]
    count: number
    summary: {
      total_detected: number
      showing: number
      detection_method: string
      filters_applied?: Record<string, unknown>
      top_domains?: Record<string, number>
    }
  }
}

export interface HoarderTabsParams extends Record<string, string | number | undefined> {
  lookback_days?: number
  min_score?: number
  age_min?: number
  domain?: string
  exclude_domains?: string
  limit?: number
  sort_by?: 'value_rank' | 'age' | 'score'
}
