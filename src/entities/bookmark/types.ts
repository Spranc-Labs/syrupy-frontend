export interface Bookmark {
  id: number
  url: string
  title?: string
  description?: string
  preview?: {
    image?: string
    site_name?: string
    description?: string
  }
  collection_id?: number
  metadata?: Record<string, unknown>
  tags?: Array<{ id: number; name: string; color: string }>
  created_at: string
  updated_at: string
}

export interface CreateBookmarkInput {
  url: string
  title?: string
  description?: string
  collection_id?: number
  preview_image?: string
  preview_site_name?: string
  preview_description?: string
  metadata?: Record<string, unknown>
  tag_names?: string[]
}

export interface UpdateBookmarkInput {
  title?: string
  description?: string
  collection_id?: number
  preview_image?: string
  preview_site_name?: string
  preview_description?: string
  metadata?: Record<string, unknown>
  tag_names?: string[]
}

export interface MoveBookmarkInput {
  collection_id: number
}

export interface BookmarksResponse {
  success: boolean
  data: Bookmark[]
  pagination?: {
    current_page: number
    per_page: number
    total: number
  }
}

export interface BookmarkResponse {
  success: boolean
  data: Bookmark
}
