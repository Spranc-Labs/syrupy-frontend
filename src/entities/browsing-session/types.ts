/**
 * Preview metadata for browser tabs (og:image, favicon, etc.)
 */
export interface PreviewMetadata {
  image?: string | null
  favicon?: string | null
  description?: string | null
  site_name?: string | null
  author?: string | null
}

/**
 * Browser tab from HeyHo
 */
export interface BrowserTab {
  id: number | string // Allow string for page_visit_id use case
  url: string
  title?: string | null
  domain?: string | null
  tab_order?: number | null
  preview?: PreviewMetadata | null
}

/**
 * Browsing session (collection of tabs)
 */
export interface BrowsingSession {
  id: number
  title?: string | null
  status?: string | null
  duration_seconds?: number | null
  formatted_duration?: string | null
  research_session_tabs: BrowserTab[]
  created_at: string
  updated_at: string
}

/**
 * API response for browsing sessions
 */
export interface BrowsingSessionsResponse {
  sessions: BrowsingSession[]
  count: number
}
